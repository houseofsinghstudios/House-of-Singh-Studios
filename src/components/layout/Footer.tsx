"use client";

import { useState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

/* ── Next-page routing ── */

const NEXT_PAGE_MAP: Record<string, { name: string; href: string }> = {
  "/": { name: "Services", href: "/services" },
  "/services": { name: "Work", href: "/work" },
  "/work": { name: "About", href: "/about" },
  "/about": { name: "Contact", href: "/contact" },
  "/contact": { name: "Services", href: "/services" },
  "/ai": { name: "Packages", href: "/packages" },
  "/packages": { name: "Contact", href: "/contact" },
  "/insights": { name: "Services", href: "/services" },
  "/careers": { name: "About", href: "/about" },
};

const DEFAULT_NEXT = { name: "Contact", href: "/contact" };

function getNextPage(pathname: string) {
  const exact = NEXT_PAGE_MAP[pathname];
  if (exact) return exact;
  if (pathname.startsWith("/services/"))
    return { name: "Work", href: "/work" };
  if (pathname.startsWith("/work/"))
    return { name: "Contact", href: "/contact" };
  if (pathname.startsWith("/insights/"))
    return { name: "Insights", href: "/insights" };
  return DEFAULT_NEXT;
}

/* ── Live clock ── */

function LiveClock({ tz }: { tz: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    function update() {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: tz,
        }).format(new Date())
      );
    }
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [tz]);
  return <span>{time || "—"}</span>;
}

/* ── Data ── */

const STUDIO_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Packages", href: "/packages" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const CONNECT_LINKS = [
  { label: "Instagram", href: "https://instagram.com/houseofsinghstudios" },
  { label: "LinkedIn", href: "https://linkedin.com/company/houseofsinghstudios" },
  { label: "X / Twitter", href: "https://x.com/hosdesignstudio" },
];

const LOCATIONS = [
  { city: "Toronto", tz: "America/Toronto" },
  { city: "Delhi", tz: "Asia/Kolkata" },
  { city: "London", tz: "Europe/London" },
];

/* ── Component ── */

export default function Footer() {
  const pathname = usePathname();
  const nextPage = getNextPage(pathname);

  return (
    <footer className="ft-footer">
      {/* ── Next page section ── */}
      <div className="ft-next">
        <Link href={nextPage.href} className="ft-next-link" data-cursor="link">
          <span className="ft-next-label">Next</span>
          <span className="ft-next-name">
            {nextPage.name}
            <svg
              className="ft-next-arrow"
              width="32"
              height="32"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 40 L40 8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 8 L40 8 L40 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>

      {/* ── Footer body ── */}
      <div className="ft-body">
        {/* Top: tagline + link columns */}
        <div className="ft-top">
          <div className="ft-tagline-col">
            <p className="ft-tagline">
              Strategy.<br />
              Identity.<br />
              Direction.
            </p>
          </div>
          <div className="ft-columns">
            <div className="ft-col">
              <p className="ft-col-head">Studio</p>
              {STUDIO_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="ft-col-link">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="ft-col">
              <p className="ft-col-head">Company</p>
              {COMPANY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="ft-col-link">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="ft-col">
              <p className="ft-col-head">Connect</p>
              {CONNECT_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="ft-col-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="ft-locations">
          {LOCATIONS.map((loc) => (
            <span key={loc.city} className="ft-loc">
              {loc.city} — <LiveClock tz={loc.tz} />
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="ft-bottom">
          <span className="ft-copyright">
            &copy; 2026 House of Singh Studios Inc.
          </span>
          <div className="ft-legal">
            <Link href="/privacy" className="ft-legal-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="ft-legal-link">
              Terms
            </Link>
          </div>
          <button
            className="ft-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            type="button"
          >
            Top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
