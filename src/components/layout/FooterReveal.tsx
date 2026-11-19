"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";

// The 11 point maple leaf from the flag of Canada, in the flag red: the one place that red is used on
// the site (a recorded design exception, CLAUDE.md). Decorative: the line beside it says it.
function MapleLeaf() {
  return (
    <svg className="ft-reveal-leaf" viewBox="-2015 -2000 4030 4030" width="12" height="12" fill="#D52B1E" aria-hidden="true" focusable="false">
      <path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" />
    </svg>
  );
}

export default function FooterReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const taglineId = useId();
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
    // A named region, so the crest and its line sit in a landmark like the rest of the page (the
    // footer is the page's one contentinfo landmark, and this block follows it outside the content).
    <section className="ft-reveal" ref={sectionRef} aria-labelledby={taglineId}>
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
        {/* The section's label. The leaf stays with "Proudly" if the line wraps on a narrow phone. */}
        <p className="ft-reveal-tagline" id={taglineId}>
          <span className="ft-reveal-lead">
            <MapleLeaf />
            Proudly
          </span>{" "}
          Canadian owned and operated.
        </p>
      </div>
    </section>
  );
}
