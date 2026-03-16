"use client";

import { Link } from "next-view-transitions";
import { useState, useEffect, useRef, useCallback } from "react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI", href: "/ai" },
  { label: "Journal", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const mobileNavLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI", href: "/ai" },
  { label: "Journal", href: "/insights" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "Careers", href: "/careers" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
          transform: hidden && !menuOpen ? "translateY(-100%)" : "translateY(0)",
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
              className="header-crest"
              style={{ width: "auto", display: "block" }}
            />
          </Link>
        </div>

        {/* Text Wordmark — visible when scrolled (desktop) or always (mobile) */}
        <div
          className="header-wordmark"
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

        {/* Mobile Hamburger Trigger */}
        <button
          className="mobile-menu-trigger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            marginRight: -8,
            position: "relative",
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 110,
          }}
        >
          <span
            className="hamburger-line hamburger-line-1"
            style={{
              position: "absolute",
              left: 8,
              top: menuOpen ? 17 : 13,
              width: 20,
              height: 0,
              borderTop: "1.5px solid var(--text-primary)",
              transition: "top 0.3s ease, transform 0.3s ease",
              transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
          />
          <span
            className="hamburger-line hamburger-line-2"
            style={{
              position: "absolute",
              left: 8,
              top: menuOpen ? 17 : 20.5,
              width: 20,
              height: 0,
              borderTop: "1.5px solid var(--text-primary)",
              transition: "top 0.3s ease, transform 0.3s ease",
              transform: menuOpen ? "rotate(-45deg)" : "rotate(0deg)",
            }}
          />
        </button>
      </header>

      {/* Mobile Full-Screen Overlay */}
      <div
        className="mobile-nav-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          backgroundColor: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `0 var(--page-px)`,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      >
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {mobileNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              style={{
                fontFamily: "var(--sans)",
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                textDecoration: "none",
                lineHeight: 1.2,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        .header-nav-link:hover {
          color: var(--text-primary) !important;
        }
        /* Desktop: hide mobile elements */
        .mobile-menu-trigger { display: none !important; }
        .mobile-nav-overlay { display: none; }

        /* Crest logo responsive sizing */
        .header-crest { height: 115px; }

        /* Mobile: hide desktop nav, show mobile elements */
        @media (max-width: 899px) {
          .header-desktop-nav { display: none !important; }
          .mobile-menu-trigger { display: flex !important; }
          .mobile-nav-overlay { display: flex !important; }
          .header-crest { height: 72px; }
        }
      `}</style>
    </>
  );
}
