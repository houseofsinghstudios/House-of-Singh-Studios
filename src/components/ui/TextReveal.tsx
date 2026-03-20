"use client";

import { useRef, useEffect, useState } from "react";

interface TextRevealProps {
  children?: React.ReactNode;
  lines?: string[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  disabled?: boolean;
}

export default function TextReveal({
  children,
  lines,
  as: Component = "h2",
  className = "",
  disabled = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (disabled || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-40px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [disabled]);

  if (disabled) {
    return (
      <Component className={className}>
        {children ?? lines?.join(" ")}
      </Component>
    );
  }

  if (lines && lines.length > 0) {
    return (
      <Component
        ref={ref as React.RefObject<never>}
        className={className}
        aria-label={lines.join(" ")}
      >
        {lines.map((line, i) => (
          <span key={i} className="text-reveal-line">
            <span
              className={`text-reveal-inner${revealed ? " revealed" : ""}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {line}
            </span>
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component ref={ref as React.RefObject<never>} className={className}>
      <span className="text-reveal-line">
        <span className={`text-reveal-inner${revealed ? " revealed" : ""}`}>
          {children}
        </span>
      </span>
    </Component>
  );
}
