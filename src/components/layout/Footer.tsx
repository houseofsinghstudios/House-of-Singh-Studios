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
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--text-faint)",
              marginBottom: 20,
            }}
          >
            Studio
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {studioLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--text-primary)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Connect */}
        <div>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--text-faint)",
              marginBottom: 20,
            }}
          >
            Connect
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {connectLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Column 3: Studio info */}
        <div>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--text-faint)",
              marginBottom: 20,
            }}
          >
            Studio
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              House of Singh Studios
            </p>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 14,
                color: "var(--text-muted)",
              }}
            >
              Toronto, Canada
            </p>
            <a
              href="mailto:hello@houseofsingh.com"
              style={{
                fontFamily: "var(--sans)",
                fontSize: 14,
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
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
        }}
      >
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 12,
            color: "var(--text-faint)",
          }}
        >
          &copy; 2025 House of Singh Studios Inc.
        </p>
      </div>

      <style>{`
        @media (max-width: 699px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
