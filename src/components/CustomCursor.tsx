"use client";

import { useEffect, useRef, useState } from "react";

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const state = useRef<"default" | "expand" | "link">("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsMobile(window.innerWidth < 901);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    document.body.style.cursor = "none";

    let raf: number;

    function animate() {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.15);

      if (cursor) {
        cursor.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }

    function updateCursorState(target: HTMLElement | null) {
      if (!cursor) return;
      if (!target) {
        state.current = "default";
        applyState();
        return;
      }

      const expandEl = target.closest("[data-cursor='expand']");
      const linkEl = target.closest("[data-cursor='link']") || target.closest("a, button");

      if (expandEl) {
        state.current = "expand";
      } else if (linkEl) {
        state.current = "link";
      } else {
        state.current = "default";
      }
      applyState();
    }

    function applyState() {
      if (!cursor) return;
      const text = cursor.querySelector<HTMLElement>(".cursor-text");
      switch (state.current) {
        case "expand":
          cursor.style.width = "80px";
          cursor.style.height = "80px";
          cursor.style.background = "#fff";
          cursor.style.mixBlendMode = "normal";
          if (text) text.style.opacity = "1";
          break;
        case "link":
          cursor.style.width = "24px";
          cursor.style.height = "24px";
          cursor.style.background = "var(--text-primary)";
          cursor.style.mixBlendMode = "difference";
          if (text) text.style.opacity = "0";
          break;
        default:
          cursor.style.width = "12px";
          cursor.style.height = "12px";
          cursor.style.background = "var(--text-primary)";
          cursor.style.mixBlendMode = "difference";
          if (text) text.style.opacity = "0";
      }
    }

    function onMouseOver(e: MouseEvent) {
      updateCursorState(e.target as HTMLElement);
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "var(--text-primary)",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        transition:
          "width 0.3s cubic-bezier(.23,1,.32,1), height 0.3s cubic-bezier(.23,1,.32,1), background 0.3s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        className="cursor-text"
        style={{
          fontFamily: "var(--sans)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-primary)",
          opacity: 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      >
        View
      </span>
    </div>
  );
}
