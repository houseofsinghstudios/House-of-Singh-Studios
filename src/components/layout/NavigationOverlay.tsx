"use client";

import { useEffect, useRef, useCallback } from "react";
import { Link } from "next-view-transitions";

const overlayLinks = [
  { label: "Services", href: "/services", count: "(04)" },
  { label: "Work", href: "/work", count: "(04)" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights", count: "(01)" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
];

interface NavigationOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function NavigationOverlay({ open, onClose }: NavigationOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  /* ── Focus trap ── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = [
        closeBtnRef.current,
        ...linkRefs.current.filter(Boolean),
      ].filter(Boolean) as HTMLElement[];

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    // Focus the close button when overlay opens
    const t = setTimeout(() => closeBtnRef.current?.focus(), 100);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(t);
    };
  }, [open, handleKeyDown]);

  return (
    <div
      ref={overlayRef}
      className={`nav-overlay${open ? " nav-overlay--open" : ""}`}
      aria-hidden={!open}
    >
      {/* Overlay header bar */}
      <div className="nav-overlay-header">
        <Link
          href="/"
          onClick={onClose}
          className="nav-overlay-wordmark"
        >
          House of Singh Studios
        </Link>
        <button
          ref={closeBtnRef}
          className="nav-overlay-close"
          onClick={onClose}
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
        >
          Close
        </button>
      </div>

      {/* Navigation links */}
      <nav className="nav-overlay-links">
        {overlayLinks.map((link, i) => (
          <Link
            key={link.href}
            ref={(el) => { linkRefs.current[i] = el; }}
            href={link.href}
            onClick={onClose}
            className="nav-overlay-link"
            style={{ "--link-index": i } as React.CSSProperties}
            tabIndex={open ? 0 : -1}
            data-cursor="link"
          >
            <span className="nav-overlay-link-label">{link.label}</span>
            {link.count && (
              <span className="nav-overlay-link-count">{link.count}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom info */}
      <div className="nav-overlay-footer">
        <span className="nav-overlay-footer-item">studio@houseofsingh.com</span>
        <span className="nav-overlay-footer-item">Toronto, Canada</span>
      </div>
    </div>
  );
}
