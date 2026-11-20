"use client";
// A client component: the desktop keyword field. All thirty disciplines, interleaved across the four
// services, with a slash between words on the same line only: each term carries its slash in front,
// and the list is pulled left by one slash cell inside a clipping frame, so the first slash of every
// line is hidden. A word with real work links to its case study; pointing at it shows a small preview
// that follows the pointer (decorative). Preview images load only after the pointer first enters the
// field, so they never compete with the hero image.

import { useRef, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { track } from "@/lib/analytics";
import { caseStudyHref, previewCaption, type WwdService, type WwdTerm, type WwdWork } from "@/lib/what-we-do";

interface Props {
  terms: WwdTerm[];
  services: WwdService[];
  work: Record<string, WwdWork>;
  // A row pointed at: its service's words stay Obsidian, the rest turn Accessible Ash.
  litService: string | null;
  onWord: (service: string | null) => void;
}

// The preview sits 28px right of the pointer and 130px above it.
const OFFSET_X = 28;
const OFFSET_Y = -130;

const isMouse = (e: React.PointerEvent) => e.pointerType === "mouse";

export default function WwdField({ terms, services, work, litService, onWord }: Props) {
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState<WwdTerm | null>(null);
  // Every preview shown so far stays rendered (hidden), so coming back to a word never reloads it.
  const [seen, setSeen] = useState<WwdWork[]>([]);
  const preview = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const follow = (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      preview.current?.style.setProperty("--x", `${clientX + OFFSET_X}px`);
      preview.current?.style.setProperty("--y", `${clientY + OFFSET_Y}px`);
    });
  };

  const enter = (e: React.PointerEvent, term: WwdTerm) => {
    if (!isMouse(e)) return;
    onWord(term.service);
    const w = work[term.name];
    if (!w) return;
    setActive(term);
    setSeen((list) => (list.some((s) => s.image.src === w.image.src) ? list : [...list, w]));
  };
  const leave = (e: React.PointerEvent) => {
    if (!isMouse(e)) return;
    onWord(null);
    setActive(null);
  };

  const current = active ? work[active.name] : null;
  const serviceName = active ? services.find((s) => s.slug === active.service)?.name : "";

  return (
    <div className="wwd-field-wrap" onPointerEnter={(e) => isMouse(e) && setArmed(true)} onPointerMove={follow}>
      <div className="wwd-field-frame">
        <ul className="wwd-field">
          {terms.map((t) => {
            const w = work[t.name];
            return (
              <li key={t.name} className="wwd-term" data-dim={litService !== null && t.service !== litService ? true : undefined} style={{ "--i": t.order } as React.CSSProperties}>
                <span className="wwd-sep" aria-hidden="true">/</span>
                {w ? (
                  <Link
                    href={caseStudyHref(w.slug)}
                    className="wwd-word wwd-word--work"
                    data-cursor="link"
                    onPointerEnter={(e) => enter(e, t)}
                    onPointerLeave={leave}
                    onFocus={() => onWord(t.service)}
                    onBlur={() => onWord(null)}
                    onClick={() => track("home_wwd_word_click", { discipline: t.name, has_work: true, layout: "desktop" })}
                  >
                    {t.name}
                  </Link>
                ) : (
                  <span className="wwd-word" onPointerEnter={(e) => enter(e, t)} onPointerLeave={leave}>
                    {t.name}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="wwd-preview" ref={preview} aria-hidden="true" data-show={current ? true : undefined}>
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
        {current && active && (
          <p className="wwd-preview-caption">
            <span className="wwd-preview-what">{previewCaption(active.name, current.client)}</span>
            <span className="wwd-preview-service">{serviceName}</span>
          </p>
        )}
      </div>
    </div>
  );
}
