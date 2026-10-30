// A referring address cut to its origin and path, for the Project Planner and Brand Pulse. Query
// strings and fragments can carry personal details (search terms, email addresses, tokens), so they
// are dropped in the browser and again on the server, and never reach n8n.
import { capRaw, stripTags } from "./form-input";

export function originAndPath(value: unknown): string {
  if (typeof value !== "string") return "";
  // Cut before cleaning (src/lib/form-input.ts), so nothing ever scans more than twice the limit.
  const raw = stripTags(capRaw(value, 500)).replace(/\s+/g, " ").trim().slice(0, 500);
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return /^https?:$/.test(u.protocol) ? `${u.origin}${u.pathname}`.slice(0, 300) : "";
  } catch {
    return "";
  }
}
