// Per IP request limit, the one Brand Pulse introduced, shared by the Brand Pulse, Project Planner,
// careers, newsletter and contact lead routes.
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

  function hit(ip: string, now: number): boolean {
    const entry = counts.get(ip);
    if (!entry || now - entry.timestamp > windowMs) {
      counts.set(ip, { count: 1, timestamp: now });
      return false;
    }
    entry.count++;
    return entry.count > maxRequests;
  }

  // One address, or several for the same request (clientAddresses): each is counted, and the request
  // is limited when any of them is over the limit.
  return function isRateLimited(ip: string | readonly string[]): boolean {
    const now = Date.now();
    const ips = typeof ip === "string" ? [ip] : [...new Set(ip)];
    return ips.map((one) => hit(one, now)).some(Boolean);
  };
}

// The first address in x-forwarded-for, as the lead route reads it.
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// The address the platform itself saw (audit finding 14, added 22 Nov 2026): Vercel sets
// x-vercel-forwarded-for and x-real-ip at its edge, where a visitor cannot write them. Null off Vercel.
export function platformIp(request: Request): string | null {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  return vercel || request.headers.get("x-real-ip")?.trim() || null;
}

// Every address a request is counted under: the x-forwarded-for one as before, and the platform's
// own when there is one and it differs, so a forged x-forwarded-for cannot reset the count.
export function clientAddresses(request: Request): string[] {
  const platform = platformIp(request);
  const forwarded = clientIp(request);
  return platform && platform !== forwarded ? [forwarded, platform] : [forwarded];
}
