import SiteShell from "@/components/layout/SiteShell";
import NotFoundContent from "@/components/layout/NotFoundContent";
import { NOT_FOUND_METADATA } from "@/lib/not-found";

// The 404 for any address no route matches. Next.js builds it ahead of time as /_not-found inside the
// root layout (so the arming script is in its head) and answers it with a real 404 status. It draws the
// site shell itself, so the page reads in full on the server, without JavaScript. notFound() from a
// site page uses (site)/not-found.tsx, with the same copy and metadata.
export const metadata = NOT_FOUND_METADATA;

export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
