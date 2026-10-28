# Services import

The four services on the website are written in the code, in `src/data/services.ts`, and the website reads them from there. This tool copies them into Sanity, field for field, so Studio always holds a complete reference copy. It:

1. Reads the four services from the code and checks Sanity can hold every field.
2. Shows you what each service contains, and what is in Sanity now.
3. With `--commit`, writes the four services to Sanity, replacing their previous copy.
4. With `--verify`, compares Sanity with the code and lists every difference.

It runs on your own computer only. It is never part of the website itself.

**The website does not read this copy.** Changing a service in Studio changes nothing on the site. Every service document in Studio says so at the top. To change a service on the site, change `src/data/services.ts`, then run this tool again so Sanity matches.

---

## Before you start (one time only)

You need Node.js 22 or newer and `npm install` run once.

The services import uses the same `.env.import` file and Sanity write token as the portfolio import. If you have set that up already, there is nothing more to do. If not, follow "Before you start" in `scripts/import-portfolio/README.md`.

**Never put the token in `.env.local`.** `.env.local` holds the website's settings on your computer only: git ignores it and it is never committed. The write token belongs only in `.env.import`, which git also ignores.

---

## Running it

```
npm run import:services                  Show what would be written. Reads Sanity, writes nothing.
npm run import:services -- --commit      Write the four services to Sanity, then verify.
npm run import:services -- --verify      Compare Sanity with the code. Writes nothing.
```

Always run without `--commit` first and read the output.

- **The dry run** lists each service with every field: text fields by their length, lists by their count, for example `deliverables: 9` and `process: 5`. It then says which documents it will create or replace, and names any other service documents it found in Sanity (the older "Strategy" and "Brand Identity & Visual Design"). Those are never touched.
- **`--commit`** writes each service as the document `service-<slug>`, for example `service-brand-identity`, and replaces that document completely, so Sanity always equals the code. All four are written together, or none is. It then runs the verify step below.
- **`--verify`** reads the four documents back and compares them with the code, field by field. It prints `identical` for each service, or every difference, for example `deliverables[2].name: code "Logo System", Sanity "Logo"`.
- **Nothing is ever deleted.**
- **Run it again any time the services in the code change.** It is safe to repeat.

If `src/data/services.ts` gains a field Sanity does not have yet, the tool stops and writes nothing, and says which field. Add the field to `sanity/schemas/service.ts` and `scripts/import-services/lib/transform.mjs`, then run it again.

### Edits made in Studio

A `--commit` replaces the four documents with the code, so anything typed into them in Studio is overwritten. Run `--verify` first if you want to see what was changed there.

If Studio shows a service as an unpublished draft, the tool says so. Studio keeps showing the draft until you discard it.

---

## What goes where

| In the code | In Studio | On the service page |
| --- | --- | --- |
| `slug` | Service tab, Web address | The page address, /services/brand-identity |
| `number` | Service tab, Service number | Not shown today |
| `name` | Service tab, Service name | The "Plan a … Project" button, Brand Pulse results |
| `subtitle` | Hero tab, Service label | Not shown today |
| `seoH1` | Hero tab, Page topic (h1) | The small line above the heading, the page's h1 |
| `headline` | Hero tab, Hero heading | The large heading |
| `description` | Hero tab, Hero text | The paragraph under the heading |
| `tagline` | Not shown yet tab, Tagline | Not shown today |
| `seoTitle` | SEO tab, SEO title | Browser tab and search results |
| `seoDescription` | SEO tab, SEO description | Search results and link previews |
| `gradient` | Not shown yet tab, Background gradient | Not shown today |
| `deliverables` | Deliverables tab | (01) What you get |
| `impact` | Why it matters tab | (02) Why it matters |
| `localSection` | Across the GTA tab | (04) Across the GTA |
| `process` | Process steps tab | (05) How we do it |
| `faqs` (optional) | Questions tab | (07) Questions, after Related work. Links in answers are written as `[text](/path)` |
| `ctaHeading` | Closing call to action tab, Closing heading | The dark Next step section |
| (position in the code) | Service tab, Order in Studio | Sorts the Studio list only |
