"use client";
// A client component: it owns the hero's state (the chosen field, the image on show, Pause, whether
// the field list is open, whether a pointer or a finger is on the image) and lays out the parts that
// use it. Rendered inside HeroSection's grid: its pieces are grid items of the section.
//
// The rotation waits while a pointer or a finger is on the image, while the list is open and while
// Pause is on. Reduced motion: no rotation, first image only.

import { useCallback, useRef, useState } from "react";
import { track, trackOnce } from "@/lib/analytics";
import { DEFAULT_WORD, heroFieldItems, heroFrames, holdMs, type HeroEntry } from "@/lib/homepage-hero";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";
import HeroCaption from "./HeroCaption";
import HeroFieldList from "./HeroFieldList";
import HeroImages from "./HeroImages";
import HeroLine from "./HeroLine";
import HeroPause from "./HeroPause";

const LIST_ID = "hero-fields";
const COMPACT = "(max-width: 1080px)";
const HOVER = "(hover: hover) and (pointer: fine)";

interface Rotation {
  field: number | null;
  index: number;
  // Every move, so the progress line restarts; and whether the set has gone round once (only the
  // first showing of its first image holds longer).
  step: number;
  looped: boolean;
}

// The chosen field and the image on show, and the moves between them.
function useRotation(entries: HeroEntry[]) {
  const [rot, setRot] = useState<Rotation>({ field: null, index: 0, step: 0, looped: false });
  const frames = heroFrames(entries, rot.field);
  const advance = useCallback(() => {
    setRot((r) => {
      const count = heroFrames(entries, r.field).length;
      const index = (r.index + 1) % Math.max(count, 1);
      return { ...r, index, step: r.step + 1, looped: r.looped || index === 0 };
    });
  }, [entries]);
  const choose = useCallback((field: number | null) => {
    setRot((r) => (r.field === field ? r : { field, index: 0, step: r.step + 1, looped: false }));
  }, []);
  return { rot, frames, advance, choose };
}

// The field list: open on hover or focus where there is a mouse, and on tap; closes on leaving.
function usePicker(canHover: boolean, buttonRef: React.RefObject<HTMLButtonElement | null>) {
  const [open, setOpen] = useState(false);
  const area = {
    onPointerLeave: (e: React.PointerEvent) => canHover && e.pointerType === "mouse" && setOpen(false),
    onBlur: (e: React.FocusEvent) => canHover && !e.currentTarget.contains(e.relatedTarget as Node | null) && setOpen(false),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key !== "Escape" || !open) return;
      // Focus first: focusing the word opens the list, so closing comes after it.
      buttonRef.current?.focus();
      setOpen(false);
    },
  };
  return { open, toggle: () => setOpen((o) => !o), hoverOpen: () => canHover && setOpen(true), area };
}

// A pointer resting on the image, or a finger on it, holds the rotation.
function useHold() {
  const [pointerOver, setPointerOver] = useState(false);
  const [fingerOn, setFingerOn] = useState(false);
  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setPointerOver(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setPointerOver(false),
    onTouchStart: () => setFingerOn(true),
    onTouchEnd: () => setFingerOn(false),
    onTouchCancel: () => setFingerOn(false),
  };
  return { held: pointerOver || fingerOn, handlers };
}

// A field picked in the list: its images, its word, and (once per field per visit) the event. Only a
// change the visitor makes is announced; the timer's changes are not, so a screen reader is not
// interrupted every few seconds.
function usePreview(entries: HeroEntry[], current: number | null, choose: (field: number | null) => void) {
  const [announce, setAnnounce] = useState("");
  const preview = (field: number | null) => {
    if (field === current) return;
    choose(field);
    const shown = entries[field ?? 0];
    if (shown) setAnnounce(shown.heroName);
    if (field !== null) trackOnce("hero_field_preview", entries[field].heroField, { field: entries[field].heroField });
  };
  return { announce, preview };
}

// A click through to a case study from the image, the caption or the list.
const openProject = (source: "image" | "caption" | "list") => (slug: string) => track("hero_project_click", { project: slug, source });

export default function HeroInteractive({ entries }: { entries: HeroEntry[] }) {
  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  const compact = useMediaQuery(COMPACT);
  const canHover = useMediaQuery(HOVER);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { rot, frames, advance, choose } = useRotation(entries);
  const picker = usePicker(canHover, buttonRef);
  const [paused, setPaused] = useState(false);
  const hold = useHold();
  const { announce, preview } = usePreview(entries, rot.field, choose);

  const index = reduceMotion ? 0 : rot.index;
  const frame = frames[index];
  const entry = frame ? entries[frame.project] : undefined;
  const rotating = !reduceMotion && frames.length > 1;
  const word = rot.field === null ? DEFAULT_WORD : entries[rot.field].heroWord;
  return (
    <>
      <div className="hero-media" {...hold.handlers}>
        {entry && (
          <HeroImages
            entries={entries}
            frames={frames}
            index={index}
            step={rot.step}
            holdMs={holdMs(index === 0 && !rot.looped, compact)}
            rotating={rotating}
            halted={paused || picker.open || hold.held}
            onDone={advance}
            onOpen={() => openProject("image")(entry.slug)}
          />
        )}
        {rotating && <HeroPause paused={paused} onToggle={() => setPaused((p) => !p)} />}
      </div>
      {entry && <HeroCaption entry={entry} reduceMotion={reduceMotion} onOpen={openProject("caption")} />}
      <div className="hero-pick" {...picker.area}>
        <HeroLine word={word} open={picker.open} listId={LIST_ID} reduceMotion={reduceMotion} buttonRef={buttonRef} onToggle={picker.toggle} onHoverOpen={picker.hoverOpen} />
        <HeroFieldList id={LIST_ID} items={heroFieldItems(entries)} slugs={entries.map((e) => e.slug)} active={rot.field} open={picker.open} compact={compact} onPreview={preview} onOpenProject={openProject("list")} />
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>
    </>
  );
}
