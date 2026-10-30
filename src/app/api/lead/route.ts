import { NextResponse } from "next/server";
import { n8nTarget, postToN8n } from "@/lib/n8n";
import { checkLeadLengths, cleanField, LEAD_LIMITS } from "@/lib/lead";
import { cleanSubmissionId, isEmail } from "@/lib/form-input";
import { bodyTooLarge, parseJson, readBodyText } from "@/lib/request-body";
import { errorName, json, N8N_FAILED, routeLog } from "@/lib/api-response";
import { checkReferralFields, isIntroduction, isPartnership, REFERRAL_LIMITS } from "@/lib/partners/forms";
import { STUDIO_EMAIL } from "@/lib/constants/contact";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { cleanCampaign } from "@/lib/campaign";
import { cleanLeadSource } from "@/lib/lead-source";

const log = routeLog("lead");

// Five leads per address per minute: the limiter the other form routes share.
const isRateLimited = createRateLimiter(5);

// Shown when the contact form is submitted before JavaScript has loaded, so the browser posts
// the form itself instead of the page sending JSON. Nothing is read from that post or forwarded.
const NO_SCRIPT_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Message not sent | House of Singh Studios</title>
<style>
  body { margin: 0; background: #F7F6F5; color: #22211F; font-family: system-ui, sans-serif; }
  main { max-width: 560px; padding: 120px max(24px, 8vw); }
  h1 { font-size: 32px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 16px; }
  p { color: #5C5B58; font-size: 16px; line-height: 1.6; margin: 0 0 16px; }
  a { color: #22211F; }
</style>
</head>
<body>
<main>
  <h1>Your message was not sent.</h1>
  <p>The form needs the page to finish loading before it can send. Please go back to the <a href="/contact">contact page</a> and try again.</p>
  <p>Or email us directly at <a href="mailto:${STUDIO_EMAIL}">${STUDIO_EMAIL}</a>.</p>
</main>
</body>
</html>`;

// Logs record only what helps debugging. Never a name, email, budget, message,
// the webhook URL or the n8n response body: Vercel keeps logs.
export async function POST(request: Request) {
  try {
    log.info("request received");

    // Only the JSON the contact page sends is accepted. A plain form post is never read or treated as a lead.
    if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
      log.info("non JSON request rejected");
      return new NextResponse(NO_SCRIPT_PAGE, { status: 415, headers: { "content-type": "text/html; charset=utf-8" } });
    }

    if (isRateLimited(clientIp(request))) {
      log.info("rate limit exceeded");
      return json({ success: false, error: "Too many requests. Please try again later." }, 429);
    }

    // Over 64 KB is refused before anything is parsed.
    const text = await readBodyText(request);
    if (text === null) {
      log.info("request too large");
      return bodyTooLarge();
    }
    // Not JSON (or not an object): a 400, like every form route.
    const body = parseJson(text) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      log.info("invalid request");
      return json({ success: false, error: "Invalid request" }, 400);
    }
    const { name, email, service, budget, message, honeypot } = body;

    if (honeypot) {
      log.info("honeypot filled, ignored");
      return json({ success: true });
    }

    // Validate email format: the length first, so the pattern never runs on a long value.
    if (!email || !isEmail(String(email))) {
      log.info("validation failed: invalid email");
      return json({ success: false, error: "Invalid email" }, 400);
    }

    // Sanitize text inputs, then check lengths on the cleaned values. Service and budget are optional:
    // a missing or empty value cleans to "", which is valid; only the 80 character cap applies.
    const fields = {
      name: cleanField(name, LEAD_LIMITS.name),
      email: cleanField(email, LEAD_LIMITS.email),
      service: cleanField(service, LEAD_LIMITS.service),
      budget: cleanField(budget, LEAD_LIMITS.budget),
      message: cleanField(message, LEAD_LIMITS.message),
    };
    const invalid = checkLeadLengths(fields);
    if (invalid) {
      log.info(`validation failed: ${invalid.toLowerCase()}`);
      return json({ success: false, error: invalid }, 400);
    }
    // Introductions and partnerships carry their own fields; "How did you hear about us?" is optional on every lead.
    const referral = {
      who: cleanField(body.who, REFERRAL_LIMITS.who),
      contact: cleanField(body.contact, REFERRAL_LIMITS.contact),
      permission: body.permission === true,
      businessName: cleanField(body.businessName, REFERRAL_LIMITS.businessName),
      partnerType: cleanField(body.partnerType, REFERRAL_LIMITS.partnerType),
      website: cleanField(body.website, REFERRAL_LIMITS.website),
      hearAbout: cleanField(body.hearAbout, REFERRAL_LIMITS.hearAbout),
      recommendedBy: cleanField(body.recommendedBy, REFERRAL_LIMITS.recommendedBy),
    };
    const referralInvalid = checkReferralFields(fields.service, referral);
    if (referralInvalid) {
      log.info(`validation failed: ${referralInvalid.toLowerCase()}`);
      return json({ success: false, error: referralInvalid }, 400);
    }
    const leadSource = cleanLeadSource(body.leadSource);
    const submissionId = cleanSubmissionId(body.submissionId);
    const sanitized = {
      ...fields,
      ...(isIntroduction(fields.service) && {
        introduction: { clientName: referral.who, clientContact: referral.contact, permission: referral.permission },
      }),
      ...(isPartnership(fields.service) && {
        partnership: { businessName: referral.businessName, partnerType: referral.partnerType, website: referral.website },
      }),
      hearAbout: referral.hearAbout,
      recommendedBy: referral.recommendedBy,
      // Campaign tags and the partner referral code, cleaned with the browser's own rules.
      attribution: cleanCampaign(body.attribution),
      // Where the session began (landing_page, referrer, utm_*), cleaned with the browser's rules.
      ...(leadSource && { leadSource }),
      source: "contact-form",
      // The form's id for this submission, the same on a retry, for de-duplication in n8n.
      ...(submissionId && { submissionId }),
      submittedAt: new Date().toISOString(),
    };

    const target = n8nTarget("N8N_WEBHOOK_URL");
    if ("missing" in target) {
      log.error(`${target.missing} is not configured`);
      return json({ success: false, error: "Server configuration error" }, 500);
    }

    const response = await postToN8n(target, sanitized, 10000);

    // n8n answers only after saving and alerting, so a non 2xx status is a real failure.
    if (!response.ok) {
      log.error(`n8n webhook failed with status ${response.status}`);
      return json({ success: false }, N8N_FAILED);
    }

    log.info("forwarded to n8n");
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
