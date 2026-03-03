export const HERO = {
  label: "Creative Direction Studio",
  headline: ["AI can generate assets.", "It cannot build a brand."],
  secondary:
    "A design studio powered by AI systems and led by creative direction.",
  supporting:
    "We build brands that hold up across every channel for years. AI handles the production layer. Human judgment drives the creative layer.",
  cta: {
    primary: { text: "View Projects", href: "/work" },
    secondary: { text: "Start a Project", href: "/contact" },
  },
};

export const ARGUMENT = {
  label: "The Problem",
  heading: "Your business has evolved. Your brand has not.",
  pain: "Your revenue has changed. Your team has changed. Your market position has changed. But your brand still reflects an earlier version of your business. Your website says one thing. Your marketing materials say another. No two touchpoints feel like the same business. There is no system holding it together, and every new campaign widens the gap.",
  snap: "We fix that.",
  process:
    "Every project at House of Singh Studios moves through five stages. AI accelerates research and production. Creative direction stays human. You know what you are getting, when you are getting it, and what it costs before we start.",
  steps: ["Discovery", "Strategy", "Creative Direction", "Production", "Delivery"],
};

export const STATS = {
  label: "Studio",
  targets: [75, 10, 12] as const,
  labels: [
    "Projects delivered across identity, media, and digital.",
    "Years of professional creative practice.",
    "Industries served.",
  ],
};

export interface Service {
  title: string;
  sentence: string;
  bullets: string[];
  linkText: string;
  href: string;
}

export const SERVICES_SECTION = {
  label: "Capabilities",
  heading: "Four capabilities. One studio.",
  subheading: "Every service is built to solve a business problem, not just look good.",
  items: [
    {
      title: "Brand Identity and Visual Design",
      sentence: "The visual foundation your business operates on.",
      bullets: [
        "Logo systems and brand marks",
        "Color, typography, and visual language",
        "Brand guidelines and documentation",
        "Packaging and collateral design",
      ],
      linkText: "Explore Brand Identity",
      href: "/services/brand-identity",
    },
    {
      title: "Visual Media and Content Production",
      sentence: "Visual work built on strategy, not just aesthetics.",
      bullets: [
        "Brand films and short form video",
        "Photography and art direction",
        "Campaign direction and visual storytelling",
        "Social and digital content systems",
      ],
      linkText: "Explore Visual Media",
      href: "/services/visual-media",
    },
    {
      title: "Digital Design and Experience",
      sentence: "Your digital presence should convert, not just exist.",
      bullets: [
        "Website design and development direction",
        "Interface and digital layout systems",
        "Content architecture and structure",
        "Ongoing digital design support",
      ],
      linkText: "Explore Digital Design",
      href: "/services/digital-design",
    },
    {
      title: "Creative Strategy and Systems",
      sentence: "The thinking that makes everything else consistent.",
      bullets: [
        "Brand positioning and clarity workshops",
        "Creative direction frameworks",
        "Content and communication strategy",
        "AI supported workflow integration",
      ],
      linkText: "Explore Creative Strategy",
      href: "/services/creative-strategy",
    },
  ] satisfies Service[],
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
    name: "TEDxToronto Visual Identity",
    label: "Client Project",
    sentence:
      "Event branding and visual system for one of Canada\u2019s largest TEDx events.",
    href: "/work/tedxtoronto",
    color: "#2B2B2B",
    accent: "#E62B1E",
  },
  {
    name: "Meridian Financial Group",
    label: "Studio Exploration",
    sentence:
      "Brand identity system for a mid-market financial services firm.",
    href: "/work/meridian",
    color: "#1A3A5C",
    accent: "#C9A96E",
  },
  {
    name: "Soulbound Publication",
    label: "Client Project",
    sentence:
      "Publication cover design and art direction for a leadership book.",
    href: "/work/soulbound",
    color: "#3C2A4A",
    accent: "#D4AF37",
  },
  {
    name: "Nomad Kitchen",
    label: "Studio Exploration",
    sentence:
      "Brand identity and packaging for a modern South Asian food brand.",
    href: "/work/nomad-kitchen",
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
