// The homepage (04) Start links into the planner and Brand Pulse with ?from=home_start: a brief or a
// result started from there records home_start as attribution.entryPlacement, the site's convention
// for links within the site. The session's first page (src/lib/lead-source.ts) is untouched.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PULSE_HREF, planHref } from "@/lib/home-start";
import { startSession as startBrief } from "@/components/project-planner/events";
import { startSession as startPulse } from "@/components/brand-pulse/events";
import { buildPayload, parseEvent } from "@/lib/project-planner/events-server";
import { ENTRY_PLACEMENTS as PLANNER_PLACEMENTS, parsePlacement as plannerPlacement } from "@/lib/project-planner/start-links";
import { ENTRY_PLACEMENTS as PULSE_PLACEMENTS, parsePlacement as pulsePlacement } from "@/lib/brand-pulse/entry";

// A page opened at this address, as the browser sees it after the homepage link.
function openAt(href: string) {
  const url = new URL(href, "https://studios.houseofsingh.com");
  const store = new Map<string, string>();
  Object.assign(globalThis, {
    window: {
      location: { search: url.search, pathname: url.pathname, href: url.href },
      sessionStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) },
    },
    document: { referrer: "https://studios.houseofsingh.com/" },
  });
}

test("home_start is a known placement for both tools; the earlier ones stay", () => {
  assert.ok(PLANNER_PLACEMENTS.includes("home_start") && PLANNER_PLACEMENTS.includes("home_band_chip"));
  assert.ok(PULSE_PLACEMENTS.includes("home_start") && PULSE_PLACEMENTS.includes("home_band_button"));
  assert.equal(plannerPlacement("home_start"), "home_start");
  assert.equal(pulsePlacement("home_start"), "home_start");
});

test("a planner brief started from the homepage records home_start, with or without services", () => {
  for (const href of [planHref(["identity", "website"]), planHref([])]) {
    openAt(href);
    const session = startBrief();
    assert.equal(session.attribution.entryPlacement, "home_start", href);
    // What n8n receives for that brief.
    const event = parseEvent({ event: "started", briefId: session.briefId, attribution: session.attribution });
    assert.ok(typeof event !== "string", String(event));
    const payload = buildPayload(event, "2026-11-21T12:00:00.000Z") as { attribution: { entryPlacement: string; landingPage: string } };
    assert.equal(payload.attribution.entryPlacement, "home_start");
    assert.equal(payload.attribution.landingPage, "/start");
  }
});

test("a Brand Pulse result started from the homepage records home_start", () => {
  openAt(PULSE_HREF);
  const session = startPulse();
  assert.equal(session.attribution.entryPlacement, "home_start");
  // The API reads the same value back through the same rule before it reaches n8n.
  assert.equal(pulsePlacement(session.attribution.entryPlacement), "home_start");
  assert.match(readFileSync("src/app/api/brand-pulse/route.ts", "utf8"), /entryPlacement: parsePlacement\(a\.entryPlacement\),/);
});

test("the discovery call link is unchanged, and the lead source module is not touched", () => {
  assert.match(readFileSync("src/components/homepage/start/StartSection.tsx", "utf8"), /<a href=\{DISCOVERY_CALL_URL\} className="hs-door-link"/);
  assert.doesNotMatch(readFileSync("src/lib/lead-source.ts", "utf8"), /home_start|entryPlacement/);
});
