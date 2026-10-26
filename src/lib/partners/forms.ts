// Introductions, partnerships and "How did you hear about us?" in the contact form and the Project
// Planner. Values equal labels, so they reach n8n and Airtable as plain text like every other
// service. Pure, so the rules can be tested and shared by the form and /api/lead.
import { isNomination, NOMINATION_PLACEHOLDER, serviceFromQuery } from "@/lib/initiatives/nominations";

// ?service=introduction and ?service=partnership preselect these; both hide the budget.
export const PARTNER_SERVICES = {
  introduction: "Introducing a client",
  partnership: "Becoming a partner",
} as const;

export const isIntroduction = (service: string) => service === PARTNER_SERVICES.introduction;
export const isPartnership = (service: string) => service === PARTNER_SERVICES.partnership;
// Introductions and partnerships ask their own questions, so their message is optional.
export const messageOptional = (service: string) => isIntroduction(service) || isPartnership(service);

// The service option to preselect for a ?service= value: a nomination, an introduction, a
// partnership, or "" for anything else.
export function contactServiceFromQuery(value: unknown): string {
  const nomination = serviceFromQuery(value);
  if (nomination) return nomination;
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" && Object.hasOwn(PARTNER_SERVICES, raw) ? PARTNER_SERVICES[raw as keyof typeof PARTNER_SERVICES] : "";
}

export const PARTNER_TYPES = [
  "Web development or marketing agency",
  "Printing or signage",
  "Photography or video",
  "Accounting, legal or advisory",
  "Other",
] as const;

export const HEAR_ABOUT = ["Google search", "Social media", "Recommended by someone", "A partner or agency", "An event or talk", "Other"] as const;

// These two answers reveal "Who recommended us?".
const NAMES_A_RECOMMENDER: readonly string[] = ["Recommended by someone", "A partner or agency"];
export const asksWhoRecommended = (hearAbout: string) => NAMES_A_RECOMMENDER.includes(hearAbout);

export const REFERRAL_LIMITS = {
  who: 160,
  contact: 160,
  businessName: 160,
  partnerType: 80,
  website: 300,
  hearAbout: 60,
  recommendedBy: 160,
} as const;

export const FORM_COPY = {
  yourName: "Your name",
  yourEmail: "Your email",
  who: "Who are you introducing?",
  reach: "How can we reach them?",
  permission: "I have their permission to share their details",
  permissionError: "Please confirm you have their permission to share their details.",
  introductionPlaceholder: "Anything we should know?",
  businessName: "Business name",
  partnerType: "What do you do?",
  partnerTypePlaceholder: "Select one",
  website: "Website",
  partnershipPlaceholder: "Tell us about your business and the clients you work with.",
  hearAbout: "How did you hear about us?",
  hearAboutPlaceholder: "Select one",
  recommendedBy: "Who recommended us?",
  optional: "(optional)",
  thanksIntroduction: "Thank you. We will contact them within one business day, and keep you updated.",
  thanksPartnership: "Thank you. Your partner link arrives within two business days.",
};

export interface ReferralFields {
  who: string;
  contact: string;
  permission: boolean;
  businessName: string;
  partnerType: string;
  website: string;
  hearAbout: string;
  recommendedBy: string;
}

// Caps apply to every lead; the required fields only to their own service. The reason is short
// and never quotes the submitted value.
export function checkReferralFields(service: string, f: ReferralFields): string | null {
  for (const key of Object.keys(REFERRAL_LIMITS) as (keyof typeof REFERRAL_LIMITS)[]) {
    if (f[key].length > REFERRAL_LIMITS[key]) return `${key} must be at most ${REFERRAL_LIMITS[key]} characters`;
  }
  if (isIntroduction(service)) {
    if (!f.who) return "Who you are introducing is required";
    if (!f.contact) return "How to reach them is required";
    if (f.permission !== true) return "Permission to share their details is required";
  }
  if (isPartnership(service)) {
    if (!f.businessName) return "Business name is required";
    if (!f.partnerType) return "What you do is required";
  }
  return null;
}

// The contact form's message placeholder for the chosen service.
export function messagePlaceholder(service: string): string {
  if (isNomination(service)) return NOMINATION_PLACEHOLDER;
  if (isIntroduction(service)) return FORM_COPY.introductionPlaceholder;
  if (isPartnership(service)) return FORM_COPY.partnershipPlaceholder;
  return "Tell us about your project, your timeline, and what you are looking for.";
}

// The contact form's thank you for the service that was sent.
export function contactThanks(service: string): string {
  if (isIntroduction(service)) return FORM_COPY.thanksIntroduction;
  if (isPartnership(service)) return FORM_COPY.thanksPartnership;
  return "Thank you. We have received your brief.";
}
