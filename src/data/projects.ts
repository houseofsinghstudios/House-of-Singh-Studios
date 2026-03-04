export interface ProjectSection {
  label: string;
  title: string;
  paragraphs: string[];
}

export interface ProjectResult {
  number: string;
  description: string;
}

export interface Project {
  slug: string;
  number: string;
  name: string;
  categories: string[];
  year: string;
  description: string;
  client: string;
  services: string;
  industry: string;
  gradient: string;
  sections: {
    business: ProjectSection;
    challenge: ProjectSection;
    approach: ProjectSection;
    deliverables: ProjectSection;
  };
  results: ProjectResult[];
  resultSummary: string;
}

export const projects: Project[] = [
  {
    slug: "tedxtoronto",
    number: "01",
    name: "TEDxToronto Visual Identity",
    categories: ["Brand Identity", "Visual Media"],
    year: "2024",
    gradient: "linear-gradient(155deg, #D8D2CA, #C8BFB4)",
    description:
      "Event branding and visual system for one of Canada\u2019s largest independently organized TEDx events.",
    client: "TEDxToronto",
    services: "Brand Identity, Visual Media, Creative Direction",
    industry: "Events and Conferences",
    sections: {
      business: {
        label: "(The Business)",
        title: "About the client",
        paragraphs: [
          "TEDxToronto is one of the largest independently organized TEDx events in Canada, bringing together thousands of attendees each year. The event platform spans a full day conference, digital content, and year-round community programming.",
          "The organization needed a visual identity system that could flex across physical event spaces, digital platforms, printed collateral, and social media while maintaining cohesion.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        title: "What needed solving",
        paragraphs: [
          "The existing visual identity had been built incrementally over several years without a unified system. Each event cycle introduced new elements that did not connect back to a core identity.",
          "The challenge was to create a system flexible enough to evolve annually while maintaining a consistent foundation that audiences would recognize immediately.",
        ],
      },
      approach: {
        label: "(Our Approach)",
        title: "How we worked",
        paragraphs: [
          "We began with discovery: stakeholder interviews, audience research, and an audit of how the brand was used across all touchpoints.",
          "The strategy phase defined the brand visual principles: clarity, energy, and intellectual warmth. From there, we developed a modular identity system with a core mark, flexible color framework, and typography guidelines that scale.",
          "AI assisted the research phase by analyzing competitor visual positioning and accelerating asset generation during production. Creative direction remained human at every decision point.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        title: "What we delivered",
        paragraphs: [
          "The final delivery included a complete brand identity system: primary and secondary logo marks, flexible color palette with event-specific accent options, typography hierarchy, brand guidelines documentation, and templated assets for social, print, and environmental signage.",
          "We also produced the event visual media: stage graphics, speaker introduction sequences, pre-event campaign assets, and a photography art direction guide.",
        ],
      },
    },
    results: [
      { number: "3,000+", description: "Attendees at launch event" },
      { number: "40%", description: "Fewer revision rounds through AI assisted QC" },
      { number: "50+", description: "Branded assets across print and digital" },
      { number: "1", description: "Unified system replacing fragmented elements" },
    ],
    resultSummary:
      "The new identity system launched at the 2024 event and has carried through all subsequent programming. The modular framework allows each event cycle to feel fresh while remaining unmistakably TEDxToronto.",
  },
  {
    slug: "meridian",
    number: "02",
    name: "Meridian Financial Group",
    categories: ["Brand Identity", "Digital Design"],
    year: "2024",
    gradient: "linear-gradient(155deg, #CAD2D8, #B4BFC8)",
    description:
      "Complete rebrand and digital presence for a mid-market financial services firm.",
    client: "Meridian Financial Group",
    services: "Brand Identity, Digital Design, Brand Guidelines",
    industry: "Financial Services",
    sections: {
      business: {
        label: "(The Business)",
        title: "About the client",
        paragraphs: [
          "Meridian Financial Group is a mid-market financial advisory firm serving high-net-worth individuals and growing businesses across Ontario. The firm needed to modernize its visual identity to match its evolved service offering.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        title: "What needed solving",
        paragraphs: [
          "The existing brand felt dated and generic. It did not differentiate Meridian from larger institutional competitors or communicate the personal, strategic approach the firm actually delivers.",
        ],
      },
      approach: {
        label: "(Our Approach)",
        title: "How we worked",
        paragraphs: [
          "We conducted a competitive audit of 20+ financial brands, then developed a visual language that balances authority with approachability. The identity system uses a restrained color palette and structured typography to signal credibility.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        title: "What we delivered",
        paragraphs: [
          "Full brand identity system, website design direction, stationery suite, pitch deck templates, and comprehensive brand guidelines documentation.",
        ],
      },
    },
    results: [
      { number: "35%", description: "Increase in qualified inbound leads" },
      { number: "12", description: "Touchpoints redesigned under one system" },
    ],
    resultSummary:
      "The rebrand launched alongside a new website and has driven measurable improvement in prospect quality and client confidence.",
  },
  {
    slug: "soulbound",
    number: "03",
    name: "Soulbound Publication",
    categories: ["Visual Media", "Creative Strategy"],
    year: "2023",
    gradient: "linear-gradient(155deg, #D2D8CA, #BFC8B4)",
    description:
      "Visual identity and editorial design for an independent arts and culture publication.",
    client: "Soulbound",
    services: "Visual Media, Creative Strategy, Art Direction",
    industry: "Publishing and Media",
    sections: {
      business: {
        label: "(The Business)",
        title: "About the client",
        paragraphs: [
          "Soulbound is an independent publication exploring the intersection of art, culture, and identity. They needed a visual system that could work across print, digital, and social without losing editorial integrity.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        title: "What needed solving",
        paragraphs: [
          "The publication had strong written content but inconsistent visual presentation. Each issue looked like it came from a different brand.",
        ],
      },
      approach: {
        label: "(Our Approach)",
        title: "How we worked",
        paragraphs: [
          "We built a modular design system with flexible grid structures, a defined typography scale, and an art direction framework that allows editorial freedom within brand boundaries.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        title: "What we delivered",
        paragraphs: [
          "Editorial design system, issue templates, social content framework, and contributor guidelines.",
        ],
      },
    },
    results: [
      { number: "3x", description: "Social engagement after visual rebrand" },
      { number: "8", description: "Issues produced under new system" },
    ],
    resultSummary:
      "The design system has held across eight issues and over 200 social posts, creating the visual consistency the publication needed to build a recognizable brand.",
  },
  {
    slug: "nomad-kitchen",
    number: "04",
    name: "Nomad Kitchen",
    categories: ["Brand Identity"],
    year: "2023",
    gradient: "linear-gradient(155deg, #D8CAD2, #C8B4BF)",
    description:
      "Brand identity for a modern restaurant concept rooted in global cuisine and local sourcing.",
    client: "Nomad Kitchen",
    services: "Brand Identity, Packaging, Environmental Design",
    industry: "Food and Hospitality",
    sections: {
      business: {
        label: "(The Business)",
        title: "About the client",
        paragraphs: [
          "Nomad Kitchen is a restaurant concept built around global flavors prepared with locally sourced ingredients. The founders needed a brand that communicated both worldliness and warmth.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        title: "What needed solving",
        paragraphs: [
          "The concept needed to feel premium without being pretentious, and global without being generic. The brand had to work across menus, packaging, signage, and social media from day one.",
        ],
      },
      approach: {
        label: "(Our Approach)",
        title: "How we worked",
        paragraphs: [
          "We developed the brand identity around the idea of movement and craft. The visual language draws from cartographic and artisan aesthetics, grounded in a warm, earthy palette.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        title: "What we delivered",
        paragraphs: [
          "Logo system, color palette, typography, menu design, packaging for takeout and retail products, signage specifications, and brand guidelines.",
        ],
      },
    },
    results: [
      { number: "100%", description: "Brand-consistent touchpoints at launch" },
      { number: "4", description: "Revenue streams with branded packaging" },
    ],
    resultSummary:
      "Nomad Kitchen launched with complete visual consistency across all customer touchpoints, from signage to takeout bags to social content.",
  },
  {
    slug: "the-collective",
    number: "05",
    name: "The Collective Studio",
    categories: ["Digital Design", "Creative Strategy"],
    year: "2024",
    gradient: "linear-gradient(155deg, #CAD8D2, #B4C8BF)",
    description:
      "Website design and creative systems for a collaborative workspace and events venue.",
    client: "The Collective Studio",
    services: "Digital Design, Creative Strategy, Content Architecture",
    industry: "Real Estate and Co-working",
    sections: {
      business: {
        label: "(The Business)",
        title: "About the client",
        paragraphs: [
          "The Collective Studio is a creative co-working space and events venue in Toronto. They needed a digital presence that communicated their unique positioning: part workspace, part creative community.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        title: "What needed solving",
        paragraphs: [
          "Their existing website was a basic template that failed to convey the energy and purpose of the physical space. It was not generating the quality of inquiries they needed.",
        ],
      },
      approach: {
        label: "(Our Approach)",
        title: "How we worked",
        paragraphs: [
          "We designed a website that functions as both a brand statement and a lead generation tool. The information architecture was restructured around visitor intent: book a space, join the community, or host an event.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        title: "What we delivered",
        paragraphs: [
          "Website design, content architecture, booking flow UX, and a social content system tied to the website visual language.",
        ],
      },
    },
    results: [
      { number: "60%", description: "Increase in booking inquiries" },
      { number: "2.5x", description: "Average session duration improvement" },
    ],
    resultSummary:
      "The redesigned digital experience directly increased booking inquiries and gave The Collective a platform that matches the quality of their physical space.",
  },
  {
    slug: "raahi",
    number: "06",
    name: "Raahi Travel Co",
    categories: ["Brand Identity", "Visual Media"],
    year: "2023",
    gradient: "linear-gradient(155deg, #D2CAD8, #BFB4C8)",
    description:
      "Brand identity and visual media for a luxury travel company specializing in South Asian destinations.",
    client: "Raahi Travel Co",
    services: "Brand Identity, Visual Media, Photography Direction",
    industry: "Travel and Hospitality",
    sections: {
      business: {
        label: "(The Business)",
        title: "About the client",
        paragraphs: [
          "Raahi Travel Co curates luxury travel experiences across South Asia. The company needed a brand that would resonate with a North American audience while honoring the authenticity of the destinations.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        title: "What needed solving",
        paragraphs: [
          "The travel industry is saturated with generic tropical imagery and vague luxury language. Raahi needed to stand apart with a brand that felt specific, intentional, and culturally grounded.",
        ],
      },
      approach: {
        label: "(Our Approach)",
        title: "How we worked",
        paragraphs: [
          "We built the brand around the concept of intentional travel. The visual identity uses a refined palette inspired by natural materials and traditional craft, paired with modern typography.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        title: "What we delivered",
        paragraphs: [
          "Complete brand identity, photography art direction guide, social media visual system, pitch deck template, and print collateral for travel fairs.",
        ],
      },
    },
    results: [
      { number: "45%", description: "Increase in premium package bookings" },
      { number: "3", description: "International travel fairs with branded presence" },
    ],
    resultSummary:
      "The brand identity positioned Raahi as a premium alternative in the South Asian travel market and has been the foundation of all client-facing materials since launch.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project {
  const idx = projects.findIndex((p) => p.slug === currentSlug);
  return projects[(idx + 1) % projects.length];
}
