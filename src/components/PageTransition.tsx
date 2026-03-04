"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip animation on initial page load
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

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
  }, [pathname]);

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
