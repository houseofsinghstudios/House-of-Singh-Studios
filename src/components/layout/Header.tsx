"use client";

import { Link } from "next-view-transitions";
import { useState, useEffect, useRef, useCallback } from "react";
import NavigationOverlay from "./NavigationOverlay";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

        setScrolled(y >= 100);

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
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={`site-header${scrolled ? " site-header--scrolled" : ""}${menuOpen ? " site-header--menu-open" : ""}`}
        style={{
          transform: hidden && !menuOpen ? "translateY(-100%)" : "translateY(0)",
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

        {/* Menu + trigger — always visible on desktop/tablet, only nav on mobile */}
        <button
          className="header-menu-trigger"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          data-cursor="link"
        >
          <span className="header-menu-trigger-text">
            {menuOpen ? "Close" : "Menu"}
          </span>
          <span
            className="header-menu-trigger-plus"
            style={{
              transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            +
          </span>
        </button>
      </header>

      {/* Full-screen Navigation Overlay */}
      <NavigationOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
