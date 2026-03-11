import { NextRequest, NextResponse } from "next/server";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request: NextRequest) {
  try {
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
