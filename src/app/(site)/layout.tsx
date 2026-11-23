import SiteShell from "@/components/layout/SiteShell";

// Every site page sits inside the shared site shell (src/components/layout/SiteShell.tsx): site CSS,
// header, footer, analytics and the site JSON-LD. The root not-found.tsx uses the same shell.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
