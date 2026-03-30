export const HERO = {
  label: "Creative Direction Studio",
  cycleWords: ["Your brand", "Your identity", "Your positioning", "Your visual system"],
  headlineStatic: "is not an AI prompt.",
  headlineLine2: "It demands direction and context.",
  secondary: "A design studio for businesses that have outgrown their brand.",
  cta: {
    primary: { text: "Start a Project", href: "/contact" },
  },
};

export const ARGUMENT = {
  label: "The Problem",
  heading: "Your business has evolved. Your brand has not.",
  snap: "We fix that.",
  steps: [
    "Discover what your brand should be.",
    "Design the system that makes it real.",
    "Deliver assets that hold up everywhere.",
  ],
};

export const STATS = {
  items: [
    { target: 50, suffix: "+", label: "Projects Delivered" },
    { target: 12, suffix: "+", label: "Years of Practice" },
    { target: 8, suffix: "+", label: "Industries Served" },
  ],
};

export interface ServiceBlock {
  title: string;
  sentence: string;
  description: string;
  href: string;
}

export const SERVICES_SECTION = {
  label: "Capabilities",
  heading: "Every service solves a business problem.",
  items: [
    {
      title: "Brand Identity and Visual Design",
      sentence: "Your brand identity is the first thing your market judges you on. We build complete visual systems that give your business a consistent, professional presence across every touchpoint.",
      description: "Logo systems, color, typography, brand guidelines, and visual language that holds across every touchpoint.",
      href: "/services/brand-identity",
    },
    {
      title: "Visual Media and Content Production",
      sentence: "Content without a visual strategy is noise. We direct and produce brand photography, campaign films, and social content systems built on strategic intent.",
      description: "Brand photography, campaign films, social content systems, and visual storytelling with strategic intent.",
      href: "/services/visual-media",
    },
    {
      title: "Digital Design and Experience",
      sentence: "Your website is your highest-traffic brand touchpoint. We design the visual direction, content architecture, and interface systems that make it work commercially.",
      description: "Website design direction, interface systems, content architecture, and ongoing digital design support.",
      href: "/services/digital-design",
    },
    {
      title: "Creative Strategy and Systems",
      sentence: "Most brand problems are strategy problems disguised as design problems. We run positioning workshops and build creative direction frameworks that give your team structure.",
      description: "Brand positioning workshops, creative direction frameworks, and AI workflow integration consulting.",
      href: "/services/creative-strategy",
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
    label: "Brand Identity",
    sentence:
      "Event branding and visual system for one of Canada\u2019s largest TEDx events.",
    href: "/work/tedxtoronto",
    color: "#2B2B2B",
    accent: "#E62B1E",
    image: "/images/projects/tedxtoronto/tedxtoronto.jpg",
  },
  {
    name: "Meridian Financial Group",
    label: "Brand Identity",
    sentence:
      "Brand identity system for a mid-market financial services firm.",
    href: "/work/meridian",
    color: "#1A3A5C",
    accent: "#C9A96E",
    image: "/images/projects/meridian/meridian.jpg",
  },
  {
    name: "Soulbound Publication",
    label: "Publication Design",
    sentence:
      "Publication cover design and art direction for a leadership book.",
    href: "/work/soulbound",
    color: "#3C2A4A",
    accent: "#D4AF37",
    image: "/images/projects/soulbound/soulbound.jpg",
  },
  {
    name: "Nomad Kitchen",
    label: "Brand Identity, Packaging",
    sentence:
      "Brand identity and packaging for a modern South Asian food brand.",
    href: "/work/nomad-kitchen",
    color: "#4A3728",
    accent: "#E8A848",
    image: "/images/projects/nomad-kitchen/nomad-kitchen.jpg",
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
  heading: "Start a project.",
  supporting: "We respond within 24 hours.",
  buttons: {
    primary: { text: "Book a Discovery Call", href: "/contact" },
    secondary: { text: "Start a Project", href: "/contact" },
  },
};
