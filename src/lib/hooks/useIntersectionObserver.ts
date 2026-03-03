"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * Observes a single element and returns whether it's intersecting.
 * By default triggers once (element stays "revealed" after entering viewport).
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: Options = {}
): { ref: React.RefObject<T | null>; isIntersecting: boolean } {
  const { threshold = 0.15, triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) observer.unobserve(el);
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return { ref, isIntersecting };
}
