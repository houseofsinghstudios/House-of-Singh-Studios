# Portfolio import

This tool turns folders of project files on your computer into finished case studies on the website. For each project folder it:

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

## Preparing your projects

Create a folder called `portfolio-import` in the project folder (next to `package.json`). Inside it, make one folder per project:

```
portfolio-import/
  tairn-and-co/
    project.json
    copy.md
    cover.jpg
    01-logo-system.jpg
    02-packaging.jpg
    03-signage.jpg
  another-project/
    ...
```

Git ignores the whole `portfolio-import` folder, so nothing in it is ever saved to GitHub.

### The folder name becomes the web address

`tairn-and-co` becomes `studios.houseofsingh.com/work/tairn-and-co`.

Use only lowercase letters, numbers and hyphens. No spaces, capitals, `&` or full stops.

### Images

- **`cover.jpg`** is required. It is the main image for the case study. The name must be exactly `cover.jpg`. Use a **landscape** image: the page shows the cover in a fixed wide frame (16:9), so a portrait cover is cropped top and bottom. The tool warns you if the cover is portrait.
- **Gallery images** start with a number and a hyphen: `01-logo-system.jpg`, `02-packaging.jpg`. They appear in number order. Use two digits (`01`, `02` ... `10`) so the order is always clear.
- JPG, PNG and WebP files all work. Everything is converted to JPG on upload.
- Any other image in the folder (for example `logo.jpg` with no number) stops that project, so nothing gets silently left out.

Send the largest, best quality files you have. The tool prepares them for you:

- It shrinks any image whose longest side is over 2800 pixels down to 2800. It never enlarges and never crops.
- It converts colours to sRGB so they look right in every browser.
- It removes hidden camera data (location, camera model, dates) but keeps the colour information.
- It turns photos taken sideways on a phone the right way up.

A typical photo ends up between about 300 KB and 700 KB.

### project.json

This file holds the facts about the project. Copy this example and change the values. Keep all the quote marks, colons and commas exactly as shown.

```json
{
  "title": "Tairn and Co.",
  "client": "Tairn and Co.",
  "industry": "Hospitality",
  "year": 2026,
  "serviceCategory": "brand-identity",
  "disciplines": ["brand-identity", "packaging"],
  "deliverables": ["Brand strategy", "Logo system"],
  "featured": true,
  "publishedAt": "2026-10-14",
  "seoDescription": "One sentence under 155 characters.",
  "images": {
    "cover.jpg": "Describe the cover image",
    "01-logo-system.jpg": "Describe this image"
  }
}
```

| Field | What to put | Required |
| --- | --- | --- |
| `title` | The project name as it appears on the site. | Yes |
| `client` | The client's name. | No |
| `industry` | For example `Hospitality`. | No |
| `year` | A number with no quote marks, for example `2026`. | No |
| `serviceCategory` | Exactly one of the four values below. | Yes |
| `disciplines` | One or more of the nine values below, in square brackets. | Yes |
| `deliverables` | A list of what you made, in square brackets. | No |
| `featured` | `true` to show it on the homepage, `false` otherwise. No quote marks. | No |
| `publishedAt` | The date, written `YYYY-MM-DD`, for example `"2026-10-14"`. | Yes |
| `seoDescription` | The sentence Google shows in search results. Keep it under 155 characters. | Recommended |
| `images` | Every image file in the folder, each with its alt text. | Yes |

**`serviceCategory`**, choose one:

| Value | Service |
| --- | --- |
| `brand-identity` | Brand Identity and Visual Design |
| `visual-media` | Visual Media and Content Production |
| `digital-design` | Digital Design and Experience |
| `creative-strategy` | Creative Strategy and Systems |

**`disciplines`**, choose any of: `brand-identity`, `packaging`, `publication`, `art-direction`, `website`, `video`, `photography`, `social-content`, `strategy`. These power the filters on the Work page.

**Alt text** in `images` describes each picture for people who cannot see it, and helps search engines. Keep it short and specific. Every image file needs an entry, and every entry needs a matching file. Names must match exactly, including capitals.

Do not add an SEO title. The site adds the studio name to every page title automatically.

### copy.md

This file holds the written story. It must have exactly these four headings, in this order, each with at least one paragraph under it:

```
## Overview
First paragraph.

Second paragraph.

## Challenge
Paragraphs.

## Approach
Paragraphs.

## Results
Paragraphs.
```

- Leave an empty line between paragraphs.
- Each heading starts with two `#` symbols and a space.
- Do not add other headings, and do not put any text above `## Overview`.
- Write plain text. Bold, links and bullet points are not supported and would show up as stray symbols.
- Italics are not supported either. If you write `*like this*`, the tool removes the asterisks, keeps the words as plain text, and warns you.

---

## Running the import

Open a terminal in the project folder.

### Step 1: always do a dry run first

```
npm run import:portfolio
```

A dry run checks every project and prepares every image, then shows exactly what it would create. **It writes nothing and does not connect to Sanity.** Fix anything it reports, then run it again until it is clean.

### Step 2: the real run

```
npm run import:portfolio -- --commit
```

This uploads the images and creates the case studies. They are published straight away.

Note the two hyphens `--` on their own before `--commit`. They are needed whenever you add options.

### Options

| Option | What it does |
| --- | --- |
| (none) | Dry run. Same as `--dry-run`. Safe to run any time. |
| `--dry-run` | Check and preview only. Writes nothing. |
| `--commit` | Actually create the case studies in Sanity. Nothing is ever written without this. |
| `--only tairn-and-co` | Process just that one project folder. Works with a dry run or `--commit`. |
| `--overwrite` | Use with `--commit`. Replaces a case study that already has the same web address. |

Examples:

```
npm run import:portfolio -- --only tairn-and-co
npm run import:portfolio -- --commit --only tairn-and-co
npm run import:portfolio -- --commit --only tairn-and-co --overwrite
```

---

## Running it again is safe

Before doing any work on a project, a `--commit` run checks whether Sanity already has a case study with that web address. If it does, the tool says so and **skips that project**. Nothing is changed and no images are uploaded.

To replace it, run again with `--overwrite`. This replaces the existing case study in place, keeping the same address. Be aware:

- Overwriting replaces the whole case study with what is in your folder. Any changes made directly in Sanity Studio since then are lost.
- If someone has unsaved edits to that case study in Studio (a draft), the tool warns you. Studio keeps showing the draft until it is published or discarded.

The tool never deletes anything.

---

## What you will see

For each project, the tool shows:

- Each image with its size before and after, for example `4000x3000 -> 2800x2100   8.21 MB -> 612.4 KB`.
- Either the document it created, or **SKIPPED** or **FAILED** with the reason in plain words.

At the end, a summary shows how many projects were created, skipped and failed, how many images were uploaded, the total size, and the web address of each new case study.

If one project has a problem, the tool reports it and carries on with the others.

### Common messages

| Message | What to do |
| --- | --- |
| `SANITY_WRITE_TOKEN in .env.import is empty` | Follow "Before you start" above. |
| `Sanity rejected the token` | The token was copied wrongly or does not have Editor permission. Create a new one. |
| `copy.md is missing the heading "## Approach"` | Add the heading, spelled exactly as shown. |
| `"serviceCategory" is "branding"` | Use one of the four values in the table above. |
| `"logo.jpg" has no alt text entry` | Add the file to `images` in project.json, with a description. |
| `cover.jpg is portrait` | Only a warning. The import still runs, but the top and bottom of the cover will be cut off. Swap in a landscape cover if that matters. |
| `uses *single asterisk* italics` | Only a warning. The words import as plain text without the asterisks. |
| `A case study with this slug already exists` | It is already on the site. Add `--overwrite` only if you mean to replace it. |
| `images were uploaded before the failure` | Fix the problem and run again. The images are reused, not duplicated. |
