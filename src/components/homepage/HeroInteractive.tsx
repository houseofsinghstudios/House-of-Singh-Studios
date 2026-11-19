"use client";
// A client component: it owns the hero's two clocks and what stops them, and lays out the parts that
// use them. Rendered inside HeroSection's grid: its pieces are grid items of the section.
//
// The images: one per project, 6s each, the whole image a link to the project on screen. The word in
// the value line: its own clock, HERO_WORDS in order, the first change 4.5s after the entrance, then
// every 3s. An image change never lands within 500ms of a word change: it waits until 500ms after.
// A pointer, keyboard focus or a finger on the image holds the image (not the word). Pause stops both. Reduced
// motion: neither moves, first image and "businesses" only, no Pause.

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { HERO_WORDS, WORD_EVERY_MS, WORD_FIRST_MS, imageWait, type HeroEntry } from "@/lib/homepage-hero";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";
import HeroCaption from "./HeroCaption";
import HeroImages from "./HeroImages";
import HeroLine from "./HeroLine";
import HeroPause from "./HeroPause";

// When the word last changed and when it next will (Infinity while it is stopped), for the image clock.
interface WordTimes {
  last: number;
  next: number;
}

// The word's clock. Stopping it keeps the time left, so it picks up where it was.
function useWordClock(running: boolean) {
  const [index, setIndex] = useState(0);
  const times = useRef<WordTimes>({ last: -Infinity, next: Infinity });
  const remaining = useRef(WORD_FIRST_MS);
  useEffect(() => {
    if (!running) return;
    const t = times.current;
    let timer = 0;
    const schedule = (ms: number) => {
      t.next = performance.now() + ms;
      timer = window.setTimeout(() => {
        t.last = performance.now();
        setIndex((i) => (i + 1) % HERO_WORDS.length);
        schedule(WORD_EVERY_MS);
      }, ms);
    };
    schedule(remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, t.next - performance.now());
      t.next = Infinity;
    };
  }, [running]);
  return { word: HERO_WORDS[index], times };
}

// The images' clock. The progress line says when an image is due; it then moves at once, or 500ms
// after a word change that is too close. Checked again when the wait ends, as timers can run late.
function useImageClock(count: number, halted: boolean, words: React.RefObject<WordTimes>) {
  const [rot, setRot] = useState({ index: 0, step: 0, due: false });
  useEffect(() => {
    if (!rot.due || halted) return;
    let timer = 0;
    const tryMove = () => {
      const wait = imageWait(performance.now(), words.current.last, words.current.next);
      if (wait > 0) timer = window.setTimeout(tryMove, wait);
      else setRot((r) => ({ index: (r.index + 1) % count, step: r.step + 1, due: false }));
    };
    timer = window.setTimeout(tryMove, 0);
    return () => window.clearTimeout(timer);
  }, [rot.due, halted, count, words]);
  const onDue = useCallback(() => setRot((r) => ({ ...r, due: true })), []);
  return { index: rot.index, step: rot.step, onDue };
}

// A pointer resting on the image, keyboard focus on it (or on Pause), or a finger on it holds the image.
function useHold() {
  const [pointerOver, setPointerOver] = useState(false);
  const [focused, setFocused] = useState(false);
  const [fingerOn, setFingerOn] = useState(false);
  const handlers = {
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setFocused(false),
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setPointerOver(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setPointerOver(false),
    onTouchStart: () => setFingerOn(true),
    onTouchEnd: () => setFingerOn(false),
    onTouchCancel: () => setFingerOn(false),
  };
  return { held: pointerOver || focused || fingerOn, handlers };
}

// A click through to a case study from the image or the caption.
const openProject = (source: "image" | "caption") => (slug: string) => track("hero_project_click", { project: slug, source });

export default function HeroInteractive({ entries }: { entries: HeroEntry[] }) {
  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  const [paused, setPaused] = useState(false);
  const hold = useHold();
  // With no projects nothing moves, so there is nothing for a Pause button to stop.
  const moving = !reduceMotion && entries.length > 0;
  const { word, times } = useWordClock(moving && !paused);
  const rotating = moving && entries.length > 1;
  const images = useImageClock(entries.length, paused || hold.held, times);
  const index = rotating ? images.index : 0;
  const entry = entries[index];

  return (
    <>
      <div className="hero-media" {...hold.handlers}>
        {entry && (
          <HeroImages
            entries={entries}
            index={index}
            step={images.step}
            rotating={rotating}
            halted={paused || hold.held}
            onDue={images.onDue}
            onOpen={() => openProject("image")(entry.slug)}
          />
        )}
        {moving && <HeroPause paused={paused} onToggle={() => setPaused((p) => !p)} />}
      </div>
      {entry && <HeroCaption entry={entry} reduceMotion={reduceMotion} onOpen={openProject("caption")} />}
      <div className="hero-statement">
        <HeroLine word={moving ? word : HERO_WORDS[0]} reduceMotion={reduceMotion} />
      </div>
    </>
  );
}
