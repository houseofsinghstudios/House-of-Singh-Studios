"use client";

import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

const NEXT_PAGE_MAP: Record<string, { label: string; href: string; teaser: string }> = {
  "/": { label: "Services", href: "/services", teaser: "Four capabilities built to solve business problems, not just look good." },
  "/services": { label: "Work", href: "/work", teaser: "Real projects. Real results. See what we have built." },
  "/work": { label: "About", href: "/about", teaser: "How the studio operates, who built it, and why it works." },
  "/about": { label: "Contact", href: "/contact", teaser: "Start a conversation about your brand." },
  "/contact": { label: "Services", href: "/services", teaser: "Four capabilities built to solve business problems, not just look good." },
  "/ai": { label: "Packages", href: "/packages", teaser: "Clear scope. Defined deliverables. Fixed pricing." },
  "/packages": { label: "Contact", href: "/contact", teaser: "Start a conversation about your brand." },
  "/insights": { label: "Services", href: "/services", teaser: "Four capabilities built to solve business problems, not just look good." },
  "/careers": { label: "About", href: "/about", teaser: "How the studio operates, who built it, and why it works." },
};

export default function FooterNextPage() {
  const pathname = usePathname();

  let nextPage = NEXT_PAGE_MAP[pathname];
  if (!nextPage) {
    if (pathname.startsWith("/work/")) {
      nextPage = { label: "Contact", href: "/contact", teaser: "Start a conversation about your brand." };
    } else if (pathname.startsWith("/services/")) {
      nextPage = { label: "Work", href: "/work", teaser: "Real projects. Real results. See what we have built." };
    } else if (pathname.startsWith("/insights/")) {
      nextPage = { label: "Insights", href: "/insights", teaser: "More thinking on brand, design, and creative systems." };
    } else {
      nextPage = { label: "Services", href: "/services", teaser: "Four capabilities built to solve business problems, not just look good." };
    }
  }

  return (
    <Link href={nextPage.href} className="footer-next-page" data-cursor="link">
      <div className="footer-next-left">
        <span className="footer-next-label">Next</span>
        <p className="footer-next-desc">{nextPage.teaser}</p>
      </div>
      <div className="footer-next-right">
        <span className="footer-next-name">{nextPage.label}</span>
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
    </Link>
  );
}
