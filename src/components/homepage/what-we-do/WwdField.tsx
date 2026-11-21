"use client";
// A client component: the desktop keyword field. All thirty disciplines, interleaved across the four
// services, with a slash between words on the same line only: each term carries its slash in front,
// and the list is pulled left by one slash cell inside a clipping frame, so the first slash of every
// line is hidden. A word with real work links to its case study; pointing at it shows a small preview
// that follows the pointer (decorative) and never covers the word or its line (placePreview). Preview
// images load only after the pointer first enters the field, so they never compete with the hero image.

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { track } from "@/lib/analytics";
import { caseStudyHref, placePreview, previewCaption, type WwdService, type WwdTerm, type WwdWork } from "@/lib/what-we-do";

interface Props {
  terms: WwdTerm[];
  services: WwdService[];
  work: Record<string, WwdWork>;
  // The lit service: its words stay Obsidian, the rest turn Accessible Ash.
  litService: string | null;
  // The row pointed at or focused: its words also take the marker band, 12ms apart in reading order.
  bandService: string | null;
  onWord: (service: string | null) => void;
}

const isMouse = (e: React.PointerEvent) => e.pointerType === "mouse";

// Moves the preview to its place for this pointer and the line of the word pointed at. The visible top
// is the header's edge (0 while the header is slid away), so the preview never hides under the bar.
function movePreview(el: HTMLDivElement | null, line: Element | null, pointer: { x: number; y: number }) {
  if (!el || !line) return;
  const root = document.documentElement;
  const edge = parseFloat(getComputedStyle(root).getPropertyValue("--header-edge")) || 0;
  const place = placePreview(pointer, line.getBoundingClientRect(), { width: el.offsetWidth, height: el.offsetHeight }, { width: root.clientWidth, top: edge });
  el.style.setProperty("--x", `${place.left}px`);
  el.style.setProperty("--y", `${place.top}px`);
  el.dataset.side = place.side;
  el.toggleAttribute("data-below", place.below);
}

interface TermProps {
  term: WwdTerm;
  work: WwdWork | undefined;
  dim: boolean;
  band: boolean;
  onEnter: (e: React.PointerEvent, term: WwdTerm) => void;
  onLeave: (e: React.PointerEvent) => void;
  onWord: (service: string | null) => void;
}

// One word in the field, with its slash. A word with work links to its case study. The word's text sits
// on an inner span, which carries the row's marker band, so it never fights the link's underline or its
// own hover band.
function FieldTerm({ term: t, work: w, dim, band, onEnter, onLeave, onWord }: TermProps) {
  return (
    <li className="wwd-term" data-dim={dim || undefined} data-band={band || undefined} style={{ "--i": t.order } as React.CSSProperties}>
      <span className="wwd-sep" aria-hidden="true">/</span>
      {w ? (
        <Link
          href={caseStudyHref(w.slug)}
          className="wwd-word wwd-word--work"
          data-cursor="link"
          onPointerEnter={(e) => onEnter(e, t)}
          onPointerLeave={onLeave}
          onFocus={() => onWord(t.service)}
          onBlur={() => onWord(null)}
          onClick={() => track("home_wwd_word_click", { discipline: t.name, has_work: true, layout: "desktop" })}
        >
          <span className="wwd-ink">{t.name}</span>
        </Link>
      ) : (
        <span className="wwd-word" onPointerEnter={(e) => onEnter(e, t)} onPointerLeave={onLeave}>
          <span className="wwd-ink">{t.name}</span>
        </span>
      )}
    </li>
  );
}

interface PreviewProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  armed: boolean;
  seen: WwdWork[];
  current: WwdWork | null | undefined;
  caption: string;
  serviceName: string;
}

// The decorative preview that follows the pointer. Every image shown so far stays rendered (hidden), so
// coming back to a word never reloads it; images load only once the field is armed.
function FieldPreview({ previewRef, armed, seen, current, caption, serviceName }: PreviewProps) {
  return (
    <div className="wwd-preview" ref={previewRef} aria-hidden="true" data-show={current ? true : undefined}>
      <div className="wwd-preview-frame">
        {armed &&
          seen.map((w) => (
            <Image
              key={w.image.src}
              src={w.image.src}
              alt=""
              fill
              sizes="300px"
              className="wwd-preview-img"
              data-on={current?.image.src === w.image.src ? true : undefined}
              style={{ objectFit: "cover", objectPosition: w.image.position }}
            />
          ))}
      </div>
      {caption && (
        <p className="wwd-preview-caption">
          <span className="wwd-preview-what">{caption}</span>
          <span className="wwd-preview-service">{serviceName}</span>
        </p>
      )}
    </div>
  );
}

// The preview's state: the word pointed at, the images shown so far, and its place beside the pointer.
function usePreview(work: Record<string, WwdWork>, onWord: (service: string | null) => void) {
  const [active, setActive] = useState<WwdTerm | null>(null);
  // Every preview shown so far stays rendered (hidden), so coming back to a word never reloads it.
  const [seen, setSeen] = useState<WwdWork[]>([]);
  const preview = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  // The line of the word pointed at (its term, one line tall).
  const lineRef = useRef<Element | null>(null);

  // A new word changes the caption, and so the preview's height: place it once React has drawn it.
  useLayoutEffect(() => {
    if (active) movePreview(preview.current, lineRef.current, pointerRef.current);
  }, [active]);

  const follow = (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    pointerRef.current = { x: e.clientX, y: e.clientY };
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => movePreview(preview.current, lineRef.current, pointerRef.current));
  };

  const enter = (e: React.PointerEvent, term: WwdTerm) => {
    if (!isMouse(e)) return;
    onWord(term.service);
    const w = work[term.name];
    if (!w) return;
    pointerRef.current = { x: e.clientX, y: e.clientY };
    lineRef.current = e.currentTarget.closest(".wwd-term");
    setActive(term);
    setSeen((list) => (list.some((s) => s.image.src === w.image.src) ? list : [...list, w]));
  };
  const leave = (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    onWord(null);
    setActive(null);
  };
  return { preview, active, seen, follow, enter, leave };
}

export default function WwdField({ terms, services, work, litService, bandService, onWord }: Props) {
  const [armed, setArmed] = useState(false);
  const { preview, active, seen, follow, enter, leave } = usePreview(work, onWord);
  const current = active ? work[active.name] : null;
  const serviceName = active ? services.find((s) => s.slug === active.service)?.name : "";

  return (
    <div className="wwd-field-wrap" onPointerEnter={(e) => isMouse(e) && setArmed(true)} onPointerMove={follow}>
      <div className="wwd-field-frame">
        <ul className="wwd-field">
          {terms.map((t) => (
            <FieldTerm
              key={t.name}
              term={t}
              work={work[t.name]}
              dim={litService !== null && t.service !== litService}
              band={bandService !== null && t.service === bandService}
              onEnter={enter}
              onLeave={leave}
              onWord={onWord}
            />
          ))}
        </ul>
      </div>
      <FieldPreview previewRef={preview} armed={armed} seen={seen} current={current} caption={current && active ? previewCaption(active.name, current.client) : ""} serviceName={serviceName ?? ""} />
    </div>
  );
}
