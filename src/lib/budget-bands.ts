// The budget ranges a visitor can give, one list for both forms (site audit S-09, 23 Nov 2026): the
// Project Planner's optional investment question (src/lib/project-planner) and the contact form's
// "Budget range (CAD), optional" menu (BUDGET_OPTIONS in src/lib/lead.ts). They are the visitor's own
// range, sent to the studio, never the studio's price (see PRICING in CLAUDE.md), so the list starts
// under $1,000 and offers no floor. In display order, "Not sure yet" last; amounts in CAD.
export const BAND_IDS = ["under_1k", "1k_4k", "4k_10k", "10k_20k", "20k_plus", "not_sure"] as const;
export type BandId = (typeof BAND_IDS)[number];

export const BAND_LABELS: Record<BandId, string> = {
  under_1k: "Under $1,000",
  "1k_4k": "$1,000 to $4,000",
  "4k_10k": "$4,000 to $10,000",
  "10k_20k": "$10,000 to $20,000",
  "20k_plus": "$20,000 or more",
  not_sure: "Not sure yet",
};
