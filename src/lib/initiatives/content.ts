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

export const LANDING = {
  title: "Initiatives: Parallel and Commons",
  description:
    "Studio led programmes by House of Singh Studios: Parallel, brands reimagined for businesses we admire, and Commons, pro bono design for charities and community organisations in Toronto.",
  label: "Initiatives",
  heading: "Beyond the brief.",
  intro:
    "Studio led programmes where House of Singh Studios designs without a client brief: new possibilities for businesses we admire, and pro bono design for organisations doing good in Toronto.",
  programmesHeading: "Programmes",
  explore: (name: string) => `Explore ${name}`,
  takePartHeading: "Take part",
  takePart: [
    {
      slug: "parallel",
      heading: "Parallel",
      text: "Know a business we should reimagine? Nominate it for Parallel.",
      button: "Nominate a Business",
      href: "/contact?service=parallel",
    },
    {
      slug: "commons",
      heading: "Commons",
      text: "Know a charity that deserves great design? Nominate it for Commons.",
      button: "Nominate an Organisation",
      href: "/contact?service=commons",
    },
  ],
  questionsHeading: "Questions",
  questions: [
    {
      q: "What are House of Singh Studios Initiatives?",
      a: "Studio led programmes outside paid client work. Parallel reimagines brands for growing businesses, with their permission. Commons offers pro bono design to charities and community organisations in Toronto.",
    },
    {
      q: "Do you offer pro bono design or branding?",
      a: "Yes, through Commons. We take on three pro bono projects a year for registered charities, non profits and community groups with an annual operating budget under $1 million.",
    },
    {
      q: "Can I nominate a business or an organisation?",
      a: "Yes. Nominate a business for Parallel or a charity for Commons through our contact form. We read every nomination.",
    },
  ] satisfies Question[],
  closing: {
    heading: "Have an idea worth exploring?",
    text: "We are always glad to hear from founders, businesses and organisations building something meaningful.",
    button: "Start a Conversation",
    href: "/contact",
  },
};

export const PARALLEL = {
  title: "Parallel: Brands Reimagined",
  description:
    "Parallel is a programme by House of Singh Studios that reimagines the brands of growing businesses we admire, with their permission. No cost, no obligation.",
  heading: "One brand. Another possibility.",
  intro:
    "Parallel is where we choose growing businesses we admire and reimagine their brand identity, with their written permission. It is a gift, not a pitch: no cost, no obligation, and the business approves the work before anything is published.",
  stepsHeading: "How it works",
  steps: [
    { name: "We choose.", description: "We look for businesses people already love, with a story worth telling. Anyone can nominate one." },
    { name: "We ask.", description: "Nothing begins without the business's written permission." },
    { name: "We reimagine.", description: "A new brand identity, shown across the places it would live, with the thinking behind it." },
    { name: "They decide.", description: "The business sees the work first and can choose not to publish it." },
    { name: "We publish.", description: "Credited as an alternative possibility, never as the business's official brand." },
  ],
  workHeading: "The work",
  workEmpty: "The first Parallel projects are in progress.",
  questionsHeading: "Questions",
  questions: [
    { q: "Does Parallel cost anything?", a: "No. Parallel is entirely studio funded." },
    {
      q: "Does the business have to use the new brand?",
      a: "No. There is no obligation to adopt, buy or use the concept. If a business would like to use it, that becomes a separate project.",
    },
    {
      q: "Can a business ask to be part of Parallel?",
      a: "Yes. Businesses can nominate themselves, and anyone can nominate a business they admire. Selection is at the studio's discretion.",
    },
    { q: "Is Parallel a critique of the current brand?", a: "Never. Every Parallel concept is an alternative possibility, not a correction." },
  ] satisfies Question[],
  nominate: {
    heading: "Nominate a business",
    text: "Tell us about a growing business you think deserves another possibility.",
    button: "Nominate a Business",
    href: "/contact?service=parallel",
  },
};

export const COMMONS = {
  title: "Commons: Pro Bono Design and Branding in Toronto",
  description:
    "Commons is the pro bono programme of House of Singh Studios: three pro bono design and branding projects a year for charities and community organisations in Toronto.",
  heading: "Design for the common good.",
  intro:
    "Commons is our pro bono programme. Each year we give three charities and community organisations professional brand and design work, at no cost, with the same care as any client project.",
  offerHeading: "What we offer",
  offer: [
    "Three pro bono projects a year",
    "Up to 35 hours of studio time each",
    "A defined scope agreed at the start: for example a brand identity refresh, a campaign, or a photography day",
    "The same process and standards as our paid work",
  ],
  eligibleHeading: "Who can apply",
  eligible: [
    "Registered charities, non profits and community groups doing clear public good",
    "An annual operating budget under $1 million",
    "Based in Toronto or the GTA",
    "A named decision maker, content ready, and decisions made on time",
    "Happy for the finished work to be shared as a case study",
  ],
  notEligible: "Not eligible: businesses, political parties and campaigns, and organisations whose purpose conflicts with the studio's values.",
  chooseHeading: "How we choose",
  chooseIntro:
    "Each nomination is considered on five things: impact, need, readiness, fit with what the studio does well, and whether the work will help the organisation tell its story.",
  criteria: [
    { name: "Impact", line: "The good the organisation does." },
    { name: "Need", line: "How much the work would help." },
    { name: "Readiness", line: "Ready to take part and decide on time." },
    { name: "Fit", line: "Fit with what the studio does well." },
    { name: "Story", line: "Whether the work will help the organisation tell its story." },
  ],
  workHeading: "The work",
  workEmpty: "The first Commons projects will appear here.",
  questionsHeading: "Questions",
  questions: [
    {
      q: "What is pro bono design?",
      a: "Professional design work given free of charge. Through Commons, House of Singh Studios offers pro bono branding and design to charities and community organisations.",
    },
    {
      q: "Is Commons really free?",
      a: "Yes. There is no fee. We ask for a named point of contact, timely decisions, and permission to share the finished work.",
    },
    { q: "How often do you take on pro bono projects?", a: "Three a year. Nominations are reviewed once a year." },
    {
      q: "Can you provide a donation receipt for the work?",
      a: "No. In Canada, donated services generally cannot receive an official donation receipt, so Commons is a contribution, not a tax arrangement.",
    },
  ] satisfies Question[],
  nominate: {
    heading: "Nominate an organisation",
    text: "Tell us about a charity or community group that deserves great design. Organisations can nominate themselves.",
    button: "Nominate an Organisation",
    href: "/contact?service=commons",
  },
};
