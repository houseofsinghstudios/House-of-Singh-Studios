import { NextResponse } from "next/server";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

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
  if (entry.count > MAX_REQUESTS) return true;
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit.entries()) {
    if (now - entry.timestamp > RATE_LIMIT_WINDOW) rateLimit.delete(ip);
  }
}, 5 * 60 * 1000);

// Logs record only what helps debugging. Never a name, email, budget, message,
// the webhook URL or the n8n response body: Vercel keeps logs.
export async function POST(request: Request) {
  try {
    console.log("[lead] request received");

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      console.log("[lead] rate limit exceeded");
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, service, budget, message, honeypot } = body;

    if (honeypot) {
      console.log("[lead] honeypot filled, ignored");
      return NextResponse.json({ success: true });
    }

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("[lead] validation failed: invalid email");
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    // Sanitize text inputs
    const sanitized = {
      name: name ? stripHtml(String(name)) : "",
      email: stripHtml(String(email)),
      service: service ? stripHtml(String(service)) : "",
      budget: budget ? stripHtml(String(budget)) : "",
      message: message ? stripHtml(String(message)) : "",
      source: "contact-form",
      submittedAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[lead] N8N_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
      signal: AbortSignal.timeout(10000),
    });

    // n8n answers only after saving and alerting, so a non 2xx status is a real failure.
    if (!response.ok) {
      console.error(`[lead] n8n webhook failed with status ${response.status}`);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    console.log("[lead] forwarded to n8n");
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error("[lead] n8n webhook timed out after 10 seconds");
      return NextResponse.json({ success: false }, { status: 504 });
    }
    // Name only: error messages can quote the request body or the webhook host.
    console.error("[lead] request failed:", err instanceof Error ? err.name : "unknown error");
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
