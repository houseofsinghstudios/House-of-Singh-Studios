// The three actions per profile. They are the reason to give an email, so they stay on the server:
// "server-only" makes the build fail if any client component imports this file.
// Only the Brand Pulse API route uses it, to add the actions to the result it sends to n8n.
// Plain everyday words, no dashes, like content.ts.
import "server-only";
import { assess } from "./engine";
import type { Answers, ProfileId, ServerResult } from "./types";

const ACTIONS: Record<ProfileId, [string, string, string]> = {
  strong: [
    "Keep one shared folder of approved files and templates, and delete old versions as you go.",
    "Once a month, check a few new pieces against your brand rules before they go out.",
    "Put a date in your calendar to retake this check in six months.",
  ],
  "hard-to-explain": [
    "Ask five customers why they chose you, and write down their exact words. The answer is often already there.",
    "Write one sentence about what you do that a competitor could not honestly say. If you cannot, start there.",
    "Read your homepage as a stranger would. If the first screen does not say why you, rewrite that first.",
  ],
  overdue: [
    "Put your brand beside your three closest competitors on one page, the way a customer sees them, and note where you look older.",
    "List every place your brand appears today, so a refresh can be planned once rather than piece by piece.",
    "Decide what must survive the refresh: a colour, a symbol or a name customers already know. Protect that before changing anything.",
  ],
  "unused-rulebook": [
    "Ask three people who make brand material where the rules live. If they cannot find them in under a minute, that is the problem.",
    "Turn the five things your team makes most often into ready templates, so the right choice is also the easy one.",
    "Name one person who signs off anything customers will see, and give them the rules as their checklist.",
  ],
  outgrown: [
    "Write down the three audiences or markets your next year depends on, and check whether your brand speaks to each.",
    "List the material your plans will need, from sales decks to signage, before a deadline makes it urgent.",
    "Test your brand at its edges: smallest size, darkest background, a new product name. Weak points show there first.",
  ],
  unwritten: [
    "Write down the rules your team already follows without thinking, from colours to tone, before they are lost.",
    "Create one shared folder with the approved logo files, colours and fonts, and delete every other version.",
    "Template the three pieces you make most often, so new work starts from the rules instead of from scratch.",
  ],
  scattered: [
    "Screenshot your brand everywhere it appears this week and lay the images side by side. The differences will be obvious within minutes.",
    "Choose one version of the logo, one set of colours and two fonts, and retire everything else.",
    "Fix the three most seen pieces first: usually your website, your social profiles and your email signature.",
  ],
  undersold: [
    "Look at the part you named as weakest on a phone, through a customer's eyes, and list the three things that let the business down most.",
    "Find the best example of your work, product or space, and make sure it is the first thing customers see wherever they look.",
    "Compare that part with your two strongest competitors and note one thing they do better. That is your first fix.",
  ],
};

export function actionsFor(profile: ProfileId): [string, string, string] {
  return ACTIONS[profile];
}

// The full result for n8n: the shared engine's result plus the actions.
export function assessWithActions(answers: Answers): ServerResult {
  const result = assess(answers);
  return { ...result, actions: actionsFor(result.profileId) };
}
