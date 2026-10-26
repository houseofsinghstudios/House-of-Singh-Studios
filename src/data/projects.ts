import type { ProjectType } from "@/lib/initiatives/types";

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
  // The 1200x630 share image (og:image) for Sanity case studies. Missing for the static fallback.
  shareImage?: string;
  sections: {
    business: ProjectSection;
    challenge: ProjectSection;
    approach: ProjectSection;
    deliverables: ProjectSection;
    result: ProjectSection;
  };
  deliverablesList: string[];
  disciplines?: string[];
  serviceCategories?: string[];
  // Missing means client work: no label.
  projectType?: ProjectType;
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
    seoTitle: "TEDxToronto Visual Identity",
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
          "The identity system gave TEDxToronto a consistent and professional visual presence across every touchpoint. The guidelines enabled a large team to produce on brand materials independently, reducing revision cycles and maintaining quality throughout the event lifecycle.",
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
];

