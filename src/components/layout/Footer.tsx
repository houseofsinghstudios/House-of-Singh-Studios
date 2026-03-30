"use client";

import { Link } from "next-view-transitions";

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

export default function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-body">
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
                <Link key={l.href} href={l.href} className="ft-col-link">{l.label}</Link>
              ))}
            </div>
            <div className="ft-col">
              <p className="ft-col-head">Company</p>
              {COMPANY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="ft-col-link">{l.label}</Link>
              ))}
            </div>
            <div className="ft-col">
              <p className="ft-col-head">Connect</p>
              {CONNECT_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="ft-col-link" target="_blank" rel="noopener noreferrer">{l.label}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <span className="ft-copyright">&copy; 2026 House of Singh Studios Inc.</span>
          <div className="ft-legal">
            <Link href="/privacy" className="ft-legal-link">Privacy Policy</Link>
            <Link href="/terms" className="ft-legal-link">Terms</Link>
          </div>
          <button className="ft-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} type="button">
            Top &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
