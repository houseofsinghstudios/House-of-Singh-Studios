import { NextResponse } from "next/server";
import { checkLeadLengths, cleanField } from "@/lib/lead";

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
  <p>Or email us directly at <a href="mailto:studio@houseofsingh.com">studio@houseofsingh.com</a>.</p>
</main>
</body>
</html>`;

// Logs record only what helps debugging. Never a name, email, budget, message,
// the webhook URL or the n8n response body: Vercel keeps logs.
export async function POST(request: Request) {
  try {
    console.log("[lead] request received");

    // Only the JSON the contact page sends is accepted. A plain form post is never read or treated as a lead.
    if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) {
      console.log("[lead] non JSON request rejected");
      return new NextResponse(NO_SCRIPT_PAGE, { status: 415, headers: { "content-type": "text/html; charset=utf-8" } });
    }

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

    // Sanitize text inputs, then check lengths on the cleaned values
    const fields = {
      name: cleanField(name),
      email: cleanField(email),
      service: cleanField(service),
      budget: cleanField(budget),
      message: cleanField(message),
    };
    const invalid = checkLeadLengths(fields);
    if (invalid) {
      console.log(`[lead] validation failed: ${invalid.toLowerCase()}`);
      return NextResponse.json({ success: false, error: invalid }, { status: 400 });
    }
    const sanitized = { ...fields, source: "contact-form", submittedAt: new Date().toISOString() };

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
