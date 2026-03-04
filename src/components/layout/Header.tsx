"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const mobileLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y >= 80);

      // Mobile: hide after 200px, Desktop: after 400px
      const threshold = window.innerWidth <= 900 ? 200 : 400;
      if (y > threshold && y > lastScrollY.current) {
        setHidden(true);
      } else if (y < lastScrollY.current) {
        setHidden(false);
      }

      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const animateMenuOpen = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const links = overlay.querySelectorAll<HTMLElement>(".header-mobile-link");
    const cta = overlay.querySelector<HTMLElement>(".header-mobile-cta");

    menuTlRef.current?.kill();
    const tl = gsap.timeline();
    menuTlRef.current = tl;

    gsap.set(overlay, { display: "flex", y: "100%" });
    gsap.set(links, { opacity: 0, y: 20 });
    if (cta) gsap.set(cta, { opacity: 0, y: 16 });

    tl.to(overlay, { y: "0%", duration: 0.4, ease: "power4.inOut" });
    tl.to(links, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: "power3.out" }, 0.2);
    if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, ">");
  }, []);

  const animateMenuClose = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    menuTlRef.current?.kill();
    gsap.to(overlay, {
      y: "100%",
      duration: 0.35,
      ease: "power4.inOut",
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        setMenuOpen(false);
      },
    });
  }, []);

  useEffect(() => {
    if (menuOpen) animateMenuOpen();
  }, [menuOpen, animateMenuOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 var(--page-px)",
          backgroundColor: scrolled ? "var(--bg)" : "transparent",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          transform:
            hidden && !menuOpen ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 0.35s ease, background-color 0.5s ease, border-color 0.5s ease",
        }}
      >
        {/* Crest Logo — visible in State 1 (top of page), positioned with breathing room */}
        <div
          style={{
            position: "fixed",
            left: "var(--page-px)",
            top: 48,
            opacity: scrolled ? 0 : 1,
            transform: scrolled ? "translateY(-20px)" : "translateY(0)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            pointerEvents: scrolled ? "none" : "auto",
            zIndex: 100,
          }}
        >
          <Link href="/" aria-label="House of Singh Studios home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hos-studios-logo.svg"
              alt=""
              style={{ height: 90, width: "auto", display: "block" }}
            />
          </Link>
        </div>

        {/* Text Logotype — fades in for State 2 (scrolled) */}
        <div
          style={{
            opacity: scrolled ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: scrolled ? "auto" : "none",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--text-primary)",
              textDecoration: "none",
            }}
          >
            House of Singh Studios
          </Link>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop Nav Links — fade in for State 2 */}
        <nav
          className="header-desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            opacity: scrolled ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: scrolled ? "auto" : "none",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="header-nav-link"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 11,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger — State 2 only, below 900px */}
        <button
          className="header-hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{
            display: "none",
            flexDirection: "column",
            gap: 5,
            padding: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? "auto" : "none",
            transition: "opacity 0.5s ease",
          }}
        >
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: "var(--text-primary)",
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: "var(--text-primary)",
            }}
          />
          <span
            style={{
              display: "block",
              width: 24,
              height: 1.5,
              background: "var(--text-primary)",
            }}
          />
        </button>
      </header>

      {/* Mobile Full-Screen Overlay — always in DOM for GSAP animation */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 101,
          background: "var(--bg)",
          display: "none",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transform: "translateY(100%)",
        }}
      >
        {/* Close X */}
        <button
          onClick={animateMenuClose}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 18,
            right: "var(--page-px)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            minHeight: 44,
            minWidth: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="1.5"
          >
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>

        {/* Overlay Links */}
        {mobileLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={animateMenuClose}
            className="header-mobile-link"
            style={{
              fontFamily: "var(--serif)",
              fontSize: 36,
              fontWeight: 600,
              color: "var(--text-primary)",
              textDecoration: "none",
              lineHeight: 1.6,
              transition: "color 0.2s ease",
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* Start a Project CTA */}
        <Link
          href="/contact"
          onClick={animateMenuClose}
          className="header-mobile-cta btn-primary"
          style={{
            position: "absolute",
            bottom: 40,
            left: "var(--page-px)",
            right: "var(--page-px)",
            height: 52,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Start a Project
        </Link>
      </div>

      <style>{`
        .header-nav-link:hover {
          color: var(--text-primary) !important;
        }
        .header-mobile-link:hover {
          color: var(--text-muted) !important;
        }
        @media (max-width: 899px) {
          .header-desktop-nav { display: none !important; }
          .header-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
