"use client";
// The site header: one fixed bar, 72px on desktop and 56px at 1080px and below. The studio's name,
// as live text in the nav's type, is the home link at every width. Above 1080px: five links and "Plan your project".
// At 1080px and below: the menu button, which opens the drawer (MenuDrawer.tsx).
//
// A client component because it follows the scroll (the line under the bar once scrolled, hiding on
// the way down and showing on the way up, src/lib/header-scroll.ts) and owns the drawer's open
// state. Never hidden while the drawer is open or with reduced motion, and shown at once when
// keyboard focus moves into it, so focus never lands on a hidden element.

import { Link } from "next-view-transitions";
import IntentLink from "@/components/IntentLink";
import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";
import { useHeaderScroll } from "@/lib/use-header-scroll";
import MenuDrawer from "./MenuDrawer";
import { SITE_LINKS } from "./site-links";

const DRAWER_ID = "site-menu-drawer";
// The drawer only exists at these widths: past them an open drawer closes.
const DRAWER_WIDTHS = "(max-width: 1080px)";

// Above 1080px: the five links, then "Plan your project" (hidden at 1080px and below, where the
// drawer's Contact covers it). Work prefetches on sight (a main path whose stylesheet the homepage
// already has); every other page on intent (IntentLink).
function DesktopNav() {
  return (
    <nav className="header-desktop-nav" aria-label="Primary navigation">
      {SITE_LINKS.map((link) => {
        const NavLink = link.href === "/work" ? Link : IntentLink;
        return (
          <NavLink key={link.href} href={link.href} className="header-nav-link">
            {link.label}
          </NavLink>
        );
      })}
      <IntentLink href="/start" className="btn-primary header-cta" data-cursor="link" onClick={() => track("header_cta_click", { location: "header" })}>
        Plan your project
      </IntentLink>
    </nav>
  );
}

// At 1080px and below: opens and closes the drawer. Its two lines turn into a cross while the drawer
// is open (globals.css); it stays above the drawer, the one control for it.
function MenuButton({ buttonRef, open, onClick }: { buttonRef: React.RefObject<HTMLButtonElement | null>; open: boolean; onClick: () => void }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="header-mobile-hamburger needs-js"
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={DRAWER_ID}
    >
      <span className="hamburger-line" />
      <span className="hamburger-line" />
    </button>
  );
}

// After the drawer closes: focus back to the menu button. While open: closing it if the window widens.
function useDrawerEffects(
  open: boolean,
  close: () => void,
  returnFocusRef: React.RefObject<boolean>,
  menuButtonRef: React.RefObject<HTMLButtonElement | null>,
) {
  // The focus moves here, not in close(): until the drawer's own cleanup has run, the header is
  // still inert and cannot take focus. React runs every cleanup before any new effect.
  useEffect(() => {
    if (open || !returnFocusRef.current) return;
    returnFocusRef.current = false;
    menuButtonRef.current?.focus({ preventScroll: true });
  }, [open, returnFocusRef, menuButtonRef]);

  // Widening the window past 1080px with the drawer open closes it, so the page is never left locked.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(DRAWER_WIDTHS);
    const onChange = () => {
      if (!mq.matches) close();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, close]);
}

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  const { scrolled, hidden, reveal } = useHeaderScroll(drawerOpen || reduceMotion);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const openDrawer = () => {
    setDrawerOpen(true);
    track("menu_open");
  };
  // Whatever closes the drawer, focus goes back to the menu button, without scrolling the page.
  // The header shows again too, so the menu button is in view to take the focus.
  const returnFocus = useRef(false);
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    reveal();
    returnFocus.current = true;
  }, [reveal]);
  useDrawerEffects(drawerOpen, closeDrawer, returnFocus, menuButtonRef);

  // The hidden state, once, for anything that follows the header (--header-edge in globals.css).
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", hidden);
    return () => document.documentElement.removeAttribute("data-header-hidden");
  }, [hidden]);

  const className = `site-header${scrolled ? " site-header--scrolled" : ""}${hidden ? " site-header--hidden" : ""}`;
  return (
    <>
      <header className={className} onFocus={reveal}>
        {/* The home link is the studio's name as live text, in the nav's type; written in normal case
            (capitals come from CSS), so screen readers say the name naturally. */}
        <IntentLink href="/" className="header-wordmark">
          House of Singh Studios
        </IntentLink>
        <div className="header-spacer" />
        <DesktopNav />
        <MenuButton buttonRef={menuButtonRef} open={drawerOpen} onClick={drawerOpen ? closeDrawer : openDrawer} />
      </header>
      <MenuDrawer id={DRAWER_ID} open={drawerOpen} onClose={closeDrawer} toggleRef={menuButtonRef} />
    </>
  );
}
