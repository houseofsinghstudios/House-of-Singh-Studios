"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

/**
 * PageTransition: View Transitions API is primary (handled by ViewTransitions
 * wrapper in layout.tsx). This component renders the GSAP overlay only as
 * fallback for browsers that do not support View Transitions.
 */
export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);
  const [supportsVT, setSupportsVT] = useState(false);

  useEffect(() => {
    setSupportsVT(
      typeof document !== "undefined" && "startViewTransition" in document
    );
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    // View Transitions supported — browser handles transitions
    if (supportsVT) return;

    const el = overlayRef.current;
    if (!el) return;

    const tl = gsap.timeline();
    tl.set(el, { y: "100%" })
      .to(el, {
        y: "0%",
        duration: 0.5,
        ease: "power4.inOut",
      })
      .to(el, {
        y: "-100%",
        duration: 0.4,
        ease: "power4.inOut",
        delay: 0.1,
      })
      .set(el, { y: "100%" });

    return () => {
      tl.kill();
    };
  }, [pathname, supportsVT]);

  if (supportsVT) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "var(--text-primary)",
        zIndex: 200,
        transform: "translateY(100%)",
        pointerEvents: "none",
      }}
    />
  );
}
