// Every visitor facing word on the Initiatives pages, plus the fallback initiatives used when Sanity
// cannot be reached or has no initiative documents yet. No dashes of any kind; buttons in Title Case.
import type { Initiative } from "./types";

export interface Question {
  q: string;
  a: string;
}

// Fallback initiatives. Foundry is built but hidden: it never renders, and its page returns 404.
// Commons has no fallback recognitions: without Sanity its logos are simply not shown.
export const FALLBACK_INITIATIVES: Initiative[] = [
  {
    name: "Parallel",
    slug: "parallel",
    category: "Brands reimagined",
    tagline: "One brand. Another possibility.",
    summary: "A series where we reimagine exciting brands we admire. Real businesses, new directions, and the thinking behind every choice.",
    status: "live",
    statusLabel: "Edition 01 underway",
    order: 1,
    hasPage: true,
    atAGlance: [{ value: "Real brands" }, { value: "New directions" }, { value: "The thinking, shown" }],
    recognitions: [],
  },
  {
    name: "Commons",
    slug: "commons",
    category: "Pro bono design",
    tagline: "Design for the common good.",
    summary: "Pro bono brand and design work for charities and community organizations in Toronto. Three projects a year.",
    status: "nominations-open",
    statusLabel: "Nominations open for 2027",
    order: 2,
    hasPage: true,
    atAGlance: [{ value: "3 projects a year" }, { value: "Up to 35 hours each" }, { value: "Toronto and the GTA" }],
    recognitions: [],
  },
  {
    name: "Foundry",
    slug: "foundry",
    category: "",
    tagline: "",
    summary: "",
    status: "hidden",
    order: 3,
    hasPage: false,
    atAGlance: [],
    recognitions: [],
  },
];

// The small label above the at a glance rows in a program page hero.
export const GLANCE_LABEL = "At a glance";

export const LANDING = {
  title: "Initiatives: Parallel and Commons",
  description:
    "Work House of Singh Studios does for its own reasons: Parallel, a series reimagining exciting brands, and Commons, pro bono design for charities and community organizations in Toronto.",
  label: "Initiatives",
  heading: "Beyond the brief.",
  intro:
    "Work the studio does for its own reasons. Parallel reimagines exciting brands. Commons gives pro bono design to organizations doing good in Toronto.",
  programmesHeading: "Programs",
  explore: (name: string) => `Explore ${name}`,
  takePartHeading: "Take part",
  takePart: [
    {
      slug: "parallel",
      heading: "Parallel",
      text: "Know a brand we should reimagine? Suggest it.",
      button: "Suggest a Brand",
      href: "/contact?service=parallel",
    },
    {
      slug: "commons",
      heading: "Commons",
      text: "Know a charity that deserves great design? Nominate it.",
      button: "Nominate an Organization",
      href: "/contact?service=commons",
    },
  ],
  questionsHeading: "Questions",
  questions: [
    {
      q: "What are House of Singh Studios Initiatives?",
      a: "Work the studio does outside client briefs. Parallel is a series reimagining exciting brands. Commons is our pro bono design program for charities and community organizations in Toronto.",
    },
    {
      q: "Do you offer pro bono design or branding?",
      a: "Yes, through Commons: three projects a year for charities, nonprofits and community groups with an annual operating budget under $1 million.",
    },
    {
      q: "Can I suggest a brand or nominate an organization?",
      a: "Yes, through our contact form.",
    },
  ] satisfies Question[],
};

export const PARALLEL = {
  title: "Parallel: Brand Identity Concepts by House of Singh Studios",
  description:
    "Parallel is a studio series by House of Singh Studios that reimagines exciting brands. Same business, a different direction, and the thinking behind every choice.",
  heading: "One brand. Another possibility.",
  intro:
    "Parallel is a studio series. We choose exciting brands and reimagine them from the ground up. Same business, a different direction. Each edition shows how we think, what we see, and where a brand could go.",
  glance: [
    { label: "Format", value: "An ongoing series" },
    { label: "Subjects", value: "Exciting, growing brands" },
    { label: "Selection", value: "Chosen by the studio" },
  ],
  stepsHeading: "Inside each edition",
  stepsIntro: "Every edition follows the same five parts.",
  steps: [
    { name: "The brand today.", description: "What it is, and what makes it worth a second look." },
    { name: "The question.", description: "The one idea we want to explore." },
    { name: "The new direction.", description: "Identity, type, colour and voice, rebuilt from that idea." },
    { name: "In the world.", description: "The brand where it lives: packaging, signage, screens and print." },
    { name: "The thinking.", description: "Why every choice was made." },
  ],
  workHeading: "The editions",
  workEmpty: "The first editions are underway.",
  questionsHeading: "Questions",
  questions: [
    { q: "Is Parallel commissioned work?", a: "No. The studio chooses each brand and funds every edition." },
    { q: "Does the business know?", a: "Yes. Every edition is made with the business's written permission." },
    { q: "Is Parallel a critique of the current brand?", a: "No. It is an alternative, not a correction." },
    { q: "Can the business use the new identity?", a: "Only through a separate agreement with the studio." },
    { q: "Can I suggest a brand?", a: "Yes, though the studio chooses most brands itself." },
  ] satisfies Question[],
  nominate: {
    heading: "Suggest a brand",
    text: "Most Parallel brands are chosen by the studio. If you know one we should look at, tell us.",
    button: "Suggest a Brand",
    href: "/contact?service=parallel",
  },
};

export const COMMONS = {
  title: "Commons: Pro Bono Design and Branding in Toronto",
  description:
    "Commons is the pro bono design program of House of Singh Studios: three pro bono branding and design projects a year for charities and community organizations in Toronto.",
  heading: "Design for the common good.",
  intro:
    "Commons is our pro bono design program. Each year, three charities and community organizations receive professional brand and design work. No fee. The same standard as our paid work.",
  glance: [{ value: "3 projects a year" }, { value: "Up to 35 hours each" }, { value: "Toronto and the GTA" }],
  offerHeading: "What we offer",
  offer: [
    "Three pro bono projects a year",
    "Up to 35 hours of studio time each",
    "A defined scope, agreed at the start",
    "The same process and standard as our paid work",
  ],
  eligibleHeading: "Who can apply",
  eligible: [
    "Registered charities, nonprofits and community groups",
    "An annual operating budget under $1 million",
    "Based in Toronto or the GTA",
    "A decision maker, content ready, and time to engage",
    "Happy for the finished work to be shared",
  ],
  notEligible: "Not eligible: Businesses, political parties and campaigns, and organizations whose purpose conflicts with our values.",
  chooseHeading: "How we choose",
  criteria: [
    { name: "Impact", line: "How many people benefit, and how much." },
    { name: "Need", line: "Whether professional design is otherwise out of reach." },
    { name: "Readiness", line: "A decision maker, content and time." },
    { name: "Fit", line: "Work the studio does well." },
    { name: "Story", line: "A result worth sharing." },
  ],
  workHeading: "Pro bono work",
  // The outlined last slot in the Pro bono work row, linking to the nominate band.
  openSlot: { text: "2027 nominations open", href: "#nominate" },
  questionsHeading: "Questions",
  questions: [
    {
      q: "What is pro bono design?",
      a: "Professional design work given free of charge. Through Commons, we offer pro bono branding and design to charities and community organizations.",
    },
    {
      q: "Is Commons really free?",
      a: "Yes. We ask for a named contact, timely decisions, and permission to share the work.",
    },
    { q: "How often do you take on pro bono projects?", a: "Three a year, reviewed as nominations arrive." },
    {
      q: "Can you provide a donation receipt?",
      a: "No. In Canada, donated services generally cannot receive an official donation receipt.",
    },
  ] satisfies Question[],
  nominate: {
    heading: "Nominate an organization",
    text: "Know a charity or community group that deserves great design? Organizations can nominate themselves.",
    button: "Nominate an Organization",
    href: "/contact?service=commons",
  },
  next: {
    label: "What happens next",
    items: ["Reviewed as they arrive", "Chosen on five criteria", "Selected organizations announced publicly"],
  },
};
