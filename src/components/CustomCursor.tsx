"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dot = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const cursorState = useRef("default");

  const isStudio = pathname?.startsWith("/studio");

  const updateCursor = useCallback(function loop() {
    // Dot follows mouse exactly
    dot.current.x = mouse.current.x;
    dot.current.y = mouse.current.y;

    // Ring follows with slight lag
    ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
    ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
    }

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (isStudio) return;

    // Check for fine pointer (mouse device)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorEl = target.closest("[data-cursor]");
      const state = cursorEl?.getAttribute("data-cursor") || "default";

      // Check if hovering a link or button
      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, select, label"
      );

      let newState = state;
      if (state === "default" && isInteractive) {
        newState = "hover";
      }

      if (newState !== cursorState.current) {
        cursorState.current = newState;
        if (dotRef.current) {
          dotRef.current.className = `custom-cursor-dot${newState !== "default" ? ` cursor-${newState}` : ""}`;
        }
        if (ringRef.current) {
          ringRef.current.className = `custom-cursor-ring${newState !== "default" ? ` cursor-${newState}` : ""}`;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    rafRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isStudio, updateCursor]);

  if (isStudio) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring">
        <span className="cursor-label">View</span>
        <span className="cursor-pause-icon">
          <span />
          <span />
        </span>
      </div>
    </>
  );
}
