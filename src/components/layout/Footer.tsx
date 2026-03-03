import Link from "next/link";

const studioLinks = [
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
];

const connectLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Instagram", href: "https://instagram.com/houseofsingh", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/company/houseofsingh", external: true },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "64px var(--page-px) 40px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 48,
        }}
        className="footer-grid"
      >
        {/* Column 1: Studio */}
        <div>
          <p className="footer-heading">Studio</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {studioLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="footer-link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Connect */}
        <div>
          <p className="footer-heading">Connect</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer-link"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Column 3: Studio info */}
        <div>
          <p className="footer-heading">Studio</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p className="footer-text">House of Singh Studios</p>
            <p className="footer-text">Toronto, Canada</p>
            <a href="mailto:hello@houseofsingh.com" className="footer-link">
              hello@houseofsingh.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: 56,
          paddingTop: 24,
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <p className="editorial-label">
          Design studio. AI powered. Brand focused.
        </p>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 12,
            color: "var(--text-faint)",
          }}
        >
          &copy; {new Date().getFullYear()} House of Singh Studios Inc. All rights reserved.
        </p>
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
