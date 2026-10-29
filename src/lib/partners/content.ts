// Every visitor facing word on /partners. No dashes of any kind, Canadian spelling, buttons in Title
// Case. The order of the page follows the partner's concerns: their client's safety first, their
// effort second, the reward third. Money is the thank you, never the headline.
import type { Question } from "@/lib/initiatives/content";

export const INTRODUCE_HREF = "/contact?service=introduction";
export const PARTNER_HREF = "/contact?service=partnership";

export const PARTNERS = {
  title: "Partners",
  description:
    "Introduce a client to House of Singh Studios and receive 10 percent of their first project's fee. For agencies, developers, printers and photographers.",
  label: "Partners",
  heading: "Good work travels by recommendation.",
  intro:
    "Many of our best clients arrive through someone they trust. Our partner program thanks the agencies, developers, printers and advisors who introduce us.",
  introduce: "Introduce a Client",
  partner: "Become a Partner",
};

// At a glance: each figure counts up from 0; the suffix stays fixed.
export const GLANCE = [
  { value: 10, suffix: "%", text: "of the first project's fee, for every client you introduce" },
  { value: 1, suffix: " day", text: "for your client to hear from us" },
  { value: 30, suffix: " sec", text: "to make an introduction; we give you the words" },
  { value: 14, suffix: " days", text: "to receive your reward, once the client has paid" },
] as const;

export const SAFE = {
  heading: "Your client, in safe hands",
  items: [
    { name: "A reply within one business day.", line: "Your client hears from Maninder directly, not a sales team." },
    { name: "You stay in the loop.", line: "We update you after the first call, after the proposal, and at launch." },
    { name: "The same standard as our own clients.", line: "Every introduction gets the full studio process, whatever its size." },
  ],
};

export const HOW = {
  heading: "How it works",
  intro: "Three steps, and the first takes thirty seconds.",
  steps: [
    { name: "Introduce.", description: "Send a short email to both of us, or share your personal partner link." },
    { name: "We take care.", description: "We reply within one business day and look after your client as if they were our own." },
    { name: "We thank you.", description: "Once the client has paid for their first project, your reward arrives within 14 days." },
  ],
  boxLabel: "The introduction, ready to send",
  introduction:
    "I'd like to introduce you to Maninder Singh at House of Singh Studios, a brand identity and design studio in Toronto. I think they'd be a great fit for what you're planning. Maninder, meet [name]. I'll let you both take it from here.",
  copy: "Copy Text",
  copied: "Copied",
  hint: "Paste it into an email to both of you.",
  fallback: "Press Ctrl or Command and C to copy.",
};

export const WORTH = {
  heading: "What it is worth",
  line: "10 percent of the first project's fee.",
  body: "For example, a $10,000 project earns you $1,000. Past clients receive a $250 credit on their next project.",
  small: "Calculated before taxes, on the first project only.",
};

export const WHO = {
  heading: "Who it is for, and the moment",
  rows: [
    { who: "Web developers and marketing agencies", moment: "A client wants a new website or campaign, but has no brand to build it on." },
    { who: "Printers and sign makers", moment: "A client orders new signage or packaging with a weak logo file." },
    { who: "Photographers and video producers", moment: "Great imagery, held back by the brand around it." },
    { who: "Accountants, lawyers and advisors", moment: "A client is growing, raising money, rebranding or opening a new location." },
    { who: "Past clients", moment: "Someone you know is where you were before we worked together." },
  ],
};

export const QUESTIONS_HEADING = "Questions";
// Offered under the Questions heading.
export const PARTNERS_EMAIL = "partners@houseofsingh.com";

export const QUESTIONS: Question[] = [
  {
    q: "Who can become a partner?",
    a: "Agencies, developers, printers, photographers, advisors and past clients. We approve each partner individually, so every introduction gets the care it deserves.",
  },
  { q: "Do I need to sign anything?", a: "No contract to start. Once approved, you receive the terms in a short email." },
  { q: "How much do I earn?", a: "10 percent of the first project's fee, before taxes. Past clients receive a $250 credit on their next project instead." },
  {
    q: "When is the reward paid?",
    a: "Within 14 days of the client's final payment for their first project, by Interac e-Transfer or against your invoice.",
  },
  { q: "What if the client does not hire you?", a: "Nothing changes. There is never any cost to you, and we will still thank you for thinking of us." },
  {
    q: "Will you keep me updated?",
    a: "Yes, at three points: after the first call, after the proposal, and at launch. We never share your client's confidential details.",
  },
  { q: "What if two people introduce the same client?", a: "The first introduction we receive is the one we credit." },
  {
    q: "Why don't accountants and lawyers receive a fee?",
    a: "Their professional rules often limit referral fees, so we exchange introductions instead, which most advisors prefer.",
  },
  { q: "Should I tell my client about the reward?", a: "We encourage it. Openness builds trust, and some professions require it." },
];

// The closing band: two ways to act, introduce now or partner long term.
export const BAND = [
  { slug: "introduce", heading: "I have someone in mind", text: "We reply to them within one business day.", button: "Introduce a Client", href: INTRODUCE_HREF },
  { slug: "partner", heading: "I want to partner long term", text: "Your partner link arrives within two business days.", button: "Become a Partner", href: PARTNER_HREF },
];
