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

const overlayLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work", count: "06" },
  { label: "AI", href: "/ai" },
  { label: "Journal", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
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

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!overlayOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOverlayOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlayOpen]);

  const closeOverlay = useCallback(() => setOverlayOpen(false), []);

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
          backgroundColor:
            scrolled || overlayOpen ? "var(--bg)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom:
            scrolled && !overlayOpen
              ? "1px solid var(--border)"
              : "1px solid transparent",
          transform:
            hidden && !overlayOpen ? "translateY(-100%)" : "translateY(0)",
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
            opacity: scrolled || overlayOpen ? 0 : 1,
            transform:
              scrolled || overlayOpen ? "translateY(-20px)" : "translateY(0)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            pointerEvents: scrolled || overlayOpen ? "none" : "auto",
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

        {/* Text Wordmark — visible when scrolled or overlay open */}
        <div
          style={{
            opacity: scrolled || overlayOpen ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: scrolled || overlayOpen ? "auto" : "none",
          }}
        >
          <Link
            href="/"
            onClick={overlayOpen ? closeOverlay : undefined}
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
            opacity: scrolled && !overlayOpen ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: scrolled && !overlayOpen ? "auto" : "none",
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

        {/* Menu + / Close trigger */}
        <button
          className="header-menu-trigger"
          onClick={() => setOverlayOpen((prev) => !prev)}
          aria-label={overlayOpen ? "Close menu" : "Open menu"}
          aria-expanded={overlayOpen}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px 0 8px 24px",
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--sans)",
            fontSize: 11,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "var(--text-primary)",
            opacity: scrolled || overlayOpen ? 1 : 0,
            pointerEvents: scrolled || overlayOpen ? "auto" : "none",
            transition: "opacity 0.5s ease, color 0.2s ease",
          }}
        >
          {overlayOpen ? "Close" : "Menu +"}
        </button>
      </header>

      {/* Full-screen Navigation Overlay */}
      <div
        className="nav-overlay"
        aria-hidden={!overlayOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 var(--page-px)",
          opacity: overlayOpen ? 1 : 0,
          pointerEvents: overlayOpen ? "auto" : "none",
          transition: "opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {overlayLinks.map((link, i) => (
            <div
              key={link.href}
              className="nav-overlay-item"
              style={{
                opacity: overlayOpen ? 1 : 0,
                transform: overlayOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${i * 80}ms, transform 0.5s cubic-bezier(0.23, 1, 0.32, 1) ${i * 80}ms`,
              }}
            >
              <Link
                href={link.href}
                onClick={closeOverlay}
                className="nav-overlay-link"
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.3,
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 8,
                  padding: "6px 0",
                  transition: "color 0.2s ease",
                }}
              >
                {link.label}
                {link.count && (
                  <span
                    style={{
                      fontFamily: "var(--sans)",
                      fontSize: 11,
                      fontWeight: 400,
                      letterSpacing: "0.06em",
                      color: "var(--text-muted)",
                      position: "relative",
                      top: "-0.8em",
                    }}
                  >
                    {link.count}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      <style>{`
        .header-nav-link:hover {
          color: var(--text-primary) !important;
        }
        .nav-overlay-link:hover {
          color: var(--text-muted) !important;
        }
        /* Mobile: hide desktop nav, show only wordmark + menu trigger */
        @media (max-width: 899px) {
          .header-desktop-nav { display: none !important; }
        }
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .nav-overlay,
          .nav-overlay-item {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
