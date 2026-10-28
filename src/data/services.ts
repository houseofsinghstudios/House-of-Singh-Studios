import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";

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

// One question on a service page. The answer is plain text; links are written in it as
// [visible text](/path) or [visible text](https://...), nothing else.
export interface ServiceFaq {
  question: string;
  answer: string;
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
  // "Questions, answered", after Related work. A service without questions shows no section.
  faqs?: ServiceFaq[];
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
    seoTitle: "Branding and Brand Identity, Toronto | House of Singh Studios",
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
    faqs: [
      {
        question: "What is brand identity, and how is it different from a logo?",
        answer:
          "Brand identity is the complete visual and verbal system that makes a business recognisable: its logo, typography, colour, imagery, tone of voice and the rules that hold them together. A logo is one part of that system. A logo tells people your name; a brand identity tells them who you are, consistently, everywhere they meet you. See [what a complete brand identity system includes](/insights/what-a-brand-identity-system-actually-includes-and-why-a-logo-is-not-enough), or explore [the brand identity systems in our work](/work).",
      },
      {
        question: "How much does branding cost in Canada?",
        answer:
          "Most Canadian businesses pay $8,000 to $35,000 for a complete brand identity from an established studio, before HST. Freelancers typically charge $1,500 to $8,000, and larger agencies start around $25,000. A rebrand usually costs about the same as a new identity, while a refresh typically costs 30 to 50 percent of one. At House of Singh Studios, projects start from $1,000, and [the Project Planner](/start) gives you a personal estimate in two minutes. For a full breakdown, read [what brand identity design costs in Canada](/insights/how-much-does-brand-identity-design-cost-in-canada-a-studio-s-honest-breakdown) and [what Toronto branding agencies charge](/insights/branding-agency-pricing-toronto).",
      },
      {
        question: "What does a brand identity package include?",
        answer:
          "A complete brand identity package includes brand strategy, a logo system with variations, typography, a colour palette, brand guidelines and the everyday applications your business needs, such as stationery, presentation templates and social media templates. Some also cover packaging, signage or [brand photography direction](/services/visual-media). Two packages at the same price can contain very different work, so always ask what is included before comparing. We scope every package to what your business actually needs: [plan your project](/start), or [tell us what you are working on](/contact).",
      },
      {
        question: "What should brand guidelines include?",
        answer:
          "Brand guidelines should include how to use your logo, your colour palette with exact values for print and screen, typography and hierarchy, photography and imagery style, tone of voice, and real examples of the brand applied. Good guidelines are written for the people who use them, so your team and suppliers produce consistent work without having to ask. Every brand identity we deliver includes guidelines your team can actually use, and if your current brand has none, our [brand strategy and systems work](/services/creative-strategy) can create them.",
      },
      {
        question: "What are the steps to rebrand a business, and how long does it take?",
        answer:
          `A rebrand moves through five stages: discovery, to understand the business and its market; strategy, to define positioning and audience; creative direction, where the new identity takes shape; production, where every asset is built; and delivery, with guidelines and files your team can use. A focused rebrand takes four to six weeks, a complete identity system eight to twelve weeks, and a rebrand rolled out across signage, print and [your website](/services/digital-design) twelve to sixteen weeks or more. The first step is a [30 minute discovery call](${DISCOVERY_CALL_URL}).`,
      },
      {
        question: "Should I rebrand or refresh my brand?",
        answer:
          "Refresh if your brand still reflects who you are but looks dated or inconsistent: you keep the recognition you have built and tighten the system around it. Rebrand if your business has changed, moved into new markets or outgrown its positioning, so the brand no longer tells the truth about it. A refresh usually costs 30 to 50 percent of a full rebrand, and a well planned rollout keeps your existing customers with you either way. Not sure which you need? The two minute [Brand Pulse check](/brand-pulse) shows where your brand stands, and our guide to [rebrand or refresh](/insights/rebrand-or-refresh-how-established-businesses-should-decide) walks through the decision.",
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
    seoTitle: "Website Design Toronto | House of Singh Studios",
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
    faqs: [
      {
        question: "How much does a website cost in Canada?",
        answer:
          "A business website in Canada typically costs $3,000 to $12,000 from a freelancer, $12,000 to $45,000 from a design studio, and $45,000 and beyond from a large agency, before HST. Template builders can cost under $3,000, plus your own time. What changes the price is how much strategy, custom design and content goes in. Website design cost in Toronto sits toward the top of the Canadian range. For a full breakdown, read [how much a website costs in Canada](/insights/how-much-does-a-website-cost-in-canada), or get a personal estimate in two minutes with the [Project Planner](/start).",
      },
      {
        question: "How long does it take to build a website?",
        answer:
          `A template website can be live within days. A freelance build usually takes four to eight weeks, and a studio project eight to sixteen weeks, most of it spent on strategy, structure, design and content rather than code. A website redesign takes a similar time, depending on how much is rethought. If your brand needs work too, plan [brand identity](/services/brand-identity) first, so the site is designed once, not twice. The fastest way to a clear timeline is a [30 minute discovery call](${DISCOVERY_CALL_URL}).`,
      },
      {
        question: "How much does a website redesign cost?",
        answer:
          "A website redesign that keeps your structure and content and refreshes the design costs less than a new site. A redesign that rethinks strategy, structure, content and design costs about the same as building a new website, because it effectively is one. Redesign when the site still serves your business but looks dated or converts poorly; start fresh when the business, audience or offer has changed. Not sure where your brand stands first? The two minute [Brand Pulse check](/brand-pulse) shows you, or [tell us about your current site](/contact).",
      },
      {
        question: "Squarespace, Wix or WordPress: which is best for a business website?",
        answer:
          "Squarespace is the easiest to manage and suits simple sites with strong visuals. Wix is flexible for small businesses that want to build themselves. WordPress is the most extensible but needs ongoing maintenance and security care. Shopify is the standard for online stores. A business outgrows templates when it needs a distinctive design, faster pages, deeper search performance or connected systems. That is when a custom build with a modern content system pays off. If you are weighing the cost of each route, [read our website cost guide](/insights/how-much-does-a-website-cost-in-canada).",
      },
      {
        question: "How do I choose a web design company in Toronto?",
        answer:
          `Look at work similar to what you need, then ask every web design company the same questions: Who will actually design my site? Is there a strategy phase before design? Who writes the content? Will I own the site and be able to update it? What happens after launch? A studio that answers all five clearly is worth more than a cheaper quote that answers two. See [our work](/work), read [how to brief a design studio](/insights/how-to-brief-a-design-studio-so-you-actually-get-what-you-want), and bring your questions to a [discovery call](${DISCOVERY_CALL_URL}).`,
      },
      {
        question: "Will I own my website, and can my team update it?",
        answer:
          "You should own your domain, your content and your design files outright, with accounts set up in your business's name, never the designer's. We build every site on a content management system, so your team can edit pages, publish articles and add projects without calling anyone, and we hand over documentation and a walkthrough at launch. If your current site is held in someone else's account, that is worth fixing before anything else. [Plan your project](/start) to see what a handover includes, or [ask us directly](/contact).",
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
