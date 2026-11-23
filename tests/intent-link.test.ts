// Links prefetch on intent, not on sight (homepage audit H-07, 22 Nov 2026; site wide since the site
// audit S-06, 23 Nov 2026): prefetching every linked page on load fetched routes and their stylesheets
// before any interaction, and Chrome warned about each unused preloaded stylesheet (116 warnings across
// the audited pages before S-06, 0 after). Only /work prefetches on sight, and only on the homepage.
// Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const read = (f: string) => readFileSync(f, "utf8");

test("IntentLink: no viewport prefetch, a router prefetch on hover, focus and touch, same Link underneath", () => {
  const src = read("src/components/IntentLink.tsx");
  assert.match(src, /import \{ Link, useTransitionRouter \} from "next-view-transitions";/, "page transitions unchanged");
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
  assert.match(header, /const onHome = usePathname\(\) === "\/";/);
  assert.match(header, /const NavLink = link\.href === "\/work" && onHome \? Link : IntentLink;/, "Work on sight on the homepage only, the rest on intent");
  assert.match(header, /<IntentLink href="\/start" className="btn-primary header-cta"/);
  assert.match(header, /<IntentLink href="\/" className="header-wordmark">/);
  assert.match(read("src/components/work/index/HomeWorkIndex.tsx"), /<Link href=\{all\.href\} className="hw-all"/, "All work keeps prefetching on sight");
});

// Every .tsx file under src.
function sourceFiles(dir = "src"): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? sourceFiles(full) : e.name.endsWith(".tsx") ? [full] : [];
  });
}

test("site wide: no direct Link to a site page outside the agreed exceptions", () => {
  // The view transition Link, used directly, prefetches on sight. Allowed only in IntentLink itself and
  // where /work prefetches on sight on the homepage: the header's Work link and Selected work's All work.
  const transitionLink = sourceFiles().filter((f) => /import \{[^}]*\bLink\b[^}]*\} from "next-view-transitions";/.test(read(f)));
  assert.deepEqual(transitionLink.sort(), [
    path.join("src/components/IntentLink.tsx"),
    path.join("src/components/layout/Header.tsx"),
    path.join("src/components/work/index/HomeWorkIndex.tsx"),
  ]);
  // next/link only in global-error, which renders outside the site shell (no transition provider),
  // and there with prefetch off.
  const nextLink = sourceFiles().filter((f) => /from "next\/link"/.test(read(f)));
  assert.deepEqual(nextLink, [path.join("src/app/global-error.tsx")]);
  const globalError = read("src/app/global-error.tsx");
  for (const m of globalError.matchAll(/<Link\b[^>]*>/g)) assert.match(m[0], /prefetch=\{false\}/, m[0]);
  // The two exceptions keep their one direct Link each.
  assert.equal((read("src/components/work/index/HomeWorkIndex.tsx").match(/<Link\b/g) || []).length, 1);
});

test("the shared pieces: Button and NextPageLink link through IntentLink", () => {
  const button = read("src/components/ui/Button.tsx");
  assert.match(button, /import IntentLink from "@\/components\/IntentLink";/);
  assert.equal((button.match(/<IntentLink href=\{href\}/g) || []).length, 2, "the text button and the boxed button");
  assert.doesNotMatch(button, /<Link\b/);
  const next = read("src/components/layout/NextPageLink.tsx");
  assert.match(next, /<IntentLink href=\{next\.href\} className="next-page-anchor"/);
});

test("the planner's discovery call link is a plain anchor, as every external link", () => {
  const invite = read("src/components/project-planner/PlannerInvite.tsx");
  assert.match(invite, /<a href=\{DISCOVERY_CALL_URL\} className="pp-link" target="_blank" rel="noopener noreferrer">/);
});
