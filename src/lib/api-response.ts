// Shared answers and logs for the form API routes, so every route reports the same failure the same
// way: 400 when the request is not JSON (or not an object), 413 over the size cap, 429 over the rate
// limit, 502 when n8n refuses, 504 when n8n times out, 500 for anything unexpected. The visitor facing
// messages stay each route's own.
// Logs carry the route's prefix ("[lead]") and never the request body, a visitor's details or the
// webhook address: Vercel keeps logs.

export type ApiRoute = "lead" | "careers" | "subscribe" | "brand-pulse" | "project-planner";

// A JSON answer with a status (200 when none is given).
export function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status });
}

// Log lines with the route's prefix.
export function routeLog(route: ApiRoute) {
  return {
    info: (message: string) => console.log(`[${route}] ${message}`),
    error: (message: string) => console.error(`[${route}] ${message}`),
  };
}

// The status for a failed n8n call: 502, as a gateway that answered with an error.
export const N8N_FAILED = 502;

// What an unexpected error may say in a log: its name only (messages can quote the request body or
// the webhook host).
export const errorName = (err: unknown) => (err instanceof Error ? err.name : "unknown error");
