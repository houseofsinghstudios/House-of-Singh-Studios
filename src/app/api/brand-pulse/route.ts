import { n8nTarget, postToN8n } from "@/lib/n8n";
import { createRateLimiter } from "@/lib/rate-limit";
import { referralCode } from "@/lib/campaign";
import { isValidAnswers } from "@/lib/brand-pulse/codec";
import { parsePlacement } from "@/lib/brand-pulse/entry";
import { assessWithActions } from "@/lib/brand-pulse/actions";
import { ENGINE_VERSION } from "@/lib/brand-pulse/engine";
import { answerLabels, bookingUrl, shareUrl } from "@/lib/brand-pulse/links";
import { FEEDBACK_IDS, GATES, QUESTION_ORDER, TEAM_SIZE_IDS, type Answers, type Feedback, type Gate, type TeamSize } from "@/lib/brand-pulse/types";
import { cleanLeadSource } from "@/lib/lead-source";
import { originAndPath } from "@/lib/referrer";
import { capRaw, isEmail, stripTags } from "@/lib/form-input";
import { bodyTooLarge, parseJson, readBodyText } from "@/lib/request-body";
import { errorName, json, N8N_FAILED, routeLog } from "@/lib/api-response";

const log = routeLog("brand-pulse");

// Brand Pulse events. The result is always recomputed here with the same rule based engine:
// whatever result the browser might send is ignored.
// Logs record only the event type and outcome. Never a name, email, company, website,
// the webhook URL or the n8n response body: Vercel keeps logs.

const EVENTS = ["completed", "lead", "profile", "feedback"] as const;
type PulseEvent = (typeof EVENTS)[number];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// A full visit sends up to four events (completed, feedback, lead, profile), so a quick retake
// needs more room than the contact form. The lead, careers and subscribe routes stay at 5.
const isRateLimited = createRateLimiter(20);

// Cut before cleaning (src/lib/form-input.ts), so nothing ever scans more than twice the limit.
function clean(value: unknown, max: number): string {
  return typeof value === "string" ? stripTags(capRaw(value, max)).trim().slice(0, max) : "";
}

// "Company.com/About" becomes "https://company.com/About". Returns null when it is not a web address.
function normaliseWebsite(value: unknown): string | null {
  const raw = clean(value, 200);
  if (!raw) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) return null;
    const path = url.pathname === "/" ? "" : url.pathname;
    return `${url.protocol}//${url.host.toLowerCase()}${path}`.slice(0, 200);
  } catch {
    return null;
  }
}

function cleanEmail(value: unknown): string | null {
  const email = clean(value, 254);
  return isEmail(email) ? email : null;
}

type Contact =
  | { email: string; retakeReminder: boolean; marketingConsent: boolean }
  | { email: string; name: string; company: string; website: string; teamSize: TeamSize | "" };

// The event specific part of the payload, or an error message for a 400.
function eventFields(event: PulseEvent, body: Record<string, unknown>): { contact?: Contact; feedback?: Feedback } | string {
  const c = (body.contact && typeof body.contact === "object" ? body.contact : {}) as Record<string, unknown>;
  if (event === "feedback") {
    const feedback = body.feedback as Feedback;
    return FEEDBACK_IDS.includes(feedback) ? { feedback } : "Invalid feedback";
  }
  if (event === "completed") return {};

  const email = cleanEmail(c.email);
  if (!email) return "Invalid email";
  if (event === "lead") {
    return { contact: { email, retakeReminder: c.retakeReminder === true, marketingConsent: c.marketingConsent === true } };
  }
  const website = normaliseWebsite(c.website);
  if (website === null) return "Invalid website";
  const teamSize = TEAM_SIZE_IDS.includes(c.teamSize as TeamSize) ? (c.teamSize as TeamSize) : "";
  return { contact: { email, name: clean(c.name, 100), company: clean(c.company, 120), website, teamSize } };
}

function buildPayload(event: PulseEvent, body: Record<string, unknown>, answers: Answers, fields: { contact?: Contact; feedback?: Feedback }) {
  const result = assessWithActions(answers);
  const share = shareUrl(answers);
  const contact = fields.contact;
  const a = (body.attribution && typeof body.attribution === "object" ? body.attribution : {}) as Record<string, unknown>;
  const leadSource = cleanLeadSource(body.leadSource);
  return {
    event,
    resultId: body.resultId as string,
    engineVersion: ENGINE_VERSION,
    gate: body.gate as Gate,
    submittedAt: new Date().toISOString(),
    answers: Object.fromEntries(QUESTION_ORDER.map((q) => [q, answers[q]])),
    answerLabels: answerLabels(answers),
    result: {
      pulse: result.pulse,
      pulseLabel: result.pulseLabel,
      profileId: result.profileId,
      profileName: result.profileName,
      headline: result.headline,
      vitals: result.vitals.map(({ id, label, level, severity }) => ({ id, label, level, severity })),
      total: result.total,
      paragraphs: result.paragraphs,
      actions: result.actions,
      service: result.service,
      alsoService: result.alsoService,
      shareUrl: share,
      bookingUrl: bookingUrl(answers, result, share),
    },
    ...(contact ? { contact } : {}),
    ...(fields.feedback ? { feedback: fields.feedback } : {}),
    // With an email or details only: where the session began (landing_page, referrer, utm_*).
    ...(contact && leadSource ? { leadSource } : {}),
    attribution: {
      source: clean(a.source, 200),
      medium: clean(a.medium, 200),
      campaign: clean(a.campaign, 200),
      referralCode: referralCode(a.referralCode),
      landingPage: clean(a.landingPage, 500),
      // Origin and path only, whatever the browser sent.
      referrer: originAndPath(a.referrer),
      entryPlacement: parsePlacement(a.entryPlacement),
    },
  };
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      log.info("rate limit exceeded");
      return json({ success: false, error: "Too many requests. Please try again later." }, 429);
    }

    // Over 64 KB is refused before anything is parsed.
    const text = await readBodyText(request);
    if (text === null) return bodyTooLarge();
    const body: unknown = parseJson(text);
    if (!body || typeof body !== "object") return json({ success: false, error: "Invalid request" }, 400);
    const b = body as Record<string, unknown>;

    const event = b.event as PulseEvent;
    if (!EVENTS.includes(event)) return json({ success: false, error: "Invalid event" }, 400);
    if (typeof b.resultId !== "string" || !UUID.test(b.resultId)) return json({ success: false, error: "Invalid resultId" }, 400);
    if (!GATES.includes(b.gate as Gate)) return json({ success: false, error: "Invalid gate" }, 400);
    if (!isValidAnswers(b.answers)) {
      log.info(`${event}: invalid answers`);
      return json({ success: false, error: "Invalid answers" }, 400);
    }
    const fields = eventFields(event, b);
    if (typeof fields === "string") {
      log.info(`${event}: ${fields.toLowerCase()}`);
      return json({ success: false, error: fields }, 400);
    }

    if (typeof b.honeypot === "string" && b.honeypot.trim()) {
      log.info(`${event}: honeypot filled, ignored`);
      return json({ success: true });
    }

    const target = n8nTarget("N8N_BRAND_PULSE_WEBHOOK_URL");
    if ("missing" in target) {
      log.error(`${target.missing} is not configured`);
      return json({ success: false, error: "Server configuration error" }, 500);
    }

    const response = await postToN8n(target, buildPayload(event, b, b.answers, fields), 10000);

    if (!response.ok) {
      log.error(`${event}: n8n webhook failed with status ${response.status}`);
      return json({ success: false }, N8N_FAILED);
    }

    log.info(`${event}: forwarded to n8n`);
    return json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      log.error("n8n webhook timed out after 10 seconds");
      return json({ success: false }, 504);
    }
    // Name only: error messages can quote the request body or the webhook host.
    log.error(`request failed: ${errorName(err)}`);
    return json({ success: false }, 500);
  }
}
