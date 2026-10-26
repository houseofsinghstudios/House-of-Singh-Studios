"use client";
// The introduction, ready to send, with a Copy Text button. Client component: it writes to the
// clipboard, shows "Copied" for two seconds and announces it to screen readers. Where the clipboard
// is unavailable it selects the text instead, so Ctrl or Command and C copies it.

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { HOW } from "@/lib/partners/content";
import { trackPartner } from "./track";

type State = "idle" | "copied" | "manual";

export default function IntroductionBox() {
  const [state, setState] = useState<State>("idle");
  const textRef = useRef<HTMLParagraphElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function selectText() {
    const node = textRef.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(HOW.introduction);
      setState("copied");
      trackPartner("partner_copy_intro");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState((s) => (s === "copied" ? "idle" : s)), 2000);
    } catch {
      selectText();
      setState("manual");
    }
  }

  const note = state === "manual" ? HOW.fallback : HOW.hint;
  return (
    <div className="pt-intro css-reveal">
      <p className="editorial-label pt-intro-label">{HOW.boxLabel}</p>
      <p ref={textRef} className="pt-intro-text">
        {HOW.introduction}
      </p>
      <div className="pt-intro-actions">
        <Button variant={state === "copied" ? "primary" : "secondary"} onClick={copy} magnetic={false}>
          {state === "copied" ? HOW.copied : HOW.copy}
        </Button>
        {/* Always in the layout, shown once used, so nothing moves when it appears. */}
        <p className="pt-intro-hint" style={{ visibility: state === "idle" ? "hidden" : "visible" }}>
          {note}
        </p>
      </div>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? HOW.copied : state === "manual" ? HOW.fallback : ""}
      </span>
    </div>
  );
}
