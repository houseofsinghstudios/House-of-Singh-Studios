"use client";

import { useState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

/* ── Next-page routing ── */

const NEXT_PAGE_MAP: Record<
  string,
  { name: string; href: string; teaser: string }
> = {
  "/": {
    name: "Services",
    href: "/services",
    teaser:
      "Four capabilities built to solve business problems, not just look good.",
  },
  "/services": {
    name: "Work",
    href: "/work",
    teaser: "Real projects. Real results. See what we have built.",
  },
  "/work": {
    name: "About",
    href: "/about",
    teaser: "How the studio operates, who built it, and why it works.",
  },
  "/about": {
    name: "Contact",
    href: "/contact",
    teaser: "Start a conversation about your brand.",
  },
  "/contact": {
    name: "Services",
    href: "/services",
    teaser:
      "Four capabilities built to solve business problems, not just look good.",
  },
  "/ai": {
    name: "Packages",
    href: "/packages",
    teaser: "Clear scope. Defined deliverables. Fixed pricing.",
  },
  "/packages": {
    name: "Contact",
    href: "/contact",
    teaser: "Start a conversation about your brand.",
  },
  "/insights": {
    name: "Services",
    href: "/services",
    teaser:
      "Four capabilities built to solve business problems, not just look good.",
  },
  "/careers": {
    name: "About",
    href: "/about",
    teaser: "How the studio operates, who built it, and why it works.",
  },
};

const DEFAULT_NEXT = {
  name: "Contact",
  href: "/contact",
  teaser: "Start a conversation about your brand.",
};

function getNextPage(pathname: string) {
  const exact = NEXT_PAGE_MAP[pathname];
  if (exact) return exact;
  if (pathname.startsWith("/services/"))
    return {
      name: "Work",
      href: "/work",
      teaser: "Real projects. Real results. See what we have built.",
    };
  if (pathname.startsWith("/work/"))
    return {
      name: "Contact",
      href: "/contact",
      teaser: "Start a conversation about your brand.",
    };
  if (pathname.startsWith("/insights/"))
    return {
      name: "Insights",
      href: "/insights",
      teaser: "More thinking on brand, design, and creative systems.",
    };
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
  return <span className="ft-loc-time">{time || "—"}</span>;
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
];

/* ── Component ── */

export default function Footer() {
  const pathname = usePathname();
  const nextPage = getNextPage(pathname);

  return (
    <footer>
      {/* ── Beige next-page section ── */}
      <div className="ft-next-wrap">
        <div className="ft-next-inner">
          <Link href={nextPage.href} className="footer-next-link" data-cursor="link">
            <div className="footer-next-grid">
              <div className="footer-next-left">
                <span className="footer-next-label">Next</span>
                <p className="footer-next-desc">{nextPage.teaser}</p>
              </div>
              <div className="footer-next-right">
                <span className="footer-next-name">{nextPage.name}</span>
                <svg
                  className="footer-next-arrow"
                  width="40"
                  height="40"
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
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Dark footer ── */}
      <div className="ft-dark">
        <div className="ft-dark-inner">
          {/* Top: brand + link columns */}
          <div className="ft-dark-top">
            <div className="ft-brand">
              <img
                src="/hos-studios-logo.svg"
                alt="House of Singh Studios"
                className="ft-brand-crest"
                width={72}
                height={60}
              />
              <p className="ft-brand-tagline">
                Design studio.<br />
                AI powered. Brand focused.
              </p>
              <p className="ft-brand-muted">
                Strategy, identity, digital&nbsp;&amp;&nbsp;motion — delivered through
                creative direction and artificial intelligence.
              </p>
            </div>

            <div className="ft-links">
              {/* Studio column */}
              <div className="ft-link-col">
                <p className="ft-link-head">Studio</p>
                {STUDIO_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="ft-link">
                    {l.label}
                  </Link>
                ))}
              </div>

              {/* Company column */}
              <div className="ft-link-col">
                <p className="ft-link-head">Company</p>
                {COMPANY_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="ft-link">
                    {l.label}
                  </Link>
                ))}
              </div>

              {/* Connect column */}
              <div className="ft-link-col">
                <p className="ft-link-head">Connect</p>
                {CONNECT_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="ft-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                ))}
                <p className="ft-link-note">Available for new projects</p>
              </div>
            </div>
          </div>

          {/* Locations row */}
          <div className="ft-locs">
            <p className="ft-link-head">Locations</p>
            <div className="ft-locs-row">
              {LOCATIONS.map((loc) => (
                <span key={loc.city} className="ft-loc">
                  {loc.city} — <LiveClock tz={loc.tz} />
                </span>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="ft-bottom">
            <a href="mailto:studio@houseofsingh.com" className="ft-email">
              studio@houseofsingh.com
              <svg
                className="ft-email-arrow"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7v10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <span className="ft-copy">
              &copy; 2026 House of Singh Studios Inc.
            </span>
            <button
              className="ft-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              type="button"
            >
              Top &uarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
