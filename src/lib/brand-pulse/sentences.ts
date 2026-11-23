// The result's sentences, chosen by the engine (engine.ts) from the answers: one per answer, and the
// next step per profile. Visitor facing copy, under the same rules as content.ts (plain words, no
// dashes); kept apart so content.ts stays under 300 lines.
import type { Answers, ProfileId } from "./types";

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
