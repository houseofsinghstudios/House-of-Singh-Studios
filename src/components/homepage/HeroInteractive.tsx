"use client";
// A client component: it owns the hero's clock and what holds it, and lays out the parts that use it.
// Rendered inside HeroSection's grid: its pieces are grid items of the section.
//
// One clock: the images, one per project, 5s each, the whole image a link to the project on screen.
// The value line's word follows the image (heroWordFor): "businesses" for the first image on the
// first pass, then each project's field word. Pause, a pointer, keyboard focus or a finger on the
// image hold the image and its word together. Reduced motion: nothing moves, the first image and
// "businesses" only, no Pause.

import { useCallback, useState } from "react";
import { track } from "@/lib/analytics";
import { DEFAULT_WORD, heroWordFor, type HeroEntry } from "@/lib/homepage-hero";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";
import HeroCaption from "./HeroCaption";
import HeroImages from "./HeroImages";
import HeroLine from "./HeroLine";
import HeroPause from "./HeroPause";

// The rotation: the image on show, every move (so the progress line restarts), and whether it has gone
// round once (from then on the first project shows its own word).
function useRotation(count: number) {
  const [rot, setRot] = useState({ index: 0, step: 0, looped: false });
  const advance = useCallback(() => {
    setRot((r) => {
      const index = (r.index + 1) % count;
      return { index, step: r.step + 1, looped: r.looped || index === 0 };
    });
  }, [count]);
  return { ...rot, advance };
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
  const rotation = useRotation(entries.length);
  // Nothing moves with reduced motion or with fewer than two projects, so there is nothing to pause.
  const moving = !reduceMotion && entries.length > 1;
  const index = moving ? rotation.index : 0;
  const entry = entries[index];
  const word = moving ? heroWordFor(entries, index, rotation.looped) : DEFAULT_WORD;

  return (
    <>
      <div className="hero-media" {...hold.handlers}>
        {entry && (
          <HeroImages
            entries={entries}
            index={index}
            step={rotation.step}
            rotating={moving}
            halted={paused || hold.held}
            onDue={rotation.advance}
            onOpen={() => openProject("image")(entry.slug)}
          />
        )}
        {moving && <HeroPause paused={paused} onToggle={() => setPaused((p) => !p)} />}
      </div>
      {entry && <HeroCaption entry={entry} reduceMotion={reduceMotion} onOpen={openProject("caption")} />}
      <div className="hero-statement">
        <HeroLine word={word} reduceMotion={reduceMotion} />
      </div>
    </>
  );
}
