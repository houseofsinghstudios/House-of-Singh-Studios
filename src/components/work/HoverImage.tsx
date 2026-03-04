"use client";

import { useEffect, useRef } from "react";

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n;
}

interface HoverImageProps {
  gradient: string;
  visible: boolean;
}

export default function HoverImage({ gradient, visible }: HoverImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 901) return;

    let raf: number;

    function onMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }

    function animate() {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.1);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.1);

      if (ref.current) {
        ref.current.style.left = `${pos.current.x}px`;
        ref.current.style.top = `${pos.current.y}px`;
      }
      raf = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMouseMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== "undefined" && window.innerWidth < 901) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        width: 320,
        height: 400,
        pointerEvents: "none",
        zIndex: 50,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        scale: visible ? "1" : "0.85",
        transition:
          "opacity 0.35s cubic-bezier(.23,1,.32,1), scale 0.35s cubic-bezier(.23,1,.32,1)",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <span
        className="editorial-label"
        style={{ color: "#999" }}
      >
        Project Image
      </span>
    </div>
  );
}
