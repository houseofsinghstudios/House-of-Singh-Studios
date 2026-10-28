// The brand packages: the single source for their prices and timelines. The public Packages page is
// retired; the Project Planner reads the Brand Foundation price and the package durations from here.
// Prices are CAD, excluding HST.
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import { formatDollars } from "@/lib/money";

export interface PackageTier {
  number: string;
  title: string;
  startsFrom: number;
  readonly price: string;
  description: string;
  includes: string[];
  timeline: string;
  bestFor: string;
  cta: { text: string; href: string; variant: "primary" | "secondary" };
  recommended: boolean;
}

export const PACKAGE_TIERS: PackageTier[] = [
  {
    number: "01",
    title: "Brand Foundation",
    startsFrom: 4000,
    get price() { return formatDollars(this.startsFrom); },
    description:
      "For businesses launching or formalizing their visual identity for the first time.",
    includes: [
      "Logo system with primary mark and variations",
      "Color and typography framework",
      "Basic brand guidelines document",
      "Primary brand applications",
    ],
    timeline: "4 to 6 weeks",
    bestFor:
      "Founders, new ventures, businesses operating without a formal brand system.",
    cta: { text: "Start a Project", href: "/start", variant: "secondary" as const },
    recommended: false,
  },
  {
    number: "02",
    title: "Brand Identity System",
    startsFrom: 10000,
    get price() { return formatDollars(this.startsFrom); },
    description:
      "For businesses that need a complete visual identity built to scale.",
    includes: [
      "Full discovery and strategy phase",
      "Complete logo system with variations",
      "Typography and color architecture",
      "Comprehensive brand guidelines document",
      "Collateral design suite",
      "Art direction for brand photography and content",
    ],
    timeline: "8 to 12 weeks",
    bestFor:
      "Businesses that have outgrown their current brand.",
    cta: { text: "Book a Discovery Call", href: DISCOVERY_CALL_URL, variant: "primary" as const },
    recommended: true,
  },
  {
    number: "03",
    title: "Brand Ecosystem",
    startsFrom: 20000,
    get price() { return formatDollars(this.startsFrom); },
    description:
      "For businesses that need brand identity, digital presence, content systems, and ongoing creative direction under one roof.",
    includes: [
      "Everything in Brand Identity System",
      "Website design direction and content architecture",
      "Content strategy and social media systems",
      "Brand launch support",
      "3 months of post-launch creative direction and support",
    ],
    timeline: "12 to 16 weeks",
    bestFor:
      "Businesses preparing for a major growth phase, market expansion, or rebrand.",
    cta: { text: "Book a Discovery Call", href: DISCOVERY_CALL_URL, variant: "primary" as const },
    recommended: false,
  },
];

// The entry package. Its price is the brand identity starting price in the Project Planner.
export const BRAND_FOUNDATION = PACKAGE_TIERS[0];
