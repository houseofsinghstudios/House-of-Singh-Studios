"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

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

const CITIES = [
  { name: "Toronto, Canada", abbr: "EST", email: "studio@houseofsingh.com" },
  { name: "Delhi, India", abbr: "IST", email: "studio@houseofsingh.com" },
  { name: "London, UK", abbr: "GMT", email: null },
];

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  const pathname = usePathname();
  const nextPage = getNextPage(pathname);

  return (
    <footer style={{ background: "#E0DEDA", borderTop: "1px solid #A9A6A2" }}>
      {/* Section 1: Next Page */}
      <div className="footer-container footer-next-section">
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

      {/* Divider */}
      <div className="footer-container">
        <div className="footer-divider" />
      </div>

      {/* Section 2: Timezone Row */}
      <div className="footer-container footer-tz-section">
        <div className="footer-tz-grid">
          {CITIES.map((city) => (
            <div key={city.name} className="footer-tz-col">
              <p className="footer-tz-label">{city.name}</p>
              {city.email ? (
                <p className="footer-tz-detail">
                  {city.abbr} &middot;{" "}
                  <a href={`mailto:${city.email}`}>{city.email}</a>
                </p>
              ) : (
                <p className="footer-tz-detail footer-tz-coming-soon">
                  Coming soon
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="footer-container">
        <div className="footer-divider" />
      </div>

      {/* Section 3: Nav Row */}
      <div className="footer-container footer-nav-section">
        <nav className="footer-nav-row">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="footer-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Section 4: Bottom Row — no divider above */}
      <div className="footer-container footer-bottom-section">
        <span className="footer-copyright-text">
          &copy; 2026 House of Singh Studios Inc.
        </span>
        <button
          className="footer-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          type="button"
        >
          Top &uarr;
        </button>
      </div>
    </footer>
  );
}
