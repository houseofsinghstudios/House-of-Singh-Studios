import { Link } from "next-view-transitions";
import EditorialLabel from "@/components/ui/EditorialLabel";

export default function AboutPreview() {
  return (
    <section
      className="css-reveal"
      style={{
        padding: "clamp(80px, 10vw, 140px) var(--page-px)",
        background: "var(--bg-shift)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
        }}
        className="about-preview-grid"
      >
        <div>
          <EditorialLabel text="(04) About" className="mb-6" />
          <h2
            className="font-[var(--sans)] font-medium tracking-[-0.025em] text-[color:var(--text-primary)] m-0"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              lineHeight: 1.15,
              maxWidth: 480,
            }}
          >
            An AI-powered design studio building brands for established businesses.
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            className="font-[var(--sans)] font-normal text-[color:var(--text-secondary)] m-0"
            style={{
              fontSize: "clamp(15px, 1.1vw, 16px)",
              lineHeight: 1.75,
              maxWidth: 520,
            }}
          >
            We build brand identities, visual systems, and digital experiences. Design is a business tool. AI powers the production layer. Creative direction stays human.
          </p>
          <div className="mt-8">
            <Link
              href="/about"
              className="arrow-link no-underline"
              data-cursor="link"
            >
              <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
                Get to know us <span className="arrow-icon">&rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Divider + services link */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          marginTop: "clamp(40px, 5vw, 64px)",
          paddingTop: 24,
        }}
      >
        <Link
          href="/services"
          className="arrow-link no-underline"
          data-cursor="link"
        >
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            View all our services <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
