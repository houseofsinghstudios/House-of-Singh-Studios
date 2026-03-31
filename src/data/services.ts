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
  image: string;
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
  subtitle: string;
  headline: string;
  description: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  gradient: string;
  deliverables: ServiceDeliverable[];
  impact: {
    heading: string;
    body: string;
  };
  process: ServiceProcessStep[];
  relatedWork: ServiceRelatedWork[];
  ctaHeading: string;
}

export const services: ServiceData[] = [
  {
    slug: "brand-identity",
    number: "01",
    name: "Brand Identity and Visual Design",
    subtitle: "Brand Identity and Visual Design",
    headline: "Your business has grown. Your brand has not kept up.",
    description: "We build complete visual systems — logo, typography, color architecture, and brand guidelines — that give your business a consistent, professional presence across every touchpoint.",
    tagline: "The system behind how your business looks.",
    seoTitle: "Brand Identity and Visual Design — House of Singh Studios",
    seoDescription:
      "Complete brand identity systems built for established businesses. Logo, typography, color architecture, and brand guidelines that scale.",
    gradient: "linear-gradient(135deg, #3D3D3D 0%, #1A1A1A 100%)",
    deliverables: [
      {
        name: "Brand Strategy",
        description:
          "Market research, competitive analysis, audience definition, and positioning framework before any design begins.",
      },
      {
        name: "Brand Naming",
        description:
          "Name development, exploration, and validation for new brands or sub-brands.",
      },
      {
        name: "Logo System",
        description:
          "Primary mark, wordmark, and responsive variations for every application from signage to social.",
      },
      {
        name: "Typography System",
        description:
          "Font selection, hierarchy, and usage rules that maintain clarity across all media.",
      },
      {
        name: "Color Architecture",
        description:
          "Primary and secondary palettes with specifications for print, digital, and environmental use.",
      },
      {
        name: "Brand Guidelines",
        description:
          "Comprehensive documentation that ensures anyone on your team can apply the brand correctly.",
      },
      {
        name: "Collateral Suite",
        description:
          "Business cards, letterheads, presentation templates, and essential brand applications.",
      },
      {
        name: "Packaging Design",
        description:
          "Product packaging and label design that extends the brand system to physical touchpoints.",
      },
      {
        name: "Art Direction",
        description:
          "Photography and content direction that aligns all visual assets with the brand system.",
      },
    ],
    impact: {
      heading: "Your brand is a business asset, not a design exercise.",
      body: "An inconsistent brand costs you clients you never see. They visit your website, check your social presence, compare you to a competitor with sharper visuals, and leave without contacting you. A brand identity system fixes that permanently.",
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "We learn your business, market, and goals before we design anything.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "Positioning, audience, and visual direction. Every decision has a reason.",
      },
      {
        step: "03",
        name: "Direction",
        description:
          "Visual language, tone, and systems that define how your brand shows up.",
      },
      {
        step: "04",
        name: "Production",
        description:
          "Assets, documentation, and deliverables with quality control at every step.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "Complete system with guidelines, files, and structure to maintain it.",
      },
    ],
    relatedWork: [
      {
        slug: "tedxtoronto",
        name: "TEDxToronto",
        client: "TEDx",
        result: "Complete visual identity system across 14 touchpoints",
        gradient: "linear-gradient(135deg, #2C2C2C 0%, #1A1A1A 100%)",
        image: "/images/projects/tedxtoronto/tedxtoronto.jpg",
      },
      {
        slug: "meridian",
        name: "Meridian",
        client: "Meridian Financial",
        result: "40% improvement in brand recall across digital channels",
        gradient: "linear-gradient(135deg, #3D3D3D 0%, #1A1A1A 100%)",
        image: "/images/projects/meridian/meridian.jpg",
      },
    ],
    ctaHeading: "Ready to fix your brand identity?",
  },
  {
    slug: "visual-media",
    number: "02",
    name: "Visual Media and Content Production",
    subtitle: "Visual Media and Content Production",
    headline:
      "Your content looks different on every platform. Nothing connects.",
    description: "We direct and produce brand photography, campaign films, and social content systems. Every piece serves a strategic purpose. Nothing is produced without a clear brief and defined outcome.",
    tagline: "Content with direction, not just production.",
    seoTitle: "Visual Media and Content Production — House of Singh Studios",
    seoDescription:
      "Brand photography, campaign films, and social content systems built on strategic intent. Visual production directed by brand strategy.",
    gradient: "linear-gradient(135deg, #4A3F35 0%, #2C2419 100%)",
    deliverables: [
      {
        name: "Brand Photography",
        description:
          "Planned and directed shoots that capture your brand personality. Lifestyle, product, and team photography.",
      },
      {
        name: "Video Production",
        description:
          "Brand films, campaign videos, and promotional content from concept through post-production.",
      },
      {
        name: "Short Form Content",
        description:
          "Instagram Reels, YouTube Shorts, and platform-native video optimized for engagement and brand consistency.",
      },
      {
        name: "Social Content Systems",
        description:
          "Templates, formats, and visual frameworks that maintain brand consistency across platforms.",
      },
      {
        name: "Creative Direction",
        description:
          "Art direction and shot planning for all visual production. Every asset aligns with the brand system.",
      },
      {
        name: "Script and Narrative",
        description:
          "Story development and script writing that gives video and campaign content strategic purpose.",
      },
    ],
    impact: {
      heading:
        "Content that converts starts with direction, not a camera.",
      body: "Most businesses produce content reactively. A post here, a video there, no visual thread connecting them. We fix that by building content systems that are planned, directed, and designed to maintain brand consistency at scale.",
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "Understanding your brand, audience, and the visual story you need to tell.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "Defining the content plan, channels, and visual direction before any production.",
      },
      {
        step: "03",
        name: "Direction",
        description:
          "Art direction, shot lists, and creative frameworks for every shoot and edit.",
      },
      {
        step: "04",
        name: "Production",
        description:
          "Photography, video, and content creation executed against the plan.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "Final assets, content libraries, and templates your team can use ongoing.",
      },
    ],
    relatedWork: [],
    ctaHeading: "Ready to build a content system?",
  },
  {
    slug: "digital-design",
    number: "03",
    name: "Digital Design and Experience",
    subtitle: "Digital Design and Experience",
    headline:
      "Your website exists. But it does not work for your business.",
    description: "We design the visual direction, content architecture, and interface systems for websites and digital platforms. Your site should work as hard as your sales team.",
    tagline: "Your highest-traffic brand touchpoint, designed.",
    seoTitle: "Digital Design and Experience — House of Singh Studios",
    seoDescription:
      "Website design direction, content architecture, and interface systems that make your digital presence work commercially.",
    gradient: "linear-gradient(135deg, #2C3D4A 0%, #1A2530 100%)",
    deliverables: [
      {
        name: "UX Research",
        description:
          "User research, competitor audit, and audience analysis that inform every design decision before wireframes begin.",
      },
      {
        name: "Information Architecture",
        description:
          "Site mapping, page hierarchy, and content structure that guides visitors toward the right action.",
      },
      {
        name: "Wireframing",
        description:
          "Low and high-fidelity wireframes that define layout, flow, and functionality before visual design begins.",
      },
      {
        name: "UI Design",
        description:
          "Visual design, component libraries, and page templates that translate your brand into a cohesive digital experience.",
      },
      {
        name: "Interaction Design",
        description:
          "Hover states, scroll behaviors, transitions, and micro-interactions that make the experience feel intentional.",
      },
      {
        name: "Responsive Design",
        description:
          "Adaptive layouts for every screen size. Desktop, tablet, and mobile without compromise.",
      },
      {
        name: "Development Direction",
        description:
          "Design specs, asset handoff, and creative oversight during development. We work with your developers or our partners.",
      },
      {
        name: "Post-Launch Support",
        description:
          "Design iterations, content updates, and visual refinements as your business evolves.",
      },
    ],
    impact: {
      heading: "Your website works 24 hours. It should sell like it.",
      body: "A website that looks good but does not convert is an expensive brochure. We design digital experiences where every page has a job: build trust, demonstrate capability, and move the visitor toward a conversation.",
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "Auditing your current digital presence, audience behavior, and business goals.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "Defining information architecture, user flows, and conversion objectives.",
      },
      {
        step: "03",
        name: "Direction",
        description:
          "Visual design direction, component systems, and interaction patterns.",
      },
      {
        step: "04",
        name: "Production",
        description:
          "High-fidelity designs, prototypes, and developer-ready specifications.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "Design handoff, development oversight, and post-launch iteration support.",
      },
    ],
    relatedWork: [],
    ctaHeading: "Ready to redesign your digital presence?",
  },
  {
    slug: "creative-strategy",
    number: "04",
    name: "Creative Strategy and Systems",
    subtitle: "Creative Strategy and Systems",
    headline:
      "Your team makes brand decisions without a playbook. Every output looks different.",
    description: "We build the strategic layer that gives your team the ability to make brand decisions confidently. Positioning workshops, creative direction frameworks, and visual consistency systems.",
    tagline: "Strategy before design. Clarity before everything.",
    seoTitle: "Creative Strategy and Systems — House of Singh Studios",
    seoDescription:
      "Brand positioning workshops, creative direction frameworks, and visual consistency systems. Strategy that makes everything else work.",
    gradient: "linear-gradient(135deg, #3A3A3A 0%, #1A1A1A 100%)",
    deliverables: [
      {
        name: "Brand Audit",
        description:
          "Comprehensive review of your current brand, digital presence, and competitive landscape with actionable recommendations.",
      },
      {
        name: "Positioning",
        description:
          "Define your market position, unique value, and the story that makes your brand the clear choice for your audience.",
      },
      {
        name: "Audience Discovery",
        description:
          "Research-backed audience profiles, customer journey mapping, and messaging that speaks to buying motivations.",
      },
      {
        name: "Brand Voice",
        description:
          "Tone of voice guidelines, key messaging frameworks, and communication templates for every channel.",
      },
      {
        name: "Creative Frameworks",
        description:
          "Visual and verbal standards that establish what on-brand looks like for every piece of creative output.",
      },
      {
        name: "Content Strategy",
        description:
          "Channel plans, content pillars, publishing cadence, and editorial direction connecting brand messaging to goals.",
      },
      {
        name: "Brand Governance",
        description:
          "Usage rules, approval workflows, and quality standards that protect your brand as your team grows.",
      },
    ],
    impact: {
      heading: "Strategy is what separates a brand from a logo.",
      body: "A logo without strategy is decoration. A brand system without a framework is a collection of files nobody uses correctly. We build the strategic layer that gives your team the ability to make brand decisions confidently, consistently, and without needing external creative support for every choice.",
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "Auditing your brand, market position, and competitive landscape.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "Defining positioning, audience, and the strategic direction for your brand.",
      },
      {
        step: "03",
        name: "Direction",
        description:
          "Building creative frameworks, voice guidelines, and visual standards.",
      },
      {
        step: "04",
        name: "Documentation",
        description:
          "Brand governance, usage rules, and systems your team can follow.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "Presentation to leadership, team training, and implementation roadmap.",
      },
    ],
    relatedWork: [],
    ctaHeading: "Ready to get a strategic framework?",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
