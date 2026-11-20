// The homepage's (02) What we do: interleaving, counts and the heading, the work picked per discipline,
// the link builders, the Studio rules, the events and the homepage order. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { services } from "@/data/services";
import {
  caseStudyHref,
  countLabel,
  countWord,
  detailLinkText,
  interleave,
  pickWork,
  previewCaption,
  rankWorkProjects,
  repeatedDiscipline,
  seeItText,
  serviceHref,
  totalDisciplines,
  WWD_MAX_ENTRIES,
  wwdHeading,
  type WwdProjectDoc,
  type WwdService,
} from "@/lib/what-we-do";

const read = (file: string) => readFileSync(file, "utf8");
const LIST: WwdService[] = services.map((s) => ({ slug: s.slug, number: s.number, name: s.name, tagline: s.tagline, description: s.description, disciplines: s.deliverables }));
const ALL = services.flatMap((s) => s.deliverables.map((d) => d.name));

test("interleaving: the first of each service, then the second of each, and so on", () => {
  const terms = interleave(LIST);
  assert.equal(terms.length, ALL.length);
  assert.deepEqual(terms.slice(0, 8).map((t) => t.name), ["Brand Strategy", "Brand Photography", "UX Research", "Brand Audit", "Brand Naming", "Video Production", "Information Architecture", "Positioning"]);
  assert.deepEqual(terms.map((t) => t.order), terms.map((_, i) => i), "reading order");
  assert.deepEqual(new Set(terms.map((t) => t.name)), new Set(ALL), "every discipline once");
  // Brand identity has the most disciplines, so the last round holds only its ninth.
  assert.equal(terms.at(-1)!.name, "Art Direction");
  assert.equal(terms.at(-1)!.service, "brand-identity");
  // A small case: services of different lengths.
  const small = interleave([
    { slug: "a", number: "01", name: "A", tagline: "", description: "", disciplines: [{ name: "a1", description: "" }, { name: "a2", description: "" }, { name: "a3", description: "" }] },
    { slug: "b", number: "02", name: "B", tagline: "", description: "", disciplines: [{ name: "b1", description: "" }] },
  ]);
  assert.deepEqual(small.map((t) => t.name), ["a1", "b1", "a2", "a3"]);
});

test("counts and the heading: derived from the data, the number written as a word", () => {
  assert.deepEqual(services.map((s) => s.deliverables.length), [9, 6, 8, 7]);
  assert.equal(totalDisciplines(LIST), 30);
  assert.equal(wwdHeading(LIST), "Four services. Thirty disciplines. One studio.");
  // The heading's number always equals the total, whatever the total is.
  assert.ok(wwdHeading(LIST).includes(`${countWord(totalDisciplines(LIST))} disciplines`));
  const plusOne = LIST.map((s, i) => (i === 0 ? { ...s, disciplines: [...s.disciplines, { name: "New", description: "" }] } : s));
  assert.equal(wwdHeading(plusOne), "Four services. Thirty one disciplines. One studio.");
  assert.equal(countWord(4), "Four");
  assert.equal(countWord(19), "Nineteen");
  assert.equal(countWord(40), "Forty");
  assert.equal(countWord(99), "Ninety nine");
  assert.equal(countWord(100), "100");
  assert.equal(countLabel(9), "09");
  // The section builds the heading from the data: no number word written into the component.
  const section = read("src/components/homepage/what-we-do/WhatWeDoSection.tsx");
  assert.match(section, /\{wwdHeading\(list\)\}/);
  assert.doesNotMatch(section, /Thirty|Four services/);
});

const img = (id: string) => ({ url: `https://cdn.sanity.io/images/x/y/${id}.jpg`, alt: `${id} alt`, hotspot: { x: 0.5, y: 0.25 } });
const build = (image: { url?: string }) => ({ src: `${image.url}?w=900`, position: "50% 25%" });

test("picking the work per discipline: explorations out, Homepage order first, then newest", () => {
  const docs: WwdProjectDoc[] = [
    { slug: "late", title: "Late Co", projectType: "client", publishedAt: "2026-11-01", whatWeDo: [{ discipline: "Logo System", image: img("late") }] },
    { slug: "ordered", title: "Ordered Co", heroName: "Ordered", projectType: "client", homeOrder: 2, publishedAt: "2025-01-01", whatWeDo: [{ discipline: "Logo System", image: img("ordered") }, { discipline: "Brand Naming", image: img("naming") }] },
    { slug: "explore", title: "Explore", projectType: "exploration", homeOrder: 1, publishedAt: "2026-11-10", whatWeDo: [{ discipline: "Brand Audit", image: img("explore") }, { discipline: "Logo System", image: img("x") }] },
    { slug: "untyped", title: "Untyped Co", publishedAt: "2026-10-01", whatWeDo: [{ discipline: "UX Research", image: img("ux") }] },
    { slug: "no-image", title: "No Image", publishedAt: "2026-11-20", whatWeDo: [{ discipline: "Positioning", image: null }, { discipline: "Brand Voice", image: { alt: "x" } }] },
    { slug: "unknown", title: "Unknown", publishedAt: "2026-11-20", whatWeDo: [{ discipline: "Juggling", image: img("j") }] },
  ];
  const work = pickWork(docs, ALL, build);
  assert.equal(work["Logo System"].slug, "ordered", "Homepage order beats a newer project");
  assert.equal(work["Logo System"].client, "Ordered", "the Hero name when set");
  assert.equal(work["Logo System"].image.src, "https://cdn.sanity.io/images/x/y/ordered.jpg?w=900");
  assert.equal(work["Logo System"].image.alt, "ordered alt");
  assert.equal(work["Brand Naming"].slug, "ordered");
  assert.equal(work["UX Research"].client, "Untyped Co", "no type counts as client; the title when no Hero name");
  assert.equal(work["Brand Audit"], undefined, "explorations are never used");
  assert.equal(work["Positioning"], undefined, "no image: the word stays plain text");
  assert.equal(work["Brand Voice"], undefined, "an image without its file: plain text");
  assert.equal(work["Juggling"], undefined, "only the thirty disciplines");
  assert.deepEqual(rankWorkProjects(docs).map((p) => p.slug), ["ordered", "no-image", "unknown", "late", "untyped"]);
  // Nothing from Sanity: every word plain text.
  assert.deepEqual(pickWork([], ALL, build), {});
});

test("the link builders and the words around them", () => {
  assert.equal(caseStudyHref("tairn"), "/work/tairn");
  assert.equal(serviceHref("brand-identity"), "/services/brand-identity");
  assert.equal(detailLinkText("Brand Identity and Visual Design"), "Brand Identity and Visual Design in detail");
  assert.equal(seeItText("Tairn and Co"), "See it in Tairn and Co");
  assert.equal(previewCaption("Logo System", "Tairn and Co"), "Logo System for Tairn and Co");
});

test("Studio: the What we do fieldset, its list from the services, each discipline once, twelve at most", () => {
  const schema = read("sanity/schemas/caseStudy.ts");
  assert.match(schema, /import \{ services \} from "\.\.\/\.\.\/src\/data\/services";/);
  assert.match(schema, /services\.flatMap\(\(s\) => s\.deliverables\.map\(\(d\) => \(\{ title: `\$\{d\.name\} \(\$\{s\.name\}\)`, value: d\.name \}\)\)\)/);
  assert.match(schema, /description: "Choose the disciplines this project shows on the homepage, and the image for each\. Client work only; explorations are never used\.",/);
  const fieldsets = schema.slice(schema.indexOf("fieldsets: ["), schema.indexOf("fields: ["));
  assert.ok(fieldsets.indexOf('name: "workIndex"') < fieldsets.indexOf('name: "homepageWhatWeDo"'), "after Work index");
  assert.match(fieldsets, /name: "homepageWhatWeDo",\s*title: "What we do",[\s\S]*?collapsed: true/);
  assert.match(schema, /options: \{ hotspot: true \}/);
  assert.equal(WWD_MAX_ENTRIES, 12);
  assert.equal(repeatedDiscipline([{ discipline: "Logo System" }, { discipline: "Brand Naming" }, { discipline: "Logo System" }]), "Logo System");
  assert.equal(repeatedDiscipline([{ discipline: "Logo System" }, {}, null]), null);
  assert.equal(repeatedDiscipline(undefined), null);
});

test("events: the three names, with their parameters, and no hover events", () => {
  const root = read("src/components/homepage/what-we-do/WhatWeDo.tsx");
  const field = read("src/components/homepage/what-we-do/WwdField.tsx");
  const rows = read("src/components/homepage/what-we-do/WwdRows.tsx");
  const phone = read("src/components/homepage/what-we-do/WwdPhoneWords.tsx");
  assert.match(root, /track\("home_wwd_service_open", \{ service: services\[i\]\.slug \}\)/);
  assert.match(field, /track\("home_wwd_word_click", \{ discipline: t\.name, has_work: true, layout: "desktop" \}\)/);
  assert.match(phone, /track\("home_wwd_word_click", \{ discipline: name, has_work: Boolean\(work\[name\]\), layout: "phone" \}\)/);
  assert.match(rows, /track\("home_service_click", \{ service: service\.slug \}\)/);
  for (const src of [root, field, rows, phone]) assert.doesNotMatch(src, /track\("[a-z_]*hover/);
});

test("the homepage: What we do replaces The Argument and Capabilities; the sections renumbered", () => {
  const page = read("src/app/(site)/(home)/page.tsx");
  const order = ["<HeroSection", "<SelectedWorkSection", "<WhatWeDoSection", "<TestimonialsSection", "<ProofSection", "<ToolBand", "<CtaSection"].map((tag) => page.indexOf(tag));
  assert.ok(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1])), `order ${order}`);
  assert.doesNotMatch(page, /ArgumentSection|ServicesSection|NextPageLink/);
  assert.match(read("src/components/homepage/what-we-do/WhatWeDoSection.tsx"), /<EditorialLabel number="02" text="What we do"/);
  assert.match(read("src/components/homepage/TestimonialsSection.tsx"), /<EditorialLabel number="03" text="Testimonials"/);
  assert.match(read("src/components/homepage/ProofSection.tsx"), /\(04\) Proof/);
  assert.match(read("src/components/homepage/ToolBand.tsx"), /label: "\(05\) Two ways to start"/);
  // The preview images: next/image at 300px, never priority, and only after the pointer enters.
  const field = read("src/components/homepage/what-we-do/WwdField.tsx");
  assert.match(field, /sizes="300px"/);
  assert.match(field, /\{armed &&/);
  assert.doesNotMatch(field, /\bpriority\b|fetchPriority|loading="eager"/);
});
