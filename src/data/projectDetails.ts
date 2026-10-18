import type { PortableTextBlock } from "@portabletext/react";

export interface ProjectDetailImage {
  src: string;
  alt: string;
}

// An image inside a case study block, with its natural pixel size so it renders uncropped.
export interface BlockImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// One composed section of the project page. Order comes from Sanity.
export type CaseStudyBlock =
  | { key: string; type: "split"; side: "left" | "right"; heading: string; body: PortableTextBlock[]; image: BlockImage }
  | { key: string; type: "offset"; heading: string; body: PortableTextBlock[]; image: BlockImage }
  | { key: string; type: "full"; image: BlockImage; caption?: string }
  | { key: string; type: "pair"; images: [BlockImage, BlockImage] }
  | { key: string; type: "statement"; quote: string; body?: PortableTextBlock[] }
  | { key: string; type: "feature"; image: BlockImage; detail: BlockImage; caption?: string };

export interface ProjectDetailStat {
  value: string;
  label: string;
}

export interface ProjectDetail {
  slug: string;
  name: string;
  category: string;
  year: string;
  industry?: string;
  timeline?: string;
  summary: string;
  heroImage: ProjectDetailImage;
  overview: {
    heading: string;
    paragraphs: string[];
  };
  challenge: {
    heading: string;
    paragraphs: string[];
  };
  approach: {
    heading: string;
    paragraphs: string[];
  };
  deliverables: { title: string; description: string }[];
  images: {
    set1: ProjectDetailImage[];
    set2?: ProjectDetailImage[];
  };
  result: {
    heading: string;
    paragraphs: string[];
    stats?: ProjectDetailStat[];
  };
  nextProject: { slug: string; name: string };
  // When present and non-empty, these replace the legacy challenge, approach, gallery and result sections.
  blocks?: CaseStudyBlock[];
  // caseStudy.workDelivered: what was genuinely delivered. Chooses the Project Planner link.
  workDelivered?: string[];
}

export const projectDetails: ProjectDetail[] = [
  {
    slug: "tedxtoronto",
    name: "TEDxToronto Visual Identity",
    category: "Brand Identity",
    year: "2024",
    industry: "Events · Media",
    timeline: "10 weeks",
    summary:
      "Event branding and visual system for one of Canada\u2019s largest TEDx events, applied across 14 touchpoints by a 40-person creative team.",
    heroImage: {
      src: "/images/projects/tedxtoronto/tedxtoronto.jpg",
      alt: "TEDxToronto visual identity system applied across event materials",
    },
    overview: {
      heading: "The Business",
      paragraphs: [
        "TEDxToronto is one of Canada\u2019s largest independently organized TEDx events, bringing together thinkers, creators, and leaders to share ideas across disciplines. The organization operates across digital, print, and live event environments with a volunteer-driven creative team of over 40 people.",
        "The event attracts thousands of attendees annually and produces content that reaches millions online. Every visual touchpoint\u2014from stage design to social media\u2014represents the TEDxToronto brand to a discerning, design-literate audience.",
      ],
    },
    challenge: {
      heading: "Fragmented identity across 14 touchpoints",
      paragraphs: [
        "The event needed a visual identity system that could hold up across stage design, digital content, print materials, social media, signage, attendee badges, and sponsor communications\u201414 distinct touchpoints in total. Each application was being handled by different members of a large volunteer creative team.",
        "Without a governing system, the brand looked different depending on who made it. The TEDx framework added constraints: the identity had to feel contemporary and bold while respecting global TEDx guidelines. Consistency at this scale required more than a logo file\u2014it required a system built for delegation.",
      ],
    },
    approach: {
      heading: "A system built for 40 people to execute independently",
      paragraphs: [
        "We started with a discovery phase to map every touchpoint, identify the operational constraints, and understand which decisions the creative team needed to make independently versus centrally. Strategy defined the visual direction and established clear parameters\u2014not just what to do, but what not to do.",
        "The identity system was designed for delegation from the start. Modular components, prescriptive usage rules, and templated formats meant a volunteer with basic design skills could produce on-brand materials without needing creative review. Production included all event collateral, digital assets, and documentation.",
      ],
    },
    deliverables: [
      {
        title: "Visual Identity System",
        description:
          "Primary mark, wordmark, and lockup variations for all event applications.",
      },
      {
        title: "Event Branding",
        description:
          "Stage design direction, signage system, and environmental graphics.",
      },
      {
        title: "Print Collateral",
        description:
          "Programs, attendee badges, sponsor materials, and printed signage.",
      },
      {
        title: "Digital Asset Library",
        description:
          "Social media templates, email headers, and web graphics.",
      },
      {
        title: "Brand Guidelines",
        description:
          "Comprehensive documentation enabling 40+ volunteers to produce on-brand work.",
      },
      {
        title: "Creative Direction",
        description:
          "Oversight and quality control across all production streams.",
      },
    ],
    images: {
      set1: [
        {
          src: "/images/projects/tedxtoronto/tedxtoronto.jpg",
          alt: "TEDxToronto primary brand identity and logo system",
        },
      ],
    },
    result: {
      heading:
        "A visual identity that holds across 14 touchpoints without a single inconsistency.",
      paragraphs: [
        "The identity system gave TEDxToronto a consistent and professional visual presence across every application. The guidelines enabled a 40-person team to produce on-brand materials independently, reducing revision cycles by an estimated 60% and maintaining quality throughout the event lifecycle.",
        "The modular system scaled from a 6-inch badge to a 30-foot stage backdrop without losing coherence. For the first time, every piece of TEDxToronto communication looked like it came from the same organization.",
      ],
      stats: [
        { value: "14", label: "Touchpoints covered" },
        { value: "40+", label: "Team members using the system" },
        { value: "60%", label: "Fewer revision cycles" },
      ],
    },
    // No next project: this is the only hardcoded project. The template skips the row when slug is empty.
    nextProject: { slug: "", name: "" },
  },
];

export function getProjectDetail(
  slug: string
): ProjectDetail | undefined {
  return projectDetails.find((p) => p.slug === slug);
}
