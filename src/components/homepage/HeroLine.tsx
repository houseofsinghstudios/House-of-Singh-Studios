"use client";
// A client component: the value line enters line by line (its lines are measured in the browser), and
// its last word changes with the image on show, rolling letter by letter on a marker band.
//
// "Brand identity, design and digital for growing businesses." Nothing in it is interactive. The
// visible line is hidden from screen readers, which read the sentence once, from the hidden copy;
// the word changes are not announced. Reduced motion: no entrance and no roll (and no changes, which
// HeroInteractive stops), the band shown still.

import { useEffect, useRef, useState } from "react";
import { DEFAULT_WORD } from "@/lib/homepage-hero";

const LEAD = "Brand identity, design and digital for growing".split(" ");
// The line's entrance in CSS: from 0.5s, 70ms between lines, 0.9s each. The masks come off after it.
const ENTRANCE_DONE_MS = 500 + 70 * 4 + 900 + 100;
// The old word's letters leave in 240ms, 12ms apart (hero.css); it is removed once they have gone.
const OUT_MS = 240;
const OUT_STAGGER_MS = 12;

// The word's letters, then its full stop. The stop belongs to the word, so it leaves and arrives with
// it: a new word brings a new stop, and nothing already on the page moves (no layout shift).
function Letters({ word }: { word: string }) {
  return (
    <>
      {Array.from(word).map((letter, i) => (
        <span key={i} className="hero-letter" style={{ "--i": i } as React.CSSProperties}>
          {letter}
        </span>
      ))}
      <span className="hero-letter hero-stop" style={{ "--i": word.length } as React.CSSProperties}>
        .
      </span>
    </>
  );
}

interface Roll {
  now: string;
  before: string | null;
  // Counts the changes: keys the word's box and its letters.
  n: number;
}

// The word on show, the one leaving and the change count.
function useRoll(word: string, reduceMotion: boolean): Roll {
  const [roll, setRoll] = useState<Roll>({ now: word, before: null, n: 0 });
  // Adjusting state while rendering, so the change starts in the same frame as the new word.
  if (roll.now !== word) setRoll({ now: word, before: reduceMotion ? null : roll.now, n: roll.n + 1 });

  // The old word goes once its letters are out; on a timer, so it never depends on an animation event.
  const leaving = roll.before;
  useEffect(() => {
    if (!leaving) return;
    const done = window.setTimeout(() => setRoll((r) => ({ ...r, before: null })), OUT_MS + OUT_STAGGER_MS * leaving.length + 50);
    return () => window.clearTimeout(done);
  }, [leaving, roll.n]);
  return roll;
}

// The word in its clipped box, on its band. On a change the old word leaves (band wiping away to the
// right, letters rising out) and the new one arrives (letters rising in, band wiping in from the left).
function CyclingWord({ roll }: { roll: Roll }) {
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
  const roll = useRoll(word, reduceMotion);
  useLineEntrance(ref);
  return (
    <>
      <p ref={ref} className="hero-value" aria-hidden="true">
        {LEAD.map((w, i) => (
          <span key={i}>
            <span className="hero-value-w">
              <span className="hero-value-i">{w}</span>
            </span>
            {/* The space before the word hangs at the line's end when the word wraps and shows when it
                fits; it arrives with each word too, so that is never counted as a shift. */}
            {i === LEAD.length - 1 ? <span key={roll.n}>{" "}</span> : " "}
          </span>
        ))}
        {/* The word: on phones it starts its own line (hero.css), so its length never moves the lines.
            Above 1080px a short word ends line two and a longer one starts line three: each word
            arrives in a box of its own (keyed by the change), so nothing already on the page moves
            and no layout shift is recorded, while every frame looks as it did when one box was
            reused (homepage audit, 22 Nov 2026). */}
        <span key={roll.n} className="hero-value-w hero-value-w--word">
          <span className="hero-value-i">
            <CyclingWord roll={roll} />
          </span>
        </span>
      </p>
      <p className="sr-only">{`${LEAD.join(" ")} ${DEFAULT_WORD}.`}</p>
    </>
  );
}
