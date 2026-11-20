"use client";
// A client component: the light in the homepage (03) Proof. It holds only the lit chapter, the hover
// override and the phone bar's state. The scroll decides the lit chapter through IntersectionObserver
// (no scroll listeners); on desktop, pointing at a chapter or focusing its index button overrides it.
// The words themselves are server rendered (head and list), so this island adds no text of its own
// except the desktop index and the decorative phone bar.

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { track } from "@/lib/analytics";
import { LIGHT_LINE, LIGHT_ROOT_MARGIN, PROOF_SECTION, bottomSpace, countText, indexScrollTop, litFromCrossed, type PromiseId } from "@/lib/proof";

interface Props {
  head: ReactNode;
  list: ReactNode;
  headingId: string;
  promises: Array<{ id: PromiseId; number: string; name: string }>;
}

type Override = { index: number; by: "pointer" | "focus" } | null;
type LenisWindow = Window & { __lenis?: { scrollTo: (target: number) => void } };

const DESKTOP = "(min-width: 1081px)";
const cssPx = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
const chapterEls = (root: HTMLElement) => [...root.querySelectorAll<HTMLElement>("[data-chapter]")];

// The last chapter whose top has crossed the line, 55% down the viewport. The root margin cuts the
// bottom 45% off the viewport, so the observer reports each time a top crosses the line.
function useScrollLight(rootRef: RefObject<HTMLDivElement | null>): number {
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const els = rootRef.current ? chapterEls(rootRef.current) : [];
    const crossed = els.map(() => false);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const line = e.rootBounds?.bottom ?? window.innerHeight * LIGHT_LINE;
          crossed[els.indexOf(e.target as HTMLElement)] = e.boundingClientRect.top < line;
        }
        setLit(litFromCrossed(crossed));
      },
      { rootMargin: LIGHT_ROOT_MARGIN },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef]);
  return lit;
}

// The phone bar shows once the H2 has scrolled under the header, and hides when it comes back.
function useBarShown(headingId: string): boolean {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const heading = document.getElementById(headingId);
    if (!heading) return;
    const bar = cssPx("--header-bar");
    const observer = new IntersectionObserver(
      ([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? bar)),
      { rootMargin: `-${bar}px 0px 0px 0px` },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, [headingId]);
  return shown;
}

// Measured, not guessed: the list gets just enough space below it for the last chapter's top to
// reach the line. Usually none, because the rest of the homepage follows.
function useBottomSpace(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    const list = root?.querySelector<HTMLElement>(".proof-list");
    if (!root || !list) return;
    const measure = () => {
      list.style.paddingBottom = "";
      const last = chapterEls(root).at(-1);
      if (!last) return;
      const below = document.documentElement.scrollHeight - (last.getBoundingClientRect().top + window.scrollY);
      const space = bottomSpace(window.innerHeight, below);
      if (space) list.style.paddingBottom = `${space}px`;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [rootRef]);
}

// An index click: the chapter's top 30% down the viewport, through Lenis when it runs.
function scrollToChapter(root: HTMLElement | null, index: number) {
  const el = root?.querySelector<HTMLElement>(`[data-chapter="${index}"]`);
  if (!el) return;
  const top = indexScrollTop(el.getBoundingClientRect().top, window.scrollY, window.innerHeight, cssPx("--header-bar"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = (window as LenisWindow).__lenis;
  if (lenis && !reduced) lenis.scrollTo(top);
  else window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
}

export default function ProofLight({ head, list, headingId, promises }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollLit = useScrollLight(rootRef);
  const barShown = useBarShown(headingId);
  useBottomSpace(rootRef);
  const [override, setOverride] = useState<Override>(null);
  const lit = override?.index ?? scrollLit;

  const point = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !window.matchMedia(DESKTOP).matches) return;
    const chapter = (e.target as HTMLElement).closest<HTMLElement>("[data-chapter]");
    if (chapter) setOverride({ index: Number(chapter.dataset.chapter), by: "pointer" });
  };
  const leave = () => setOverride((o) => (o?.by === "pointer" ? null : o));

  return (
    <div className="proof-light" ref={rootRef} data-lit={lit}>
      <div className="proof-bar-shell" aria-hidden="true">
        <div className="proof-bar" data-show={barShown || undefined}>
          <p className="proof-bar-row">
            <span>
              ({PROOF_SECTION.number}) {PROOF_SECTION.label}
            </span>
            <span>{countText(lit, promises.length)}</span>
          </p>
          <p className="proof-bar-title">{PROOF_SECTION.heading}</p>
          <span className="proof-bar-steps">
            {promises.map((p, i) => (
              <span key={p.id} className="proof-bar-step" data-on={i <= lit || undefined} />
            ))}
          </span>
        </div>
      </div>
      <div className="proof-grid">
        <div className="proof-side">
          {head}
          <ol className="proof-index" aria-label="Our promises">
            {promises.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="proof-index-btn"
                  aria-current={i === lit ? "step" : undefined}
                  data-cursor="link"
                  onClick={() => {
                    track("proof_index_click", { promise: p.id });
                    scrollToChapter(rootRef.current, i);
                  }}
                  onFocus={(e) => e.currentTarget.matches(":focus-visible") && setOverride({ index: i, by: "focus" })}
                  onBlur={() => setOverride((o) => (o?.by === "focus" ? null : o))}
                >
                  <span className="proof-index-num">{p.number}</span>
                  <span className="proof-index-name">{p.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="proof-main" onPointerOver={point} onPointerLeave={leave}>
          {list}
        </div>
      </div>
    </div>
  );
}
