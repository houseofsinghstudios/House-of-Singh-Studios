"use client";

import { useEffect, useRef } from "react";
import { Link } from "next-view-transitions";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import Button from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const serviceBlocks = [
  {
    number: "01",
    title: "Brand Identity and Visual Design",
    description:
      "Your brand identity is the first thing your market judges you on. We build complete visual systems — logo, typography, color architecture, and brand guidelines — that give your business a consistent, professional presence across every touchpoint. The result is a brand that looks as established as your business actually is.",
    deliverables: [
      "Logo System",
      "Typography",
      "Color Architecture",
      "Brand Guidelines",
      "Collateral Suite",
      "Art Direction",
    ],
    href: "/services/brand-identity",
    color: "#E8E5E0",
  },
  {
    number: "02",
    title: "Visual Media and Content Production",
    description:
      "Content without a visual strategy is noise. We direct and produce brand photography, campaign films, and social content systems built on strategic intent. Every image and frame reinforces your brand positioning. The output works across channels because it was planned that way from the start.",
    deliverables: [
      "Brand Photography",
      "Video Production",
      "Social Systems",
      "Art Direction",
      "Script Development",
    ],
    href: "/services/visual-media",
    color: "#E0E5E8",
  },
  {
    number: "03",
    title: "Digital Design and Experience",
    description:
      "Your website is your highest-traffic brand touchpoint. We design the visual direction, content architecture, and interface systems that make it work commercially. We lead the design, work with development partners to build it, and ensure every page serves a business purpose — not just an aesthetic one.",
    deliverables: [
      "Website Design Direction",
      "Interface Design",
      "Content Architecture",
      "Digital Brand Systems",
      "Ongoing Support",
    ],
    href: "/services/digital-design",
    color: "#E5E8E0",
  },
  {
    number: "04",
    title: "Creative Strategy and Systems",
    description:
      "Most brand problems are strategy problems disguised as design problems. We run positioning workshops, build creative direction frameworks, and design content systems that give your team the structure to maintain brand quality without depending on a designer for every decision. For businesses exploring AI in their creative workflow, we provide guidance on tool selection and integration.",
    deliverables: [
      "Positioning Workshops",
      "Creative Frameworks",
      "Content Strategy",
      "Visual Systems",
      "AI Workflow Integration",
    ],
    href: "/services/creative-strategy",
    color: "#E8E0E5",
  },
];

export default function ServicesOverviewClient() {
  const heroRef = useRef<HTMLElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // ── Hero animation ──
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let split: SplitType | null = null;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const label = hero.querySelector("[data-hero-label]");
    const heading = hero.querySelector("[data-hero-heading]") as HTMLElement;
    const sub = hero.querySelector("[data-hero-sub]");

    if (label) {
      gsap.set(label, { opacity: 0, y: 12 });
      tl.to(label, { opacity: 0.5, y: 0, duration: 0.4 }, 0);
    }

    if (heading) {
      split = new SplitType(heading, { types: "words" });
      if (split.words) {
        gsap.set(split.words, { y: "100%", opacity: 0 });
        tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.06, duration: 0.6 }, 0.15);
      }
    }

    if (sub) {
      gsap.set(sub, { opacity: 0, y: 12 });
      tl.to(sub, { opacity: 0.5, y: 0, duration: 0.4 }, 0.6);
    }

    return () => {
      tl.kill();
      if (split) split.revert();
    };
  }, []);

  // ── Block entrance animations ──
  useEffect(() => {
    const container = blocksRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const blocks = container.querySelectorAll<HTMLElement>(".service-block");
      blocks.forEach((block) => {
        const title = block.querySelector("[data-block-title]") as HTMLElement;
        const desc = block.querySelector("[data-block-desc]");
        const dels = block.querySelector("[data-block-deliverables]");
        const link = block.querySelector("[data-block-link]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        if (title) {
          const split = new SplitType(title, { types: "words" });
          if (split.words) {
            gsap.set(split.words, { y: "100%", opacity: 0 });
            tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.04, duration: 0.5 }, 0);
          }
        }

        if (desc) {
          gsap.set(desc, { opacity: 0, y: 16 });
          tl.to(desc, { opacity: 0.7, y: 0, duration: 0.4 }, 0.2);
        }

        if (dels) {
          gsap.set(dels, { opacity: 0, y: 8 });
          tl.to(dels, { opacity: 0.4, y: 0, duration: 0.3 }, 0.35);
        }

        if (link) {
          gsap.set(link, { opacity: 0 });
          tl.to(link, { opacity: 1, duration: 0.3 }, 0.45);
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // ── CTA animation ──
  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    let split: SplitType | null = null;
    const ctx = gsap.context(() => {
      const heading = cta.querySelector("[data-cta-heading]") as HTMLElement;
      const sub = cta.querySelector("[data-cta-sub]");
      const btns = cta.querySelector("[data-cta-btns]");

      const tl = gsap.timeline({
        scrollTrigger: { trigger: cta, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });

      if (heading) {
        split = new SplitType(heading, { types: "words" });
        if (split.words) {
          gsap.set(split.words, { y: "100%", opacity: 0 });
          tl.to(split.words, { y: "0%", opacity: 1, stagger: 0.04, duration: 0.5 }, 0);
        }
      }

      if (sub) {
        gsap.set(sub, { opacity: 0, y: 12 });
        tl.to(sub, { opacity: 0.7, y: 0, duration: 0.4 }, ">");
      }

      if (btns) {
        gsap.set(btns, { opacity: 0, y: 8 });
        tl.to(btns, { opacity: 1, y: 0, duration: 0.3 }, ">0.1");
      }
    }, cta);

    return () => {
      ctx.revert();
      if (split) split.revert();
    };
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="flex flex-col justify-center px-[var(--page-px)]"
        style={{ minHeight: "100vh" }}
      >
        <p
          data-hero-label
          className="font-[var(--sans)] text-xs uppercase tracking-[0.15em] text-[color:var(--text-primary)]"
          style={{ opacity: 0.5 }}
        >
          (Services)
        </p>

        <h1
          data-hero-heading
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] mt-4 overflow-hidden"
          style={{ fontSize: "clamp(44px, 6vw, 84px)", lineHeight: 1.05 }}
        >
          Every service solves a business problem.
        </h1>

        <p
          data-hero-sub
          className="font-[var(--sans)] font-normal text-[color:var(--text-primary)] max-w-[540px] mt-8"
          style={{ fontSize: "clamp(14px, 1.1vw, 16px)", opacity: 0.5 }}
        >
          Four capabilities. One studio. Every service connects to measurable business outcomes.
        </p>
      </section>

      {/* ── SERVICE BLOCKS ── */}
      <div ref={blocksRef} className="px-[var(--page-px)]">
        {serviceBlocks.map((service) => (
          <Link
            key={service.number}
            href={service.href}
            className="service-block"
            data-cursor="expand"
          >
            <div className="service-block-content">
              <span className="service-block-number font-[var(--serif)] font-semibold">
                {service.number}
              </span>

              <h2
                data-block-title
                className="font-[var(--serif)] font-normal text-[color:var(--text-primary)] overflow-hidden"
                style={{ fontSize: "clamp(28px, 3vw, 36px)", lineHeight: 1.15, marginBottom: 20 }}
              >
                {service.title}
              </h2>

              <p
                data-block-desc
                className="font-[var(--sans)] font-normal text-[15px] leading-[1.7] max-w-[540px]"
                style={{ color: "rgba(26, 26, 26, 0.7)", marginBottom: 24 }}
              >
                {service.description}
              </p>

              <p
                data-block-deliverables
                className="font-[var(--sans)] uppercase text-[12px] tracking-[0.05em]"
                style={{ color: "rgba(26, 26, 26, 0.4)" }}
              >
                {service.deliverables.join(" · ")}
              </p>

              <span
                data-block-link
                className="inline-flex items-center gap-2 mt-8 font-[var(--sans)] font-medium text-[13px] uppercase tracking-[0.1em] text-[color:var(--text-primary)] no-underline"
              >
                Learn More
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </div>

            <div
              className="service-block-color"
              style={{ background: service.color }}
            />
          </Link>
        ))}
      </div>

      {/* ── CTA ── */}
      <section
        ref={ctaRef}
        className="text-center"
        style={{ padding: "160px var(--page-px)" }}
      >
        <h2
          data-cta-heading
          className="font-[var(--serif)] font-semibold text-[color:var(--text-primary)] overflow-hidden"
          style={{ fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 1.1 }}
        >
          Not sure where to start?
        </h2>
        <p
          data-cta-sub
          className="font-[var(--sans)] font-normal text-[17px] text-[color:var(--text-primary)] max-w-[480px] mx-auto"
          style={{ margin: "24px auto 40px", opacity: 0.7 }}
        >
          Book a discovery call. We will help you identify which service fits your business.
        </p>
        <div data-cta-btns className="flex flex-wrap justify-center gap-3">
          <Button href="#" data-cursor="link">
            Book a Discovery Call
          </Button>
          <Button href="/packages" variant="secondary" data-cursor="link">
            View Packages
          </Button>
        </div>
      </section>
    </>
  );
}
