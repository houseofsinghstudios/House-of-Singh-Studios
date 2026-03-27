import { NextResponse } from "next/server";

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

    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_SUBSCRIBE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn(
        "N8N_SUBSCRIBE_WEBHOOK_URL is not configured. Skipping webhook."
      );
      return NextResponse.json({ success: true });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source: "footer-subscribe",
        subscribedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
