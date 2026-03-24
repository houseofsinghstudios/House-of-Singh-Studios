export interface ProjectDetailImage {
  src: string;
  alt: string;
}

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
    nextProject: { slug: "meridian", name: "Meridian Financial Group" },
  },
  {
    slug: "meridian",
    name: "Meridian Financial Group",
    category: "Brand Identity",
    year: "2024",
    industry: "Financial Services",
    timeline: "8 weeks",
    summary:
      "Brand identity system for a mid-market financial services firm that needed to stand apart in a sector where everyone looks the same.",
    heroImage: {
      src: "/images/projects/meridian/meridian.jpg",
      alt: "Meridian Financial Group brand identity system",
    },
    overview: {
      heading: "The Business",
      paragraphs: [
        "Meridian Financial Group is a mid-market financial services firm serving clients across wealth management, corporate advisory, and investment planning. The firm competes for high-net-worth clients in a sector where trust and credibility are communicated through visual presence before any conversation takes place.",
        "Meridian\u2019s client base expects discretion, stability, and professionalism. The brand needed to signal these qualities immediately\u2014on the website, in presentations, and across every client-facing document.",
      ],
    },
    challenge: {
      heading:
        "Indistinguishable from every other financial services firm in the market",
      paragraphs: [
        "Financial services firms default to the same visual language: navy blue, serif fonts, stock photography of handshakes. Meridian\u2019s existing brand followed this formula exactly, making them invisible in competitive comparisons. Prospects could not distinguish Meridian from three other firms in the same market.",
        "The brand had to work across digital platforms, print materials, and client-facing presentations. It needed to convey stability and professionalism while standing apart from competitors who all made the same visual choices.",
      ],
    },
    approach: {
      heading:
        "Own the space between tradition and modernity that no competitor occupies",
      paragraphs: [
        "We examined competitor positioning and identified a visual gap: every firm in Meridian\u2019s market defaulted to either conservative-traditional or aggressive-modern. Neither reflected Meridian\u2019s actual character. Strategy defined a position between those extremes\u2014refined confidence without excess.",
        "Creative direction established a typographic-led identity with a restrained color palette built on warm neutrals rather than the expected corporate blues. The system communicates that Meridian takes its own presentation as seriously as its financial advice\u2014and that distinction registers with the high-net-worth clients they serve.",
      ],
    },
    deliverables: [
      {
        title: "Logo System",
        description:
          "Primary mark, secondary mark, and responsive lockups for all applications.",
      },
      {
        title: "Typography System",
        description:
          "Type hierarchy and pairing rules for digital, print, and presentations.",
      },
      {
        title: "Color Architecture",
        description:
          "Restrained palette built on warm neutrals, specified for screen and print.",
      },
      {
        title: "Brand Guidelines",
        description:
          "Documented standards ensuring consistent application across the organization.",
      },
      {
        title: "Stationery Suite",
        description:
          "Business cards, letterhead, envelopes, and client-facing documents.",
      },
      {
        title: "Presentation System",
        description:
          "Templated pitch decks and quarterly report formats for client meetings.",
      },
    ],
    images: {
      set1: [
        {
          src: "/images/projects/meridian/meridian.jpg",
          alt: "Meridian Financial Group brand identity and stationery system",
        },
      ],
    },
    result: {
      heading:
        "A brand that clients recognize before the first meeting starts.",
      paragraphs: [
        "The identity system positions Meridian as a firm that takes its own presentation as seriously as its financial advice. In competitive reviews, Meridian now registers as distinct\u2014prospects recall the brand after a single exposure to the website or a presentation deck.",
        "The documented guidelines ensure consistent application as the firm grows, eliminating the visual drift that made the previous brand unreliable across touchpoints.",
      ],
      stats: [
        { value: "40%", label: "Improvement in brand recall" },
        { value: "6", label: "Touchpoints unified" },
      ],
    },
    nextProject: { slug: "soulbound", name: "Soulbound Publication" },
  },
  {
    slug: "soulbound",
    name: "Soulbound Publication",
    category: "Publication Design",
    year: "2023",
    industry: "Publishing · Leadership",
    timeline: "6 weeks",
    summary:
      "Publication cover design and art direction for a leadership book that needed to stand apart from a saturated genre.",
    heroImage: {
      src: "/images/projects/soulbound/soulbound.jpg",
      alt: "Soulbound publication cover design and art direction",
    },
    overview: {
      heading: "The Publication",
      paragraphs: [
        "Soulbound is a publication exploring leadership, personal growth, and the intersection of discipline and creativity. The book is positioned for emerging leaders and professionals who value substance and intentionality over self-help formulas.",
        "The author needed a visual identity that matched the depth of the content\u2014something that communicated authority and seriousness without being academic, and warmth without being generic.",
      ],
    },
    challenge: {
      heading:
        "Every leadership book on the shelf looks like every other leadership book",
      paragraphs: [
        "The leadership and personal development genre is saturated with covers that follow predictable formulas: bold sans-serif titles, motivational subtitles, and stock photography of mountains or individuals gazing into the distance. These covers signal \u201cself-help\u201d immediately, which was precisely the wrong association for Soulbound.",
        "The visual treatment had to differentiate the publication in a crowded market while reflecting its core themes of intentionality, inner strength, and disciplined creativity. It had to work as a physical book, a digital cover, and a social media asset simultaneously.",
      ],
    },
    approach: {
      heading:
        "Treat the cover as a brand identity exercise, not a graphic design task",
      paragraphs: [
        "We approached this as a positioning project. The discovery phase examined the competitive landscape, identified the visual tropes that signal \u201cgeneric leadership book,\u201d and defined what Soulbound\u2019s cover needed to avoid. The audience research showed that the target reader responds to confidence and restraint\u2014not to visual noise.",
        "Creative direction explored typographic treatments that conveyed authority and calm. The final direction uses restrained composition, deliberate negative space, and a tonal palette that separates it from the aggressive colors that dominate the genre. Every design choice was a strategic decision about market positioning.",
      ],
    },
    deliverables: [
      {
        title: "Cover Design",
        description:
          "Front, spine, and back cover design with print-ready specifications.",
      },
      {
        title: "Typography System",
        description:
          "Type selection and hierarchy for cover, chapter openers, and body text.",
      },
      {
        title: "Chapter Openers",
        description:
          "Art direction for interior layout and chapter opening pages.",
      },
      {
        title: "Digital Variations",
        description:
          "Cover adaptations for Amazon, Kindle, and online distribution platforms.",
      },
      {
        title: "Production Files",
        description:
          "Print-ready files, color profiles, and specifications for manufacturing.",
      },
    ],
    images: {
      set1: [
        {
          src: "/images/projects/soulbound/soulbound.jpg",
          alt: "Soulbound cover design and typography system",
        },
      ],
    },
    result: {
      heading:
        "A cover that differentiates a leadership book from the genre it belongs to.",
      paragraphs: [
        "The cover design gives Soulbound a visual identity that matches the depth of its content. The typographic approach differentiates it from the crowded leadership genre\u2014readers consistently describe it as \u201cserious\u201d and \u201cintentional,\u201d which is precisely the positioning the author wanted.",
        "The design system scales from the physical book to digital platforms without losing its distinctive character. The chapter openers extend the cover\u2019s restraint into the reading experience itself.",
      ],
    },
    nextProject: { slug: "nomad-kitchen", name: "Nomad Kitchen" },
  },
  {
    slug: "nomad-kitchen",
    name: "Nomad Kitchen",
    category: "Brand Identity, Packaging",
    year: "2023",
    industry: "Food · Consumer Goods",
    timeline: "12 weeks",
    summary:
      "Brand identity and packaging for a modern South Asian food brand bridging heritage flavors with premium contemporary positioning.",
    heroImage: {
      src: "/images/projects/nomad-kitchen/nomad-kitchen.jpg",
      alt: "Nomad Kitchen brand identity and packaging design",
    },
    overview: {
      heading: "The Brand",
      paragraphs: [
        "Nomad Kitchen is a modern food brand rooted in South Asian culinary traditions. The brand bridges authentic flavors with contemporary presentation, targeting food-conscious consumers who value both heritage and quality.",
        "The brand was entering a market where South Asian food products are either positioned as budget ethnic alternatives or as premium fusion experiments. Nomad Kitchen needed to occupy the space between: authentic in origin, contemporary in presentation, premium in positioning.",
      ],
    },
    challenge: {
      heading:
        "Cultural authenticity and premium positioning treated as opposites by every competitor",
      paragraphs: [
        "South Asian food brands in North America rely on predictable cultural imagery\u2014ornate patterns, bright colors, and traditional motifs\u2014that limits their market appeal to a narrow audience. Brands that avoid this approach tend to erase cultural identity entirely in favor of generic \u201cminimalist\u201d packaging. Neither strategy worked for Nomad Kitchen.",
        "The packaging had to communicate South Asian heritage without relying on visual cliches, feel premium without feeling sterile, and work across shelf retail, e-commerce photography, and social media content. The visual system needed room to expand across product categories without losing coherence.",
      ],
    },
    approach: {
      heading:
        "Position the brand where no competitor stands: culturally grounded and premium",
      paragraphs: [
        "We approached this as a positioning exercise before any design began. Strategy mapped the competitive landscape and identified the gap between traditional ethnic food brands and premium contemporary labels. Nomad Kitchen\u2019s position was defined as \u201cheritage-forward, design-led\u201d\u2014a brand that respects its roots while refusing to be limited by them.",
        "Creative direction developed a visual language built on warm tones, clean typography, and confident composition. Packaging design was integrated from the start\u2014not treated as an afterthought to the identity. Every element, from the wordmark to the label stock, was chosen to reinforce the positioning.",
      ],
    },
    deliverables: [
      {
        title: "Brand Identity System",
        description:
          "Logo, wordmark, and visual language built for a food brand at shelf and online.",
      },
      {
        title: "Packaging Design",
        description:
          "Label system, structural specifications, and production-ready files for product line.",
      },
      {
        title: "Color Palette",
        description:
          "Warm, heritage-inspired palette specified for print, digital, and packaging substrates.",
      },
      {
        title: "Typography System",
        description:
          "Type selection balancing cultural warmth with contemporary clarity.",
      },
      {
        title: "Brand Guidelines",
        description:
          "Documentation enabling consistent brand application across product expansion.",
      },
      {
        title: "Social Templates",
        description:
          "Visual frameworks for e-commerce photography and social media content.",
      },
    ],
    images: {
      set1: [
        {
          src: "/images/projects/nomad-kitchen/nomad-kitchen.jpg",
          alt: "Nomad Kitchen packaging design and brand identity",
        },
      ],
    },
    result: {
      heading:
        "A brand that belongs on premium shelves without erasing where it comes from.",
      paragraphs: [
        "The identity positions Nomad Kitchen as a brand that belongs alongside established premium food labels\u2014not in the ethnic food aisle. The visual system connects cultural authenticity with contemporary design, giving the brand room to grow across product categories without losing its identity.",
        "The packaging system scales from a single product to a full line. Each new SKU inherits the brand\u2019s positioning automatically through the documented system, eliminating the need to redesign for every product extension.",
      ],
      stats: [
        { value: "3", label: "Product categories covered" },
        { value: "1", label: "Consistent identity system" },
      ],
    },
    nextProject: { slug: "tedxtoronto", name: "TEDxToronto Visual Identity" },
  },
];

export function getProjectDetail(
  slug: string
): ProjectDetail | undefined {
  return projectDetails.find((p) => p.slug === slug);
}
