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
}

export const services: ServiceData[] = [
  {
    slug: "brand-identity",
    number: "01",
    name: "Brand Identity and Visual Design",
    tagline:
      "Your brand identity is the first thing your market judges you on. We build complete visual systems — logo, typography, color architecture, and brand guidelines — that give your business a consistent, professional presence across every touchpoint. The result is a brand that looks as established as your business actually is.",
    description:
      "Complete brand identity systems built for established businesses. Logo, typography, color architecture, and brand guidelines that scale.",
    seoTitle: "Brand Identity and Visual Design — House of Singh Studios",
    seoDescription:
      "Complete brand identity systems built for established businesses. Logo, typography, color architecture, and brand guidelines that scale.",
    gradient: "linear-gradient(135deg, #3D3D3D 0%, #1A1A1A 100%)",
    deliverables: [
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
          "A comprehensive document that ensures anyone on your team can apply the brand correctly.",
      },
      {
        name: "Collateral Suite",
        description:
          "Business cards, letterheads, presentation templates, and essential brand applications.",
      },
      {
        name: "Art Direction",
        description:
          "Photography and content direction that aligns visual assets with the brand system.",
      },
    ],
    impact: {
      heading: "Your brand is a business asset, not a design exercise.",
      body: "An inconsistent brand costs you clients you never see. They visit your website, check your social presence, compare you to a competitor with sharper visuals, and leave without contacting you. A brand identity system fixes that permanently. It makes every touchpoint work together so your business looks as credible as it actually is.",
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "We audit your current brand, research your market, and interview stakeholders to understand what the brand needs to be.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "We define positioning, audience priorities, and visual direction before any design work begins.",
      },
      {
        step: "03",
        name: "Creative Direction",
        description:
          "We develop the visual language: logo concepts, typography, color, and expression across key applications.",
      },
      {
        step: "04",
        name: "Production",
        description:
          "We refine, document, and build every deliverable with AI-assisted quality control at each stage.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "You receive the complete brand system with guidelines, source files, and a handoff session to ensure your team can use it.",
      },
    ],
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
    tagline:
      "Content without a visual strategy is noise. We direct and produce brand photography, campaign films, and social content systems built on strategic intent. Every image and frame reinforces your brand positioning. The output works across channels because it was planned that way from the start.",
    description:
      "Brand photography, campaign films, and social content systems built on strategic intent. Visual production directed by brand strategy.",
    seoTitle: "Visual Media and Content Production — House of Singh Studios",
    seoDescription:
      "Brand photography, campaign films, and social content systems built on strategic intent. Visual production directed by brand strategy.",
    gradient: "linear-gradient(135deg, #4A3F35 0%, #2C2419 100%)",
    deliverables: [
      {
        name: "Brand Photography",
        description:
          "Planned and directed shoots that capture your brand's personality, not generic stock imagery.",
      },
      {
        name: "Campaign Films",
        description:
          "Short form and long form video content built around narrative and brand positioning.",
      },
      {
        name: "Social Content Systems",
        description:
          "Templates, formats, and visual frameworks that maintain brand consistency across platforms.",
      },
      {
        name: "Art Direction",
        description:
          "Creative direction for all visual production, ensuring every asset aligns with the brand system.",
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
      body: "Most businesses produce content reactively. A post here, a video there, no visual thread connecting them. The result is a brand that looks different on every platform. We fix that by building content systems that are planned, directed, and designed to maintain brand consistency at scale.",
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "We review your current content, audit your channels, and identify gaps between your brand and how it shows up visually.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "We define content pillars, visual direction, and a production plan mapped to your business goals.",
      },
      {
        step: "03",
        name: "Creative Direction",
        description:
          "We establish the visual treatment, shot lists, and narrative frameworks before any production begins.",
      },
      {
        step: "04",
        name: "Production",
        description:
          "We direct and produce the content with consistent quality control across every deliverable.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "You receive organized, formatted assets with usage guidelines and templates for ongoing content creation.",
      },
    ],
    relatedWork: [],
  },
  {
    slug: "digital-design",
    number: "03",
    name: "Digital Design and Experience",
    tagline:
      "Your website is your highest-traffic brand touchpoint. We design the visual direction, content architecture, and interface systems that make it work commercially. We lead the design, work with development partners to build it, and ensure every page serves a business purpose — not just an aesthetic one.",
    description:
      "Website design direction, content architecture, and interface systems that make your digital presence work commercially.",
    seoTitle: "Digital Design and Experience — House of Singh Studios",
    seoDescription:
      "Website design direction, content architecture, and interface systems that make your digital presence work commercially.",
    gradient: "linear-gradient(135deg, #2C3D4A 0%, #1A2530 100%)",
    deliverables: [
      {
        name: "Website Design Direction",
        description:
          "Visual design, layout systems, and page templates that translate your brand into a digital experience.",
      },
      {
        name: "Content Architecture",
        description:
          "Page structure, information hierarchy, and content organization that guides visitors toward action.",
      },
      {
        name: "Interface Design",
        description:
          "Interactive elements, navigation patterns, and micro-interactions that make the experience feel intentional.",
      },
      {
        name: "Digital Brand Systems",
        description:
          "Component libraries and design tokens that ensure consistency across your entire digital presence.",
      },
      {
        name: "Ongoing Support",
        description:
          "Post-launch design iterations, content updates, and visual refinements as your business evolves.",
      },
    ],
    impact: {
      heading: "Your website works 24 hours. It should sell like it.",
      body: "A website that looks good but does not convert is an expensive brochure. We design digital experiences where every page has a job: build trust, demonstrate capability, and move the visitor toward a conversation. Structure and strategy come before aesthetics.",
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "We audit your current digital presence, analyze user behavior, and define what the website needs to achieve for your business.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "We map content architecture, page hierarchy, and conversion paths before any visual design begins.",
      },
      {
        step: "03",
        name: "Creative Direction",
        description:
          "We design the visual system: layouts, typography, imagery direction, and interaction patterns.",
      },
      {
        step: "04",
        name: "Production",
        description:
          "We build detailed design files, work with development partners, and ensure pixel-level quality through review cycles.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "You receive a launched website with documentation, a component guide, and a plan for ongoing iteration.",
      },
    ],
    relatedWork: [],
  },
  {
    slug: "creative-strategy",
    number: "04",
    name: "Creative Strategy and Systems",
    tagline:
      "Most brand problems are strategy problems disguised as design problems. We run positioning workshops, build creative direction frameworks, and design content systems that give your team the structure to maintain brand quality without depending on a designer for every decision. For businesses exploring AI in their creative workflow, we provide guidance on tool selection and integration.",
    description:
      "Brand positioning workshops, creative direction frameworks, and visual consistency systems. Strategy that makes everything else work.",
    seoTitle: "Creative Strategy and Systems — House of Singh Studios",
    seoDescription:
      "Brand positioning workshops, creative direction frameworks, and visual consistency systems. Strategy that makes everything else work.",
    gradient: "linear-gradient(135deg, #3A3A3A 0%, #1A1A1A 100%)",
    deliverables: [
      {
        name: "Positioning Workshops",
        description:
          "Facilitated sessions that define your brand's market position, audience, and competitive differentiation.",
      },
      {
        name: "Creative Frameworks",
        description:
          "Direction documents that establish visual and verbal standards for all creative output.",
      },
      {
        name: "Content Strategy",
        description:
          "Channel plans, content pillars, and publishing systems that connect brand messaging to business goals.",
      },
      {
        name: "Visual Consistency Systems",
        description:
          "Documentation and templates that ensure brand quality is maintained without creative bottlenecks.",
      },
      {
        name: "AI Workflow Integration",
        description:
          "Guidance on adopting AI tools in your creative operations: tool selection, workflow design, and implementation support.",
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
          "We interview stakeholders, review existing brand materials, and assess where strategic gaps are causing inconsistency.",
      },
      {
        step: "02",
        name: "Strategy",
        description:
          "We define positioning, audience frameworks, and the creative principles that will govern all future brand decisions.",
      },
      {
        step: "03",
        name: "Creative Direction",
        description:
          "We build the frameworks, templates, and systems that translate strategy into daily creative operations.",
      },
      {
        step: "04",
        name: "Production",
        description:
          "We document everything: guidelines, playbooks, and reference materials your team can use independently.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "You receive a complete strategic toolkit with a handoff session and optional ongoing advisory support.",
      },
    ],
    relatedWork: [],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
