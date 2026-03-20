"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);
  const [supportsVT] = useState(
    () => typeof document !== "undefined" && "startViewTransition" in document
  );

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (supportsVT) return;

    const el = overlayRef.current;
    if (!el) return;

    // Slide in
    el.style.transition = "none";
    el.style.transform = "translateY(100%)";

    requestAnimationFrame(() => {
      el.style.transition = "transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)";
      el.style.transform = "translateY(0%)";

      const onSlideIn = () => {
        el.removeEventListener("transitionend", onSlideIn);
        setTimeout(() => {
          el.style.transition = "transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)";
          el.style.transform = "translateY(-100%)";

          const onSlideOut = () => {
            el.removeEventListener("transitionend", onSlideOut);
            el.style.transition = "none";
            el.style.transform = "translateY(100%)";
          };
          el.addEventListener("transitionend", onSlideOut, { once: true });
        }, 100);
      };
      el.addEventListener("transitionend", onSlideIn, { once: true });
    });
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
