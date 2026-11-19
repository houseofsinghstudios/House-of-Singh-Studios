"use client";
// The phone and tablet menu (1080px and below): a drawer from the right over a scrim. A client
// component because it handles focus, keys, touch and the scroll lock while it is open.
//
// Opens from the header's menu button. Closes on the X, the scrim, Escape, a link, or a swipe to the
// right of more than 60px. While open it is a modal dialog: the page behind is inert and does not
// scroll (Lenis is paused too), focus starts on the close button and Tab stays inside the drawer.
// Focus returns to the menu button on close (Header's onClose). Always rendered, so the menu button's
// aria-controls always points at it; inert while closed.

import { Link } from "next-view-transitions";
import { useEffect, useRef } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";
import { SITE_LINKS } from "./site-links";
import TorontoTime from "./TorontoTime";

// The header's pages, then Contact (on desktop it has no link in the header).
const DRAWER_LINKS = [...SITE_LINKS, { label: "Contact", href: "/contact" }];

// Everything outside the drawer that can take focus. Inert while the drawer is open.
const OUTSIDE = "header.site-header, main, footer, .ft-reveal, .skip-link";
const SWIPE_CLOSE_PX = 60;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type LenisWindow = Window & { __lenis?: { stop: () => void; start: () => void } };

// While open: the page behind is inert and still, Escape closes, Tab wraps inside the drawer.
function useModal(open: boolean, panel: React.RefObject<HTMLDivElement | null>, close: React.RefObject<HTMLButtonElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const outside = [...document.querySelectorAll<HTMLElement>(OUTSIDE)];
    for (const el of outside) el.inert = true;
    const lenis = (window as LenisWindow).__lenis;
    lenis?.stop();
    document.body.classList.add("nav-open");
    const focusFrame = requestAnimationFrame(() => close.current?.focus({ preventScroll: true }));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
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
  }, [open, panel, close, onClose]);
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

export default function MenuDrawer({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModal(open, panelRef, closeRef, onClose);
  const swipe = useSwipeRight(onClose);

  return (
    <>
      <div className="menu-scrim" data-open={open} onClick={onClose} aria-hidden="true" />
      <div
        id={id}
        ref={panelRef}
        className="menu-drawer"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        data-lenis-prevent
        onTouchStart={swipe.onTouchStart}
        onTouchEnd={swipe.onTouchEnd}
      >
        <div className="menu-drawer-top">
          <button ref={closeRef} type="button" className="menu-drawer-close" onClick={onClose} aria-label="Close menu" />
        </div>
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
