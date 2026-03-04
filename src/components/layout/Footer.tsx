import Link from "next/link";

const pageLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
];

const serviceLinks = [
  { label: "Brand Identity", href: "/services/brand-identity" },
  { label: "Visual Media", href: "/services/visual-media" },
  { label: "Digital Design", href: "/services/digital-design" },
  { label: "Creative Strategy", href: "/services/creative-strategy" },
];

const connectLinks = [
  { label: "Contact", href: "/contact" },
  {
    label: "Instagram",
    href: "https://instagram.com/houseofsingh",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/houseofsingh",
    external: true,
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Column 1: Studio */}
        <div className="footer-col">
          <p className="footer-heading">Studio</p>
          <p className="footer-text">House of Singh Studios</p>
          <p className="footer-text">Toronto, Canada</p>
          <a href="mailto:hello@houseofsingh.com" className="footer-link">
            hello@houseofsingh.com
          </a>
        </div>

        {/* Column 2: Pages */}
        <div className="footer-col">
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
        <div className="footer-col">
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
        <div className="footer-col">
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
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; 2026 House of Singh Studios Inc. All rights reserved.
        </p>
        <div className="footer-legal">
          <Link href="/terms" className="footer-legal-link">
            Terms
          </Link>
          <Link href="/privacy" className="footer-legal-link">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
