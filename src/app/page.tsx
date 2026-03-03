"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const crestRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Crest fade on scroll
    function handleScroll() {
      if (!crestRef.current) return;
      const y = window.scrollY;
      const progress = Math.min(y / 80, 1);
      crestRef.current.style.opacity = String(1 - progress);
      crestRef.current.style.transform = `translateY(${-30 * progress}px)`;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer for reveal animation
    // Delay observation so the browser paints the initial opacity:0 state first
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    const raf = requestAnimationFrame(() => {
      revealRefs.current.forEach((el) => {
        if (el) observer.observe(el);
      });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  function addRevealRef(el: HTMLElement | null, index: number) {
    if (el) revealRefs.current[index] = el;
  }

  return (
    <>
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--page-px) 80px",
          position: "relative",
        }}
      >
        {/* Crest logo */}
        <div
          ref={crestRef}
          style={{
            position: "absolute",
            top: 140,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 120,
          }}
        >
          <Image
            src="/hos-studios-logo.svg"
            alt="House of Singh Studios crest"
            width={120}
            height={120}
            priority
          />
        </div>

        {/* Hero content */}
        <div style={{ maxWidth: 800 }}>
          <h1
            ref={(el) => addRevealRef(el, 0)}
            data-delay="0"
            className="reveal-up"
            style={{
              fontFamily: "var(--serif)",
              fontWeight: 600,
              fontSize: "clamp(44px, 6.2vw, 80px)",
              lineHeight: 1.08,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            AI can generate assets.
            <br />
            It cannot build a brand.
          </h1>

          <p
            ref={(el) => addRevealRef(el, 1)}
            data-delay="150"
            className="reveal-up"
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 400,
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--text-muted)",
              marginTop: 28,
              maxWidth: 560,
            }}
          >
            A design studio powered by AI systems and led by creative direction.
          </p>

          <p
            ref={(el) => addRevealRef(el, 2)}
            data-delay="300"
            className="reveal-up"
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 300,
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--text-faint)",
              marginTop: 16,
              maxWidth: 560,
            }}
          >
            We build brands that hold up across every channel for years. AI
            handles the production layer. Human judgment drives the creative
            layer.
          </p>

          {/* CTAs */}
          <div
            ref={(el) => addRevealRef(el as HTMLElement, 3)}
            data-delay="450"
            className="reveal-up"
            style={{
              display: "flex",
              gap: 16,
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            <Link href="/work" className="btn-primary">
              View Projects
            </Link>
            <Link href="/contact" className="btn-outline">
              Start a Project
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={(el) => addRevealRef(el as HTMLElement, 4)}
          data-delay="600"
          className="reveal-up"
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              background: "var(--border)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="scroll-line" />
          </div>
        </div>
      </section>

      <style>{`
        .reveal-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal-up.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 32px;
          border-radius: 0;
          background: var(--text-primary);
          color: var(--bg);
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }
        .btn-primary:hover {
          opacity: 0.85;
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          padding: 0 32px;
          border-radius: 0;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: border-color 0.2s ease;
        }
        .btn-outline:hover {
          border-color: var(--text-muted);
        }

        .scroll-line {
          position: absolute;
          top: -40px;
          left: 0;
          width: 1px;
          height: 40px;
          background: var(--text-faint);
          animation: scrollDown 2s ease-in-out infinite;
        }

        @keyframes scrollDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(80px); }
        }
      `}</style>
    </>
  );
}
