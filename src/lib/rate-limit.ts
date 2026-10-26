// Per IP request limit, the one Brand Pulse introduced, shared by the Brand Pulse, Project Planner,
// careers and newsletter routes.
// In memory: each serverless instance keeps its own count, so on Vercel the limit holds per instance,
// not globally. A burst spread across several instances can exceed it.
export function createRateLimiter(maxRequests: number, windowMs = 60 * 1000) {
  const counts = new Map<string, { count: number; timestamp: number }>();

  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of counts.entries()) {
      if (now - entry.timestamp > windowMs) counts.delete(ip);
    }
  }, 5 * 60 * 1000).unref?.();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = counts.get(ip);
    if (!entry || now - entry.timestamp > windowMs) {
      counts.set(ip, { count: 1, timestamp: now });
      return false;
    }
    entry.count++;
    return entry.count > maxRequests;
  };
}

// The first address in x-forwarded-for, as the lead route reads it.
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
