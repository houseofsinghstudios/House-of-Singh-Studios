"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;

      // State 2 activates at 80px
      setScrolled(y >= 80);

      // Hide/show after 400px
      if (y > 400 && y > lastScrollY.current) {
        setHidden(true);
        setMenuOpen(false);
      } else if (y < lastScrollY.current) {
        setHidden(false);
      }

      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
        {/* Crest Logo — visible in State 1 (top of page) */}
        <div
          style={{
            position: "absolute",
            left: "var(--page-px)",
            top: "50%",
            transform: scrolled
              ? "translateY(calc(-50% - 20px))"
              : "translateY(-50%)",
            opacity: scrolled ? 0 : 1,
            transition: "opacity 0.5s ease, transform 0.5s ease",
            pointerEvents: scrolled ? "none" : "auto",
          }}
        >
          <Link href="/" aria-label="House of Singh Studios home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hos-studios-logo.svg"
              alt=""
              style={{ height: 52, width: "auto", display: "block" }}
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

      {/* Mobile Full-Screen Overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 101,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {/* Close X */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: 18,
              right: "var(--page-px)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
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
              onClick={() => setMenuOpen(false)}
              className="header-mobile-link"
              style={{
                fontFamily: "var(--serif)",
                fontSize: 36,
                fontWeight: 400,
                color: "var(--text-primary)",
                textDecoration: "none",
                lineHeight: 1.6,
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

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
