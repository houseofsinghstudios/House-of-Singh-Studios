"use client";

import { Link } from "next-view-transitions";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI", href: "/ai" },
  { label: "Journal", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;

      setScrolled(y >= 80);

      if (y > 400 && y > lastScrollY.current) {
        setHidden(true);
      } else if (y < lastScrollY.current) {
        setHidden(false);
      }

      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="site-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: scrolled ? 48 : 64,
          display: "flex",
          alignItems: "center",
          padding: "0 var(--page-px)",
          backgroundColor: scrolled ? "var(--bg)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 0.35s ease, background-color 0.5s ease, border-color 0.5s ease, height 0.35s ease",
        }}
      >
        {/* Crest Logo — visible at top of page only */}
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
              style={{ height: 106, width: "auto", display: "block" }}
            />
          </Link>
        </div>

        {/* Text Wordmark — visible when scrolled */}
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
              viewTransitionName: "site-logo",
            }}
          >
            House of Singh Studios
          </Link>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop Nav Links — visible when scrolled, hidden on mobile */}
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
      </header>

      <style>{`
        .header-nav-link:hover {
          color: var(--text-primary) !important;
        }
        /* Mobile: hide desktop nav */
        @media (max-width: 899px) {
          .header-desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
