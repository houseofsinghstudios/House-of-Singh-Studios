import { NextResponse } from "next/server";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

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
      company: company ? stripHtml(String(company)) : "",
      message: message ? stripHtml(String(message)) : "",
      source: "contact-form",
      submittedAt: new Date().toISOString(),
    };

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("N8N_WEBHOOK_URL is not configured. Skipping webhook.");
      return NextResponse.json({ success: true });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
