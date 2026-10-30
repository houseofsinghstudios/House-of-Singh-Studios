import { NextRequest, NextResponse } from "next/server";
import { n8nTarget, postToN8n } from "@/lib/n8n";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { checkCareers, cleanCareers } from "@/lib/careers";
import { bodyTooLarge, readBodyText } from "@/lib/request-body";

// Five requests a minute per address, the shared in memory limiter.
const isRateLimited = createRateLimiter(5);

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(clientIp(request))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Over 64 KB is refused before anything is parsed.
    const text = await readBodyText(request);
    if (text === null) return bodyTooLarge();
    const body = JSON.parse(text);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // A filled honeypot is a bot: answer as if it worked, send nothing.
    if (typeof body.honeypot === "string" && body.honeypot.trim()) {
      console.log("[careers] honeypot filled, ignored");
      return NextResponse.json({ success: true });
    }

    // Cleaned first, then checked: required fields, email format and length caps.
    const fields = cleanCareers(body);
    const invalid = checkCareers(fields);
    if (invalid) {
      console.log(`[careers] validation failed: ${invalid.toLowerCase()}`);
      return NextResponse.json({ error: invalid }, { status: 400 });
    }

    const target = n8nTarget("N8N_CAREERS_WEBHOOK_URL");
    if ("missing" in target) {
      console.error(`${target.missing} is not configured`);
      return NextResponse.json(
        { error: "Application system is not configured." },
        { status: 500 }
      );
    }

    const n8nResponse = await postToN8n(
      target,
      { ...fields, source: "careers-page", submittedAt: new Date().toISOString() },
      10000,
    );

    if (!n8nResponse.ok) {
      console.error("n8n webhook failed:", n8nResponse.status);
      return NextResponse.json(
        { error: "Failed to submit application." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      console.error("[careers] n8n webhook timed out after 10 seconds");
      return NextResponse.json({ error: "Failed to submit application." }, { status: 504 });
    }
    // Name only: error messages can quote the request body or the webhook host.
    console.error("Career application error:", error instanceof Error ? error.name : "unknown error");
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
