// Every visitor facing word in Brand Pulse lives here, so copy can change without touching logic.
// The one exception is the three actions per profile: they are server only, in actions.ts.
// Plain everyday words, no design jargon, no dashes of any kind. Buttons in Title Case.

import type { Answers, Feedback, Level, ProfileId, Pulse, QuestionId, TeamSize, VitalId } from "./types";

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
  button: "Start the Check",
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

export const INDUSTRY_SENTENCES: Record<Answers["industry"], string> = {
  "professional-services": "In professional services, clients buy trust before they buy expertise, and the brand is often the first evidence of both.",
  "real-estate": "In real estate, buyers and partners judge credibility before the first meeting, usually from a listing, a sign or a deck.",
  hospitality: "In hospitality, people choose with their eyes first. The menu, the room, the feed and the packaging make the decision before the food does.",
  retail: "In retail, the brand has seconds on a shelf or a screen to earn attention, and it is judged side by side with its competitors.",
  health: "In health and wellness, people are trusting you with something personal, so the brand has to signal care and competence at the same time.",
  technology: "In technology, products look increasingly alike, which puts more weight on the brand to explain why yours is different.",
  other: "Whatever the sector, customers decide whether a business is credible long before they speak to anyone in it.",
};

export const UPDATED_SENTENCES: Record<Answers["updated"], string> = {
  "under-1": "Your look was updated within the last year, so the foundation is current.",
  "1-3": "Your look was updated in the last three years, which should still feel current if it has been used consistently since.",
  "3-5": "At three to five years, a look starts to feel familiar rather than fresh, especially next to competitors who have updated theirs.",
  "over-5": "More than five years without a professional update is a long time. Customers now meet you on a phone, in a feed and in search results, next to competitors who have refreshed.",
  never: "Your look has never been professionally designed, so it has been carrying the business on instinct rather than on purpose.",
};

export const WEAKEST_SENTENCES: Record<Answers["weakest"], string> = {
  website: "You named your website as the weakest part. For most customers it is the first real impression, and often where they decide whether to get in touch.",
  "photo-video": "You named your photos and video as the weakest part. Images do most of the selling before anyone reads a word, so weak ones cost more than they seem to.",
  social: "You named social media as the weakest part. It is often where people check you out after hearing your name, so it needs to match the business you are.",
  "print-sales": "You named your printed and sales material as the weakest part. Those are the pieces in a customer's hands while they are deciding.",
  "logo-look": "You named your logo and overall look as the weakest part. Everything else is built on it, so it holds everything else back too.",
  none: "Nothing stands out to you as weak, which is a good sign. The real test is how the parts work together.",
};

export const CONSISTENT_SENTENCES: Record<Answers["consistent"], string> = {
  yes: "Your website, social media and printed material look like the same business. That consistency is what makes a brand feel established.",
  mostly: "Your materials mostly match, with a few differences. Small differences add up, and customers feel them before they can name them.",
  no: "Your materials do not look like the same business. Customers notice, usually as a sense that something does not add up.",
  "never-compared": "You have not compared your materials side by side. It takes ten minutes, and it is usually where the first surprises appear.",
};

export const HANDOVER_SENTENCES: Record<Answers["handover"], string> = {
  "written-followed": "A new employee or supplier could get your brand right without asking you. That is rare, and it is what lets a business grow without the brand drifting.",
  "rules-unused": "You have brand rules, but nobody really uses them. Rules that sit in a folder behave like no rules at all.",
  "lots-of-help": "New people can only get your brand right with a lot of help from you, which makes you the bottleneck every time something is made.",
  "in-our-heads": "Your brand lives in your head. That works until the team grows or a new supplier gets the brief.",
};

export const CLARITY_SENTENCES: Record<Answers["clarity"], string> = {
  "straight-away": "People understand what makes you different straight away, which is one of the hardest things for a brand to achieve.",
  "some-explanation": "People need some explanation before they see what makes you different. Every extra sentence is a chance for them to lose interest.",
  "after-talking": "People only understand what makes you different once they talk to you. Your brand should be doing that work before the conversation, not after it.",
  struggle: "You find it hard to explain what makes you different. If you struggle to say it, customers will struggle to see it.",
};

export const AHEAD_SENTENCES: Record<Answers["ahead"], string> = {
  launch: "With a launch, expansion or new location coming, your brand is about to be seen by more people, in more places, than ever.",
  growing: "With the team growing or new markets ahead, more people will be making and judging your brand material.",
  investment: "With new investment or a sale ahead, your brand becomes part of how the business is valued.",
  steady: "With a steady year ahead, this is a good moment to fix the foundations before the next push.",
};

export const NEXT_STEP_SENTENCES: Record<ProfileId, string> = {
  strong: "The next step is to protect what you have: keep standards high as you produce more, and run this check again in six months.",
  "hard-to-explain": "The next step is positioning: agreeing in one sentence what makes you different, then making sure your brand says it before you have to.",
  overdue: "The next step is a refresh of your look, planned once across every place it appears, keeping what customers already recognise.",
  "unused-rulebook": "The next step is not a new look. It is making your rules easy to use: practical templates, a short session for the team and one person responsible.",
  outgrown: "The next step is to test your brand against your plans for the year ahead, then strengthen whatever will not hold up.",
  unwritten: "The next step is to write your brand down: the look, the rules and the templates, so anyone can get it right without asking you.",
  scattered: "The next step is to bring everything into line: one approved look, simple rules and ready templates for the pieces you make most.",
  undersold: "The next step is to fix what customers see first, starting with the part you named, so it matches the quality of the business behind it.",
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
  label: "(Next Step)",
  heading: "Talk it through with our Creative Director.",
  text: "A 30 minute conversation about your result, not a sales presentation. No preparation needed: your answers come with you. Choose any time that suits you.",
  button: "Discuss My Results",
};

export const KEEP_IT = {
  label: "(Keep It)",
  heading: "Take this with you.",
  text: "We will send your result, plus three practical actions for your brand this quarter.",
  emailLabel: "Email",
  button: "Send My Result",
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
  button: "Add Details",
  sending: "Sending...",
  success: "Thank you. We will look before we speak.",
  failure: "We could not add your details just now. Your result is still here.",
  websiteInvalid: "Enter a website address, like company.com.",
};

export const GATE_COPY = {
  heading: "Get your full result.",
  button: "Show My Result",
};

export const QUIET_LINKS = {
  conversation: "Start a Conversation",
  copyLink: "Copy a link to this result",
  copied: "Link copied.",
  startAgain: "Start again",
};

export const SHARED = {
  button: "Take the Check Yourself",
};

export const ARTICLE_CTA = {
  label: "(Brand Pulse)",
  heading: "How healthy is your brand?",
  text: "A plain read on five vital signs, in about a minute.",
  button: "Take the 60 Second Brand Pulse",
};

export const PAGE = {
  title: "Brand Pulse Check",
  description: "Seven quick questions, about a minute. A plain read on five vital signs of your brand, with one clear next step.",
};
