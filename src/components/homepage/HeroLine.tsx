"use client";
// A client component: the value line's last word is a button that opens the field list, and it rolls
// to the chosen field's word. The line also enters line by line, which needs its lines measured in
// the browser.
//
// "Brand identity, design and digital for growing businesses." "businesses" (or the field's word) is
// the button; the full stop and a small plus sit inside it after the word, so the whole end of the
// line is one target. Reduced motion: no entrance, and the word swaps without the roll.

import { useEffect, useRef, useState } from "react";
import { wordLabel } from "@/lib/homepage-hero";

const LEAD = "Brand identity, design and digital for growing".split(" ");
// The line's entrance in CSS: from 0.5s, 70ms between lines, 0.9s each. The masks come off after it.
const ENTRANCE_DONE_MS = 500 + 70 * 4 + 900 + 100;

interface Props {
  word: string;
  open: boolean;
  listId: string;
  reduceMotion: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
  onHoverOpen: () => void;
}

// The word in its clipped box: on a change the old word leaves upwards while the new one rises in.
function RollingWord({ word, reduceMotion }: { word: string; reduceMotion: boolean }) {
  const [roll, setRoll] = useState({ now: word, before: null as string | null, n: 0 });
  // Adjusting state while rendering, so the roll starts in the same frame as the new word.
  if (roll.now !== word) setRoll({ now: word, before: reduceMotion ? null : roll.now, n: roll.n + 1 });
  return (
    <span className="hero-word-box">
      {roll.before && (
        <span
          key={`out-${roll.n}`}
          className="hero-word hero-word--out"
          aria-hidden="true"
          onAnimationEnd={(e) => !e.pseudoElement && setRoll((r) => ({ ...r, before: null }))}
        >
          {roll.before}
        </span>
      )}
      <span key={`in-${roll.n}`} className={`hero-word${roll.n > 0 ? " hero-word--in" : ""}`}>
        {roll.now}
      </span>
    </span>
  );
}

// Gives each masked word its line number (--l), so whole lines rise together, then lifts the masks
// once the entrance is over (they would clip the button's focus ring).
function useLineEntrance(ref: React.RefObject<HTMLParagraphElement | null>) {
  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const tops: number[] = [];
    for (const w of p.querySelectorAll<HTMLElement>(".hero-value-w")) {
      if (!tops.includes(w.offsetTop)) tops.push(w.offsetTop);
      w.style.setProperty("--l", String(tops.indexOf(w.offsetTop)));
    }
    const done = window.setTimeout(() => p.setAttribute("data-entered", "true"), ENTRANCE_DONE_MS);
    return () => window.clearTimeout(done);
  }, [ref]);
}

export default function HeroLine({ word, open, listId, reduceMotion, buttonRef, onToggle, onHoverOpen }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  useLineEntrance(ref);
  return (
    <p ref={ref} className="hero-value">
      {LEAD.map((w, i) => (
        <span key={i}>
          <span className="hero-value-w">
            <span className="hero-value-i">{w}</span>
          </span>{" "}
        </span>
      ))}
      <span className="hero-value-w">
        <span className="hero-value-i">
          <button
            ref={buttonRef}
            type="button"
            className="hero-word-button"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={wordLabel(word)}
            onClick={onToggle}
            onPointerEnter={(e) => e.pointerType === "mouse" && onHoverOpen()}
            onFocus={onHoverOpen}
          >
            <RollingWord word={word} reduceMotion={reduceMotion} />.<span className="hero-plus" aria-hidden="true" />
          </button>
        </span>
      </span>
    </p>
  );
}
