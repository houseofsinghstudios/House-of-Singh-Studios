export interface ServiceDeliverable {
  name: string;
  description: string;
}

export interface ServiceRelatedWork {
  slug: string;
  name: string;
  client: string;
  result: string;
  gradient: string;
}

export interface ServiceProcessStep {
  step: string;
  name: string;
  description: string;
}

export interface ServiceData {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  gradient: string;
  deliverables: ServiceDeliverable[];
  impact: {
    quote: string;
    paragraphs: string[];
  };
  process: ServiceProcessStep[];
  idealClient: string;
  relatedWork: ServiceRelatedWork[];
}

const sharedProcess: ServiceProcessStep[] = [
  {
    step: "01",
    name: "Discovery",
    description:
      "We learn your business, your audience, and your goals. No assumptions. Interviews, audits, and competitive analysis.",
  },
  {
    step: "02",
    name: "Strategy",
    description:
      "We define the positioning, the scope, and the creative direction. You approve the plan before any production starts.",
  },
  {
    step: "03",
    name: "Creative Direction",
    description:
      "Concepts, references, and creative frameworks. We establish the visual and strategic direction with your input.",
  },
  {
    step: "04",
    name: "Production",
    description:
      "The work gets built. Checkpoints at defined intervals. AI handles production speed. Human judgment handles quality.",
  },
  {
    step: "05",
    name: "Delivery",
    description:
      "Final deliverables, documentation, and handoff. Your team has everything they need to use the system independently.",
  },
];

export const services: ServiceData[] = [
  {
    slug: "brand-identity",
    number: "01",
    name: "Brand Identity and Visual Design",
    tagline: "A brand identity system that works as hard as your business does.",
    description:
      "We build complete brand identity systems. Logo, typography, color, visual language, and guidelines documentation. Everything your team needs to show up consistently across every channel and medium.",
    gradient: "linear-gradient(135deg, #3D3D3D 0%, #1A1A1A 100%)",
    deliverables: [
      {
        name: "Logo Systems and Brand Marks",
        description:
          "Primary, secondary, and responsive lockups designed for every application from business cards to billboards.",
      },
      {
        name: "Color and Typography Systems",
        description:
          "A defined palette and type hierarchy that works across digital, print, and environmental applications.",
      },
      {
        name: "Visual Language and Art Direction",
        description:
          "The rules that govern how your brand looks and feels in any context. Photography style, illustration approach, iconography.",
      },
      {
        name: "Brand Guidelines Documentation",
        description:
          "A comprehensive document your team can follow without needing a designer in the room for every decision.",
      },
      {
        name: "Packaging and Collateral Design",
        description:
          "Business cards, letterheads, presentation templates, and packaging that carry the brand system into the physical world.",
      },
      {
        name: "Brand Expressions and Applications",
        description:
          "Social media templates, email signatures, signage specifications. The brand applied to every touchpoint.",
      },
    ],
    impact: {
      quote:
        "A consistent brand identity increases revenue by up to 23%. Most businesses lose that money because their visual identity is fragmented across channels.",
      paragraphs: [
        "Your brand identity is not your logo. It is the system that makes your business recognizable, trustworthy, and differentiated in a crowded market. When that system is inconsistent, every marketing dollar works harder than it should.",
        "We build identity systems that hold up under pressure. Across packaging, digital, social, print, and environmental. The system we deliver is designed for your team to use independently, not to create dependency on a designer.",
      ],
    },
    process: sharedProcess,
    idealClient:
      "Established businesses doing $1M to $20M in revenue that have outgrown their original branding. Your business has evolved. Your visual identity has not caught up. You need a system, not a one-off logo refresh.",
    relatedWork: [
      {
        slug: "tedxtoronto",
        name: "TEDxToronto",
        client: "TEDx",
        result: "Complete visual identity system across 14 touchpoints",
        gradient: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
      },
      {
        slug: "meridian",
        name: "Meridian",
        client: "Meridian Financial",
        result: "40% improvement in brand recall across digital channels",
        gradient: "linear-gradient(135deg, #3D3D3D 0%, #1A1A1A 100%)",
      },
    ],
  },
  {
    slug: "visual-media",
    number: "02",
    name: "Visual Media and Content Production",
    tagline: "Content that does more than fill a feed. Content that builds a brand.",
    description:
      "Brand films, campaign visuals, photography direction, and content systems. We produce visual media with strategic intent. Every frame, every shot, every edit serves your brand positioning.",
    gradient: "linear-gradient(135deg, #4A3F35 0%, #2C2419 100%)",
    deliverables: [
      {
        name: "Brand Films and Short Form Video",
        description:
          "Campaign hero films, social-first short form content, product videos. Produced with narrative structure, not just visuals.",
      },
      {
        name: "Campaign Direction and Visual Storytelling",
        description:
          "The creative concept, shot lists, and art direction that turn a brief into a visual narrative with commercial purpose.",
      },
      {
        name: "Photography and Art Direction",
        description:
          "Brand photography with a defined style guide. Product, lifestyle, editorial. Consistent look across all channels.",
      },
      {
        name: "Social and Digital Content Systems",
        description:
          "Template systems, content calendars, and production workflows that let your team produce on-brand content at scale.",
      },
      {
        name: "Script Development and Narrative Shaping",
        description:
          "The words and structure behind the visuals. Voiceover scripts, campaign narratives, messaging frameworks for video.",
      },
    ],
    impact: {
      quote:
        "Video content generates 1200% more shares than text and images combined. But only when it is built on strategy, not just production value.",
      paragraphs: [
        "Most businesses produce content that looks good but says nothing. The result is a library of assets that do not convert, do not build recognition, and do not justify the production spend.",
        "We start with your brand positioning and business objectives. Then we produce. Every piece of content maps back to a strategic goal. That is the difference between content production and content marketing.",
      ],
    },
    process: sharedProcess,
    idealClient:
      "Businesses with an established brand that need visual content at scale. You have the brand foundation. Now you need the content engine to put it in front of the right audience consistently.",
    relatedWork: [
      {
        slug: "nomad-kitchen",
        name: "Nomad Kitchen",
        client: "Nomad Kitchen",
        result: "Brand film series driving 3x social engagement",
        gradient: "linear-gradient(135deg, #4A3F35 0%, #2C2419 100%)",
      },
      {
        slug: "raahi",
        name: "Raahi",
        client: "Raahi Travel",
        result: "Photography system used across 6 markets",
        gradient: "linear-gradient(135deg, #3A4A3F 0%, #1A2A1F 100%)",
      },
    ],
  },
  {
    slug: "digital-design",
    number: "03",
    name: "Digital Design and Experience",
    tagline: "Digital experiences that convert visitors into clients.",
    description:
      "Website design, interface systems, interactive experiences, and content architecture. We design digital touchpoints that look right and work right. Every page, every interaction, every user flow is intentional.",
    gradient: "linear-gradient(135deg, #2C3D4A 0%, #1A2530 100%)",
    deliverables: [
      {
        name: "Website Design and Development Direction",
        description:
          "Complete website design with wireframes, high-fidelity mockups, interaction specifications, and development-ready documentation.",
      },
      {
        name: "Interface and Digital Layout Systems",
        description:
          "Reusable component libraries and layout grids that maintain visual consistency across pages and screen sizes.",
      },
      {
        name: "Interactive Brand Experiences",
        description:
          "Microsites, landing pages, and campaign experiences that go beyond standard templates. Built for engagement and conversion.",
      },
      {
        name: "Content Architecture and Structure",
        description:
          "Information architecture, navigation design, and content hierarchy that helps users find what they need without friction.",
      },
      {
        name: "Ongoing Digital Design Support",
        description:
          "Retainer-based design support for new pages, campaign assets, and iterative improvements based on performance data.",
      },
    ],
    impact: {
      quote:
        "75% of users judge a business's credibility based on its website. Your digital presence is not a brochure. It is your most visible salesperson.",
      paragraphs: [
        "A website that looks dated or functions poorly costs you money every day. Visitors leave. Leads do not convert. Your brand loses credibility before a conversation even starts.",
        "We design digital experiences that are built on user behavior data and business objectives. Not on what looks trendy. The result is a digital presence that works commercially, not just aesthetically.",
      ],
    },
    process: sharedProcess,
    idealClient:
      "Businesses whose website does not reflect the quality of their product or service. You know your site is holding you back. You need a digital presence that matches the caliber of your business.",
    relatedWork: [
      {
        slug: "soulbound",
        name: "Soulbound",
        client: "Soulbound Collective",
        result: "Website redesign with 65% increase in lead conversion",
        gradient: "linear-gradient(135deg, #2C3D4A 0%, #1A2530 100%)",
      },
      {
        slug: "the-collective",
        name: "The Collective",
        client: "The Collective",
        result: "Digital experience platform serving 4 markets",
        gradient: "linear-gradient(135deg, #4A4A3D 0%, #2A2A1F 100%)",
      },
    ],
  },
  {
    slug: "creative-strategy",
    number: "04",
    name: "Creative Strategy and Systems",
    tagline: "Strategy that turns brand decisions into business outcomes.",
    description:
      "Brand positioning, creative direction frameworks, communication strategy, and visual consistency systems. We build the strategic layer that makes every creative decision intentional and commercially effective.",
    gradient: "linear-gradient(135deg, #3A3A3A 0%, #1A1A1A 100%)",
    deliverables: [
      {
        name: "Brand Positioning and Clarity Workshops",
        description:
          "Facilitated sessions that define your brand position, audience, differentiation, and messaging hierarchy. The foundation for everything else.",
      },
      {
        name: "Creative Direction Frameworks",
        description:
          "Documented systems for making creative decisions consistently. Visual references, tone parameters, and quality benchmarks your team can follow.",
      },
      {
        name: "Content and Communication Strategy",
        description:
          "Channel strategy, messaging hierarchy, content pillars, and editorial calendars that align creative output with business objectives.",
      },
      {
        name: "Visual Consistency Systems",
        description:
          "Audit your existing brand touchpoints. Identify inconsistencies. Build the governance system that prevents drift.",
      },
      {
        name: "AI Supported Workflow Integration",
        description:
          "For businesses exploring AI in their creative workflow. Tool selection, process design, and implementation support for AI-assisted creative operations.",
      },
    ],
    impact: {
      quote:
        "Companies with a documented brand strategy grow 3.5x faster than those without one. Strategy is not a luxury. It is infrastructure.",
      paragraphs: [
        "Most brand inconsistency is not a design problem. It is a strategy problem. When there is no documented system for making creative decisions, every new hire, every new campaign, and every new channel introduces drift.",
        "We build the strategic systems that prevent drift. Positioning documents, creative direction frameworks, and governance systems that keep your brand consistent as your team and channels grow.",
      ],
    },
    process: sharedProcess,
    idealClient:
      "Businesses with multiple teams, channels, or markets producing brand content. You have the talent. You do not have the system. Every department interprets the brand differently.",
    relatedWork: [
      {
        slug: "tedxtoronto",
        name: "TEDxToronto",
        client: "TEDx",
        result: "Creative framework governing 30+ volunteer designers",
        gradient: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
      },
      {
        slug: "meridian",
        name: "Meridian",
        client: "Meridian Financial",
        result: "Brand governance system across 3 business units",
        gradient: "linear-gradient(135deg, #3D3D3D 0%, #1A1A1A 100%)",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
