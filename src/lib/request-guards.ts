// Checks the form API routes run before anything else (audit of 20 Nov 2026, finding 2).
//
// Only JSON: the site's own forms always send application/json. A plain text or form post from
// another website needs no preflight, so refusing it means a foreign page cannot make its visitors'
// browsers post to these routes (each visitor bringing a fresh IP past the rate limiter).
//
// Origin: browsers send it on every cross site POST. When present it must be the live site, a
// Vercel deployment of this project, or (in development only) localhost. Server tools and tests that
// send no Origin are judged by the other checks as before.

export const SITE_ORIGIN = "https://studios.houseofsingh.com";

// This project's Vercel deployments: the production alias and every preview address, for example
// house-of-singh-studios-git-<hash>-houseofsinghstudios-projects.vercel.app.
const VERCEL_ORIGIN = /^https:\/\/house-of-singh-studios(-[a-z0-9-]+-houseofsinghstudios-projects)?\.vercel\.app$/;
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isJsonRequest(request: Request): boolean {
  return (request.headers.get("content-type") || "").toLowerCase().startsWith("application/json");
}

export function originAllowed(request: Request, env: string | undefined = process.env.NODE_ENV): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return true;
  if (origin === SITE_ORIGIN || VERCEL_ORIGIN.test(origin)) return true;
  return env !== "production" && LOCAL_ORIGIN.test(origin);
}

// The JSON answers for the two refusals, the same shape every form route uses.
export const unsupportedType = () => Response.json({ success: false, error: "Send the request as JSON." }, { status: 415 });
export const forbiddenOrigin = () => Response.json({ success: false, error: "Request refused." }, { status: 403 });

// Both checks in route order: the origin first, then the content type. null when the request may go on.
export function refuseRequest(request: Request): Response | null {
  if (!originAllowed(request)) return forbiddenOrigin();
  if (!isJsonRequest(request)) return unsupportedType();
  return null;
}
