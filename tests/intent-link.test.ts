// Links prefetch on intent, not on sight (homepage audit H-07, 22 Nov 2026): prefetching every linked
// page on load fetched nine routes and their stylesheets before any interaction, and Chrome warned about
// each unused preloaded stylesheet. The /work links keep prefetching on sight. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (f: string) => readFileSync(f, "utf8");

test("IntentLink: no viewport prefetch, a router prefetch on hover, focus and touch, same Link underneath", () => {
  const src = read("src/components/IntentLink.tsx");
  assert.match(src, /import \{ Link \} from "next-view-transitions";/, "page transitions unchanged");
  assert.match(src, /prefetch=\{false\}/);
  assert.match(src, /router\.prefetch\(href\)/);
  for (const handler of ["onMouseEnter", "onFocus", "onTouchStart"]) assert.match(src, new RegExp(`${handler}=\\{\\(e\\) => \\{\\s*warm\\(\\);\\s*${handler}\\?\\.\\(e\\);`), handler);
  assert.match(src, /href\.startsWith\("\/"\)/, "only the site's own pages");
});

test("the homepage, header, drawer and footer link through IntentLink, except the /work links", () => {
  const intentOnly = [
    "src/components/homepage/HeroImages.tsx",
    "src/components/homepage/HeroCaption.tsx",
    "src/components/homepage/what-we-do/WwdField.tsx",
    "src/components/homepage/what-we-do/WwdRows.tsx",
    "src/components/homepage/what-we-do/WwdPhoneWords.tsx",
    "src/components/homepage/start/StartSheet.tsx",
    "src/components/homepage/start/StartSection.tsx",
    "src/components/work/index/WorkRows.tsx",
    "src/components/work/index/WorkChoicePanel.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/layout/MenuDrawer.tsx",
  ];
  for (const f of intentOnly) {
    const src = read(f);
    assert.match(src, /import IntentLink from "@\/components\/IntentLink";/, f);
    assert.doesNotMatch(src, /<Link\b/, f);
  }
  const header = read("src/components/layout/Header.tsx");
  assert.match(header, /const NavLink = link\.href === "\/work" \? Link : IntentLink;/, "Work on sight, the rest on intent");
  assert.match(header, /<IntentLink href="\/start" className="btn-primary header-cta"/);
  assert.match(header, /<IntentLink href="\/" className="header-wordmark">/);
  assert.match(read("src/components/work/index/HomeWorkIndex.tsx"), /<Link href=\{all\.href\} className="hw-all"/, "All work keeps prefetching on sight");
});
