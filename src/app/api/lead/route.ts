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

    const body = await request.json();
    const { name, email, service, message, honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      message: message ? stripHtml(String(message)) : "",
      source: "contact-form",
      submittedAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("[lead] N8N_WEBHOOK_URL is not configured");
      return NextResponse.json({ success: true });
    }

    console.log("[lead] Forwarding to webhook:", webhookUrl);
    console.log("[lead] Payload:", JSON.stringify(sanitized));

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    });

    const responseText = await response.text();
    console.log("[lead] Webhook response status:", response.status);
    console.log("[lead] Webhook response body:", responseText);

    if (!response.ok) {
      console.error("[lead] Webhook failed:", response.status, responseText);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    console.log("[lead] Success — lead forwarded");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[lead] Unhandled error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
