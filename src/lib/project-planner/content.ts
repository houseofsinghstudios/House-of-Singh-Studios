// Every visitor facing word in the Project Planner lives here, so copy can change without touching logic.
// Plain everyday words, no design jargon, no dashes of any kind. Buttons and links in sentence case.

import { BAND_LABELS } from "@/lib/budget-bands";
import type { GoalId, NamedService, ServiceId, TimingId } from "./types";

// No studio prices anywhere in the planner (decided 20 Nov 2026): every path ends in the call, and
// price comes after it, in the written proposal.

export const PAGE = {
  title: "Plan your project",
  description: "Plan your project in two minutes. We come to the call prepared.",
};

export const INTRO = {
  eyebrow: "Plan your project",
  heading: "A clearer brief. A better starting point.",
  text: "Tell us what you're building and what matters most. We'll organize your priorities into a practical first phase brief you can keep, edit or send to the studio.",
  trust: "Free to use. No account required. Your contact details are only collected if you choose to send your brief.",
  // Small print under the button. Never claim nothing is sent: completed selections are kept without contact details.
  privacy: "Project selections may be recorded without contact details when a brief is completed, to improve this service.",
  privacyLink: "Privacy policy",
  button: "Build my project brief",
  writeLead: "Prefer to write to us?",
  writeLink: "Send a message.",
  pulseLead: "Not sure what needs improving?",
  pulseLink: "Try the Brand Pulse.",
};

export const FLOW = {
  progress: (step: number, total: number) => `Step ${step} of ${total}`,
  continue: "Continue",
  back: "Back",
  seeBrief: "See my brief",
  mainFocus: "Main focus:",
  change: "Change",
  chooseMainFocus: "Which one is the main focus?",
  updated: "Your plan has been updated.",
  required: "Choose an option to continue.",
};

export const SERVICE_LABELS: Record<ServiceId, string> = {
  identity: "Brand identity or rebrand",
  website: "Website",
  photo: "Photography",
  video: "Video",
  packaging: "Packaging design",
  strategy: "Positioning or brand strategy",
  unsure: "I need help defining the work",
};

export const NEEDS = {
  question: "What are you looking to create or improve?",
  helper: "Choose up to three. You can change this later.",
  tooMany: "Choose up to three. You can add more in the note when you send your brief.",
  packagingHint: "Boxes, labels and product packaging.",
  // Standalone print is not packaging. Keep a direct route for it.
  printLead: "Brochures, menus or signage on their own?",
  printLink: "Send us a message instead.",
};

export const START = {
  question: "Where are you starting from?",
  helper: "So we know what can be reused and what needs creating.",
  options: {
    identity: { new: "Starting fresh, nothing yet", logo: "We have a logo, but few standards", system: "Our identity needs refining", ready: "Our identity works well" },
    packaging: { new: "Starting fresh, nothing yet", logo: "We have a logo, but few standards", system: "Our identity needs refining", ready: "Our identity works well" },
    website: { no_site: "No website yet", refresh: "Our site needs clearer design or content", redesign: "Our site needs a full redesign", feature: "Our site works, we need something added" },
    photo: { new_content: "Our first professional photos", refresh_library: "Our existing images need a refresh", campaign: "A specific campaign or launch", ongoing: "Ongoing content every month" },
    video: { new_content: "Our first professional video", refresh_library: "Our existing videos need a refresh", campaign: "A specific campaign or launch", ongoing: "Ongoing content every month" },
    strategy: { new_positioning: "Setting our direction for the first time", reposition: "Changing our market or audience", inconsistent: "Our teams or suppliers aren't aligned", unsure_context: "Not sure yet" },
    unsure: { launching: "Launching a new business or offer", growing: "Growing or expanding", changing: "The business is changing", no_label: "Hard to put into words" },
  } as Record<ServiceId, Record<string, string>>,
};

export const GOAL = {
  question: "What would make this project a success?",
  helper: "Choose the most important outcome.",
  options: {
    credibility: "Make the business look as established as it is",
    clarity: "Help people understand our offer faster",
    differentiation: "Stand apart from similar businesses",
    launch: "Launch a business, product or campaign",
    conversion: "Help more visitors become enquiries or customers",
    consistency: "Create a consistent experience across channels",
    production: "Create professional assets for a specific need",
    other: "Something else, or not sure",
  } as Record<GoalId, string>,
};

export const PRIORITIES = {
  question: "What matters most in the first phase?",
  helper: "Choose up to three priorities for the main service. We'll help define what belongs in the first phase.",
  tooMany: "Choose up to three priorities.",
  options: {
    identity: { logo_system: "Logo and visual identity", guidelines: "Brand guidelines", collateral: "Business cards and core materials", launch_apps: "Launch ready applications", refine: "Refining what we have" },
    website: { structure: "Site structure and navigation", visual: "A fresh visual design", new_site: "A new website", landing: "Landing pages", content_org: "Organising our content", self_edit: "Updating it ourselves" },
    photo: { product: "Product images", people: "People and portraits", editorial: "Editorial brand images", campaign_assets: "Campaign images", spaces: "Interiors or property" },
    video: { brand_story: "A brand story film", campaign_video: "A campaign video", short_form: "Short clips for social", interviews: "Interviews or testimonials", demos: "Product demonstrations" },
    packaging: { pack_system: "One look across our products", variants: "Adapting to variants or sizes", print_ready: "Print ready artwork", production: "Help working with printers" },
    strategy: { positioning: "Positioning", messaging: "Messaging", workshop: "A workshop with our team", direction: "Creative direction", governance: "Keeping everything consistent" },
  } as Record<NamedService, Record<string, string>>,
  help: "Help me prioritise",
};

export const TIMING = {
  question: "When would you like the first phase to begin?",
  helper: "We confirm availability and dates together.",
  options: {
    now: "As soon as practical",
    one_three: "Within 1 to 3 months",
    three_six: "In 3 to 6 months",
    flexible: "Just exploring timelines",
  } as Record<TimingId, string>,
};

// Short names for the "What you told us" chips and the booking notes.
export const TOLD_QUESTIONS = {
  needs: "Services",
  primary: "Main focus",
  start: "Starting point",
  goal: "Success looks like",
  priorities: "Priorities",
  timing: "Timing",
};

export const BRIEF = {
  intro: "Suggested starting plan based on your selections.",
  toldTitle: "What you told us",
  editAnswer: "Edit",
  firstPhaseTitle: "Suggested first phase",
  confirmTogetherTitle: "Priorities to confirm together",
  alsoTitle: "Also requested",
  alsoNote: "Also requested; scope and sequence to confirm together.",
  successTitle: "Success to confirm",
  toConfirmTitle: "Still to confirm",
  timelinesTitle: "Typical timelines",
  relatedTitle: "Related work",
  nextTitle: "What happens next",
  next: "Choose a time for your call. We read your answers first, so the call starts with your business. After the call, a written proposal confirms deliverables, timeline and investment.",
};

// Headline by primary service and starting point. Only what the visitor asked for.
export const HEADLINES: Record<ServiceId, Record<string, string>> = {
  identity: { new: "Build a brand identity from the ground up.", logo: "Turn your logo into a complete identity.", system: "Refine your identity without losing what works.", ready: "Extend a brand that already works." },
  website: { no_site: "Plan a website that introduces the business clearly.", refresh: "Make your website clearer and easier to use.", redesign: "Redesign your website around what visitors need.", feature: "Add what your website is missing." },
  photo: { new_content: "Plan your first professional photography.", refresh_library: "Refresh your image library.", campaign: "Plan a focused campaign shoot.", ongoing: "Set up a steady flow of photography." },
  video: { new_content: "Plan your first brand film.", refresh_library: "Refresh your video content.", campaign: "Plan a focused campaign video.", ongoing: "Set up a steady flow of video." },
  packaging: { new: "Create packaging and the identity it needs.", logo: "Build packaging around your logo.", system: "Refine your packaging alongside the brand.", ready: "Design packaging on the brand you have." },
  strategy: { new_positioning: "Set a clear direction before the design.", reposition: "Reposition for the market you want.", inconsistent: "Get everyone working from the same brief.", unsure_context: "Start by deciding what matters most." },
  unsure: { launching: "Define the first thing the business needs.", growing: "Define the first thing the business needs.", changing: "Define the first thing the business needs.", no_label: "Define the first thing the business needs." },
};

// "Help me prioritise": discovery activities, never a guessed list of deliverables.
export const DISCOVERY = {
  review: "Review your existing materials",
  choose: "Choose the most useful first deliverables",
  depends: "Clarify what depends on what",
  keep: "Review what should be kept",
  unsure: ["What has changed in the business", "What exists today and what still works", "Which piece to do first and why"],
};

// Only when identity is the main focus, built from scratch, and a website was also asked for.
export const DEPENDENCY_NOTE = "Final website visuals may depend on the approved brand direction, while structure and content work can run in parallel.";

// Never a promise of revenue, sales or rankings.
export const SUCCESS: Record<GoalId, string> = {
  credibility: "Customers see a credible business at first glance.",
  clarity: "People understand what you offer within seconds.",
  differentiation: "You are recognisable among similar businesses.",
  launch: "Everything needed for launch is ready on time.",
  conversion: "More visitors take the next step, such as an enquiry.",
  consistency: "Every channel looks and sounds like the same business.",
  production: "The assets you need arrive ready to use.",
  other: "We define success together on the call.",
};

export const TO_CONFIRM: Record<ServiceId, string[]> = {
  identity: ["What exists today and what must be kept", "Who approves the design"],
  website: ["Roughly how many pages", "Who writes the content", "Features you need"],
  photo: ["How many products or people", "Location", "Where the images will be used"],
  video: ["How many videos and how long", "Location and who is on camera", "Where the videos will be shown"],
  packaging: ["How many products and variants", "Your printer and formats"],
  strategy: ["Who should take part", "Which decisions this should settle"],
  unsure: ["What has changed in the business", "What exists today"],
};

// The brand package durations. Only when brand identity is the main focus.
export const TIMELINES = {
  label: "Package examples, not the timeline for your project.",
  text: (parts: string[]) => `Brand packages typically take ${parts.slice(0, -1).join(", ")} or ${parts[parts.length - 1]}.`,
};

export const OPTIONAL = {
  toggle: "Make my brief more useful",
  investmentQuestion: "Is there an investment range you're working within?",
  optional: "(optional)",
  // The same ranges and words as the contact form's budget menu (src/lib/budget-bands.ts).
  bands: BAND_LABELS,
  currency: "All amounts in CAD.",
  website: "Your website, if you have one",
  importantDate: "Is there an important date?",
  importantDatePlaceholder: "For example, a launch in spring",
};

export const ACTIONS = {
  book: "Choose a time for your call",
  send: "Send my brief",
  edit: "Edit brief",
  print: "Print",
  startAgain: "Start again",
};

// Under the main action: what happens to the answers before the call.
export const CALL = {
  line: "Your answers go to the studio before the call, so we start with your business.",
};

export const SEND = {
  heading: "Send your brief to the studio.",
  text: "It goes straight to House of Singh Studios for a personal review.",
  name: "Name",
  email: "Email",
  company: "Company",
  location: "Location or time zone",
  note: "Anything else we should know?",
  noteLimit: (left: number) => `${left} characters left`,
  insights: "Send me occasional studio insights.",
  smallPrint: "We use these details to reply to your request.",
  privacyLink: "Privacy policy",
  button: "Send my brief",
  sending: "Sending...",
  success: "Your brief has been received. We'll review it and get back to you.",
  failure: "We couldn't send your brief. Your answers are still here, please try again.",
  nameRequired: "Enter your name.",
  emailRequired: "Enter your email.",
  emailInvalid: "Enter a valid email, like name@company.com.",
  optional: "(optional)",
};

// Links into the planner from elsewhere on the site.
export const PLACEMENTS = {
  servicesHeading: "Let's turn your ideas into a clear project.",
  servicesText: "Choose what you're building, set your priorities, and leave with a practical project brief. No sign up required.",
  servicesButton: "Plan your project",
  servicesTalk: "Prefer to talk? Book a discovery call.",
  caseStudy: "Planning something similar? Build your brief.",
  brandPulse: "Turn this into a project brief.",
  contactLead: "Prefer a guided start?",
  contactLink: "Plan your project.",
};
