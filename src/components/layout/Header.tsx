"use client";
// Sticky site header with crest, wordmark, desktop nav links, and mobile overlay menu.
// Client component because it tracks scroll position for header shrink behavior
// and manages open/close state for the mobile navigation overlay. While the overlay is open,
// Escape closes it, the page behind is inert and focus returns to the menu button on close.

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useState, useEffect, useRef, useCallback } from "react";
import { STUDIO_EMAIL } from "@/lib/constants/contact";

// The mobile menu panel, which the menu button controls.
const PANEL_ID = "mobile-nav-panel";
// Everything outside the header and the panel that can take focus. While the menu is open these are
// inert, so Tab stays inside the menu; the header's own home links are made inert below.
const OUTSIDE_MENU = "main, footer, .ft-reveal, .skip-link, .cx-root";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // One way to close, whatever closes it (the button, Escape or a link): the menu shuts and focus
  // goes back to the menu button, without scrolling the page.
  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

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

  /* ── While open: Escape closes, and the page behind the menu is inert ── */
  useEffect(() => {
    if (!mobileOpen) return;
    const outside = [...document.querySelectorAll<HTMLElement>(OUTSIDE_MENU)];
    for (const el of outside) el.inert = true;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      for (const el of outside) el.inert = false;
    };
  }, [mobileOpen, closeMenu]);

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
        {/* Crest Logo — visible at page top only (desktop). Once hidden it is inert, so its home
            link cannot take keyboard focus; the wordmark link is the home link then. */}
        <div className="header-crest-wrap" aria-hidden={scrolled || mobileOpen} inert={scrolled || mobileOpen}>
          {/* The crest's alt is the link's text and its accessible name. */}
          <Link href="/">
            <Image
              src="/hos-studios-logo.svg"
              alt="House of Singh Studios"
              className="header-crest"
              width={140}
              height={115}
              unoptimized
            />
          </Link>
        </div>

        {/* Text Wordmark — visible once scrolled, at every width. While hidden at the page top it is
            inert, like the crest once scrolled, so keyboard focus never lands on it. */}
        <div className="header-wordmark-wrap" aria-hidden={!scrolled || mobileOpen} inert={!scrolled || mobileOpen}>
          <Link href="/" className="header-wordmark">
            House of Singh Studios
          </Link>
        </div>

        {/* Spacer */}
        <div className="header-spacer" />

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
          ref={menuButtonRef}
          className="header-mobile-hamburger"
          onClick={() => (mobileOpen ? closeMenu() : setMobileOpen(true))}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls={PANEL_ID}
        >
          <span className={`hamburger-line hamburger-line--top${mobileOpen ? " open" : ""}`} />
          <span className={`hamburger-line hamburger-line--bottom${mobileOpen ? " open" : ""}`} />
        </button>
      </header>

      {/* Always rendered, so the button's aria-controls always points at it; hidden while closed. */}
      <div id={PANEL_ID} className="mobile-nav-panel" hidden={!mobileOpen}>
        <nav className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav-link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-nav-footer">
          <span>{STUDIO_EMAIL}</span>
          <span>Toronto, Canada</span>
        </div>
      </div>
    </>
  );
}
