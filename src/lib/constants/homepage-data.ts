export const HERO = {
  label: "Creative Direction Studio",
  headline: ["AI can generate assets.", "It cannot build a brand."],
  secondary:
    "A design studio powered by AI systems and led by creative direction.",
  cta: {
    primary: { text: "View Projects", href: "/work" },
    secondary: { text: "Start a Project", href: "/contact" },
  },
};

export const ARGUMENT = {
  label: "The Problem",
  heading: "Your business has evolved. Your brand has not.",
  snap: "We fix that.",
  steps: [
    { bold: "Discover", rest: "what your brand should be." },
    { bold: "Design", rest: "the system that makes it real." },
    { bold: "Deliver", rest: "assets that hold up everywhere." },
  ],
};

export const STATS = {
  targets: [110, 12, 6, 15] as const,
  labels: [
    "Projects Delivered",
    "Years of Practice",
    "Countries Served",
    "Industries Served",
  ],
};

export interface ServiceBlock {
  title: string;
  sentence: string;
  description: string;
  deliverables: string;
  href: string;
  tint: string;
}

export const SERVICES: ServiceBlock[] = [
  {
    title: "Brand Identity and Visual Design",
    sentence: "The visual foundation your business operates on.",
    description:
      "We build the visual foundation your business stands on. Logo systems, typography, color architecture, and brand guidelines that hold up across every medium and market.",
    deliverables:
      "Logo system, brand marks, color and typography system, visual language, brand guidelines, packaging and collateral, art direction",
    href: "/services/brand-identity",
    tint: "var(--tint-brand)",
  },
  {
    title: "Visual Media and Content Production",
    sentence: "Visual work built on strategy, not just aesthetics.",
    description:
      "We direct and produce the visual content that brings your brand to life. Campaign films, photography, social systems, and narrative content built on strategic intent.",
    deliverables:
      "Brand films, campaign direction, photography, social content systems, art direction, script development",
    href: "/services/visual-media",
    tint: "var(--tint-media)",
  },
  {
    title: "Digital Design and Experience",
    sentence: "Your digital presence should convert, not just exist.",
    description:
      "We design the digital spaces where your brand meets your audience. Websites, interfaces, and interactive experiences built for clarity, speed, and conversion.",
    deliverables:
      "Website design, interface systems, interactive experiences, content architecture, ongoing digital support",
    href: "/services/digital-design",
    tint: "var(--tint-digital)",
  },
  {
    title: "Creative Strategy and Systems",
    sentence: "The thinking that makes everything else consistent.",
    description:
      "We build the operating system behind your brand. Positioning clarity, creative direction frameworks, content strategy, and AI workflow integration that makes everything else work harder.",
    deliverables:
      "Brand positioning workshops, creative direction frameworks, content strategy, visual consistency systems, AI workflow integration",
    href: "/services/creative-strategy",
    tint: "var(--tint-strategy)",
  },
];

// Legacy alias for existing code that imports SERVICES_SECTION
export const SERVICES_SECTION = {
  label: "Capabilities",
  heading: "Four capabilities. One studio.",
  items: SERVICES.map((s) => ({
    title: s.title,
    sentence: s.sentence,
    href: s.href,
    color: s.tint,
  })),
};

export interface Project {
  name: string;
  label: string;
  sentence: string;
  href: string;
  color: string;
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    name: "TEDxToronto",
    label: "Brand Identity | 2024",
    sentence:
      "A complete visual identity system for Toronto\u2019s flagship ideas conference.",
    href: "/work/tedxtoronto",
    color: "#2B2B2B",
    accent: "#E62B1E",
  },
  {
    name: "Parampara",
    label: "Visual Media | 2023",
    sentence:
      "Heritage meets modernity in a visual narrative for a South Asian luxury brand.",
    href: "/work/parampara",
    color: "#1A3A5C",
    accent: "#C9A96E",
  },
  {
    name: "Northward Studio",
    label: "Digital Design | 2024",
    sentence:
      "Digital presence and brand system for an architecture practice.",
    href: "/work/northward-studio",
    color: "#3C2A4A",
    accent: "#D4AF37",
  },
  {
    name: "Civic Grounds",
    label: "Creative Strategy | 2023",
    sentence:
      "Brand positioning and identity for a community-driven real estate developer.",
    href: "/work/civic-grounds",
    color: "#4A3728",
    accent: "#E8A848",
  },
];

export interface Testimonial {
  quote: string;
  author: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Exactly what our business needed. The brand system they built gives us consistency we never had before.",
    author: "Sarah Chen, Northward Studio",
  },
  {
    quote:
      "The process was clear from day one. No surprises, no scope creep. Just sharp work delivered on schedule.",
    author: "Lovejot Singh, Parampara",
  },
  {
    quote:
      "Working with House of Singh Studios during TEDxToronto was a standout collaboration. They brought intentional, structured creative direction to every deliverable.",
    author: "Yanina Munoz, TEDxToronto",
  },
];

export const CTA = {
  label: "Next Step",
  heading: "Start a project.",
  subtext: "We respond within 24 hours.",
  buttons: {
    primary: { text: "Book a Call", href: "/contact" },
    secondary: { text: "Send a Brief", href: "/contact" },
  },
};
