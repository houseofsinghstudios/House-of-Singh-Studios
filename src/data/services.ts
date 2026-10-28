export interface ServiceDeliverable {
  name: string;
  description: string;
}


export interface ServiceProcessStep {
  step: string;
  name: string;
  description: string;
}

// One row in the service page's "Across the GTA" section: a situation, then one line about it.
export interface ServiceLocalRow {
  name: string;
  description: string;
}

export interface ServiceData {
  slug: string;
  number: string;
  name: string;
  subtitle: string;
  // The page's h1: what the page is about, with its place. Shown in the small label above the hero line.
  seoH1: string;
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
  // "(04) Across the GTA": where the studio works and who it works with.
  localSection: {
    heading: string;
    intro: string;
    rows: ServiceLocalRow[];
  };
  process: ServiceProcessStep[];
  ctaHeading: string;
}

// The opening of every service page's "Across the GTA" intro; each service adds one sentence.
const GTA_INTRO =
  "House of Singh Studios works from Toronto and Mississauga with businesses across the Greater Toronto Area, including Brampton, Oakville, Vaughan and Markham, and with clients across Canada remotely. Meetings happen in person across the GTA or on a call, whichever suits you.";

export const services: ServiceData[] = [
  {
    slug: "brand-identity",
    number: "01",
    name: "Brand Identity and Visual Design",
    subtitle: "Brand Identity and Visual Design",
    seoH1: "Brand identity design and rebranding in Toronto",
    headline: "Your business has grown. Your brand has not kept up.",
    description: "We build complete visual systems: logo, typography, colour architecture and brand guidelines. They give your business a consistent, professional presence across every touchpoint.",
    tagline: "The system behind how your business looks.",
    seoTitle: "Brand Identity Design Toronto | House of Singh Studios",
    seoDescription:
      "Brand identity design and rebranding for Toronto and GTA businesses that have outgrown their brand. Strategy, logo systems and guidelines built to last.",
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
          "Name development, exploration, and validation for new brands or sub brands.",
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
        name: "Colour Architecture",
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
    localSection: {
      heading: "Who we work with across the GTA",
      intro: `${GTA_INTRO} For brand identity work, that means a new identity or a rebrand shaped around how your business is seen in its own market.`,
      rows: [
        { name: "Outgrown the brand it started with", description: "A business that has grown past the identity it launched with, and is losing credibility to competitors who look sharper." },
        { name: "Preparing to launch", description: "A founder who wants to start with a brand that looks established on day one." },
        { name: "Repositioning before the next stage", description: "A company entering a new market, service or growth phase that needs the brand to lead." },
      ],
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
    ctaHeading: "Ready to fix your brand identity?",
  },
  {
    slug: "visual-media",
    number: "02",
    name: "Visual Media and Content Production",
    subtitle: "Visual Media and Content Production",
    seoH1: "Brand photography and video production in Toronto",
    headline:
      "Your content looks different on every platform. Nothing connects.",
    description: "We direct and produce brand photography, campaign films, and social content systems. Every piece serves a strategic purpose. Nothing is produced without a clear brief and defined outcome.",
    tagline: "Content with direction, not just production.",
    seoTitle: "Brand Photography and Video Toronto | House of Singh Studios",
    seoDescription:
      "Brand photography, video and social content for Toronto and GTA businesses, directed by brand strategy so every image and film works together.",
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
          "Brand films, campaign videos, and promotional content from concept through post production.",
      },
      {
        name: "Short Form Content",
        description:
          "Instagram Reels, YouTube Shorts, and platform native video optimized for engagement and brand consistency.",
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
    localSection: {
      heading: "Who we work with across the GTA",
      intro: `${GTA_INTRO} For photography and video, that means shoots on location at your business, wherever it is in the GTA.`,
      rows: [
        { name: "Content that looks different everywhere", description: "Photography and video made ad hoc, with no thread connecting them to the brand." },
        { name: "A launch that needs real imagery", description: "Products, spaces or people that stock photography cannot represent." },
        { name: "A team that posts every week", description: "Social content that needs a system, not a scramble." },
      ],
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
    ctaHeading: "Ready to build a content system?",
  },
  {
    slug: "digital-design",
    number: "03",
    name: "Digital Design and Experience",
    subtitle: "Digital Design and Experience",
    seoH1: "Website design for brands in Toronto",
    headline:
      "Your website exists. But it does not work for your business.",
    description: "We design the visual direction, content architecture, and interface systems for websites and digital platforms. Your site should work as hard as your sales team.",
    tagline: "Your highest traffic brand touchpoint, designed.",
    seoTitle: "Website Design for Brands, Toronto | House of Singh Studios",
    seoDescription:
      "Website design for Toronto and GTA businesses whose site no longer sells. Strategy, UX and interface design that turns visits into enquiries.",
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
          "Low and high fidelity wireframes that define layout, flow, and functionality before visual design begins.",
      },
      {
        name: "UI Design",
        description:
          "Visual design, component libraries, and page templates that translate your brand into a cohesive digital experience.",
      },
      {
        name: "Interaction Design",
        description:
          "Hover states, scroll behaviours, transitions, and micro interactions that make the experience feel intentional.",
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
        name: "Post Launch Support",
        description:
          "Design iterations, content updates, and visual refinements as your business evolves.",
      },
    ],
    impact: {
      heading: "Your website works 24 hours. It should sell like it.",
      body: "A website that looks good but does not convert is an expensive brochure. We design digital experiences where every page has a job: build trust, demonstrate capability, and move the visitor toward a conversation.",
    },
    localSection: {
      heading: "Who we work with across the GTA",
      intro: `${GTA_INTRO} For website design, that means a site built around the customers you actually serve, wherever they find you.`,
      rows: [
        { name: "A website that no longer sells", description: "The business has moved on, the site has not, and enquiries show it." },
        { name: "A new brand that needs a home", description: "An identity is ready and the website has to carry it with the same care." },
        { name: "A product or service launch", description: "A new offer that deserves its own clear, convincing pages." },
      ],
    },
    process: [
      {
        step: "01",
        name: "Discovery",
        description:
          "Auditing your current digital presence, audience behaviour, and business goals.",
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
          "High fidelity designs, prototypes, and specifications ready for developers.",
      },
      {
        step: "05",
        name: "Delivery",
        description:
          "Design handoff, development oversight, and post launch iteration support.",
      },
    ],
    ctaHeading: "Ready to redesign your digital presence?",
  },
  {
    slug: "creative-strategy",
    number: "04",
    name: "Creative Strategy and Systems",
    subtitle: "Creative Strategy and Systems",
    seoH1: "Brand strategy and positioning in Toronto",
    headline:
      "Your team makes brand decisions without a playbook. Every output looks different.",
    description: "We build the strategic layer that gives your team the ability to make brand decisions confidently. Positioning workshops, creative direction frameworks, and visual consistency systems.",
    tagline: "Strategy before design. Clarity before everything.",
    seoTitle: "Brand Strategy Consultant Toronto | House of Singh Studios",
    seoDescription:
      "Brand strategy and positioning for Toronto and GTA businesses at a turning point. Audits, workshops and frameworks that make every design decision clear.",
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
          "Audience profiles backed by research, a map of how customers find and choose you, and messaging that speaks to buying motivations.",
      },
      {
        name: "Brand Voice",
        description:
          "Tone of voice guidelines, key messaging frameworks, and communication templates for every channel.",
      },
      {
        name: "Creative Frameworks",
        description:
          "Visual and verbal standards that establish what on brand looks like for every piece of creative output.",
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
    localSection: {
      heading: "Who we work with across the GTA",
      intro: `${GTA_INTRO} For brand strategy, workshops run at your office or on a call, with your leadership team in the room.`,
      rows: [
        { name: "Decisions without a playbook", description: "A team making brand choices by instinct, with a different result each time." },
        { name: "Growth that outpaced the brand", description: "A business whose positioning no longer matches what it sells or who it serves." },
        { name: "Leadership that needs clarity first", description: "A founder or board that wants the strategy settled before any design begins." },
      ],
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
    ctaHeading: "Ready to get a strategic framework?",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
