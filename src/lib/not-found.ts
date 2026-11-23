import type { Metadata } from "next";

// The site 404's metadata, shared by the root src/app/not-found.tsx (an address no route matches) and
// (site)/not-found.tsx (notFound() from a site page). Their copy is NotFoundContent.
export const NOT_FOUND_METADATA: Metadata = {
  title: "Page not found",
  // Its own short description, the page's own line (site audit S-17), not the site's generic one.
  description: "This page may have moved or been retired. The work that did is one click away.",
  robots: { index: false, follow: true },
  // Do not inherit a canonical: a 404 points nowhere.
  alternates: { canonical: null },
};
