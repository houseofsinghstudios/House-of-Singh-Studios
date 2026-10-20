"use client";
// Quiet consent. Client component: it reads the region and the stored choice, watches scroll,
// page views, focus and the case study hero, and applies choices to Google Analytics and Clarity.
//
// Everyone: nothing appears unless they open Privacy choices from the footer.
// Stricter regions with no stored choice: a gentle ask, only after scrolling past 60% of a page or
// on the second page of the visit, at most once per visit. Desktop: a small fixed tab bottom left
// that expands to a card. Phones: a block in the page flow just above the footer, never floating.

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ASKED_KEY, CONSENT_COPY, VIEWS_KEY } from "@/lib/constants/consent";
import { CLARITY_HOST } from "@/lib/constants/clarity";
import { apply, effectiveState, isStrictRegion, readChoice, shouldAsk, storeChoice, type ConsentState } from "@/lib/consent";
import "./consent.css";

type Mode = "none" | "ask" | "choices" | "thanks";
export const PRIVACY_CHOICES_EVENT = "hos:privacy-choices";

const session = {
  get(key: string) {
    try { return sessionStorage.getItem(key); } catch { return null; }
  },
  set(key: string, value: string) {
    try { sessionStorage.setItem(key, value); } catch { /* storage blocked */ }
  },
};

const isField = (el: EventTarget | null) =>
  el instanceof HTMLElement && el.matches("input, textarea, select") && !el.closest(".cx-root");

// The ask's triggers: past 60% of the page, or the second page view of this visit.
function useAskTrigger(enabled: boolean, pathname: string, onTrigger: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const views = Number(session.get(VIEWS_KEY) || "0") + 1;
    session.set(VIEWS_KEY, String(views));
    if (views >= 2) return onTrigger();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.6) onTrigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled, pathname, onTrigger]);
}

// Desktop only: out of the way while typing in a form, or while a case study hero is on screen.
function useDesktopHidden(pathname: string) {
  const [formFocus, setFormFocus] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  useEffect(() => {
    const onIn = (e: FocusEvent) => setFormFocus(isField(e.target));
    const onOut = () => setFormFocus(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);
  useEffect(() => {
    const hero = document.querySelector(".cs-hero");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting));
    io.observe(hero);
    return () => {
      io.disconnect();
      setHeroInView(false);
    };
  }, [pathname]);
  return formFocus || heroInView;
}

export default function ConsentManager() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [strict, setStrict] = useState(false);
  const [state, setState] = useState<ConsentState>("granted");
  const [askable, setAskable] = useState(false);
  const [mode, setMode] = useState<Mode>("none");
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const desktopHidden = useDesktopHidden(pathname);

  // Same rule as Clarity: only on the real site.
  useEffect(() => {
    if (window.location.hostname !== CLARITY_HOST) return;
    let live = true;
    void isStrictRegion().then((s) => {
      if (!live) return;
      const choice = readChoice();
      setStrict(s);
      setState(effectiveState(s, choice));
      setAskable(shouldAsk(s, choice) && session.get(ASKED_KEY) !== "1");
      setReady(true);
    });
    return () => { live = false; };
  }, []);

  const trigger = useCallback(() => {
    setMode((m) => {
      if (m !== "none") return m;
      session.set(ASKED_KEY, "1");
      return "ask";
    });
    setAskable(false);
  }, []);
  useAskTrigger(ready && askable, pathname, trigger);

  // The footer's Privacy choices button.
  useEffect(() => {
    if (!ready) return;
    const open = () => {
      setState(effectiveState(strict, readChoice()));
      setMode("choices");
      setExpanded(true);
      requestAnimationFrame(() => headingRef.current?.focus());
    };
    window.addEventListener(PRIVACY_CHOICES_EVENT, open);
    return () => window.removeEventListener(PRIVACY_CHOICES_EVENT, open);
  }, [ready, strict]);

  function choose(next: ConsentState) {
    storeChoice(next);
    apply(next);
    setState(next);
    setAskable(false);
    setMessage(next === "granted" ? CONSENT_COPY.thanksOn : CONSENT_COPY.thanksOff);
    setMode("thanks");
    window.setTimeout(() => setMode("none"), 1800);
  }

  if (mode === "none") return null;
  const isAsk = mode === "ask";
  const showCard = !isAsk || expanded;
  const buttons = isAsk
    ? [{ label: CONSENT_COPY.allow, value: "granted" as const }, { label: CONSENT_COPY.decline, value: "denied" as const }]
    : [{ label: CONSENT_COPY.turnOn, value: "granted" as const }, { label: CONSENT_COPY.turnOff, value: "denied" as const }];

  return (
    <div className={`cx-root cx-${mode}${showCard ? " is-expanded" : ""}${desktopHidden ? " is-desktop-hidden" : ""}`}>
      {isAsk && (
        <button type="button" className="cx-tab" aria-expanded={expanded} aria-controls="cx-card" onClick={() => setExpanded(true)}>
          {CONSENT_COPY.tab} <span aria-hidden="true">›</span>
        </button>
      )}
      <section id="cx-card" className="cx-card" aria-labelledby="cx-heading" aria-live="polite">
        {mode === "thanks" ? (
          <p className="cx-thanks" role="status">{message}</p>
        ) : (
          <>
            <div className="cx-top">
              <p className="cx-label">{CONSENT_COPY.label}</p>
              <button
                type="button"
                className="cx-close"
                aria-label={CONSENT_COPY.close}
                onClick={() => (isAsk ? setExpanded(false) : setMode("none"))}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <h2 id="cx-heading" ref={headingRef} tabIndex={-1} className="cx-heading">
              {isAsk ? CONSENT_COPY.heading : state === "granted" ? CONSENT_COPY.stateOn : CONSENT_COPY.stateOff}
            </h2>
            {isAsk && <p className="cx-body">{CONSENT_COPY.body}</p>}
            <div className="cx-buttons">
              {buttons.map((b) => (
                <button key={b.value} type="button" className="cx-button" onClick={() => choose(b.value)}>{b.label}</button>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
