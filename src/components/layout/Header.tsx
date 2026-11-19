"use client";
// The site header: one fixed bar, 72px on desktop and 56px at 1080px and below. The wordmark artwork
// on the left is the home link at every width. Above 1080px: five links and "Plan your project".
// At 1080px and below: the menu button, which opens the drawer (MenuDrawer.tsx).
//
// A client component because it follows the scroll (the line under the bar once scrolled, hiding on
// the way down and showing on the way up, src/lib/header-scroll.ts) and owns the drawer's open
// state. Never hidden while the drawer is open or with reduced motion, and shown at once when
// keyboard focus moves into it, so focus never lands on a hidden element.

import Image from "next/image";
import { Link } from "next-view-transitions";
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
// drawer's Contact covers it).
function DesktopNav() {
  return (
    <nav className="header-desktop-nav" aria-label="Primary navigation">
      {SITE_LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="header-nav-link">
          {link.label}
        </Link>
      ))}
      <Link href="/start" className="btn-primary header-cta" data-cursor="link" onClick={() => track("header_cta_click", { location: "header" })}>
        Plan your project
      </Link>
    </nav>
  );
}

// At 1080px and below: opens the drawer. Two lines; the drawer has its own close button.
function MenuButton({ buttonRef, open, onClick }: { buttonRef: React.RefObject<HTMLButtonElement | null>; open: boolean; onClick: () => void }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="header-mobile-hamburger"
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

  const className = `site-header${scrolled ? " site-header--scrolled" : ""}${hidden ? " site-header--hidden" : ""}`;
  return (
    <>
      <header className={className} onFocus={reveal}>
        {/* The wordmark is artwork (outlined letters), not text; its alt is the home link's name. */}
        <Link href="/" className="header-wordmark">
          <Image src="/hos-studios-wordmark.svg" alt="House of Singh Studios" width={1291} height={45} className="header-wordmark-img" unoptimized priority />
        </Link>
        <div className="header-spacer" />
        <DesktopNav />
        <MenuButton buttonRef={menuButtonRef} open={drawerOpen} onClick={drawerOpen ? closeDrawer : openDrawer} />
      </header>
      <MenuDrawer id={DRAWER_ID} open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
