import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const { name, email, role, portfolioUrl, message } = body;
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_CAREERS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("N8N_CAREERS_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Application system is not configured." },
        { status: 500 }
      );
    }

    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: stripHtml(String(name)),
        email: stripHtml(String(email)),
        role: stripHtml(String(role)),
        portfolioUrl: portfolioUrl ? stripHtml(String(portfolioUrl)) : "",
        message: message ? stripHtml(String(message)) : "",
        source: "careers-page",
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!n8nResponse.ok) {
      console.error("n8n webhook failed:", n8nResponse.status);
      return NextResponse.json(
        { error: "Failed to submit application." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Career application error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
