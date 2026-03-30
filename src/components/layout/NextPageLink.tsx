"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

const NEXT_MAP: Record<string, { name: string; href: string }> = {
  "/": { name: "Services", href: "/services" },
  "/services": { name: "Work", href: "/work" },
  "/work": { name: "Contact", href: "/contact" },
  "/about": { name: "Contact", href: "/contact" },
  "/contact": { name: "Work", href: "/work" },
  "/ai": { name: "Services", href: "/services" },
  "/packages": { name: "Contact", href: "/contact" },
  "/insights": { name: "Services", href: "/services" },
  "/careers": { name: "About", href: "/about" },
};

const DEFAULT_NEXT = { name: "Contact", href: "/contact" };

function getNextPage(pathname: string) {
  const exact = NEXT_MAP[pathname];
  if (exact) return exact;
  if (pathname.startsWith("/services/")) return { name: "Work", href: "/work" };
  if (pathname.startsWith("/work/")) return { name: "Contact", href: "/contact" };
  if (pathname.startsWith("/insights/")) return { name: "Services", href: "/services" };
  return DEFAULT_NEXT;
}

export default function NextPageLink() {
  const pathname = usePathname();
  const next = getNextPage(pathname);

  return (
    <div className="next-page-link">
      <span className="next-page-label">Next</span>
      <Link href={next.href} className="next-page-anchor" data-cursor="link">
        <span className="next-page-name">{next.name}</span>
        <svg className="next-page-arrow" width="32" height="32" viewBox="0 0 48 48" fill="none">
          <path d="M8 40 L40 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 8 L40 8 L40 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
