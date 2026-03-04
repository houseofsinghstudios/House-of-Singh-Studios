import Link from "next/link";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "AI Lab", href: "/ai" },
  { label: "Insights", href: "/insights" },
];

/**
 * Static Navigation — Phase 1
 * No scroll effects, no hamburger menu interaction.
 * Desktop: fixed bar with logotype + links + CTA.
 * Mobile: centered logotype + hamburger placeholder.
 */
export default function Navigation() {
  return (
    <header
      className="nav-bar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--page-px)",
        background: "transparent",
      }}
    >
      {/* Logotype */}
      <Link href="/" className="nav-logotype">
        House of Singh Studios
      </Link>

      {/* Desktop Nav Links */}
      <nav className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop CTA */}
      <Link href="/contact" className="nav-cta nav-cta-desktop">
        Start a Project
      </Link>

      {/* Mobile Hamburger (visual placeholder — no interaction in Phase 1) */}
      <div className="nav-hamburger" aria-label="Menu">
        <span className="nav-hamburger-line" />
        <span className="nav-hamburger-line" />
        <span className="nav-hamburger-line" />
      </div>
    </header>
  );
}
