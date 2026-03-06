"use client";

import { useEffect, useRef, useCallback } from "react";

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n;
}

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input[type="submit"]';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);

  const onEnter = useCallback(() => {
    hovering.current = true;
    dotRef.current?.classList.add("cursor-hover");
    ringRef.current?.classList.add("cursor-hover");
  }, []);

  const onLeave = useCallback(() => {
    hovering.current = false;
    dotRef.current?.classList.remove("cursor-hover");
    ringRef.current?.classList.remove("cursor-hover");
  }, []);

  useEffect(() => {
    // Bail on touch/coarse-pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf: number;

    function animate() {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15);

      dot!.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      ring!.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }

    // Attach hover listeners to all interactive elements
    function attachListeners(root: Element | Document) {
      const els = root.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR);
      els.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }

    function detachListeners(root: Element | Document) {
      const els = root.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    }

    // Initial attachment
    attachListeners(document);

    // Watch for DOM changes (Next.js client navigation)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            // Check if the node itself is interactive
            if (node.matches(INTERACTIVE_SELECTOR)) {
              node.addEventListener("mouseenter", onEnter);
              node.addEventListener("mouseleave", onLeave);
            }
            // Check children
            attachListeners(node);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      detachListeners(document);
    };
  }, [onEnter, onLeave]);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
