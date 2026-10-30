"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";

export default function FooterReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMediaQuery(REDUCED_MOTION);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    // Reduced motion: the crest shows as it ends after the scroll, fully revealed and at full size.
    if (reduceMotion) {
      inner.style.clipPath = "circle(80% at 50% 50%)";
      inner.style.transform = "scale(1)";
      return;
    }

    function onScroll() {
      if (!section || !inner) return;
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Progress: 0 when section top enters viewport bottom, 1 when section top reaches viewport top
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / windowH));

      // Map progress to circle radius: 0% at start, 80% at full scroll
      const radius = progress * 80;
      inner.style.clipPath = `circle(${radius}% at 50% 50%)`;

      // Subtle scale: starts at 0.85, ends at 1
      const scale = 0.85 + progress * 0.15;
      inner.style.transform = `scale(${scale})`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [reduceMotion]);

  return (
    <div className="ft-reveal" ref={sectionRef}>
      <div className="ft-reveal-inner" ref={innerRef}>
        {/* next/image as in the header: the SVG unoptimized (next/image does not resize SVG). */}
        <Image
          src="/hos-studios-logo.svg"
          alt="House of Singh Studios"
          className="ft-reveal-crest"
          width={120}
          height={99}
          unoptimized
        />
        <p className="ft-reveal-tagline">
          Directed by humans. Accelerated by AI.
        </p>
      </div>
    </div>
  );
}
