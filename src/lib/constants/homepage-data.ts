export const HERO = {
  label: "Creative Direction Studio",
  headline: ["AI can generate assets.", "It cannot build a brand."],
  secondary:
    "A design studio powered by AI systems and led by creative direction.",
  supportingLine1:
    "We build brands that hold up across every channel for years.",
  supportingLine2:
    "AI handles the production layer. Human judgment drives the creative layer.",
  cta: {
    primary: { text: "View Projects", href: "/work" },
    secondary: { text: "Start a Project", href: "/contact" },
  },
};

export const ARGUMENT = {
  label: "The Problem",
  heading: "Your business has evolved. Your brand has not.",
  supporting: "We build the system that holds it together.",
  snap: "We fix that.",
  steps: ["Discovery", "Strategy", "Creative Direction", "Production", "Delivery"],
};

export const STATS = {
  targets: [110, 12, 15] as const,
  labels: [
    "Projects Delivered",
    "Years of Practice",
    "Industries Served",
  ],
};

export interface ServiceBlock {
  title: string;
  sentence: string;
  href: string;
  color: string;
}

export const SERVICES_SECTION = {
  label: "Capabilities",
  heading: "Four capabilities. One studio.",
  items: [
    {
      title: "Brand Identity and Visual Design",
      sentence: "The visual foundation your business operates on.",
      href: "/services/brand-identity",
      color: "#E8E5E0",
    },
    {
      title: "Visual Media and Content Production",
      sentence: "Visual work built on strategy, not just aesthetics.",
      href: "/services/visual-media",
      color: "#E0E3E8",
    },
    {
      title: "Digital Design and Experience",
      sentence: "Your digital presence should convert, not just exist.",
      href: "/services/digital-design",
      color: "#E3E8E0",
    },
    {
      title: "Creative Strategy and Systems",
      sentence: "The thinking that makes everything else consistent.",
      href: "/services/creative-strategy",
      color: "#E5E0E8",
    },
  ] satisfies ServiceBlock[],
};

export interface Project {
  name: string;
  label: string;
  sentence: string;
  href: string;
  color: string;
  accent: string;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    name: "TEDxToronto Visual Identity",
    label: "Client Project",
    sentence:
      "Event branding and visual system for one of Canada\u2019s largest TEDx events.",
    href: "/work/tedxtoronto",
    color: "#2B2B2B",
    accent: "#E62B1E",
    image: "/images/blank-stationery-concept-with-tablet-brochure.jpg",
  },
  {
    name: "Meridian Financial Group",
    label: "Studio Exploration",
    sentence:
      "Brand identity system for a mid-market financial services firm.",
    href: "/work/meridian",
    color: "#1A3A5C",
    accent: "#C9A96E",
    image: "/images/office-desk-table-with-supplies-freelance-business-workplace-objects.jpg",
  },
  {
    name: "Soulbound Publication",
    label: "Client Project",
    sentence:
      "Publication cover design and art direction for a leadership book.",
    href: "/work/soulbound",
    color: "#3C2A4A",
    accent: "#D4AF37",
    image: "/images/photography-ideas-creative-occupation-design-studio-concept.jpg",
  },
  {
    name: "Nomad Kitchen",
    label: "Studio Exploration",
    sentence:
      "Brand identity and packaging for a modern South Asian food brand.",
    href: "/work/nomad-kitchen",
    color: "#4A3728",
    accent: "#E8A848",
    image: "/images/white-laptop-cylinders-boxes-white-surface.jpg",
  },
];

export interface Testimonial {
  quote: string;
  author: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "It was a pleasure collaborating with House of Singh Studios during TEDxToronto. They brought intention to every creative decision and helped foster a team culture rooted in clarity and design excellence.",
    author: "Yanina, People and Culture, TEDxToronto",
  },
  {
    quote:
      "In a world of overdesigned noise, House of Singh Studios creates work that feels clear, intentional and grounded. Their creative process mirrors the kind of structure we value in finance.",
    author: "Keval, CPA and Controller, Ferrari",
  },
  {
    quote:
      "Crafting a publication cover that reflects the essence of a book is rare. House of Singh Studios brought clarity, intention and elegance to the process.",
    author: "Siddhartha Sharma, Author, Speaker, Leadership Coach",
  },
  {
    quote:
      "House of Singh Studios approaches creative work with the kind of operational clarity that is rare in this space. From timelines to communication, every step felt aligned and intentional.",
    author: "Lovejot, Director, Planning and Logistics",
  },
];

export const CTA = {
  label: "Next Step",
  heading: "Ready to build a brand that holds up?",
  supporting:
    "Whether you are refining an existing brand or building from scratch, the first step is a conversation.",
  button: { text: "Start a Project", href: "/contact" },
};
