import { NextResponse } from "next/server";
import { isValidAnswers } from "@/lib/brand-pulse/codec";
import { assess, ENGINE_VERSION } from "@/lib/brand-pulse/engine";
import { answerLabels, bookingUrl, shareUrl } from "@/lib/brand-pulse/links";
import { FEEDBACK_IDS, GATES, QUESTION_ORDER, TEAM_SIZE_IDS, type Answers, type Feedback, type Gate, type TeamSize } from "@/lib/brand-pulse/types";

// Brand Pulse events. The result is always recomputed here with the same rule based engine:
// whatever result the browser might send is ignored.
// Logs record only the event type and outcome. Never a name, email, company, website,
// the webhook URL or the n8n response body: Vercel keeps logs.

const EVENTS = ["completed", "lead", "profile", "feedback"] as const;
type PulseEvent = (typeof EVENTS)[number];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit.entries()) {
    if (now - entry.timestamp > RATE_LIMIT_WINDOW) rateLimit.delete(ip);
  }
}, 5 * 60 * 1000);

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, "").trim().slice(0, max) : "";
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
  return EMAIL.test(email) ? email : null;
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
  const result = assess(answers);
  const share = shareUrl(answers);
  const contact = fields.contact;
  const a = (body.attribution && typeof body.attribution === "object" ? body.attribution : {}) as Record<string, unknown>;
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
      vitals: result.vitals.map(({ id, label, level }) => ({ id, label, level })),
      paragraphs: result.paragraphs,
      actions: result.actions,
      service: result.service,
      alsoService: result.alsoService,
      shareUrl: share,
      bookingUrl: bookingUrl(answers, result, share, {
        email: contact?.email,
        name: contact && "name" in contact ? contact.name : undefined,
      }),
    },
    ...(contact ? { contact } : {}),
    ...(fields.feedback ? { feedback: fields.feedback } : {}),
    attribution: {
      source: clean(a.source, 200),
      medium: clean(a.medium, 200),
      campaign: clean(a.campaign, 200),
      landingPage: clean(a.landingPage, 500),
      referrer: clean(a.referrer, 500),
    },
  };
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      console.log("[brand-pulse] rate limit exceeded");
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    const b = body as Record<string, unknown>;

    const event = b.event as PulseEvent;
    if (!EVENTS.includes(event)) return NextResponse.json({ success: false, error: "Invalid event" }, { status: 400 });
    if (typeof b.resultId !== "string" || !UUID.test(b.resultId)) return NextResponse.json({ success: false, error: "Invalid resultId" }, { status: 400 });
    if (!GATES.includes(b.gate as Gate)) return NextResponse.json({ success: false, error: "Invalid gate" }, { status: 400 });
    if (!isValidAnswers(b.answers)) {
      console.log(`[brand-pulse] ${event}: invalid answers`);
      return NextResponse.json({ success: false, error: "Invalid answers" }, { status: 400 });
    }
    const fields = eventFields(event, b);
    if (typeof fields === "string") {
      console.log(`[brand-pulse] ${event}: ${fields.toLowerCase()}`);
      return NextResponse.json({ success: false, error: fields }, { status: 400 });
    }

    if (typeof b.honeypot === "string" && b.honeypot.trim()) {
      console.log(`[brand-pulse] ${event}: honeypot filled, ignored`);
      return NextResponse.json({ success: true });
    }

    const webhookUrl = process.env.N8N_BRAND_PULSE_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[brand-pulse] N8N_BRAND_PULSE_WEBHOOK_URL is not configured");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(event, b, b.answers, fields)),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`[brand-pulse] ${event}: n8n webhook failed with status ${response.status}`);
      return NextResponse.json({ success: false }, { status: 502 });
    }

    console.log(`[brand-pulse] ${event}: forwarded to n8n`);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error("[brand-pulse] n8n webhook timed out after 10 seconds");
      return NextResponse.json({ success: false }, { status: 504 });
    }
    // Name only: error messages can quote the request body or the webhook host.
    console.error("[brand-pulse] request failed:", err instanceof Error ? err.name : "unknown error");
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
