import { NextRequest } from "next/server";
import { n8nTarget, postToN8n } from "@/lib/n8n";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { checkCareers, cleanCareers } from "@/lib/careers";
import { cleanSubmissionId } from "@/lib/form-input";
import { bodyTooLarge, parseJson, readBodyText } from "@/lib/request-body";
import { errorName, json, N8N_FAILED, routeLog } from "@/lib/api-response";

const log = routeLog("careers");

// Five requests a minute per address, the shared in memory limiter.
const isRateLimited = createRateLimiter(5);

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(clientIp(request))) {
      return json({ error: "Too many requests. Please try again later." }, 429);
    }

    // Over 64 KB is refused before anything is parsed.
    const text = await readBodyText(request);
    if (text === null) return bodyTooLarge();
    // Not JSON (or not an object): a 400, like every form route.
    const body = parseJson(text) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid request." }, 400);
    }

    // A filled honeypot is a bot: answer as if it worked, send nothing.
    if (typeof body.honeypot === "string" && body.honeypot.trim()) {
      log.info("honeypot filled, ignored");
      return json({ success: true });
    }

    // Cleaned first, then checked: required fields, email format and length caps.
    const fields = cleanCareers(body);
    const invalid = checkCareers(fields);
    if (invalid) {
      log.info(`validation failed: ${invalid.toLowerCase()}`);
      return json({ error: invalid }, 400);
    }

    const submissionId = cleanSubmissionId(body.submissionId);
    const target = n8nTarget("N8N_CAREERS_WEBHOOK_URL");
    if ("missing" in target) {
      log.error(`${target.missing} is not configured`);
      return json({ error: "Application system is not configured." }, 500);
    }

    const n8nResponse = await postToN8n(
      target,
      {
        ...fields,
        source: "careers-page",
        // The form's id for this application, the same on a retry, for de-duplication in n8n.
        ...(submissionId && { submissionId }),
        submittedAt: new Date().toISOString(),
      },
      10000,
    );

    if (!n8nResponse.ok) {
      log.error(`n8n webhook failed with status ${n8nResponse.status}`);
      return json({ error: "Failed to submit application." }, N8N_FAILED);
    }

    return json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      log.error("n8n webhook timed out after 10 seconds");
      return json({ error: "Failed to submit application." }, 504);
    }
    // Name only: error messages can quote the request body or the webhook host.
    log.error(`request failed: ${errorName(error)}`);
    return json({ error: "An unexpected error occurred." }, 500);
  }
}
