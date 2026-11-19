"use client";
// The phone and tablet menu (1080px and below): a drawer from the right over a scrim. A client
// component because it handles focus, keys, touch and the scroll lock while it is open.
//
// Opens and closes from the header's menu button, which stays above the drawer and turns into a cross:
// one control, in one place. Also closes on the scrim, Escape, a link, or a swipe to the right of more
// than 60px. A disclosure, not a dialog: the menu button (outside the drawer) controls it, so the
// drawer is a named region, not a dialog: role="dialog" with aria-modal would hide that button from
// screen readers.
// While open, everything else is inert (the rest of the header included), so the page behind cannot
// be reached by keyboard or screen reader, and it does not scroll (Lenis is paused too). Focus goes
// to the menu button, and Tab wraps between it and the drawer's links. Always rendered, so the menu
// button's aria-controls always points at it; inert while closed.

import { Link } from "next-view-transitions";
import { useEffect, useRef } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";
import { SITE_LINKS } from "./site-links";
import TorontoTime from "./TorontoTime";

// The header's pages, then Contact (on desktop it has no link in the header).
const DRAWER_LINKS = [...SITE_LINKS, { label: "Contact", href: "/contact" }];

// Everything outside the drawer that can take focus, except the menu button. Inert while open.
const OUTSIDE = "header.site-header > :not(.header-mobile-hamburger), main, footer, .ft-reveal, .skip-link";
const SWIPE_CLOSE_PX = 60;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type LenisWindow = Window & { __lenis?: { stop: () => void; start: () => void } };

// While open: the page behind is inert and still, Escape closes, Tab wraps between the menu button
// and the drawer's links.
function useModal(open: boolean, panel: React.RefObject<HTMLDivElement | null>, toggle: React.RefObject<HTMLButtonElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const outside = [...document.querySelectorAll<HTMLElement>(OUTSIDE)];
    for (const el of outside) el.inert = true;
    const lenis = (window as LenisWindow).__lenis;
    lenis?.stop();
    document.body.classList.add("nav-open");
    const focusFrame = requestAnimationFrame(() => toggle.current?.focus({ preventScroll: true }));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = [toggle.current, ...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el): el is HTMLElement => !!el);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      for (const el of outside) el.inert = false;
      document.body.classList.remove("nav-open");
      lenis?.start();
    };
  }, [open, panel, toggle, onClose]);
}

// A swipe to the right closes: more than 60px across, and more across than down.
function useSwipeRight(onSwipe: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const from = start.current;
    start.current = null;
    if (!from) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x;
    if (dx > SWIPE_CLOSE_PX && Math.abs(dx) > Math.abs(t.clientY - from.y)) onSwipe();
  };
  return { onTouchStart, onTouchEnd };
}

// The foot of the drawer: where the studio is, and its time there now.
function DrawerFoot({ open }: { open: boolean }) {
  return (
    <div className="menu-drawer-foot">
      <div>
        <EditorialLabel text="Studio" className="menu-drawer-label" />
        <span className="menu-drawer-value">Toronto, Canada</span>
      </div>
      <div>
        <EditorialLabel text="Local time" className="menu-drawer-label" />
        <TorontoTime active={open} />
      </div>
    </div>
  );
}

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
  // The header's menu button: the drawer's one open and close control.
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}

export default function MenuDrawer({ id, open, onClose, toggleRef }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModal(open, panelRef, toggleRef, onClose);
  const swipe = useSwipeRight(onClose);

  return (
    <>
      <div className="menu-scrim" data-open={open} onClick={onClose} aria-hidden="true" />
      <div
        id={id}
        ref={panelRef}
        className="menu-drawer"
        data-open={open}
        // A named region, so all of it (the links and the studio's place and time) sits in a landmark.
        role="region"
        aria-label="Menu"
        inert={!open}
        data-lenis-prevent
        onTouchStart={swipe.onTouchStart}
        onTouchEnd={swipe.onTouchEnd}
      >
        <nav className="menu-drawer-links" aria-label="Site pages">
          {DRAWER_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav-link"
              onClick={onClose}
              style={{ "--i": i } as React.CSSProperties}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <DrawerFoot open={open} />
      </div>
    </>
  );
}
