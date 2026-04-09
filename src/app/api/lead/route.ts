import { NextResponse } from "next/server";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request: Request) {
  try {
    console.log("[lead] POST /api/lead received");

    const body = await request.json();
    const { name, email, service, budget, message, honeypot } = body;

    console.log("[lead] Form data:", { name, email, service, budget, messageLength: message?.length, hasHoneypot: !!honeypot });

    if (honeypot) {
      console.log("[lead] Honeypot filled — ignoring");
      return NextResponse.json({ success: true });
    }

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("[lead] Invalid email:", email);
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
      console.error("[lead] CRITICAL: N8N_WEBHOOK_URL is not configured — returning 500");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("[lead] Forwarding to webhook:", webhookUrl);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    });

    const responseText = await response.text();
    console.log("[lead] Webhook response:", response.status, responseText);

    if (!response.ok) {
      console.error("[lead] Webhook failed:", response.status, responseText);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    console.log("[lead] Success — lead forwarded to n8n");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[lead] Unhandled error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
