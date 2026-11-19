"use client";
// A client component: the value line enters line by line (its lines are measured in the browser), and
// its last word cycles, rolling letter by letter on a marker band.
//
// "Brand identity, design and digital for growing businesses." Nothing in it is interactive. The
// visible line is hidden from screen readers, which read the sentence once, from the hidden copy;
// the word changes are not announced. Reduced motion: no entrance and no roll (and no cycling, which
// HeroInteractive stops), the band shown still.

import { useEffect, useRef, useState } from "react";
import { HERO_WORDS } from "@/lib/homepage-hero";

const LEAD = "Brand identity, design and digital for growing".split(" ");
// The line's entrance in CSS: from 0.5s, 70ms between lines, 0.9s each. The masks come off after it.
const ENTRANCE_DONE_MS = 500 + 70 * 4 + 900 + 100;
// The old word's letters leave in 240ms, 12ms apart (hero.css); it is removed once they have gone.
const OUT_MS = 240;
const OUT_STAGGER_MS = 12;

function Letters({ word }: { word: string }) {
  return (
    <>
      {Array.from(word).map((letter, i) => (
        <span key={i} className="hero-letter" style={{ "--i": i } as React.CSSProperties}>
          {letter}
        </span>
      ))}
    </>
  );
}

// The word in its clipped box, on its band. On a change the old word leaves (band wiping away to the
// right, letters rising out) and the new one arrives (letters rising in, band wiping in from the left).
function CyclingWord({ word, reduceMotion }: { word: string; reduceMotion: boolean }) {
  const [roll, setRoll] = useState({ now: word, before: null as string | null, n: 0 });
  // Adjusting state while rendering, so the change starts in the same frame as the new word.
  if (roll.now !== word) setRoll({ now: word, before: reduceMotion ? null : roll.now, n: roll.n + 1 });

  // The old word goes once its letters are out; on a timer, so it never depends on an animation event.
  const leaving = roll.before;
  useEffect(() => {
    if (!leaving) return;
    const done = window.setTimeout(() => setRoll((r) => ({ ...r, before: null })), OUT_MS + OUT_STAGGER_MS * leaving.length + 50);
    return () => window.clearTimeout(done);
  }, [leaving, roll.n]);

  return (
    <span className="hero-word-box">
      {roll.before && (
        <span key={`out-${roll.n}`} className="hero-word hero-word--out">
          <span className="hero-band" aria-hidden="true" />
          <Letters word={roll.before} />
        </span>
      )}
      <span key={`in-${roll.n}`} className={`hero-word${roll.n > 0 ? " hero-word--in" : ""}`}>
        <span className="hero-band" aria-hidden="true" />
        <Letters word={roll.now} />
      </span>
    </span>
  );
}

// Gives each masked word its line number (--l), so whole lines rise together, then lifts the masks
// once the entrance is over.
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

export default function HeroLine({ word, reduceMotion }: { word: string; reduceMotion: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useLineEntrance(ref);
  return (
    <>
      <p ref={ref} className="hero-value" aria-hidden="true">
        {LEAD.map((w, i) => (
          <span key={i}>
            <span className="hero-value-w">
              <span className="hero-value-i">{w}</span>
            </span>{" "}
          </span>
        ))}
        <span className="hero-value-w">
          <span className="hero-value-i">
            <CyclingWord word={word} reduceMotion={reduceMotion} />.
          </span>
        </span>
      </p>
      <p className="sr-only">{`${LEAD.join(" ")} ${HERO_WORDS[0]}.`}</p>
    </>
  );
}
