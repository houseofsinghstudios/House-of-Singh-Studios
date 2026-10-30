import { NextResponse } from "next/server";
import { n8nTarget, postToN8n } from "@/lib/n8n";
import { buildPayload, parseEvent } from "@/lib/project-planner/events-server";
import { loadPublishedPricing } from "@/lib/project-planner/pricing";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { bodyTooLarge, parseJson, readBodyText } from "@/lib/request-body";

// Project Planner events: started, viewed, call_clicked, sent. The brief is always recomputed here
// with the same rule based engine and the server's own prices; whatever the browser sends is ignored.
// Logs record only the event type and outcome. Never a name, email, note, website, full referrer,
// the webhook URL or the n8n response body: Vercel keeps logs.

// Same limiter as Brand Pulse: 20 per minute per IP, per serverless instance (see rate-limit.ts).
const isRateLimited = createRateLimiter(20);

// Within one instance, an event already accepted by n8n is not sent twice. n8n remains the
// authority across instances: it deduplicates on eventIdempotencyKey.
const delivered = new Set<string>();
const DELIVERED_MAX = 5000;

export async function POST(request: Request) {
  try {
    if (isRateLimited(clientIp(request))) {
      console.log("[project-planner] rate limit exceeded");
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // Over 64 KB is refused before anything is parsed.
    const text = await readBodyText(request);
    if (text === null) return bodyTooLarge();
    const body: unknown = parseJson(text);
    const parsed = parseEvent(body);
    if (typeof parsed === "string") {
      console.log(`[project-planner] rejected: ${parsed.toLowerCase()}`);
      return NextResponse.json({ success: false, error: parsed }, { status: 400 });
    }
    if (parsed.event === "sent" && parsed.honeypot) {
      console.log("[project-planner] sent: honeypot filled, ignored");
      return NextResponse.json({ success: true });
    }

    const key = `${parsed.briefId}:${parsed.event}`;
    if (delivered.has(key)) {
      console.log(`[project-planner] ${parsed.event}: duplicate, already delivered`);
      return NextResponse.json({ success: true });
    }

    const target = n8nTarget("N8N_PROJECT_PLANNER_WEBHOOK_URL");
    if ("missing" in target) {
      console.error(`[project-planner] ${target.missing} is not configured`);
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    // started and call_clicked carry no answers, so they never need prices.
    const pricing = parsed.event === "viewed" || parsed.event === "sent" ? await loadPublishedPricing() : null;
    const response = await postToN8n(target, buildPayload(parsed, pricing, new Date().toISOString()), 10000);

    if (!response.ok) {
      console.error(`[project-planner] ${parsed.event}: n8n webhook failed with status ${response.status}`);
      return NextResponse.json({ success: false }, { status: 502 });
    }

    if (delivered.size >= DELIVERED_MAX) delivered.clear();
    delivered.add(key);
    console.log(`[project-planner] ${parsed.event}: forwarded to n8n`);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error("[project-planner] n8n webhook timed out after 10 seconds");
      return NextResponse.json({ success: false }, { status: 504 });
    }
    // Name only: error messages can quote the request body or the webhook host.
    console.error("[project-planner] request failed:", err instanceof Error ? err.name : "unknown error");
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
