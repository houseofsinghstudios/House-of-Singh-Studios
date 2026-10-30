import { n8nTarget, postToN8n } from "@/lib/n8n";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { cleanField } from "@/lib/lead";
import { checkSubscribeEmail, SUBSCRIBE_EMAIL_MAX } from "@/lib/subscribe";
import { bodyTooLarge, parseJson, readBodyText } from "@/lib/request-body";
import { errorName, json, N8N_FAILED, routeLog } from "@/lib/api-response";

const log = routeLog("subscribe");

// Signup points the n8n workflow stores in Airtable. Anything else is recorded as the footer.
const SOURCES = ["footer-subscribe", "article", "brand-pulse"];
const DEFAULT_SOURCE = "footer-subscribe";

// Five requests a minute per address, the shared in memory limiter.
const isRateLimited = createRateLimiter(5);

// Logs never include the email address or the webhook URL.
export async function POST(request: Request) {
  try {
    if (isRateLimited(clientIp(request))) {
      return json({ success: false, error: "Too many requests. Please try again later." }, 429);
    }

    // Over 64 KB is refused before anything is parsed.
    const text = await readBodyText(request);
    if (text === null) return bodyTooLarge();
    // Not JSON (or not an object): a 400, like every form route.
    const body = parseJson(text) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return json({ success: false, error: "Invalid request" }, 400);
    }
    // A filled honeypot is a bot: answer as if it worked, send nothing.
    if (typeof body.honeypot === "string" && body.honeypot.trim()) {
      return json({ success: true });
    }
    const { source } = body;
    const email = cleanField(body.email, SUBSCRIBE_EMAIL_MAX);
    const invalid = checkSubscribeEmail(email);
    if (invalid) {
      return json({ success: false, error: invalid }, 400);
    }

    const target = n8nTarget("N8N_SUBSCRIBE_WEBHOOK_URL");
    if ("missing" in target) {
      log.error(`${target.missing} is not configured`);
      return json({ success: false }, 500);
    }

    const response = await postToN8n(
      target,
      { email, source: typeof source === "string" && SOURCES.includes(source) ? source : DEFAULT_SOURCE, subscribedAt: new Date().toISOString() },
      10000,
    );

    // n8n answers only after storing and alerting, so a non 2xx status is a real failure.
    if (!response.ok) {
      log.error(`n8n webhook failed with status ${response.status}`);
      return json({ success: false }, N8N_FAILED);
    }

    return json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      log.error("n8n webhook timed out after 10 seconds");
      return json({ success: false }, 504);
    }
    // Name only: error messages can quote the request body.
    log.error(`request failed: ${errorName(err)}`);
    return json({ success: false }, 500);
  }
}
