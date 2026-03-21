"use client";

import { useState, useEffect } from "react";
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
  { name: "Toronto, Canada", tz: "America/Toronto", email: "studio@houseofsingh.com" },
  { name: "Delhi, India", tz: "Asia/Kolkata", email: "studio@houseofsingh.com" },
  { name: "London, UK", tz: "Europe/London", email: null },
];

function formatTime(tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(new Date());
}

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export default function Footer() {
  const pathname = usePathname();
  const nextPage = getNextPage(pathname);

  const [times, setTimes] = useState(() =>
    CITIES.map((c) => formatTime(c.tz))
  );

  useEffect(() => {
    const update = () => setTimes(CITIES.map((c) => formatTime(c.tz)));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer style={{ background: "#E0DEDA", borderTop: "1px solid #E5E3E0" }}>
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

      {/* Section 2: City Clocks */}
      <div className="footer-container footer-cities-section">
        <div className="footer-cities-grid">
          {CITIES.map((city, i) => {
            const [hours, minutes] = times[i].split(":");
            return (
              <div key={city.name} className="footer-city">
                <p className="footer-city-name">{city.name}</p>
                <p className="footer-city-time">
                  {hours}
                  <span className="footer-clock-colon">:</span>
                  {minutes}
                </p>
                {city.email ? (
                  <p className="footer-city-detail">
                    <a href={`mailto:${city.email}`}>{city.email}</a>
                  </p>
                ) : (
                  <p className="footer-city-detail" style={{ fontStyle: "italic", color: "#A9A6A2" }}>
                    Coming soon
                  </p>
                )}
              </div>
            );
          })}
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
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <div className="footer-container">
        <div className="footer-divider" />
      </div>

      {/* Section 4: Copyright */}
      <div className="footer-container footer-copyright-section">
        <span className="footer-copyright-text">
          &copy; 2025 House of Singh Studios Inc.
        </span>
        <div className="footer-social-links">
          <a
            href="https://instagram.com/houseofsinghstudios"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com/company/houseofsinghstudios"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
