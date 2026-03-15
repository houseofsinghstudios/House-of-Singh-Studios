"use client";

import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

const NEXT_PAGE_MAP: Record<string, { label: string; href: string }> = {
  "/": { label: "Work", href: "/work" },
  "/work": { label: "Services", href: "/services" },
  "/services": { label: "About", href: "/about" },
  "/about": { label: "Contact", href: "/contact" },
  "/contact": { label: "Home", href: "/" },
  "/insights": { label: "Work", href: "/work" },
  "/ai": { label: "Services", href: "/services" },
  "/packages": { label: "Contact", href: "/contact" },
  "/careers": { label: "Contact", href: "/contact" },
};

export default function FooterNextPage() {
  const pathname = usePathname();

  // Find the matching next page (exact match or prefix for dynamic routes)
  let nextPage = NEXT_PAGE_MAP[pathname];
  if (!nextPage) {
    if (pathname.startsWith("/work/")) {
      nextPage = { label: "Work", href: "/work" };
    } else if (pathname.startsWith("/services/")) {
      nextPage = { label: "Services", href: "/services" };
    } else if (pathname.startsWith("/insights/")) {
      nextPage = { label: "Insights", href: "/insights" };
    } else {
      nextPage = { label: "Home", href: "/" };
    }
  }

  return (
    <div className="footer-next-page">
      <div className="footer-next-page-inner">
        <span className="footer-next-page-label">Next Page</span>
        <Link
          href={nextPage.href}
          className="footer-next-page-link no-underline"
          data-cursor="link"
        >
          {nextPage.label} <span className="footer-next-page-arrow">&rarr;</span>
        </Link>
      </div>

      {/* CTA line */}
      <div className="footer-cta-line">
        <p className="footer-cta-text">
          We would love to hear from you. Let&apos;s work — together.
        </p>
        <Link
          href="/contact"
          className="arrow-link no-underline"
          data-cursor="link"
        >
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            Get in touch <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
