"use client";

import { useEffect, useRef } from "react";
import { Link } from "next-view-transitions";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";

gsap.registerPlugin(ScrollTrigger);

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // 1. Label fades up
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 15 });
        tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0);
      }

      // 2. Project cards stagger in with clip-path reveals
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>(".project-card");
        const imgWraps = gridRef.current.querySelectorAll<HTMLElement>(".project-img-wrap");
        const imgInners = gridRef.current.querySelectorAll<HTMLElement>(".project-img-inner");

        gsap.set(cards, { opacity: 0, y: 40 });
        // Cards 1+2 together, then 3+4
        const firstPair = Array.from(cards).slice(0, 2);
        const secondPair = Array.from(cards).slice(2);

        tl.to(firstPair, { opacity: 1, y: 0, duration: 0.6 }, 0.3);
        if (secondPair.length) {
          tl.to(secondPair, { opacity: 1, y: 0, duration: 0.6 }, 0.45);
        }

        // Clip-path reveal per card image
        gsap.set(imgWraps, { clipPath: "inset(6% 4% 6% 4%)" });
        gsap.set(imgInners, { scale: 1.08 });

        imgWraps.forEach((wrap, i) => {
          tl.to(wrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.out" }, 0.3 + i * 0.1);
        });
        imgInners.forEach((inner, i) => {
          tl.to(inner, { scale: 1, duration: 0.8, ease: "power3.out" }, 0.3 + i * 0.1);
        });
      }

      // 3. "View All Projects" link fades up last
      if (linkRef.current) {
        gsap.set(linkRef.current, { opacity: 0, y: 15 });
        tl.to(linkRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.9);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="css-reveal" style={{ padding: "120px var(--page-px) 160px" }}>
      <div ref={labelRef}>
        <EditorialLabel text="Selected Work" className="mb-6" />
      </div>

      <div ref={gridRef} className="work-grid mt-8">
        {PROJECTS.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="project-card block no-underline"
            data-cursor="link"
          >
            <div
              className="project-img-wrap overflow-hidden relative"
              style={{ aspectRatio: "4/3", background: project.color }}
            >
              <div className="project-img-inner project-image-inner ken-burns w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center relative"
                    style={{
                      width: "60%",
                      height: "60%",
                      border: `1px solid ${project.accent}33`,
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        height: "70%",
                        border: `1px solid ${project.accent}55`,
                      }}
                    />
                    <div
                      className="absolute"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: `${project.accent}22`,
                        border: `1px solid ${project.accent}44`,
                      }}
                    />
                  </div>
                </div>
                <span
                  className="relative z-10 font-[var(--sans)] text-[11px] uppercase tracking-[0.12em]"
                  style={{ color: `${project.accent}88` }}
                >
                  {project.name.split(" ")[0]}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p
                className="font-[var(--sans)] font-medium text-base text-[color:var(--text-primary)] m-0"
                style={{ viewTransitionName: `project-${project.href.split("/").pop()}` }}
              >
                {project.name}
              </p>
              <p className="mt-1.5 font-[var(--sans)] font-normal text-xs uppercase tracking-[0.08em] text-[#999]">
                {project.label}
              </p>
              <p className="project-sentence font-[var(--sans)] font-normal text-sm text-[color:var(--text-muted)]">
                {project.sentence}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div ref={linkRef} className="mt-12">
        <Link href="/work" className="arrow-link no-underline" data-cursor="link">
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            View All Projects <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
