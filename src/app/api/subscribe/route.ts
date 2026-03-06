import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
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
