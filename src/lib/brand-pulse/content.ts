// Every visitor facing word in Brand Pulse lives here (the result's sentences in sentences.ts), so copy
// can change without touching logic.
// The one exception is the three actions per profile: they are server only, in actions.ts.
// Plain everyday words, no design jargon, no dashes of any kind. Labels and buttons in sentence case.

import { QUESTION_ORDER, type Answers, type Feedback, type Level, type ProfileId, type Pulse, type QuestionId, type TeamSize, type VitalId } from "./types";
import { countWord } from "@/lib/what-we-do";
import { DISCOVERY_CALL_MINUTES } from "@/lib/constants/booking";

type Options<Q extends QuestionId> = { [K in Answers[Q]]: { label: string; chip: string } };

export interface QuestionContent<Q extends QuestionId> {
  text: string;
  helper?: string;
  options: Options<Q>;
}

export const QUESTIONS: { [Q in QuestionId]: QuestionContent<Q> } = {
  industry: {
    text: "What does your business do?",
    options: {
      "professional-services": { label: "Professional services", chip: "Professional services" },
      "real-estate": { label: "Real estate and development", chip: "Real estate" },
      hospitality: { label: "Hospitality and food", chip: "Hospitality" },
      retail: { label: "Retail and consumer products", chip: "Retail" },
      health: { label: "Health and wellness", chip: "Health" },
      technology: { label: "Technology", chip: "Technology" },
      other: { label: "Something else", chip: "Something else" },
    },
  },
  updated: {
    text: "When did a professional last update how your business looks?",
    helper: "Think logo, website, photos or marketing.",
    options: {
      "under-1": { label: "Within the last year", chip: "Updated this year" },
      "1-3": { label: "1 to 3 years ago", chip: "Updated 1 to 3 years ago" },
      "3-5": { label: "3 to 5 years ago", chip: "Updated 3 to 5 years ago" },
      "over-5": { label: "More than 5 years ago", chip: "Updated over 5 years ago" },
      never: { label: "Never done professionally", chip: "Never updated" },
    },
  },
  weakest: {
    text: "Which part of your brand feels weakest right now?",
    options: {
      website: { label: "Our website", chip: "Website weakest" },
      "photo-video": { label: "Our photos and video", chip: "Photos weakest" },
      social: { label: "Our social media", chip: "Social weakest" },
      "print-sales": { label: "Our printed and sales material", chip: "Print weakest" },
      "logo-look": { label: "Our logo and overall look", chip: "Logo weakest" },
      none: { label: "Nothing feels weak", chip: "Nothing weak" },
    },
  },
  consistent: {
    text: "If you put your website, social media and printed material side by side, would they look like the same business?",
    options: {
      yes: { label: "Yes, clearly", chip: "Looks the same" },
      mostly: { label: "Mostly, with a few differences", chip: "Mostly the same" },
      no: { label: "Not really", chip: "Looks different" },
      "never-compared": { label: "We have never compared them", chip: "Never compared" },
    },
  },
  handover: {
    text: "If a new employee or supplier had to create something for your brand tomorrow, could they get it right without asking you?",
    options: {
      "written-followed": { label: "Yes, we have written rules they follow", chip: "Rules followed" },
      "rules-unused": { label: "We have rules, but nobody really uses them", chip: "Rules unused" },
      "lots-of-help": { label: "Only with a lot of help from us", chip: "Needs our help" },
      "in-our-heads": { label: "No, it all lives in our heads", chip: "In our heads" },
    },
  },
  clarity: {
    text: "When someone first hears about your business, how quickly do they understand what makes you different?",
    options: {
      "straight-away": { label: "Straight away", chip: "Clear straight away" },
      "some-explanation": { label: "After some explanation", chip: "Needs explaining" },
      "after-talking": { label: "Usually only once they talk to us", chip: "Clear once we talk" },
      struggle: { label: "Honestly, we struggle to explain it ourselves", chip: "Hard to explain" },
    },
  },
  ahead: {
    text: "What is coming up for your business in the next 12 months?",
    options: {
      launch: { label: "A launch, expansion or new location", chip: "Launch ahead" },
      growing: { label: "Growing the team or entering new markets", chip: "Growing" },
      investment: { label: "New investment or a sale of the business", chip: "Investment ahead" },
      steady: { label: "Steady, much like now", chip: "Steady year" },
    },
  },
};

export const INTRO = {
  label: "(Brand Pulse)",
  heading: "Get a clear read on your brand.",
  text: "7 quick questions, about a minute. A plain read on five vital signs of your brand, and one clear next step.",
  youGet: "You will get",
  youGetItems: ["Your brand profile", "Five vital signs, each Good, Needs attention or At risk", "One clear next step"],
  button: "Start the check",
  // Used on the AI Lab page and on every link into the check from elsewhere.
  buttonElsewhere: "Take the 60 Second Brand Pulse",
  instant: "Instant results. No sign up. No personal details needed.",
  trust: "Built by a Creative Director who judges the RGD design awards and led the creative team for TEDxToronto.",
};

export const FLOW = {
  back: "Back",
  progress: (current: number, total: number) => `${current} of ${total}`,
  timeLeft: (seconds: number) => `About ${seconds} seconds left`,
  lastQuestion: "Last question",
  answersSoFar: "Your answers so far",
};

export const EVALUATING = {
  heading: "Reading your brand pulse",
  checked: "Checked",
};

export const PULSE_LABELS: Record<Pulse, string> = {
  strong: "Strong pulse",
  steady: "Steady pulse",
  weak: "Weak pulse",
};

export const LEVEL_LABELS: Record<Level, string> = {
  good: "Good",
  attention: "Needs attention",
  risk: "At risk",
};

// Display order of the five vital signs.
export const VITALS: { id: VitalId; label: string; explainer: string }[] = [
  { id: "uptodate", label: "Up to date", explainer: "How current your brand looks today." },
  { id: "presence", label: "Presence", explainer: "How well you come across where customers look." },
  { id: "consistent", label: "Consistent", explainer: "How alike your brand looks everywhere." },
  { id: "ready", label: "Ready", explainer: "Whether others can get your brand right without you." },
  { id: "clear", label: "Clear", explainer: "How quickly people understand what makes you different." },
];

export const PROFILES: Record<ProfileId, { name: string; headline: string }> = {
  strong: { name: "The Strong Pulse Brand", headline: "Your brand is in good health. Keep it that way as you grow." },
  "hard-to-explain": { name: "The Hard to Explain Brand", headline: "People like what you do. They struggle to say why you." },
  overdue: { name: "The Overdue Brand", headline: "Your brand is overdue for a refresh." },
  "unused-rulebook": { name: "The Unused Rulebook", headline: "You have brand rules. Nobody is using them." },
  outgrown: { name: "The Outgrown Brand", headline: "Your brand was built for where you were, not where you are going." },
  unwritten: { name: "The Unwritten Brand", headline: "Your brand lives in your head. It needs to live on paper." },
  scattered: { name: "The Scattered Brand", headline: "Your brand looks different everywhere, and customers notice." },
  undersold: { name: "The Undersold Brand", headline: "Your business is better than it looks." },
};

export const SERVICE_LINES = {
  recommended: "Recommended:",
  also: "Also worth a look:",
};

export const FEEDBACK: { question: string; options: { id: Feedback; label: string }[]; thanks: string } = {
  question: "Does this sound like your brand?",
  options: [
    { id: "yes", label: "Yes" },
    { id: "partly", label: "Partly" },
    { id: "not-really", label: "Not really" },
  ],
  thanks: "Thank you. That helps us sharpen the check.",
};

export const NEXT_STEP = {
  label: "(Next step)",
  heading: "Talk it through with our Creative Director.",
  text: "A 30 minute conversation about your result, not a sales presentation. No preparation needed: your answers come with you. Choose any time that suits you.",
  button: "Discuss my results",
};

export const KEEP_IT = {
  label: "(Keep it)",
  heading: "Take this with you.",
  text: "We will send your result, plus three practical actions for your brand this quarter.",
  emailLabel: "Email",
  button: "Send my result",
  sending: "Sending...",
  retake: "Remind me to retake the check in six months.",
  insights: "Send me occasional studio insights.",
  smallPrint: "One email with your result. Nothing else unless you ask.",
  success: "Sent. Check your inbox.",
  failure: "We could not send it just now. Copy the link below to keep your result.",
  emailRequired: "Enter your email.",
  emailInvalid: "Enter a valid email, like name@company.com.",
};

export const TEAM_SIZES: { id: TeamSize; label: string }[] = [
  { id: "1-10", label: "1 to 10" },
  { id: "11-50", label: "11 to 50" },
  { id: "51-200", label: "51 to 200" },
  { id: "over-200", label: "More than 200" },
];

export const STUDIO_VIEW = {
  text: "Want a studio view before your call? Add a few details.",
  name: "Name",
  company: "Company",
  website: "Website",
  teamSize: "Team size",
  teamSizePlaceholder: "Choose one",
  button: "Add details",
  sending: "Sending...",
  success: "Thank you. We will look before we speak.",
  failure: "We could not add your details just now. Your result is still here.",
  websiteInvalid: "Enter a website address, like company.com.",
};

export const GATE_COPY = {
  heading: "Get your full result.",
  button: "Show my result",
};

export const QUIET_LINKS = {
  conversation: "Start a conversation",
  copyLink: "Copy a link to this result",
  copied: "Link copied.",
  startAgain: "Start again",
};

export const SHARED = {
  button: "Take the check yourself",
  // The page's main heading for a shared result, visually hidden: the result's own title is an h2.
  hiddenHeading: "Brand Pulse result",
};

export const ARTICLE_CTA = {
  label: "(Brand Pulse)",
  heading: "How healthy is your brand?",
  text: "A plain read on five vital signs, in about a minute.",
  button: "Take the 60 Second Brand Pulse",
};

export const PAGE = {
  title: "Brand Pulse Check",
  description: "Seven quick questions, about a minute. A free, plain read on five vital signs of your brand, with one clear next step from a Toronto studio.",
};

// The section below the tool on /brand-pulse (never on a shared result): what the check reads, how it
// works, the profiles and four questions, which are also the page's FAQPage structured data. The counts
// come from the questions and the vital signs, written as words; the call length from the booking
// constant. The vital signs and profiles themselves are VITALS and PROFILES above. The numbered labels,
// (01) to (04), come from the sections (PulseGuide.tsx).
const QUESTION_WORD = countWord(QUESTION_ORDER.length);
const VITALS_WORD = countWord(VITALS.length).toLowerCase();

export const GUIDE = {
  reads: {
    heading: "What the Brand Pulse Check reads",
    intro: `${QUESTION_WORD} questions, about a minute. Your answers are scored against ${VITALS_WORD} vital signs that decide how a business is seen and chosen.`,
  },
  how: {
    heading: "How it works",
    steps: [
      `Answer ${QUESTION_WORD.toLowerCase()} questions about your business, your brand and the year ahead.`,
      "See a reading for each vital sign and the brand profile that fits you.",
      "Get one clear next step.",
    ],
  },
  profiles: { heading: "The brand profiles" },
  questions: {
    heading: "Questions",
    items: [
      { q: "Is the Brand Pulse Check free?", a: "Yes. It is free and takes about a minute." },
      { q: "Who is it for?", a: "Owners and marketing leads of growing businesses who want a quick, plain read on whether their brand is holding them back." },
      { q: "What happens after I get my result?", a: `You see your ${VITALS_WORD} vital signs, your brand profile and one next step. If you want to go further, you can book a ${DISCOVERY_CALL_MINUTES} minute discovery call with the studio.` },
      { q: "Can I share my result?", a: "Yes. A shared link carries only your answers, not your personal details." },
    ],
  },
};
