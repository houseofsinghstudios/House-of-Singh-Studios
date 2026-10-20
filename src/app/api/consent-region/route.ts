import { NextResponse } from "next/server";
import { STRICT_CONSENT_REGIONS } from "@/lib/constants/analytics";

// Whether the visitor is in a region with stricter consent rules: the same list Google Analytics
// uses (EEA, UK, Switzerland and Quebec). Read from the location headers Vercel adds to every request.
// Nothing is logged, and no IP address is read. Without the headers (not on Vercel) the region is
// unknown, which counts as strict.
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const country = (request.headers.get("x-vercel-ip-country") || "").trim().toUpperCase();
  const region = (request.headers.get("x-vercel-ip-country-region") || "").trim().toUpperCase();
  const strict = !country || STRICT_CONSENT_REGIONS.includes(country) || (region !== "" && STRICT_CONSENT_REGIONS.includes(`${country}-${region}`));
  return NextResponse.json({ strict }, { headers: { "Cache-Control": "private, max-age=3600" } });
}
