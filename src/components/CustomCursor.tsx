"use client";

import { useEffect, useRef, useCallback } from "react";
import { initMagneticButtons } from "@/lib/magnetic-button";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const updateCursor = useCallback(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Ring lerp toward mouse
    ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
    ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;

    // Apply transforms (GPU-accelerated)
    dot.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
    ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;

    rafId.current = requestAnimationFrame(updateCursor);
  }, []);

  useEffect(() => {
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-cursor]");
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) return;

      if (!target) {
        ring.className = "cursor-ring";
        dot.className = "cursor-dot";
        ring.innerHTML = "";
        ring.style.width = "";
        ring.style.height = "";
        ring.style.borderRadius = "";
        return;
      }

      const state = target.getAttribute("data-cursor");
      ring.className = `cursor-ring cursor-ring--${state}`;
      dot.className = `cursor-dot cursor-dot--${state}`;

      if (state === "view") {
        ring.innerHTML = '<span class="cursor-label">View</span>';
      } else if (state === "pause") {
        ring.innerHTML =
          '<span class="cursor-pause-icon"><span></span><span></span></span>';
      } else {
        ring.innerHTML = "";
      }

      // Magnetic CTA — morph ring to button shape
      if (state === "magnetic") {
        const rect = target.getBoundingClientRect();
        ring.style.width = `${rect.width + 16}px`;
        ring.style.height = `${rect.height + 16}px`;
        ring.style.borderRadius = "0px";
      } else {
        ring.style.width = "";
        ring.style.height = "";
        ring.style.borderRadius = "";
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    rafId.current = requestAnimationFrame(updateCursor);

    // Initialize magnetic button pull behavior
    initMagneticButtons();

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [updateCursor]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
