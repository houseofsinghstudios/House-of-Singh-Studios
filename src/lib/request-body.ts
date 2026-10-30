// The form API routes read their request body through this, so no route ever buffers or parses more
// than 64 KB. A declared Content-Length over the cap is refused before anything is read; otherwise
// the body is read up to the cap and refused the moment it passes it.

export const MAX_BODY_BYTES = 64 * 1024;

// The body as text, or null when it is over the cap.
export async function readBodyText(request: Request, max: number = MAX_BODY_BYTES): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > max) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, at);
    at += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

// The parsed JSON, or null when the text is not JSON (as request.json().catch(() => null) gave).
export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// The answer to a body over the cap: 413 with a short JSON error.
export function bodyTooLarge(): Response {
  return Response.json({ success: false, error: "Request too large" }, { status: 413 });
}
