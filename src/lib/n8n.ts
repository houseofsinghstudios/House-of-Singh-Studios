// Every call from this site to an n8n webhook goes through here. Each request carries the shared
// secret in the x-hos-webhook-secret header, so n8n can reject anything that did not come from the
// site. Fail closed: without the webhook address or the secret, nothing is sent.
// The secret is never logged; callers log only the name of a missing variable.
import "server-only";

export const SECRET_HEADER = "x-hos-webhook-secret";
export const SECRET_VAR = "N8N_WEBHOOK_SECRET";

export interface N8nTarget {
  url: string;
  secret: string;
}

type Env = Record<string, string | undefined>;

// The webhook to call, or the name of the first missing variable.
export function n8nTarget(urlVar: string, env: Env = process.env): N8nTarget | { missing: string } {
  const url = env[urlVar];
  if (!url) return { missing: urlVar };
  const secret = env[SECRET_VAR];
  if (!secret) return { missing: SECRET_VAR };
  return { url, secret };
}

// POSTs the payload as JSON with the secret header. timeoutMs aborts with a TimeoutError.
export function postToN8n(target: N8nTarget, payload: unknown, timeoutMs?: number): Promise<Response> {
  return fetch(target.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", [SECRET_HEADER]: target.secret },
    body: JSON.stringify(payload),
    ...(timeoutMs ? { signal: AbortSignal.timeout(timeoutMs) } : {}),
  });
}
