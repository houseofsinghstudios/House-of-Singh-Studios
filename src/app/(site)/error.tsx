"use client";

// Client component: Next.js requires error boundaries to be client components.
// The site's error state, shown when a page fails to render (for example a page Sanity could not
// serve and that has no earlier version cached). Renders inside the (site) layout, so visitors keep
// the header and footer. Same structure and type as the 404, without reveal animations, so it shows
// at once. Never indexed.
import Button from "@/components/ui/Button";

export default function SiteError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <section className="wp-hero">
      <meta name="robots" content="noindex" />
      <h1 className="wp-heading">This page could not load right now.</h1>

      <p className="wp-sub">Please try again in a moment.</p>

      <div className="flex flex-wrap gap-3 mt-12">
        {/* retry() fetches the page again; reset() would only redraw the failed render. */}
        <Button onClick={retry} variant="primary" data-cursor="link">
          Try Again
        </Button>
        <Button href="/" variant="secondary" data-cursor="link">
          Go to the Homepage
        </Button>
        <Button href="/contact" variant="secondary" data-cursor="link">
          Contact the Studio
        </Button>
      </div>
    </section>
  );
}
