import Button from "@/components/ui/Button";

// The site 404's copy, shared by the two not-found files: the root src/app/not-found.tsx (drawn on the
// server inside SiteShell for any address no route matches) and (site)/not-found.tsx (notFound() from
// a site page, drawn in the browser inside the site layout). Their metadata is src/lib/not-found.ts.
export default function NotFoundContent() {
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
          View our work
        </Button>
        <Button href="/start" variant="secondary" data-cursor="link">
          Plan your project
        </Button>
      </div>
    </section>
  );
}
