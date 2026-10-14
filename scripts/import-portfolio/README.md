# Portfolio import

This tool turns a folder of project files on your computer into a finished case study on the website. You describe the page as a list of **blocks**, top to bottom, and the tool:

1. Checks that everything is filled in correctly.
2. Prepares every image so it looks sharp and loads quickly.
3. Uploads the images to Sanity and creates the case study, already published.

The new case study appears at `studios.houseofsingh.com/work/your-project-name` within about a minute.

It runs on your own computer only. It is never part of the website itself.

---

## Before you start (one time only)

You need Node.js version 22 or newer, and you need to have run `npm install` in the project folder once.

### 1. Get a Sanity write token

The token is a password that lets this tool add case studies to Sanity. Treat it like a password.

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and sign in.
2. Choose the **House of Singh Studios** project.
3. Open the **API** tab, then **Tokens**, then click **Add API token**.
4. Name it `Portfolio import`.
5. Choose the **Editor** permission. (Viewer cannot create anything. Editor is enough. You do not need Administrator.)
6. Click **Save** and copy the token. Sanity shows it once only.

### 2. Put the token in `.env.import`

1. In the project folder, find `.env.import.example`.
2. Make a copy of it named exactly `.env.import` (same folder).
3. Open `.env.import` and paste your token straight after `SANITY_WRITE_TOKEN=`, with no spaces:

   ```
   SANITY_WRITE_TOKEN=sk1234yourtokenhere
   NEXT_PUBLIC_SANITY_PROJECT_ID=00iree4d
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   Leave the other two lines as they are.

**Never put the token in `.env.local`.** That file is saved to GitHub, so anyone who can see the code could see the token. `.env.import` is set up so that git ignores it and it never leaves your computer.

If a token is ever shared by mistake, delete it in the Sanity **Tokens** page and create a new one.

---

## How a page is built

Every case study page has three parts:

1. **The top, always the same:** the title, the overview text, the project facts and the cover image.
2. **The middle, made of blocks:** you choose the blocks and their order.
3. **The bottom, always the same:** deliverables, the next project and the "Start a project" panel.

### The six blocks

| Block | What it looks like |
| --- | --- |
| `split` | An image on one half of the page, a heading and text on the other. Choose which side the image is on. |
| `offset` | A heading, a column of text and an image side by side in three steps across the page. |
| `full` | One image across the full width of the page, with an optional caption. |
| `pair` | Two images side by side, edge to edge. |
| `statement` | One or two sentences shown large, with optional smaller text beside them. |
| `feature` | A large main image with a small detail image beside it, and an optional caption. |

Blocks with text (split, offset and statement) get a thin line above them, which gives the page its rhythm. Alternating text blocks with image blocks reads best.

Images are always shown whole, at their real shape. Portrait images stay portrait. Nothing is cropped, except the cover (see below).

---

## Preparing a project

Create a folder called `portfolio-import` in the project folder (next to `package.json`). Inside it, make one folder per project:

```
portfolio-import/
  tairn-and-co/
    project.json
    copy.md
    cover.jpg
    01-chair.jpg
    02-front.jpg
    ...
  another-project/
    ...
```

Git ignores the whole `portfolio-import` folder, so nothing in it is ever saved to GitHub.

**The fastest way to start:** copy `scripts/import-portfolio/example/` into `portfolio-import/`, rename the folder, add your images, and edit the two files. The example uses all six blocks.

### The folder name becomes the web address

`tairn-and-co` becomes `studios.houseofsingh.com/work/tairn-and-co`.

Use only lowercase letters, numbers and hyphens. No spaces, capitals, `&` or full stops.

### Images

- **`cover.jpg`** is required. It is the big image at the top of the page. The name must be exactly `cover.jpg`. Use a **landscape** image: the page shows the cover in a fixed wide frame (16:9), so a portrait cover is cropped top and bottom. The tool warns you if the cover is portrait.
- `cover.jpg` is only for the top of the page. It cannot be used inside a block.
- Name the other images however you like, for example `01-chair.jpg`. Starting with a number keeps them in order in your folder, but the page order comes from your block list, not the file names.
- JPG, PNG and WebP files all work. Everything is converted to JPG on upload.
- The same image can appear in more than one block. It is uploaded once.

Send the largest, best quality files you have. The tool prepares them for you:

- It shrinks any image whose longest side is over 2800 pixels down to 2800. It never enlarges and never crops.
- It converts colours to sRGB so they look right in every browser.
- It removes hidden camera data (location, camera model, dates) but keeps the colour information.
- It turns photos taken sideways on a phone the right way up.

A typical photo ends up between about 300 KB and 700 KB.

---

## copy.md: the words

This file holds all the text on the page, split into sections. Each section starts with a heading of two `#` symbols and a space.

```
## Overview
Harbour and Pine is a guesthouse and kitchen on the coast.

We gave it one identity that holds from the front door to the jam jar.

## The Challenge
Every part of the business had its own logo and its own voice.

The owners wanted **one clear identity** without losing the warmth.

## Approach
A brand should feel like the place before you arrive.

Read more on the [services page](https://studios.houseofsingh.com/services).
```

The rules:

- **`## Overview` is required.** It becomes the intro at the top of the page and the text on the project's card on the Work page.
- **Every other heading is a section you name yourself**, for example `## The Challenge`, `## Process` or `## What Changed`. Blocks pick which section to show.
- A section's **key** is how a block refers to it: the heading in lowercase, with spaces and punctuation turned into hyphens. `## The Challenge` becomes `the-challenge`. `## What Changed?` becomes `what-changed`.
- The heading shows on the page exactly as you wrote it.
- Leave an empty line between paragraphs.
- **Bold:** put two asterisks each side, `**like this**`.
- **Links:** `[the words to click](https://example.com)`. Links must start with `https://`, `http://` or `mailto:`.
- No bullet points or numbered lists, and no smaller headings (`###`).
- Italics are not supported either. If you write `*like this*`, the tool removes the asterisks, keeps the words as plain text, and warns you.
- Do not put any text above the first heading.
- Two headings cannot share the same key. `## Results` and `## Results!` would clash.
- The Overview and the large statement quote are always plain text, so bold and links there are dropped.

---

## project.json: the facts and the page

This file holds the facts about the project and the list of blocks. Keep all the quote marks, colons, commas and brackets exactly as shown.

```json
{
  "title": "Harbour and Pine",
  "client": "Harbour and Pine",
  "industry": "Hospitality",
  "year": 2026,
  "serviceCategories": ["brand-identity", "visual-media"],
  "disciplines": ["brand-identity", "packaging"],
  "deliverables": ["Brand strategy", "Logo system"],
  "featured": false,
  "publishedAt": "2026-10-14",
  "seoDescription": "One sentence under 155 characters.",
  "images": {
    "cover.jpg": "Describe the cover image",
    "01-chair.jpg": "Describe this image"
  },
  "blocks": [
    { "type": "split", "side": "left", "section": "the-challenge", "image": "01-chair.jpg" }
  ]
}
```

### The facts

| Field | What to put | Required |
| --- | --- | --- |
| `title` | The project name as it appears on the site. | Yes |
| `client` | The client's name. | No |
| `industry` | For example `Hospitality`. | No |
| `year` | A number with no quote marks, for example `2026`. | No |
| `serviceCategories` | One or more of the four values below, in square brackets. | Yes |
| `disciplines` | One or more of the nine values below, in square brackets. | Yes |
| `deliverables` | A list of what you made, in square brackets. | No |
| `featured` | `true` to show it on the homepage, `false` otherwise. No quote marks. | No |
| `publishedAt` | The date, written `YYYY-MM-DD`, for example `"2026-10-14"`. | Yes |
| `seoDescription` | The sentence Google shows in search results. Keep it under 155 characters. | Recommended |
| `images` | Every image file in the folder, each with its alt text. | Yes |
| `blocks` | The page, top to bottom. See below. | Yes |

**`serviceCategories`**, choose every service the project covers:

| Value | Service |
| --- | --- |
| `brand-identity` | Brand Identity and Visual Design |
| `visual-media` | Visual Media and Content Production |
| `digital-design` | Digital Design and Experience |
| `creative-strategy` | Creative Strategy and Systems |

The project appears under each service you list on the Services page. A full brand engagement often covers several, for example `["brand-identity", "visual-media", "digital-design"]`. List each service once.

Older project folders may use `"serviceCategory": "brand-identity"`, a single service without square brackets. That still works and is treated as a list of one. Use one or the other, never both.

**`disciplines`**, choose any of: `brand-identity`, `packaging`, `publication`, `art-direction`, `website`, `video`, `photography`, `social-content`, `strategy`. These power the filters on the Work page.

**Alt text** in `images` describes each picture for people who cannot see it, and helps search engines. Keep it short and specific. Every image file in the folder needs an entry, and every entry needs a matching file. Names must match exactly, including capitals.

Do not add an SEO title. The site adds the studio name to every page title automatically.

### The blocks

`blocks` is a list in square brackets. Each item is one block, written between curly brackets, in the order it appears on the page. Here is every block type:

```json
"blocks": [
  { "type": "split", "side": "left", "section": "the-challenge", "image": "01-chair.jpg" },
  { "type": "pair", "images": ["02-front.jpg", "03-back.jpg"] },
  { "type": "statement", "section": "approach" },
  { "type": "offset", "section": "process", "image": "04-room.jpg" },
  { "type": "full", "image": "05-applied.jpg", "caption": "Optional caption" },
  { "type": "split", "side": "right", "section": "results", "image": "06-detail.jpg" },
  { "type": "feature", "image": "07-shelf.jpg", "detail": "08-label.jpg", "caption": "Optional caption" }
]
```

| Block | Needs | Optional |
| --- | --- | --- |
| `split` | `section`, `image` | `side`: `"left"` or `"right"`. Left if you leave it out. |
| `offset` | `section`, `image` | |
| `full` | `image` | `caption` |
| `pair` | `images`: exactly two file names | |
| `statement` | `section` | |
| `feature` | `image` (the main one), `detail` (the small one) | `caption`, shown under the detail image |

How text is used:

- **split and offset** show the section's heading and all of its paragraphs.
- **statement** shows the section's **first paragraph** large, as the statement. Any further paragraphs appear small beside it. A section with one paragraph gives a statement on its own. Keep statements to one or two sentences.

`section` always uses the section key (`the-challenge`), not the heading as written (`The Challenge`).

---

## Running the import

Open a terminal in the project folder.

### Step 1: always do a dry run first

```
npm run import:portfolio
```

A dry run checks every project and prepares every image, then prints each page as a numbered list so you can read its shape:

```
  Page:
    hero
           cover.jpg (hero)                   2800 x 1867    612.0 KB
    1     split (left)    The Challenge  (2 paragraphs)
           01-chair.jpg                       2100 x 2800    540.0 KB
    2     pair
           02-front.jpg                       2240 x 2800    480.0 KB
           03-back.jpg                        2240 x 2800    470.0 KB
    3     statement       Approach  (quote 53 chars, 2 body paragraphs)
```

**It writes nothing and does not connect to Sanity.** Fix anything it reports, then run it again until it is clean.

### Step 2: import one project

```
npm run import:portfolio -- --commit --only tairn-and-co
```

Open the new page on the site and check it looks right.

### Step 3: import the rest

```
npm run import:portfolio -- --commit
```

Projects that already exist on the site are skipped automatically, so the one you imported in step 2 is not created twice.

Note the two hyphens `--` on their own before the options. They are needed whenever you add options.

### Options

| Option | What it does |
| --- | --- |
| (none) | Dry run. Same as `--dry-run`. Safe to run any time. |
| `--dry-run` | Check and preview only. Writes nothing. |
| `--commit` | Actually create the case studies in Sanity. Nothing is ever written without this. |
| `--only tairn-and-co` | Process just that one project folder. Works with a dry run or `--commit`. |
| `--overwrite` | Use with `--commit`. Replaces a case study that already has the same web address. |
| `--json` | Use with a dry run. Also prints the full document that would be sent to Sanity. |

---

## Running it again is safe

Before doing any work on a project, a `--commit` run checks whether Sanity already has a case study with that web address. If it does, the tool says so and **skips that project**. Nothing is changed and no images are uploaded.

To replace it, run again with `--overwrite`. This replaces the existing case study in place, keeping the same address. Be aware:

- Overwriting replaces the whole case study with what is in your folder. Any changes made directly in Sanity Studio since then are lost. This includes the older Challenge, Approach, Results and Gallery content of projects made before blocks existed.
- If someone has unsaved edits to that case study in Studio (a draft), the tool warns you. Studio keeps showing the draft until it is published or discarded.

The tool never deletes anything.

---

## What the messages mean

Every message names the project, and for blocks, the block number and the field, for example `[tairn-and-co] Block 3 (pair), "images"`.

### Problems that stop a project

The project is skipped and nothing is uploaded. Fix it and run again.

| Message | What to do |
| --- | --- |
| `copy.md is missing "## Overview"` | Add an `## Overview` section at the top of copy.md. |
| `"blocks" is missing or empty` | Add the `blocks` list to project.json. Copy it from the example. |
| `"carousel" is not a block type` | Use one of: split, offset, full, pair, statement, feature. |
| `"the challenge" does not exist in copy.md` | Use the section key, with hyphens: `the-challenge`. The message suggests the right one. |
| `a full block does not take a section` | Only split, offset and statement show text. Remove `section`, or change the block type. |
| `"01-Chair.jpg" does not exist in the folder` | Check the spelling and capitals. The message suggests the right name. |
| `has no alt text in project.json "images"` | Add the file to `images` in project.json, with a description. |
| `a pair needs exactly two images` | List exactly two file names in `images`. |
| `"centre" is not valid. Use "left" or "right"` | Set `side` to `"left"` or `"right"`, or leave it out. |
| `has both "serviceCategories" and "serviceCategory"` | Delete `serviceCategory` and keep the list. |
| `"serviceCategories" is empty` | List at least one service in the square brackets. |
| `includes "branding", which is not a service` | Use only the four values in the services table above. |
| `lists "brand-identity" more than once` | List each service once. |
| `cover.jpg is reserved for the hero` | Use a different image in the block. The cover only appears at the top. |
| `"detail": missing` | Add the field the block needs. See the table of blocks above. |
| `both become the section key` | Two headings clash. Rename one of them. |
| `text before the first ## heading` | Move the text under a heading, or delete it. |
| `the link "..." must start with https://` | Write the full address, starting `https://`. |
| `is a sub heading` | Remove the `###` heading, or make it a `##` section of its own. |
| `SANITY_WRITE_TOKEN in .env.import is empty` | Follow "Before you start" above. |
| `Sanity rejected the token` | The token was copied wrongly or does not have Editor permission. Create a new one. |

### Warnings

The project still imports. Read them and decide whether anything needs changing.

| Message | What it means |
| --- | --- |
| `uses *single asterisk* italics` | Only a warning. The words import as plain text without the asterisks. |
| `cover.jpg is portrait` | Only a warning. The import still runs, but the top and bottom of the cover will be cut off. Swap in a landscape cover if that matters. |
| `is in the folder but not used` | An image no block uses. It will not be uploaded. |
| `is not used by any block` | A copy.md section no block shows. It will not appear on the page. |
| `is used in blocks 2 and 5` | The same image appears twice. Fine if you meant it; it is uploaded once. |
| `the quote ... is 304 characters` | A long statement dominates the page. Keep the first paragraph to one or two sentences. |
| `two split (left) blocks back to back` | The page loses its rhythm. Alternate the side, or put an image block between them. |
| `A case study with this slug already exists` | It is already on the site. Add `--overwrite` only if you mean to replace it. |
| `images were uploaded before the failure` | Fix the problem and run again. The images are reused, not duplicated. |
