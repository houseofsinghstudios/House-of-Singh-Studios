import { Link } from "next-view-transitions";

const studioLinks = [
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "AI", href: "/ai" },
  { label: "Journal", href: "/journal" },
];

const connectLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Instagram", href: "https://instagram.com/houseofsingh", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/company/houseofsingh", external: true },
];

export default function Footer() {
  return (
    <footer className="css-fade border-t border-[var(--border)] px-[var(--page-px)] pt-16 pb-10">
      <div className="footer-grid grid grid-cols-3 gap-12">
        {/* Column 1: Studio */}
        <div>
          <p className="footer-heading">Studio</p>
          <div className="flex flex-col gap-3">
            {studioLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Connect */}
        <div>
          <p className="footer-heading">Connect</p>
          <div className="flex flex-col gap-3">
            {connectLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Column 3: Location */}
        <div>
          <p className="footer-heading">Location</p>
          <div className="flex flex-col gap-2">
            <p className="footer-text">House of Singh Studios</p>
            <p className="footer-text">Toronto, Canada</p>
            <a href="mailto:hello@houseofsingh.com" className="footer-link">
              hello@houseofsingh.com
            </a>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="mt-14 pt-6 border-t border-[var(--border)] flex flex-col items-center gap-4">
        <p className="editorial-label">
          DESIGN STUDIO. AI POWERED. BRAND FOCUSED.
        </p>

        {/* Copyright bar — two columns */}
        <div className="w-full flex justify-between items-center footer-copyright-row">
          <p className="font-[var(--sans)] text-xs text-[color:var(--text-faint)]">
            &copy; 2026 House of Singh Studios Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="font-[var(--sans)] text-xs text-[color:var(--text-faint)] no-underline hover:text-[color:var(--text-primary)] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="font-[var(--sans)] text-xs text-[color:var(--text-faint)] no-underline hover:text-[color:var(--text-primary)] transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-heading {
          font-family: var(--sans);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--text-faint);
          margin-bottom: 20px;
        }
        .footer-link {
          font-family: var(--sans);
          font-size: 14px;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: var(--text-primary);
        }
        .footer-text {
          font-family: var(--sans);
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
        }
        @media (max-width: 699px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
