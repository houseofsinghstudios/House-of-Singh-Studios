import { Link } from "next-view-transitions";
import SubscribeForm from "./SubscribeForm";
import FooterNextPage from "./FooterNextPage";
import Button from "@/components/ui/Button";

const pageLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
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
  { label: "Email", href: "mailto:studio@houseofsingh.com", external: false },
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
      {/* 1. Next Page navigation */}
      <FooterNextPage />

      {/* 2. Divider is border-bottom on .footer-next-page */}

      {/* 3. CTA row */}
      <div className="footer-cta-line">
        <p className="footer-cta-text">
          We would love to hear from you. Let&apos;s work &mdash; together.
        </p>
        <Link
          href="/contact"
          className="arrow-link no-underline"
          data-cursor="link"
        >
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            Get in touch <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>

      {/* 4. Divider is border-bottom on .footer-cta-line */}

      {/* 5. Footer main content: CTA left + Contact details right */}
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

      {/* 6. Divider is border-bottom on .footer-cta-section */}

      {/* 7. Subscribe section */}
      <div className="footer-subscribe-section">
        <h2 className="footer-subscribe-heading">Stay in the loop.</h2>
        <p className="footer-subscribe-sub">
          Studio updates, new work, and the occasional perspective on brand and
          design.
        </p>
        <SubscribeForm />
      </div>

      {/* 8. Divider is border-bottom on .footer-subscribe-section */}

      {/* 9. Navigation columns (Pages, Services, Connect) */}
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

      {/* 10. Divider is border-top on .footer-copyright-bar */}

      {/* 11. Copyright bar with social links */}
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
