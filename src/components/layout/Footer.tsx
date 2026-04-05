"use client";

import { Link } from "next-view-transitions";

const STUDIO_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI", href: "/ai" },
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

        <div className="ft-social-icons">
          <a href="https://instagram.com/houseofsinghstudios" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://linkedin.com/company/houseofsinghstudios" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a href="https://x.com/hosdesignstudio" target="_blank" rel="noopener noreferrer" aria-label="X">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l6.5 8L4 20h2l5.5-6.8L16 20h4l-6.8-8.3L20 4h-2l-5.2 6.3L8 4H4z"/>
            </svg>
          </a>
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
