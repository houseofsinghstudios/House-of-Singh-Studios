import { NextResponse } from "next/server";
import { n8nTarget, postToN8n } from "@/lib/n8n";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { cleanField } from "@/lib/lead";
import { checkSubscribeEmail } from "@/lib/subscribe";

// Signup points the n8n workflow stores in Airtable. Anything else is recorded as the footer.
const SOURCES = ["footer-subscribe", "article", "brand-pulse"];
const DEFAULT_SOURCE = "footer-subscribe";

// Five requests a minute per address, the shared in memory limiter.
const isRateLimited = createRateLimiter(5);

// Logs never include the email address or the webhook URL.
export async function POST(request: Request) {
  try {
    if (isRateLimited(clientIp(request))) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    // A filled honeypot is a bot: answer as if it worked, send nothing.
    if (typeof body.honeypot === "string" && body.honeypot.trim()) {
      return NextResponse.json({ success: true });
    }
    const { source } = body;
    const email = cleanField(body.email);
    const invalid = checkSubscribeEmail(email);
    if (invalid) {
      return NextResponse.json({ success: false, error: invalid }, { status: 400 });
    }

    const target = n8nTarget("N8N_SUBSCRIBE_WEBHOOK_URL");
    if ("missing" in target) {
      console.error(`[subscribe] ${target.missing} is not configured`);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const response = await postToN8n(
      target,
      { email, source: SOURCES.includes(source) ? source : DEFAULT_SOURCE, subscribedAt: new Date().toISOString() },
      10000,
    );

    // n8n answers only after storing and alerting, so a non 2xx status is a real failure.
    if (!response.ok) {
      console.error(`[subscribe] n8n webhook failed with status ${response.status}`);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error("[subscribe] n8n webhook timed out after 10 seconds");
      return NextResponse.json({ success: false }, { status: 504 });
    }
    // Name only: error messages can quote the request body.
    console.error("[subscribe] request failed:", err instanceof Error ? err.name : "unknown error");
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
