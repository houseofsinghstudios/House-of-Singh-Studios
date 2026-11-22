// The site header and the phone drawer: the hide and show rules (src/lib/header-scroll.ts), the
// Toronto time (src/lib/toronto-time.ts), and what the header and drawer contain. Run with:
// npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HIDE_AFTER, INITIAL_SCROLL, SCROLLED_AT, THRESHOLD, isScrolled, nextHeaderScroll, type HeaderScroll } from "@/lib/header-scroll";
import { SITE_LINKS } from "@/components/layout/site-links";
import { formatTorontoTime, torontoTime } from "@/lib/toronto-time";

// Scrolls through a list of positions and gives the state after each.
function run(positions: number[], locked = false, from: HeaderScroll = INITIAL_SCROLL): HeaderScroll[] {
  const out: HeaderScroll[] = [];
  let state = from;
  for (const y of positions) out.push((state = nextHeaderScroll(state, y, locked)));
  return out;
}
const last = (states: HeaderScroll[]) => states[states.length - 1];

test("visible near the top; hides only below 400px, on the way down", () => {
  assert.equal(last(run([0, 100, 300, 400])).hidden, false, "never hides above 400px");
  assert.equal(last(run([0, 300, 500])).hidden, true, "hides once past 400px going down");
});

test("down: hides only after more than 8px since the last change of direction", () => {
  // Hidden at 600, shown again by a 20px move up to 580, then down again from 580.
  const states = run([0, 600, 580, 584, 588, 590]);
  assert.equal(states[1].hidden, true, "600: hidden");
  assert.equal(states[2].hidden, false, "580: 20px up, shown");
  assert.equal(states[3].hidden, false, "584: 4px down, still shown");
  assert.equal(states[4].hidden, false, "588: 8px down, still shown (not more than 8)");
  assert.equal(states[5].hidden, true, "590: 10px down, hidden");
});

test("up: shows on any upward move of more than 8px", () => {
  const states = run([0, 600, 595, 592, 590]);
  assert.equal(states[1].hidden, true, "600: hidden");
  assert.equal(states[2].hidden, true, "595: 5px up, still hidden");
  assert.equal(states[3].hidden, true, "592: 8px up, still hidden (not more than 8)");
  assert.equal(states[4].hidden, false, "590: 10px up, shown");
});

test("always visible at the top of the page, and while locked", () => {
  assert.equal(last(run([0, 900, SCROLLED_AT])).hidden, false, "back at the top");
  assert.equal(last(run([0, 900, 1200], true)).hidden, false, "drawer open or reduced motion");
});

test("the rules' numbers: the line after 20px, hiding past 400px, 8px of movement", () => {
  assert.deepEqual({ SCROLLED_AT, HIDE_AFTER, THRESHOLD }, { SCROLLED_AT: 20, HIDE_AFTER: 400, THRESHOLD: 8 });
  // THRESHOLD exactly is not enough to hide; one pixel more is.
  assert.equal(last(run([0, 600, 580, 580 + THRESHOLD])).hidden, false);
  assert.equal(last(run([0, 600, 580, 580 + THRESHOLD + 1])).hidden, true);
});

test("the line under the bar shows once scrolled past 20px", () => {
  assert.equal(isScrolled(0), false);
  assert.equal(isScrolled(SCROLLED_AT), false);
  assert.equal(isScrolled(SCROLLED_AT + 1), true);
});

test("the drawer's time is Toronto time whatever the visitor's zone, as in 1:05 AM EST", () => {
  // 06:05 UTC on 15 January is 1:05 AM in Toronto (EST, UTC minus 5).
  assert.equal(formatTorontoTime(torontoTime(new Date(Date.UTC(2026, 0, 15, 6, 5)))), "1:05 AM EST");
  // 16:30 UTC on 15 July is 12:30 PM in Toronto (EDT, UTC minus 4).
  assert.equal(formatTorontoTime(torontoTime(new Date(Date.UTC(2026, 6, 15, 16, 30)))), "12:30 PM EDT");
  assert.deepEqual(torontoTime(new Date(Date.UTC(2026, 0, 15, 6, 5))), { hour: "1", minute: "05", dayPeriod: "AM", zone: "EST" });
});

test("desktop header: the studio's name as the home link, five links and Plan your project; no Contact", () => {
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  // The home link is live text, written in normal case (CSS makes the capitals).
  assert.match(header, /<IntentLink href="\/" className="header-wordmark">\s*House of Singh Studios\s*<\/IntentLink>/);
  assert.doesNotMatch(header, /next\/image|<Image|hos-studios-wordmark/);
  assert.doesNotMatch(header, /hos-studios-logo\.svg|header-crest/);
  // One list of the main pages for the header and the drawer (site-links.ts).
  assert.deepEqual(SITE_LINKS.map((l) => l.label), ["Services", "Work", "AI Lab", "About", "Insights"]);
  assert.match(header, /\{SITE_LINKS\.map\(\(link\) => \{/);
  assert.match(header, /href="\/start" className="btn-primary header-cta" data-cursor="link" onClick=\{\(\) => track\("header_cta_click", \{ location: "header" \}\)\}>\s*Plan your project/);
  assert.match(header, /track\("menu_open"\)/);
  assert.match(header, /aria-expanded=\{open\}/);
  assert.match(header, /aria-controls=\{DRAWER_ID\}/);
  // The crest file stays for the footer.
  assert.ok(readFileSync("public/hos-studios-logo.svg", "utf8").length > 0);
  // In the nav's own type, Obsidian where the links are Gunmetal; no width rule for it.
  const css = readFileSync("src/app/globals.css", "utf8");
  const home = css.slice(css.indexOf(".header-wordmark {"), css.indexOf("}", css.indexOf(".header-wordmark {")));
  for (const rule of ["font-family: var(--sans);", "font-size: 11px;", "font-weight: 500;", "text-transform: uppercase;", "letter-spacing: 0.14em;", "white-space: nowrap;", "color: var(--text-primary);", "view-transition-name: site-logo;"]) assert.ok(home.includes(rule), rule);
  assert.doesNotMatch(css, /header-wordmark-img|min-width: 1081px\) and \(max-width: 1279px/);
});

test("drawer: a disclosure the menu button controls, six links including Contact, no close X of its own", () => {
  const drawer = readFileSync("src/components/layout/MenuDrawer.tsx", "utf8");
  const header = readFileSync("src/components/layout/Header.tsx", "utf8");
  // Not a dialog: aria-modal would hide the menu button (outside the drawer) from screen readers.
  const code = drawer.replace(/^\s*\/\/.*$/gm, "");
  assert.doesNotMatch(code, /role="dialog"|aria-modal|<button/);
  assert.match(drawer, /role="region"\s+aria-label="Menu"/);
  assert.match(drawer, /<nav className="menu-drawer-links" aria-label="Site pages">/);
  // The menu button is the one control: never made inert, focused on open, part of the Tab loop.
  assert.match(drawer, /header\.site-header > :not\(\.header-mobile-hamburger\)/);
  assert.match(drawer, /toggle\.current\?\.focus\(/);
  assert.match(drawer, /\[toggle\.current, \.\.\.panel\.current\.querySelectorAll/);
  assert.match(header, /toggleRef=\{menuButtonRef\}/);
  assert.match(header, /aria-label=\{open \? "Close menu" : "Open menu"\}/);
  // The same pages as the header, then Contact.
  assert.match(drawer, /const DRAWER_LINKS = \[\.\.\.SITE_LINKS, \{ label: "Contact", href: "\/contact" \}\];/);
  assert.doesNotMatch(drawer, /label: "(Services|Work|AI Lab|About|Insights)"/, "no second copy of the pages");
  assert.doesNotMatch(drawer, /Plan your project|\/start/);
  for (const closes of [/e\.key === "Escape"/, /className="menu-scrim"[^>]*onClick=\{onClose\}/, /onClick=\{onClose\}\s*style/, /SWIPE_CLOSE_PX = 60/]) assert.match(drawer, closes);
  assert.match(drawer, /EditorialLabel text="Studio"/);
  assert.match(drawer, /EditorialLabel text="Local time"/);
});

test("the menu button morphs into the close cross, above the drawer; instantly with reduced motion", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  const z = (selector: string) => Number(css.slice(css.indexOf(selector + " {")).match(/z-index: (\d+);/)?.[1]);
  assert.ok(z(".site-header") > z(".menu-drawer") && z(".site-header") > z(".menu-scrim"), "header above the drawer and scrim");
  assert.match(css, /\.hamburger-line \{\s*display: block;\s*width: 22px;\s*height: 1\.5px;\s*background: var\(--text-primary\);/);
  // Open: slide (180ms) then turn (280ms from 180ms). Close: turn back, then slide (from 280ms).
  assert.match(css, /\[aria-expanded="true"\] \.hamburger-line \{\s*transition:\s*translate 180ms cubic-bezier\(0\.23, 1, 0\.32, 1\),\s*rotate 280ms cubic-bezier\(0\.23, 1, 0\.32, 1\) 180ms;/);
  assert.match(css, /\.hamburger-line \{[^}]*transition:\s*rotate 280ms cubic-bezier\(0\.23, 1, 0\.32, 1\),\s*translate 180ms cubic-bezier\(0\.23, 1, 0\.32, 1\) 280ms;/);
  assert.match(css, /:first-child \{\s*translate: 0 3\.75px;\s*rotate: 45deg;/);
  assert.match(css, /:last-child \{\s*translate: 0 -3\.75px;\s*rotate: -45deg;/);
  assert.doesNotMatch(css, /menu-drawer-close|menu-drawer-top/);
});

test("one header token: --header-bar, 72px on desktop and 56px at 1080px and below", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  assert.match(css, /--header-bar: 72px;/);
  assert.match(css, /@media \(max-width: 1080px\) \{\s*:root \{\s*--header-bar: 56px;/);
  for (const old of ["--header-clearance", "--header-logo-top", "--header-logo-height"]) assert.ok(!css.includes(old), old);
});
