import { Link } from "next-view-transitions";
import FooterNextPage from "./FooterNextPage";
import FooterCities from "./FooterCities";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export default function Footer() {
  return (
    <footer className="footer-root css-fade">
      {/* 1. Next Page */}
      <FooterNextPage />

      <div className="footer-divider" />

      {/* 2. City Clocks */}
      <FooterCities />

      <div className="footer-divider" />

      {/* 3. Nav Row */}
      <div className="footer-nav-row">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="footer-nav-link">
            {link.label}
          </Link>
        ))}
      </div>

      <div className="footer-divider" />

      {/* 4. Copyright Bar */}
      <div className="footer-copy-bar">
        <span className="footer-copy-text">
          &copy; 2025 House of Singh Studios Inc.
        </span>
        <div className="footer-copy-social">
          <a
            href="https://instagram.com/houseofsingh"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-copy-social-link"
          >
            Instagram
          </a>
          <a
            href="https://linkedin.com/company/houseofsingh"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-copy-social-link"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
