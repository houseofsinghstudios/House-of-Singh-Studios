import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Catch-all for URLs no other route matches. It renders nothing itself: notFound() sends the
// request to (site)/not-found.tsx with a real 404 status, inside the site shell.
// More specific routes (/studio, /api, metadata routes, public files) always win over it.

// Next applies this route's metadata when the browser takes over the 404, so it must match
// (site)/not-found.tsx. Without it the tab would show the homepage title.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function UnmatchedRoute() {
  notFound();
}
