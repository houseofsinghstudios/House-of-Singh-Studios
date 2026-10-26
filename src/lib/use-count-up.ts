// Shared count up for statistics: numbers count from 0 to their value when a section scrolls into
// view, once. Used by the homepage proof section and the AI Lab statistics row.
//
// Markup inside the observed element:
//   data-count-up="91"  the number's text. The server renders the final value; this hook rewrites it.
//   data-count-bar      optional bar for the number at the same position, filled with transform
//                       scaleX, so nothing reflows. Its transform origin belongs in CSS.

import { useEffect, type RefObject } from "react";

// Fast start, gentle finish.
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Keys of runs that already happened in this browser session.
const finishedRuns = new Set<string>();

interface CountUpOptions {
  // One duration for every number, or one per number in order (ms).
  duration: number | readonly number[];
  // Start of each number after the previous one (ms).
  stagger?: number;
  // Visible share of the element that starts the count.
  threshold: number;
  // Run once per browser session for this key, even across page visits.
  sessionKey?: string;
  // Keep the final values when the element is already on screen at load, or the visitor prefers
  // reduced motion. Numbers drop to 0 only while the element is off screen.
  settleIfVisible?: boolean;
  // Keep the final values for visitors who prefer reduced motion, but still count up when the
  // element first comes into view, even if it is on screen at load (the Partners page figures).
  finalIfReducedMotion?: boolean;
}

export function useCountUp(ref: RefObject<HTMLElement | null>, options: CountUpOptions) {
  const { duration, stagger = 0, threshold, sessionKey, settleIfVisible = false, finalIfReducedMotion = false } = options;

  useEffect(() => {
    const root = ref.current;
    if (!root || (sessionKey && finishedRuns.has(sessionKey))) return;
    if ((settleIfVisible || finalIfReducedMotion) && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nums = Array.from(root.querySelectorAll<HTMLElement>("[data-count-up]"));
    const bars = Array.from(root.querySelectorAll<HTMLElement>("[data-count-bar]"));
    const rafIds: number[] = [];

    const draw = (i: number, eased: number) => {
      nums[i].textContent = String(Math.round(eased * Number(nums[i].dataset.countUp)));
      if (bars[i]) bars[i].style.transform = `scaleX(${eased})`;
    };

    const run = () => {
      if (sessionKey) finishedRuns.add(sessionKey);
      const t0 = performance.now();
      nums.forEach((_, i) => {
        const ms = typeof duration === "number" ? duration : duration[i];
        const start = t0 + i * stagger;
        draw(i, 0);
        const tick = (now: number) => {
          const progress = Math.min(Math.max(now - start, 0) / ms, 1);
          draw(i, easeOutCubic(progress));
          if (progress < 1) rafIds[i] = requestAnimationFrame(tick);
          else draw(i, 1);
        };
        rafIds[i] = requestAnimationFrame(tick);
      });
    };

    let firstReport = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (settleIfVisible) {
          const wasFirst = firstReport;
          firstReport = false;
          if (wasFirst) {
            // On screen at load: the final values stay. Off screen: drop to 0 out of sight.
            if (entry.isIntersecting) return observer.disconnect();
            nums.forEach((_, i) => draw(i, 0));
            return;
          }
          if (entry.intersectionRatio < threshold) return;
        } else if (!entry.isIntersecting) {
          return;
        }
        if (sessionKey && finishedRuns.has(sessionKey)) return;
        observer.disconnect();
        run();
      },
      { threshold: settleIfVisible ? [0, threshold] : threshold },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      rafIds.forEach(cancelAnimationFrame);
    };
  }, [ref, duration, stagger, threshold, sessionKey, settleIfVisible, finalIfReducedMotion]);
}
