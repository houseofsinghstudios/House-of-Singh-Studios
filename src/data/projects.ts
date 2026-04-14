export interface ProjectSection {
  label: string;
  paragraphs: string[];
}

export interface Project {
  slug: string;
  number: string;
  name: string;
  workType: string;
  origin: string;
  year: string;
  description: string;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  gradient: string;
  image: string;
  sections: {
    business: ProjectSection;
    challenge: ProjectSection;
    approach: ProjectSection;
    deliverables: ProjectSection;
    result: ProjectSection;
  };
  deliverablesList: string[];
  disciplines?: string[];
  serviceCategory?: string;
}

export const projects: Project[] = [
  {
    slug: "tedxtoronto",
    number: "01",
    name: "TEDxToronto Visual Identity",
    workType: "Brand Identity",
    origin: "Client Project",
    year: "2024",
    gradient: "linear-gradient(155deg, #D8D2CA, #C8BFB4)",
    image: "/images/projects/tedxtoronto/tedxtoronto.jpg",
    description:
      "Event branding and visual system for one of Canada\u2019s largest TEDx events.",
    shortDescription: "Event branding and visual identity system for one of Canada\u2019s largest TEDx events.",
    seoTitle: "TEDxToronto Visual Identity \u2014 House of Singh Studios",
    seoDescription:
      "Brand identity and visual system for TEDxToronto. Event branding, creative direction, and design by House of Singh Studios.",
    sections: {
      business: {
        label: "(The Business)",
        paragraphs: [
          "TEDxToronto is one of Canada\u2019s largest independently organized TEDx events, bringing together thinkers, creators, and leaders to share ideas across disciplines. The organization operates across digital, print, and live event environments.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        paragraphs: [
          "The event needed a visual identity system that could hold up across a wide range of applications: stage design, digital content, print materials, and social media. The brand had to feel contemporary and bold while respecting the TEDx framework. Consistency across a large volunteer-driven creative team was a core requirement.",
        ],
      },
      approach: {
        label: "(The Approach)",
        paragraphs: [
          "We began with a discovery phase to understand the event\u2019s audience, themes, and operational constraints. Strategy work defined the visual direction and established parameters for the creative team. We developed the identity system with guidelines that ensured consistency whether applied by a designer or a volunteer. Production included all event collateral, digital assets, and brand documentation.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        paragraphs: [],
      },
      result: {
        label: "(The Result)",
        paragraphs: [
          "The identity system gave TEDxToronto a consistent and professional visual presence across every touchpoint. The guidelines enabled a large team to produce on-brand materials independently, reducing revision cycles and maintaining quality throughout the event lifecycle.",
        ],
      },
    },
    deliverablesList: [
      "Visual identity system",
      "Event branding and stage design direction",
      "Print collateral suite",
      "Digital and social media assets",
      "Brand guidelines for team-wide application",
      "Creative direction across production",
    ],
  },
  {
    slug: "meridian",
    number: "02",
    name: "Meridian Financial Group",
    workType: "Brand Identity",
    origin: "Studio Exploration",
    year: "2024",
    gradient: "linear-gradient(155deg, #CAD2D8, #B4BFC8)",
    image: "/images/projects/meridian/meridian.jpg",
    description:
      "Brand identity system for a mid-market financial services firm.",
    shortDescription: "Typography-led identity for a mid-market financial services firm.",
    seoTitle: "Meridian Financial Group \u2014 House of Singh Studios",
    seoDescription:
      "Brand identity system for a mid-market financial services firm. Studio exploration by House of Singh Studios.",
    sections: {
      business: {
        label: "(The Business)",
        paragraphs: [
          "Meridian Financial Group is a mid-market financial services firm serving clients across wealth management, corporate advisory, and investment planning. The firm operates in a sector where trust and credibility are communicated through visual presence before any conversation takes place.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        paragraphs: [
          "Financial services firms often default to conservative and generic branding that makes them indistinguishable from competitors. Meridian needed a visual identity that conveyed stability and professionalism while standing apart in a crowded market. The brand had to work across digital platforms, print materials, and client-facing presentations.",
        ],
      },
      approach: {
        label: "(The Approach)",
        paragraphs: [
          "We explored the intersection of tradition and modernity in financial branding. The strategy phase examined competitor positioning and identified an opportunity for Meridian to own a more refined and distinctive visual space. Creative direction established a typographic-led identity with a restrained color palette that communicates confidence without excess.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        paragraphs: [],
      },
      result: {
        label: "(The Result)",
        paragraphs: [
          "The identity system positions Meridian as a firm that takes its own presentation as seriously as its financial advice. The documented guidelines ensure consistent application across the organization as it grows.",
        ],
      },
    },
    deliverablesList: [
      "Logo system with primary and secondary marks",
      "Typography and color architecture",
      "Brand guidelines document",
      "Business card and stationery suite",
      "Presentation template system",
      "Digital application direction",
    ],
  },
  {
    slug: "soulbound",
    number: "03",
    name: "Soulbound Publication",
    workType: "Publication Design",
    origin: "Independent Project",
    year: "2023",
    gradient: "linear-gradient(155deg, #D2D8CA, #BFC8B4)",
    image: "/images/projects/soulbound/soulbound.jpg",
    description:
      "Publication cover design and art direction for a leadership book.",
    shortDescription: "Cover design and art direction for a leadership publication.",
    seoTitle: "Soulbound Publication \u2014 House of Singh Studios",
    seoDescription:
      "Publication cover design and art direction for a leadership book. Independent project by House of Singh Studios.",
    sections: {
      business: {
        label: "(The Business)",
        paragraphs: [
          "Soulbound is a publication exploring leadership, personal growth, and the intersection of discipline and creativity. The book is positioned for an audience of emerging leaders and professionals who value substance over self-help cliches.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        paragraphs: [
          "The publication needed cover design and art direction that communicated depth and seriousness without being academic or dry. The visual treatment had to stand out in a market saturated with generic leadership book covers while reflecting the book\u2019s core themes of intentionality and inner strength.",
        ],
      },
      approach: {
        label: "(The Approach)",
        paragraphs: [
          "We treated the cover as a brand identity exercise, not just a graphic design task. The discovery phase examined the book\u2019s themes, target audience, and competitive landscape. Creative direction explored typographic treatments that conveyed authority and calm. The final direction uses restrained composition and deliberate negative space to signal confidence.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        paragraphs: [],
      },
      result: {
        label: "(The Result)",
        paragraphs: [
          "The cover design gives Soulbound a visual identity that matches the depth of its content. The typographic approach differentiates it from the crowded leadership genre and positions it as a serious, design-conscious publication.",
        ],
      },
    },
    deliverablesList: [
      "Cover design with front, spine, and back",
      "Typography and layout system",
      "Art direction for interior chapter openers",
      "Digital cover variations for online distribution",
      "Print-ready production files",
    ],
  },
  {
    slug: "nomad-kitchen",
    number: "04",
    name: "Nomad Kitchen",
    workType: "Brand Identity, Packaging",
    origin: "Independent Project",
    year: "2023",
    gradient: "linear-gradient(155deg, #D8CAD2, #C8B4BF)",
    image: "/images/projects/nomad-kitchen/nomad-kitchen.jpg",
    description:
      "Brand identity and packaging for a modern South Asian food brand.",
    shortDescription: "Visual identity and packaging connecting cultural authenticity with contemporary design.",
    seoTitle: "Nomad Kitchen \u2014 House of Singh Studios",
    seoDescription:
      "Brand identity and packaging for a modern South Asian food brand. Independent project by House of Singh Studios.",
    sections: {
      business: {
        label: "(The Business)",
        paragraphs: [
          "Nomad Kitchen is a modern food brand rooted in South Asian culinary traditions. The brand bridges authentic flavors with contemporary presentation, targeting food-conscious consumers who value both heritage and quality.",
        ],
      },
      challenge: {
        label: "(The Challenge)",
        paragraphs: [
          "South Asian food brands in North America often rely on predictable cultural imagery that limits their market appeal. Nomad Kitchen needed a visual identity that honored its roots while feeling current, premium, and accessible to a broad audience. The packaging had to work on shelf, in e-commerce, and across social media.",
        ],
      },
      approach: {
        label: "(The Approach)",
        paragraphs: [
          "We approached this as a positioning exercise first. Strategy defined where Nomad Kitchen sits in the market between traditional ethnic food brands and premium contemporary labels. Creative direction developed a visual language that uses warm tones, clean typography, and confident composition. Packaging design was integrated from the start, not treated as an afterthought.",
        ],
      },
      deliverables: {
        label: "(Deliverables)",
        paragraphs: [],
      },
      result: {
        label: "(The Result)",
        paragraphs: [
          "The identity positions Nomad Kitchen as a brand that belongs on premium shelves alongside established food brands. The visual system connects cultural authenticity with contemporary design, giving the brand room to grow across product categories.",
        ],
      },
    },
    deliverablesList: [
      "Complete brand identity system",
      "Logo with primary mark and wordmark",
      "Color palette and typography system",
      "Packaging design for product line",
      "Brand guidelines document",
      "Social media visual templates",
    ],
  },
];

