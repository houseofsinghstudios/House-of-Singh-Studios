export interface ProjectSection {
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
    description:
      "Event branding and visual system for one of Canada\u2019s largest independently organized TEDx events.",
    client: "TEDxToronto",
    services: "Brand Identity, Visual Media, Creative Direction",
    industry: "Events and Conferences",
    gradient: "linear-gradient(155deg, #D8D2CA, #C8BFB4)",
    sections: {
      business: {
        title: "About the client",
        paragraphs: [
          "TEDxToronto is one of the largest independently organized TEDx events in Canada, bringing together thousands of attendees each year. The event platform spans a full day conference, digital content, and year-round community programming.",
          "The organization needed a visual identity system that could flex across physical event spaces, digital platforms, printed collateral, and social media while maintaining cohesion.",
        ],
      },
      challenge: {
        title: "What needed solving",
        paragraphs: [
          "The existing visual identity had been built incrementally over several years without a unified system. Each event cycle introduced new elements that did not connect back to a core identity.",
          "The challenge was to create a system flexible enough to evolve annually while maintaining a consistent foundation that audiences would recognize immediately.",
        ],
      },
      approach: {
        title: "How we worked",
        paragraphs: [
          "We began with discovery: stakeholder interviews, audience research, and an audit of how the brand was used across all touchpoints.",
          "The strategy phase defined the brand visual principles: clarity, energy, and intellectual warmth. From there, we developed a modular identity system with a core mark, flexible color framework, and typography guidelines that scale.",
          "AI assisted the research phase by analyzing competitor visual positioning and accelerating asset generation during production. Creative direction remained human at every decision point.",
        ],
      },
      deliverables: {
        title: "What we delivered",
        paragraphs: [
          "The final delivery included a complete brand identity system: primary and secondary logo marks, flexible color palette with event-specific accent options, typography hierarchy, brand guidelines documentation, and templated assets for social, print, and environmental signage.",
          "We also produced the event visual media: stage graphics, speaker introduction sequences, pre-event campaign assets, and a photography art direction guide.",
        ],
      },
    },
    results: [
      { number: "3,000+", description: "Attendees at launch event" },
      {
        number: "40%",
        description:
          "Fewer revision rounds through AI assisted quality control",
      },
      {
        number: "50+",
        description: "Branded assets delivered across print and digital",
      },
      {
        number: "1",
        description: "Unified system replacing fragmented brand elements",
      },
    ],
    resultSummary:
      "The new identity system launched at the 2024 event and has carried through all subsequent programming. The modular framework allows each event cycle to feel fresh while remaining unmistakably TEDxToronto.",
  },
  {
    slug: "meridian",
    number: "02",
    name: "Meridian Financial Group",
    categories: ["Brand Identity"],
    year: "2024",
    description:
      "Brand identity system for a mid-market financial services firm.",
    client: "Meridian Financial Group",
    services: "Brand Identity, Creative Strategy",
    industry: "Financial Services",
    gradient: "linear-gradient(155deg, #CAD2D8, #B4BFC8)",
    sections: {
      business: {
        title: "About the client",
        paragraphs: [
          "Meridian Financial Group is a mid-market financial services firm serving high-net-worth individuals and growing businesses across Ontario.",
          "After a period of rapid growth, the firm needed a brand identity that reflected its evolved position in the market.",
        ],
      },
      challenge: {
        title: "What needed solving",
        paragraphs: [
          "The existing brand was inherited from the firm\u2019s founding era and no longer communicated the sophistication of their current service offering.",
          "Every client touchpoint needed to feel cohesive, from pitch decks to the digital portal experience.",
        ],
      },
      approach: {
        title: "How we worked",
        paragraphs: [
          "We conducted a competitive audit of the financial services landscape and identified a visual whitespace: warmth without casualness, authority without coldness.",
          "The identity system was built around restrained typography, a muted earth-tone palette, and clean geometric forms that convey stability.",
        ],
      },
      deliverables: {
        title: "What we delivered",
        paragraphs: [
          "Complete brand identity including logo system, color palette, typography standards, stationery suite, pitch deck template, and brand guidelines documentation.",
        ],
      },
    },
    results: [
      { number: "1", description: "Unified brand system delivered" },
      { number: "24", description: "Branded assets across all touchpoints" },
      { number: "100%", description: "Stakeholder approval at first presentation" },
      { number: "3", description: "Months from kickoff to delivery" },
    ],
    resultSummary:
      "The rebrand launched across all client-facing materials within three months, establishing a visual foundation for the firm\u2019s next growth phase.",
  },
  {
    slug: "soulbound",
    number: "03",
    name: "Soulbound Publication",
    categories: ["Visual Media"],
    year: "2023",
    description:
      "Publication cover design and art direction for a leadership book.",
    client: "Siddhartha Sharma",
    services: "Visual Media, Art Direction",
    industry: "Publishing",
    gradient: "linear-gradient(155deg, #D2D8CA, #BFC8B4)",
    sections: {
      business: {
        title: "About the client",
        paragraphs: [
          "Siddhartha Sharma is an author, speaker, and leadership coach whose debut book explores identity, purpose, and modern leadership.",
          "The publication needed a cover and visual system that would stand out in a crowded non-fiction market while reflecting the depth of the content.",
        ],
      },
      challenge: {
        title: "What needed solving",
        paragraphs: [
          "The cover needed to communicate introspection and strength simultaneously, avoiding the common pitfalls of generic leadership book design.",
          "It had to work at thumbnail scale for digital retail and at full size for physical retail and events.",
        ],
      },
      approach: {
        title: "How we worked",
        paragraphs: [
          "We explored multiple visual directions through rapid concept development, using AI to generate texture studies and compositional variations.",
          "The final direction pairs restrained typography with a tactile, layered composition that rewards close reading.",
        ],
      },
      deliverables: {
        title: "What we delivered",
        paragraphs: [
          "Front and back cover design, spine, interior layout direction, promotional assets for social media, and a photography art direction guide for the author\u2019s press materials.",
        ],
      },
    },
    results: [
      { number: "1", description: "Publication successfully launched" },
      { number: "12", description: "Promotional assets delivered" },
      { number: "2", description: "Visual directions explored" },
      { number: "6", description: "Weeks from brief to final delivery" },
    ],
    resultSummary:
      "The publication launched with a visual identity that consistently receives praise for standing apart from typical non-fiction covers in the leadership space.",
  },
  {
    slug: "nomad-kitchen",
    number: "04",
    name: "Nomad Kitchen",
    categories: ["Brand Identity", "Digital Design"],
    year: "2024",
    description:
      "Brand identity and packaging for a modern South Asian food brand.",
    client: "Nomad Kitchen",
    services: "Brand Identity, Packaging, Digital Design",
    industry: "Food and Beverage",
    gradient: "linear-gradient(155deg, #D8CAD2, #C8B4BF)",
    sections: {
      business: {
        title: "About the client",
        paragraphs: [
          "Nomad Kitchen is a modern South Asian food brand bringing authentic regional flavors to mainstream retail channels.",
          "The brand needed an identity that honored cultural roots while appealing to a broad, food-curious consumer base.",
        ],
      },
      challenge: {
        title: "What needed solving",
        paragraphs: [
          "The challenge was avoiding the visual clich\u00E9s that dominate South Asian food branding: overly ornate patterns, expected color palettes, and generic cultural signifiers.",
          "The identity needed to feel contemporary, premium, and distinctly South Asian without relying on stereotypes.",
        ],
      },
      approach: {
        title: "How we worked",
        paragraphs: [
          "Research began with a deep dive into South Asian visual culture beyond the obvious references: textile traditions, architectural geometry, and regional color sensibilities.",
          "We developed a modular pattern system derived from traditional motifs, reimagined through a modern lens with a warm, earthy palette.",
        ],
      },
      deliverables: {
        title: "What we delivered",
        paragraphs: [
          "Complete brand identity, packaging system for six SKUs, e-commerce website design, social media templates, and a brand guidelines document covering usage across all channels.",
        ],
      },
    },
    results: [
      { number: "6", description: "Product SKUs packaged" },
      { number: "1", description: "Complete brand system delivered" },
      { number: "30+", description: "Branded assets across digital and print" },
      { number: "4", description: "Months from concept to retail-ready" },
    ],
    resultSummary:
      "Nomad Kitchen launched with a visual presence that retailers and consumers recognized as distinctly premium, driving strong shelf appeal in its first quarter.",
  },
  {
    slug: "the-collective",
    number: "05",
    name: "The Collective Co-Working",
    categories: ["Digital Design", "Brand Identity"],
    year: "2023",
    description:
      "Digital experience and brand identity for a premium co-working space.",
    client: "The Collective",
    services: "Digital Design, Brand Identity",
    industry: "Real Estate",
    gradient: "linear-gradient(155deg, #CAD8D2, #B4C8BF)",
    sections: {
      business: {
        title: "About the client",
        paragraphs: [
          "The Collective is a premium co-working space targeting creative professionals and growing startups in downtown Toronto.",
          "They needed a digital presence that reflected the design quality of their physical space and converted visitors into members.",
        ],
      },
      challenge: {
        title: "What needed solving",
        paragraphs: [
          "The existing website was template-based and failed to communicate the premium positioning of the space.",
          "The membership inquiry flow was buried and conversion rates were well below industry benchmarks.",
        ],
      },
      approach: {
        title: "How we worked",
        paragraphs: [
          "We redesigned the digital experience from the ground up: information architecture, visual design, and conversion optimization.",
          "The design language draws from the physical space: clean lines, natural materials, and deliberate negative space.",
        ],
      },
      deliverables: {
        title: "What we delivered",
        paragraphs: [
          "Responsive website design, membership inquiry flow, virtual tour integration, brand identity refresh, and a content strategy for ongoing digital presence.",
        ],
      },
    },
    results: [
      { number: "3x", description: "Increase in membership inquiries" },
      { number: "45%", description: "Improvement in page engagement" },
      { number: "1", description: "Cohesive digital and physical brand" },
      { number: "8", description: "Weeks from kickoff to launch" },
    ],
    resultSummary:
      "The new digital presence tripled membership inquiries within the first month and established a visual standard that extended into all physical brand touchpoints.",
  },
  {
    slug: "raahi",
    number: "06",
    name: "Raahi Travel Co",
    categories: ["Creative Strategy", "Brand Identity"],
    year: "2024",
    description:
      "Creative strategy and brand identity for a curated travel experience company.",
    client: "Raahi Travel Co",
    services: "Creative Strategy, Brand Identity, Visual Media",
    industry: "Travel and Hospitality",
    gradient: "linear-gradient(155deg, #D2CAD8, #BFB4C8)",
    sections: {
      business: {
        title: "About the client",
        paragraphs: [
          "Raahi Travel Co curates immersive travel experiences focused on cultural depth and authentic local connections across South and Southeast Asia.",
          "The brand needed a visual identity and strategic foundation that communicated premium curation without the stuffiness of luxury travel branding.",
        ],
      },
      challenge: {
        title: "What needed solving",
        paragraphs: [
          "The travel industry is saturated with aspirational imagery that all looks the same. Raahi needed to stand apart visually while clearly communicating what makes their experience different.",
          "The brand had to work across digital booking platforms, printed itineraries, on-ground signage, and social storytelling.",
        ],
      },
      approach: {
        title: "How we worked",
        paragraphs: [
          "We started with a creative strategy phase: defining the brand\u2019s personality, voice, and visual principles before any design work began.",
          "The visual identity draws from the concept of a journey: flowing forms, warm earth tones, and photography direction that emphasizes human connection over landscape spectacle.",
        ],
      },
      deliverables: {
        title: "What we delivered",
        paragraphs: [
          "Brand strategy document, complete visual identity system, website design direction, photography art direction guide, social media content templates, and printed collateral for on-ground guest materials.",
        ],
      },
    },
    results: [
      { number: "1", description: "Complete brand and strategy system" },
      { number: "40+", description: "Assets across all brand touchpoints" },
      { number: "5", description: "Months of strategic and creative work" },
      { number: "100%", description: "Client satisfaction at delivery" },
    ],
    resultSummary:
      "Raahi launched with a brand presence that immediately differentiated them in the curated travel space, with the strategic foundation guiding all subsequent marketing decisions.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project {
  const idx = projects.findIndex((p) => p.slug === currentSlug);
  return projects[(idx + 1) % projects.length];
}
