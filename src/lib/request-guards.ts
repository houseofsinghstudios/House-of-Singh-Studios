// Checks the form API routes run before anything else (audit of 20 Nov 2026, finding 2).
//
// Only JSON: the site's own forms always send application/json. A plain text or form post from
// another website needs no preflight, so refusing it means a foreign page cannot make its visitors'
// browsers post to these routes (each visitor bringing a fresh IP past the rate limiter).
//
// Origin: browsers send it on every cross site POST. When present it must be the live site, one of
// this project's own Vercel addresses, or (in development only) localhost. Server tools and tests
// that send no Origin are judged by the other checks as before.

export const SITE_ORIGIN = "https://studios.houseofsingh.com";

// This project's own Vercel addresses, and nothing else on vercel.app (from the review of #260):
//   the production alias, house-of-singh-studios.vercel.app, which no other project can take;
//   a deployment's own address, house-of-singh-studios-<nine character id>-houseofsinghstudios-projects
//   .vercel.app: the id is letters and digits only, so another team whose name merely ends in
//   houseofsinghstudios-projects can never match;
//   the running deployment's own branch and deployment addresses, read from Vercel's system variables
//   (VERCEL_BRANCH_URL, VERCEL_URL) and matched exactly. A branch address can hold any branch name,
//   so no pattern for it could tell this project from a lookalike.
const PRODUCTION_ALIAS = "https://house-of-singh-studios.vercel.app";
const DEPLOYMENT_ORIGIN = /^https:\/\/house-of-singh-studios-[a-z0-9]{9}-houseofsinghstudios-projects\.vercel\.app$/;
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

// The running deployment's own addresses, as origins. Vercel gives host names without the scheme.
type Deployment = { url?: string; branchUrl?: string };
const currentDeployment = (): Deployment => ({ url: process.env.VERCEL_URL, branchUrl: process.env.VERCEL_BRANCH_URL });
const ownOrigins = (d: Deployment) => [d.url, d.branchUrl].filter((h): h is string => Boolean(h)).map((h) => `https://${h.toLowerCase()}`);

export function isJsonRequest(request: Request): boolean {
  return (request.headers.get("content-type") || "").toLowerCase().startsWith("application/json");
}

export function originAllowed(request: Request, env: string | undefined = process.env.NODE_ENV, deployment: Deployment = currentDeployment()): boolean {
  const origin = request.headers.get("origin");
  if (origin === null) return true;
  if (origin === SITE_ORIGIN || origin === PRODUCTION_ALIAS || DEPLOYMENT_ORIGIN.test(origin)) return true;
  if (ownOrigins(deployment).includes(origin)) return true;
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
