import { NextRequest, NextResponse } from "next/server";

/* ── Simple in-memory rate limiter ── */
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      businessDescription,
      brandAge,
      channelCount,
      biggestChallenge,
      guidelinesStatus,
      email,
    } = body;

    if (
      !businessDescription ||
      !brandAge ||
      !channelCount ||
      !biggestChallenge ||
      !guidelinesStatus
    ) {
      return NextResponse.json(
        { error: "All five questions are required." },
        { status: 400 }
      );
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return NextResponse.json(
        { error: "AI assessment is not configured." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a brand strategist at a design studio in Toronto that builds brand identities, visual systems, and digital experiences for established businesses. You are direct, confident, and commercially grounded. You never use the words bespoke, holistic, transformative, synergy, curated, elevated, journey, passionate, cutting edge, or timeless. You do not use vague language or empty compliments. You speak in short, clear sentences.

A prospective client has answered 5 questions about their brand. Analyze their responses and provide:

1. A diagnostic heading (one line, 8 to 12 words, direct and specific to their situation). Output this on its own line, prefixed with "HEADING: ".

2. A brand assessment (2 to 3 short paragraphs) that:
   * References their specific industry
   * Identifies risks based on their brand age, channel count, and guideline status
   * Connects their stated challenge to a specific business consequence
   * Recommends a concrete next step (not vague advice)

Do not mention any studio name in the assessment. Do not pitch services. Just deliver a clear, honest evaluation that demonstrates expertise. Keep the total response under 200 words.`;

    const userMessage = `Here are the prospect's answers:

1. Business description: ${businessDescription}
2. When was the brand identity last professionally designed or updated: ${brandAge}
3. How many channels the brand appears on: ${channelCount}
4. Biggest brand challenge right now: ${biggestChallenge}
5. Documented brand guidelines status: ${guidelinesStatus}`;

    const claudeResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [{ role: "user", content: userMessage }],
          system: systemPrompt,
        }),
      }
    );

    if (!claudeResponse.ok) {
      console.error(
        "Claude API error:",
        claudeResponse.status,
        await claudeResponse.text()
      );
      return NextResponse.json(
        { error: "AI assessment failed. Please try again." },
        { status: 502 }
      );
    }

    const claudeData = await claudeResponse.json();
    const fullText = claudeData.content
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n");

    let heading = "";
    let assessment = fullText;

    const headingMatch = fullText.match(/^HEADING:\s*(.+)$/m);
    if (headingMatch) {
      heading = headingMatch[1].trim();
      assessment = fullText.replace(/^HEADING:\s*.+$/m, "").trim();
    }

    // Send to n8n webhook (fire and forget)
    const n8nWebhookUrl = process.env.N8N_BRAND_PULSE_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessDescription,
          brandAge,
          channelCount,
          biggestChallenge,
          guidelinesStatus,
          aiHeading: heading,
          aiAssessment: assessment,
          email: email || "",
          source: "brand-pulse-check",
          submittedAt: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.error("n8n webhook error (non-blocking):", err);
      });
    }

    return NextResponse.json({ success: true, heading, assessment });
  } catch (error) {
    console.error("Brand Pulse Check error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
