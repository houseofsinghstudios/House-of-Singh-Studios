import NotFoundContent from "@/components/layout/NotFoundContent";
import { NOT_FOUND_METADATA } from "@/lib/not-found";

// The in-app 404: notFound() from a site page (a missing case study, article, initiative, service or
// archive page; /initiatives/foundry on purpose). It answers 404 with noindex, but Next.js 16 draws it
// in the browser only (vercel/next.js #99287); an address no route matches gets the root
// src/app/not-found.tsx instead, drawn on the server. Same copy and metadata in both.
export const metadata = NOT_FOUND_METADATA;

export default function NotFound() {
  return <NotFoundContent />;
}
