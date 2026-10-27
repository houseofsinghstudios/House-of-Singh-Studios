"use client";

import { useSyncExternalStore } from "react";
import { Link } from "next-view-transitions";
import { CONSENT_COPY } from "@/lib/constants/consent";
import { CLARITY_HOST } from "@/lib/constants/clarity";
import { PRIVACY_CHOICES_EVENT } from "@/components/consent/ConsentManager";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";

// Three columns of four, grouped by what the visitor wants: the work, the studio, a way to start.
const STUDIO_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Initiatives", href: "/initiatives" },
  { label: "Partners", href: "/partners" },
  { label: "Careers", href: "/careers" },
];

const START_LINKS = [
  { label: "Plan Your Project", href: "/start" },
  { label: "Brand Pulse Check", href: "/brand-pulse" },
  { label: "Book a Discovery Call", href: DISCOVERY_CALL_URL, external: true },
  { label: "Contact", href: "/contact" },
];

const COLUMNS = [
  { heading: "Studio", links: STUDIO_LINKS },
  { heading: "Company", links: COMPANY_LINKS },
  { heading: "Start", links: START_LINKS },
];

const SOCIAL = [
  {
    name: "Instagram",
    href: "https://instagram.com/houseofsinghstudios",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/houseofsinghstudios",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </>
    ),
  },
  {
    name: "X",
    href: "https://x.com/hosdesignstudio",
    icon: <path d="M4 4l6.5 8L4 20h2l5.5-6.8L16 20h4l-6.8-8.3L20 4h-2l-5.2 6.3L8 4H4z"/>,
  },
];

const noSubscribe = () => () => {};
// The consent notice and Privacy choices exist only where analytics run: production, on the real site.
function useConsentActive(enabled: boolean) {
  return useSyncExternalStore(noSubscribe, () => enabled && window.location.hostname === CLARITY_HOST, () => false);
}

export default function Footer({ consentEnabled = false }: { consentEnabled?: boolean }) {
  const consentActive = useConsentActive(consentEnabled);
  return (
    <footer className="ft-footer">
      <div className="ft-body">
        <div className="ft-top">
          {/* The tagline with the social icons under it. On tablets and phones the tagline is hidden and
              the icon row follows the link columns. */}
          <div className="ft-tagline-col">
            <p className="ft-tagline">
              Strategy.<br />
              Identity.<br />
              Direction.
            </p>
            <div className="ft-social-icons">
              {SOCIAL.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`House of Singh Studios on ${social.name}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="ft-columns">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="ft-col">
                <p className="ft-col-head">{col.heading}</p>
                {col.links.map((l) =>
                  "external" in l ? (
                    <a key={l.href} href={l.href} className="ft-col-link" target="_blank" rel="noopener noreferrer">{l.label}</a>
                  ) : (
                    <Link key={l.href} href={l.href} className="ft-col-link">{l.label}</Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-copyright">&copy; 2026 House of Singh Studios Inc.</span>
          <div className="ft-legal">
            <Link href="/privacy" className="ft-legal-link">Privacy Policy</Link>
            {consentActive && (
              <button type="button" className="ft-legal-link ft-legal-button" onClick={() => window.dispatchEvent(new Event(PRIVACY_CHOICES_EVENT))}>
                {CONSENT_COPY.footerLink}
              </button>
            )}
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
