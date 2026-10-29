"use client";
// Google Analytics 4. Rendered by the (site) layout on production deployments only, so local
// development, previews and /studio never load it, and it runs only on the real hostname
// (CLARITY_HOST, the same rule Clarity follows), never on vercel.app addresses. A client component:
// it reads the visitor's consent, follows client side navigation and listens for consent changes.
//
// Consent first: gtag.js is loaded and configured only once analytics consent is granted (the
// visitor's own choice, otherwise the region default from src/lib/consent.ts), so a visitor without
// consent sends nothing at all, not even cookieless pings. Withdrawing consent stops everything.
//
// Page views are sent here, one per route, never by gtag itself (send_page_view is off; the GA4
// stream's "page changes based on browser history events" must be off too). Each one first sets
// page_location, page_path, page_title and content_group, so every later event belongs to the page
// the visitor is on. Events go through src/lib/analytics.ts, which sends nothing without consent;
// discovery call clicks are picked up here, anywhere on the site.
//
// Internal traffic: ?hos_internal=1 on any page marks this browser as the studio's (?hos_internal=0
// clears it); while marked, the config carries traffic_type "internal". ?hos_debug=1 turns on GA4's
// debug_mode for this tab's session (?hos_debug=0 turns it off), so events show in DebugView.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID } from "@/lib/constants/analytics";
import { CLARITY_HOST } from "@/lib/constants/clarity";
import { ANALYTICS_CONSENT_EVENT } from "@/lib/constants/consent";
import { effectiveState, isStrictRegion, readChoice, type ConsentState } from "@/lib/consent";
import { isAllowed, isDiscoveryCallHref, setAllowed, startGtag, syncDebugFlag, syncInternalFlag, track, trackPageView } from "@/lib/analytics";

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] } & Record<string, unknown>;

// GA's own switch: while true, gtag.js sends nothing, including its automatic events.
const DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}`;

// The gtag.js tag itself, added once consent is granted (src/lib/analytics.ts startGtag).
function loadTag() {
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(tag);
}

// The new page's title arrives with its metadata, a moment after the route changes. Waits for the
// title to differ from the last page's, or 1 second at most, then sends.
function whenTitleSettles(previous: string, send: () => void) {
  if (document.title !== previous) return send();
  const started = performance.now();
  const check = () => {
    if (document.title !== previous || performance.now() - started > 1000) send();
    else window.setTimeout(check, 50);
  };
  window.setTimeout(check, 50);
}

function safeStorage(kind: "localStorage" | "sessionStorage"): Storage | null {
  try {
    return window[kind];
  } catch {
    return null;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const sent = useRef<{ href: string; title: string } | null>(null);

  // One page view per address; repeats (re-renders, a consent change back on) are ignored.
  const pageView = useRef(() => {
    if (!isAllowed() || sent.current?.href === window.location.href) return;
    sent.current = { href: window.location.href, title: document.title };
    trackPageView(window.location.href, document.title);
  });

  // Consent: decided once per page load, then followed as the visitor changes it.
  useEffect(() => {
    if (window.location.hostname !== CLARITY_HOST) return;
    const w = window as unknown as GtagWindow;
    // Read on every full page load, whatever the consent: the flag is kept for later visits too.
    const internal = syncInternalFlag(window.location.search, safeStorage("localStorage"));
    const debug = syncDebugFlag(window.location.search, safeStorage("sessionStorage"));
    const follow = (state: ConsentState) => {
      w[DISABLE_KEY] = state !== "granted";
      setAllowed(state === "granted");
      if (state !== "granted") return;
      startGtag(w, internal, debug, loadTag);
      sent.current = null;
      pageView.current();
    };
    let live = true;
    void isStrictRegion().then((strict) => live && follow(effectiveState(strict, readChoice())));
    const onChange = (e: Event) => follow((e as CustomEvent<ConsentState>).detail);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    return () => {
      live = false;
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onChange);
    };
  }, []);

  // Client side navigation: a page view for each new route, once its title is in place.
  useEffect(() => {
    if (!isAllowed() || !sent.current || sent.current.href === window.location.href) return;
    whenTitleSettles(sent.current.title, pageView.current);
  }, [pathname]);

  // discovery_call_click: any click on a link to the discovery call (DISCOVERY_CALL_URL, also with
  // the notes Brand Pulse and the Project Planner add), including a middle click to a new tab.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.type === "auxclick" && e.button !== 1) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (link && isDiscoveryCallHref(link.href)) track("discovery_call_click", { page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);

  return null;
}
