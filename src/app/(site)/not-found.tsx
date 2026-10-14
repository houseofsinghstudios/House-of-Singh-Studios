import type { Metadata } from "next";
import Button from "@/components/ui/Button";

// The site 404. Renders inside the (site) layout, so visitors keep the header and footer.
// Reached by notFound() in any site page, and by (site)/[...not-found] for unmatched URLs.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
  // Do not inherit the root layout's homepage canonical.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <section className="wp-hero">
      <p
        className="editorial-label css-reveal"
        style={{ margin: "0 0 16px", transitionDelay: "0ms" }}
      >
        (404)
      </p>

      <h1 className="wp-heading css-reveal" style={{ transitionDelay: "100ms" }}>
        This page didn&apos;t make the final&nbsp;cut.
      </h1>

      <p className="wp-sub css-reveal" style={{ transitionDelay: "200ms" }}>
        It may have moved or been retired. The work that did is one click away.
      </p>

      <div className="flex flex-wrap gap-3 mt-12 css-reveal" style={{ transitionDelay: "300ms" }}>
        <Button href="/work" variant="primary" data-cursor="link">
          View Our Work
        </Button>
        <Button href="/contact" variant="secondary" data-cursor="link">
          Start a Project
        </Button>
      </div>
    </section>
  );
}
