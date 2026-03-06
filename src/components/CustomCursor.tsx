"use client";

import { useEffect, useRef, useCallback } from "react";

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n;
}

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input[type="submit"]';
const DATA_CURSOR_SELECTOR = "[data-cursor]";

type CursorState = "default" | "hover" | "view" | "magnetic" | "distort" | "pause";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const prevMouse = useRef({ x: -100, y: -100 });
  const velocity = useRef(0);
  const cursorState = useRef<CursorState>("default");
  const magneticTarget = useRef<HTMLElement | null>(null);

  const setState = useCallback((state: CursorState) => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const prev = cursorState.current;
    if (prev === state) return;
    cursorState.current = state;

    // Remove all state classes
    dot.classList.remove("cursor-hover", "cursor-view", "cursor-distort", "cursor-pause");
    ring.classList.remove("cursor-hover", "cursor-view", "cursor-magnetic", "cursor-distort", "cursor-pause");

    // Remove dynamic content
    ring.querySelectorAll(".cursor-label, .cursor-pause-icon").forEach((el) => el.remove());

    switch (state) {
      case "hover":
        dot.classList.add("cursor-hover");
        ring.classList.add("cursor-hover");
        break;
      case "view": {
        dot.classList.add("cursor-view");
        ring.classList.add("cursor-view");
        const label = document.createElement("span");
        label.className = "cursor-label";
        label.textContent = "View";
        ring.appendChild(label);
        break;
      }
      case "magnetic":
        ring.classList.add("cursor-magnetic");
        break;
      case "distort":
        dot.classList.add("cursor-distort");
        ring.classList.add("cursor-distort");
        break;
      case "pause": {
        dot.classList.add("cursor-pause");
        ring.classList.add("cursor-pause");
        const icon = document.createElement("span");
        icon.className = "cursor-pause-icon";
        icon.innerHTML = '<span></span><span></span>';
        ring.appendChild(icon);
        break;
      }
    }
  }, []);

  const clearMagnetic = useCallback(() => {
    if (magneticTarget.current) {
      magneticTarget.current.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      magneticTarget.current.style.transform = "";
      magneticTarget.current = null;
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let raf: number;

    function animate() {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15);

      // Calculate velocity for distort state
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      velocity.current = Math.sqrt(dx * dx + dy * dy);
      prevMouse.current.x = mouse.current.x;
      prevMouse.current.y = mouse.current.y;

      // Update distort rotation speed based on velocity
      if (cursorState.current === "distort") {
        const speed = Math.max(8, 8 - Math.min(velocity.current * 0.1, 6));
        ring!.style.animationDuration = `${speed}s`;
      }

      // Magnetic: move ring toward button center
      if (cursorState.current === "magnetic" && magneticTarget.current) {
        const rect = magneticTarget.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Move button toward cursor (max 6px)
        const offX = (mouse.current.x - cx) * 0.08;
        const offY = (mouse.current.y - cy) * 0.08;
        const clampedX = Math.max(-6, Math.min(6, offX));
        const clampedY = Math.max(-6, Math.min(6, offY));
        magneticTarget.current.style.transition = "transform 0.15s ease-out";
        magneticTarget.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

        // Morph ring to button shape
        const rw = rect.width + 16;
        const rh = rect.height + 16;
        ring!.style.width = `${rw}px`;
        ring!.style.height = `${rh}px`;

        // Center ring on button
        const ringX = cx + clampedX;
        const ringY = cy + clampedY;
        ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        dot!.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;

        raf = requestAnimationFrame(animate);
        return;
      }

      dot!.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      ring!.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }

    function findCursorAttr(el: HTMLElement): string | null {
      let node: HTMLElement | null = el;
      while (node && node !== document.body) {
        const attr = node.getAttribute("data-cursor");
        if (attr) return attr;
        node = node.parentElement;
      }
      return null;
    }

    function handleEnter(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const attr = findCursorAttr(target);

      if (attr === "view") {
        setState("view");
      } else if (attr === "magnetic") {
        // Find the actual button/link element
        let btn: HTMLElement | null = target;
        while (btn && !btn.matches("a, button, [role='button']")) {
          btn = btn.parentElement;
        }
        if (!btn) btn = target.closest("[data-cursor='magnetic']") as HTMLElement;
        if (btn) {
          magneticTarget.current = btn;
          setState("magnetic");
        }
      } else if (attr === "distort") {
        setState("distort");
      } else if (attr === "pause") {
        setState("pause");
      } else if (target.matches(INTERACTIVE_SELECTOR) || target.closest(INTERACTIVE_SELECTOR)) {
        setState("hover");
      }
    }

    function handleLeave(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;

      // Check if we're moving to a child of the same data-cursor element
      const currentAttr = findCursorAttr(target);
      if (related && currentAttr) {
        const relatedAttr = findCursorAttr(related);
        if (relatedAttr === currentAttr) return;
      }

      if (cursorState.current === "magnetic") {
        clearMagnetic();
        // Reset ring dimensions
        if (ring) {
          ring.style.width = "";
          ring.style.height = "";
        }
      }
      if (cursorState.current === "distort" && ring) {
        ring.style.animationDuration = "";
      }

      // Check if we're entering another stateful element
      if (related) {
        const nextAttr = findCursorAttr(related);
        if (nextAttr) {
          // Let the next enter event handle it
          setState("default");
          return;
        }
        if ((related as HTMLElement).matches?.(INTERACTIVE_SELECTOR) || (related as HTMLElement).closest?.(INTERACTIVE_SELECTOR)) {
          setState("hover");
          return;
        }
      }

      setState("default");
    }

    // Attach listeners
    function attachListeners(root: Element | Document) {
      // data-cursor elements
      const dataCursorEls = root.querySelectorAll<HTMLElement>(DATA_CURSOR_SELECTOR);
      dataCursorEls.forEach((el) => {
        el.addEventListener("mouseenter", handleEnter as EventListener);
        el.addEventListener("mouseleave", handleLeave as EventListener);
      });
      // Generic interactive elements (only those without data-cursor ancestor)
      const interactiveEls = root.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR);
      interactiveEls.forEach((el) => {
        if (!el.closest(DATA_CURSOR_SELECTOR)) {
          el.addEventListener("mouseenter", handleEnter as EventListener);
          el.addEventListener("mouseleave", handleLeave as EventListener);
        }
      });
    }

    function detachListeners(root: Element | Document) {
      const els = root.querySelectorAll<HTMLElement>(`${DATA_CURSOR_SELECTOR}, ${INTERACTIVE_SELECTOR}`);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter as EventListener);
        el.removeEventListener("mouseleave", handleLeave as EventListener);
      });
    }

    attachListeners(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches(DATA_CURSOR_SELECTOR) || node.matches(INTERACTIVE_SELECTOR)) {
              node.addEventListener("mouseenter", handleEnter as EventListener);
              node.addEventListener("mouseleave", handleLeave as EventListener);
            }
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
      clearMagnetic();
    };
  }, [setState, clearMagnetic]);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
