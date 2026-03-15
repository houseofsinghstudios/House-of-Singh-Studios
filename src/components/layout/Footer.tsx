import { Link } from "next-view-transitions";
import SubscribeForm from "./SubscribeForm";
import FooterNextPage from "./FooterNextPage";
import Button from "@/components/ui/Button";

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

const socialLinks = [
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
  { label: "Email", href: "mailto:studio@houseofsingh.com", external: false },
];

export default function Footer() {
  return (
    <footer className="footer-root css-fade px-[var(--page-px)] pt-0 pb-0">
      {/* Next Page navigation */}
      <FooterNextPage />

      {/* ROW 1: CTA + Contact Details */}
      <div className="footer-cta-section">
        <div className="footer-cta-left">
          <h2
            className="font-[var(--sans)] font-medium text-[color:var(--text-primary)] m-0"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            We would love to hear from you.
            <br />
            Let&rsquo;s work &mdash; together.
          </h2>
          <div style={{ marginTop: 28 }}>
            <Button href="/contact" variant="primary" data-cursor="link">
              Contact us
            </Button>
          </div>
        </div>

        <div className="footer-contact-grid">
          <div className="footer-contact-block">
            <p className="footer-contact-label">Business Enquiries</p>
            <a
              href="mailto:studio@houseofsingh.com"
              className="footer-contact-value"
            >
              studio@houseofsingh.com
            </a>
          </div>
          <div className="footer-contact-block">
            <p className="footer-contact-label">Business Hours</p>
            <p className="footer-contact-value">
              Monday to Friday
              <br />
              9am &mdash; 6pm EST
            </p>
          </div>
          <div className="footer-contact-block">
            <p className="footer-contact-label">Location</p>
            <p className="footer-contact-value">Toronto, Canada</p>
          </div>
        </div>
      </div>

      {/* ROW 2: Subscribe */}
      <div className="footer-subscribe-section">
        <h2 className="footer-subscribe-heading">Stay in the loop.</h2>
        <p className="footer-subscribe-sub">
          Studio updates, new work, and the occasional perspective on brand and
          design.
        </p>
        <SubscribeForm />
      </div>

      {/* ROW 3: Navigation columns */}
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
      </div>

      {/* ROW 4: Copyright bar with social links */}
      <div className="footer-copyright-bar">
        <span className="footer-copy-text">
          &copy; 2026 House of Singh Studios Inc.
        </span>
        <div className="footer-social-links">
          {socialLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                {link.label}
              </a>
            ) : (
              <a key={link.href} href={link.href} className="footer-social-link">
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
