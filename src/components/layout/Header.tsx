"use client";
// Sticky site header with crest, wordmark, desktop nav links, and mobile overlay menu.
// Client component because it tracks scroll position for header shrink behavior
// and manages open/close state for the mobile navigation overlay.

import { Link } from "next-view-transitions";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI", href: "/ai" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > 20 : false
  );
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const rafRef = useRef(0);

  /* ── Scroll detection (rAF-throttled) ── */
  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;

        setScrolled(y >= 20);

        if (y > 400 && y > lastScrollY.current) {
          setHidden(true);
        } else if (y < lastScrollY.current) {
          setHidden(false);
        }

        lastScrollY.current = y;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("nav-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("nav-open");
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`site-header${scrolled ? " site-header--scrolled" : ""}`}
        style={{
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        {/* Crest Logo — visible at page top only (desktop) */}
        <div className="header-crest-wrap" aria-hidden={scrolled}>
          <Link href="/" aria-label="House of Singh Studios home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hos-studios-logo.svg"
              alt=""
              className="header-crest"
              width={140}
              height={115}
            />
          </Link>
        </div>

        {/* Text Wordmark — visible when scrolled (desktop) or always (mobile) */}
        <div className="header-wordmark-wrap">
          <Link href="/" className="header-wordmark">
            House of Singh Studios
          </Link>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop Nav Links — visible at top, hidden when scrolled */}
        <nav className="header-desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="header-nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="header-mobile-hamburger"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className={`hamburger-line hamburger-line--top${mobileOpen ? " open" : ""}`} />
          <span className={`hamburger-line hamburger-line--bottom${mobileOpen ? " open" : ""}`} />
        </button>
      </header>

      {mobileOpen && (
        <div className="mobile-nav-panel">
          <nav className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-nav-footer">
            <span>studio@houseofsingh.com</span>
            <span>Toronto, Canada</span>
          </div>
        </div>
      )}
    </>
  );
}
