import Link from "next/link";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
];

export default function Navigation() {
  return (
    <header className="nav-bar">
      <Link href="/" className="nav-logotype">
        HOUSE OF SINGH STUDIOS
      </Link>

      <nav className="nav-desktop-links">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
      </nav>

      <Link href="/contact" className="nav-cta nav-cta-desktop">
        Start a Project
      </Link>

      <div className="nav-hamburger" aria-label="Menu">
        <span className="nav-hamburger-line" />
        <span className="nav-hamburger-line" />
        <span className="nav-hamburger-line" />
      </div>
    </header>
  );
}
