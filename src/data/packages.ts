// The brand packages' names and timelines. The public Packages page is retired; the Project Planner
// reads the package durations from here (BRAND_TIMELINES in src/lib/project-planner/config.ts). No
// prices: the site never shows the studio's own prices (decided 20 Nov 2026). The page's other fields
// (contents, best for, buttons) were removed on 22 Nov 2026, as nothing read them.

interface PackageTier {
  title: string;
  timeline: string;
}

export const PACKAGE_TIERS: PackageTier[] = [
  { title: "Brand Foundation", timeline: "4 to 6 weeks" },
  { title: "Brand Identity System", timeline: "8 to 12 weeks" },
  { title: "Brand Ecosystem", timeline: "12 to 16 weeks" },
];
