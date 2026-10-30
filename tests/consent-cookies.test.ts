// Turning analytics off removes the analytics cookies: Clarity's and Google Analytics' (_ga and every
// _ga_<id>), including those GA sets on the parent domain. Keeping consent leaves them alone.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
// consent.ts only reads browser globals inside its functions, so the stand ins below are in place in time.
import * as consent from "@/lib/consent";

// A small cookie jar that behaves like a browser for what consent.ts does: a cookie lives under its
// domain ("" for host only), is visible to this host when set for it or a parent domain, and is
// removed only by Max-Age=0 with the same name and the same domain.
const HOST = "studios.houseofsingh.com";
const jar = new Map<string, string>(); // "name|domain" -> value
const visible = (domain: string) => domain === "" || HOST === domain.replace(/^\./, "") || HOST.endsWith(domain.startsWith(".") ? domain : `.${domain}`);
Object.assign(globalThis, {
  window: { location: { hostname: HOST } },
  document: {
    get cookie() {
      return [...jar].filter(([k]) => visible(k.split("|")[1])).map(([k, v]) => `${k.split("|")[0]}=${v}`).join("; ");
    },
    set cookie(line: string) {
      const [pair, ...attrs] = line.split(";").map((p) => p.trim());
      const [name, value] = pair.split("=");
      const domainAttr = attrs.find((a) => a.toLowerCase().startsWith("domain="))?.slice(7) ?? "";
      // Browsers treat "domain=example.com" and "domain=.example.com" as the same domain cookie.
      const domain = domainAttr ? `.${domainAttr.replace(/^\./, "")}` : "";
      const key = `${name}|${domain}`;
      if (attrs.some((a) => a.toLowerCase() === "max-age=0")) jar.delete(key);
      else jar.set(key, value);
    },
  },
});

const setAll = () => {
  jar.clear();
  // Where GA and Clarity put them: GA on the parent domain, Clarity on the parent domain and host.
  document.cookie = "_ga=GA1.1.123.456; path=/; domain=.houseofsingh.com";
  document.cookie = "_ga_DKQYLQ90EK=GS1.1.789; path=/; domain=.houseofsingh.com";
  document.cookie = "_ga_TEST1234=GS1.1.000; path=/; domain=houseofsingh.com";
  document.cookie = "_ga=GA1.1.999; path=/";
  document.cookie = "_clck=abc; path=/; domain=.houseofsingh.com";
  document.cookie = "_clsk=def; path=/";
  document.cookie = "hos_other=keep; path=/";
  document.cookie = "_gat=keep; path=/; domain=.houseofsingh.com";
};
const names = () => document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter(Boolean).sort();
const w = { gtag: () => {}, clarity: () => {} } as unknown as Window;

test("withdrawing consent removes _ga and every _ga_ cookie, on the host and the parent domain, and Clarity's", () => {
  setAll();
  assert.deepEqual(names(), ["_clck", "_clsk", "_ga", "_ga", "_ga_DKQYLQ90EK", "_ga_TEST1234", "_gat", "hos_other"]);
  consent.apply("denied", w);
  assert.deepEqual(names(), ["_gat", "hos_other"], "only cookies that are not analytics cookies remain");
});

test("keeping consent leaves the analytics cookies in place", () => {
  setAll();
  const before = names();
  consent.apply("granted", w);
  assert.deepEqual(names(), before);
});
