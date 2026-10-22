import { NextResponse } from "next/server";
import { n8nTarget, postToN8n } from "@/lib/n8n";

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;

// Signup points the n8n workflow stores in Airtable. Anything else is recorded as the footer.
const SOURCES = ["footer-subscribe", "article", "brand-pulse"];
const DEFAULT_SOURCE = "footer-subscribe";

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }
  entry.count++;
  if (entry.count > MAX_REQUESTS) return true;
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit.entries()) {
    if (now - entry.timestamp > RATE_LIMIT_WINDOW) rateLimit.delete(ip);
  }
}, 5 * 60 * 1000);

// Logs never include the email address or the webhook URL.
export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email, source } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
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
