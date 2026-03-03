"use client";

import { useEffect, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates an array of numbers from 0 to their targets when `active` becomes true.
 * Returns the current animated values.
 */
export function useCountUp(
  targets: readonly number[],
  active: boolean,
  duration = 1200,
  staggerMs = 100
): number[] {
  const [values, setValues] = useState<number[]>(() => targets.map(() => 0));

  useEffect(() => {
    if (!active) return;

    const starts = targets.map((_, i) => performance.now() + i * staggerMs);

    function tick() {
      const now = performance.now();
      const vals = targets.map((target, i) => {
        const elapsed = now - starts[i];
        if (elapsed <= 0) return 0;
        const progress = Math.min(elapsed / duration, 1);
        return Math.round(target * easeOutCubic(progress));
      });

      setValues(vals);

      if (vals.some((v, i) => v < targets[i])) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [active, targets, duration, staggerMs]);

  return values;
}
