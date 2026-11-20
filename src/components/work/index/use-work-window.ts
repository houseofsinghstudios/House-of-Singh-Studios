"use client";
// A client hook: which project the image window shows, which of its images, and whether it is
// flipping through them. Pointing at a row flips its images on the time line's clock; pointing at a
// strip image holds that image; keyboard focus on a row plays one round, then holds; leaving the list
// keeps the last project. A new choice starts again on the first project in the new order.

import { useCallback, useEffect, useState } from "react";
import { preloadWindowImage } from "./WorkWindow";
import type { WorkItem } from "./types";

type Mode = "idle" | "hover" | "hold" | "focus";

interface WindowState {
  slug: string | undefined;
  image: number;
  mode: Mode;
  // Bumped for every image shown, so the time line starts again.
  step: number;
  // The order the window was set up for (the choice in the address).
  key: string;
}

const start = (ordered: readonly WorkItem[], key: string, step = 0): WindowState => ({ slug: ordered[0]?.slug, image: 0, mode: "idle", step, key });

export function useWorkWindow(ordered: readonly WorkItem[], key: string, reduced: boolean) {
  const [state, setState] = useState(() => start(ordered, key));
  // A new choice: back to the first project in the new order (adjusted while rendering, no effect).
  if (state.key !== key) setState(start(ordered, key, state.step + 1));

  const item = ordered.find((p) => p.slug === state.slug) ?? ordered[0];
  const count = item?.images.length ?? 0;
  const image = Math.min(state.image, Math.max(0, count - 1));
  const cycling = !reduced && count > 1 && (state.mode === "hover" || state.mode === "focus");

  const show = useCallback((target: WorkItem, mode: Mode, at?: number) => {
    setState((s) => {
      const same = s.slug === target.slug;
      if (same && s.mode === mode && at === undefined) return s;
      return { ...s, slug: target.slug, image: at ?? (same ? s.image : 0), mode, step: s.step + 1 };
    });
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      const n = ordered.find((p) => p.slug === s.slug)?.images.length ?? 0;
      if (n < 2) return s;
      const nextImage = (s.image + 1) % n;
      // Keyboard focus plays one round and stops back on the first image.
      const mode = s.mode === "focus" && nextImage === 0 ? "hold" : s.mode;
      return { ...s, image: nextImage, mode, step: s.step + 1 };
    });
  }, [ordered]);

  const handlers = {
    onRowEnter: (target: WorkItem) => show(target, "hover"),
    onRowFocus: (target: WorkItem) => show(target, "focus"),
    onImageEnter: (target: WorkItem, at: number) => show(target, "hold", at),
    onImageLeave: () => setState((s) => (s.mode === "hold" ? { ...s, mode: "hover", step: s.step + 1 } : s)),
    onListLeave: () => setState((s) => (s.mode === "idle" ? s : { ...s, mode: "idle" })),
  };

  // The next image in the round is fetched before its turn, so the flip never shows an empty frame.
  const upcoming = cycling && item ? item.images[(image + 1) % count] : undefined;
  useEffect(() => preloadWindowImage(upcoming), [upcoming]);

  return { item, image, step: state.step, cycling, next, show, handlers };
}

// At 1080px and below there is no pointer to follow: the row crossing the window's bottom edge is the
// one shown. Watches a one pixel line at that edge.
export function useRowAtWindowEdge(
  enabled: boolean,
  listRef: React.RefObject<HTMLDivElement | null>,
  windowRef: React.RefObject<HTMLDivElement | null>,
  ordered: readonly WorkItem[],
  onActive: (item: WorkItem) => void,
) {
  useEffect(() => {
    const list = listRef.current;
    const win = windowRef.current;
    if (!enabled || !list || !win) return;
    const edge = (parseFloat(getComputedStyle(win).top) || 0) + win.offsetHeight;
    const bottom = Math.max(0, window.innerHeight - edge - 1);
    const bySlug = new Map(ordered.map((p) => [p.slug, p]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const found = entry.isIntersecting && bySlug.get((entry.target as HTMLElement).dataset.slug ?? "");
          if (found) onActive(found);
        }
      },
      { rootMargin: `-${Math.round(edge)}px 0px -${Math.round(bottom)}px 0px` },
    );
    list.querySelectorAll<HTMLElement>(".wi-row").forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [enabled, listRef, windowRef, ordered, onActive]);
}
