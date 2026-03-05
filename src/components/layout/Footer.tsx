import Link from "next/link";

const pageLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Brand Identity", href: "/services/brand-identity" },
  { label: "Visual Media", href: "/services/visual-media" },
  { label: "Digital Design", href: "/services/digital-design" },
  { label: "Creative Strategy", href: "/services/creative-strategy" },
];

const connectLinks = [
  { label: "hello@houseofsingh.com", href: "mailto:hello@houseofsingh.com" },
  { label: "Instagram", href: "https://instagram.com/houseofsingh", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/company/houseofsingh", external: true },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Column 1: Studio */}
        <div>
          <p className="footer-studio-name">HOUSE OF SINGH STUDIOS</p>
          <p className="footer-studio-tagline">
            Design studio. AI powered. Brand focused.
          </p>
        </div>

        {/* Column 2: Pages */}
        <div>
          <p className="footer-heading">Pages</p>
          <div className="footer-link-list">
            {pageLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Services */}
        <div>
          <p className="footer-heading">Services</p>
          <div className="footer-link-list">
            {serviceLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 4: Connect */}
        <div>
          <p className="footer-heading">Connect</p>
          <div className="footer-link-list">
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
                <a key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; 2025 House of Singh Studios Inc.
        </p>
        <p className="footer-location">Toronto, Canada</p>
      </div>
    </footer>
  );
}
