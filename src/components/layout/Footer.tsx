import { Link } from "next-view-transitions";
import SubscribeForm from "./SubscribeForm";

const pageLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Journal", href: "/insights" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Packages", href: "/packages" },
  { label: "Careers", href: "/careers" },
];

const serviceLinks = [
  { label: "Brand Identity", href: "/services/brand-identity" },
  { label: "Visual Media", href: "/services/visual-media" },
  { label: "Digital Design", href: "/services/digital-design" },
  { label: "Creative Strategy", href: "/services/creative-strategy" },
];

const connectLinks = [
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
  { label: "Email", href: "mailto:studio@houseofsingh.com" },
];

export default function Footer() {
  return (
    <footer className="footer-root css-fade px-[var(--page-px)] pt-20 pb-0">
      {/* ROW 1: Subscribe */}
      <div className="footer-subscribe-section">
        <h2 className="footer-subscribe-heading">Stay in the loop.</h2>
        <p className="footer-subscribe-sub">
          Studio updates, new work, and the occasional perspective on brand and
          design.
        </p>
        <SubscribeForm />
      </div>

      {/* ROW 2: Navigation columns */}
      <div className="footer-nav-grid">
        {/* Pages */}
        <div>
          <p className="footer-heading">Pages</p>
          <div className="flex flex-col">
            {pageLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="footer-heading">Services</p>
          <div className="flex flex-col">
            {serviceLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div>
          <p className="footer-heading">Connect</p>
          <div className="flex flex-col">
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

      {/* ROW 3: Copyright bar */}
      <div className="footer-copyright-bar">
        <span className="footer-copy-text">
          &copy; 2026 House of Singh Studios Inc.
        </span>
        <span className="footer-copy-text">Toronto, Canada</span>
      </div>
    </footer>
  );
}
