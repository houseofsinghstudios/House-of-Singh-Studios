"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";
import { SERVICES_SECTION } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

const NUMBERS = ["01", "02", "03", "04"];

export default function ServicesSection() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [staggerDone, setStaggerDone] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Detect mobile/tablet
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // After stagger animation completes, auto-expand first item on mobile
  useEffect(() => {
    if (!isMobile || staggerDone) return;

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Stagger: 4 items × 0.1s delay + 0.5s animation = ~0.8s total
          // Auto-expand after stagger completes
          const timer = setTimeout(() => {
            setStaggerDone(true);
            setActiveIndex(0);
          }, 900);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [isMobile, staggerDone]);

  // Reset accordion state when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setActiveIndex(null);
    }
  }, [isMobile]);

  const handleTap = useCallback(
    (index: number, e: React.MouseEvent) => {
      if (!isMobile) return; // Let the <Link> handle it on desktop
      e.preventDefault();
      setActiveIndex((prev) => (prev === index ? null : index));
    },
    [isMobile]
  );

  return (
    <section
      className="css-reveal services-section-mobile"
      style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}
    >
      <div className="css-reveal">
        <EditorialLabel text="(03) Capabilities" className="mb-6" />
      </div>

      <h2
        className="css-reveal font-[var(--sans)] font-medium tracking-[-0.02em] text-[color:var(--text-primary)] m-0 overflow-hidden mb-16"
        style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1 }}
      >
        {SERVICES_SECTION.heading}
      </h2>

      <div className="svc-accordion reveal-stagger-parent" ref={sectionRef}>
        {SERVICES_SECTION.items.map((service, i) => {
          const isActive = activeIndex === i;

          return (
            <Link
              key={service.href}
              href={service.href}
              className={`svc-accordion-row${isActive ? " svc-mob-active" : ""}`}
              data-cursor="view"
              onClick={(e) => handleTap(i, e)}
            >
              <span className="svc-accordion-num">{NUMBERS[i]}</span>
              <div className="svc-accordion-content">
                <h3
                  className="svc-accordion-title"
                  style={{
                    viewTransitionName: `service-${service.href.split("/").pop()}`,
                  }}
                >
                  {service.title}
                </h3>
                <div className="svc-accordion-body">
                  <p className="svc-accordion-desc">{service.sentence}</p>
                  <span
                    role="link"
                    tabIndex={0}
                    className="svc-mob-learn-more"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(service.href);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(service.href);
                      }
                    }}
                  >
                    Learn More <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
              {/* Desktop: diagonal arrow. Mobile: +/x toggle */}
              <div className="svc-accordion-arrow-col svc-desktop-arrow">
                <svg
                  className="svc-accordion-arrow-icon"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="40" x2="40" y2="8" />
                  <polyline points="24,8 40,8 40,24" />
                </svg>
              </div>
              <div className={`svc-accordion-arrow-col svc-mob-toggle${isActive ? " svc-mob-toggle--active" : ""}`}>
                <span className="svc-mob-plus">+</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
