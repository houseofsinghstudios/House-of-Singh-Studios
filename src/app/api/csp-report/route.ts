import { clientAddresses, createRateLimiter } from "@/lib/rate-limit";

// Content Security Policy violation reports (audit of 20 Nov 2026, finding 3). The browser posts a
// report here whenever the policy blocks something; next.config.ts names this route in the
// Reporting-Endpoints header and the policy's report-to directive.
//
// Only the first 2 KB of a report is read. It is logged as one console.warn line, with line breaks
// collapsed and query strings and fragments cut from every address (a page address or referrer can
// carry a visitor's details). Nothing is stored or forwarded. Always 204, except over the rate limit.

export const REPORT_MAX_BYTES = 2048;

// Same shared limiter as the form routes: 20 reports a minute per IP.
const isRateLimited = createRateLimiter(20);

// The first REPORT_MAX_BYTES of the body as text; the rest is never read.
async function firstBytes(request: Request): Promise<string> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const kept: Uint8Array[] = [];
  let size = 0;
  while (size < REPORT_MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    const part = value.subarray(0, REPORT_MAX_BYTES - size);
    kept.push(part);
    size += part.byteLength;
  }
  await reader.cancel().catch(() => {});
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const part of kept) {
    bytes.set(part, at);
    at += part.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

// One safe log line: no line breaks or control characters, and no query string or fragment.
export function reportLine(text: string): string {
  return text
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/(https?:\/\/[^\s"'?#]*)[?#][^\s"']*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: Request) {
  if (isRateLimited(clientAddresses(request))) return new Response(null, { status: 429 });
  try {
    const text = await firstBytes(request);
    if (text) console.warn(`[csp-report] ${reportLine(text)}`);
  } catch {
    // A broken body is not worth a log line; the browser gets the same answer.
  }
  return new Response(null, { status: 204 });
}
