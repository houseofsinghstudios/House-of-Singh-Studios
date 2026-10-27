# Roles import

This tool turns Markdown files on your computer into open roles on the careers page. One file is one role. It:

1. Checks every file is filled in correctly.
2. Shows you exactly what each role will contain.
3. With `--commit`, creates each role in Sanity, already published.

It runs on your own computer only. It is never part of the website itself.

---

## Before you start (one time only)

You need Node.js 22 or newer and `npm install` run once.

The roles import uses the same `.env.import` file and Sanity write token as the portfolio import. If you have set that up already, there is nothing more to do. If not, follow "Before you start" in `scripts/import-portfolio/README.md`.

**Never put the token in `.env.local`.** Keep it in `.env.import`, which is only for the import tools.

---

## Writing a role

Create a folder called `roles-import` in the project folder (next to `package.json`). Git ignores it, so drafts never leave your computer.

Add one `.md` file per role. **The file name is the slug**: `senior-brand-designer.md` becomes the role `senior-brand-designer`. Use lowercase letters, numbers and hyphens only.

Files whose names start with `_` (for example `_notes.md`) and `README.md` are ignored, so you can keep notes in the same folder.

A full example: `scripts/import-roles/example/senior-brand-designer.md`.

### The top of the file

Between two `---` lines, one value per line:

| Field | Required | What to write |
| --- | --- | --- |
| `title` | yes | The job title, e.g. `Senior Brand Designer` |
| `department` | yes | One of `brand-identity`, `visual-media`, `digital-design`, `creative-strategy`, `operations` |
| `type` | yes | One of `full-time`, `part-time`, `contract`, `freelance` |
| `location` | no | e.g. `Toronto / Remote`. Defaults to `Toronto / Remote` |
| `summary` | yes | One or two sentences for the listing card. 300 characters at most |
| `order` | no | A whole number. Lower numbers appear first. Defaults to 10 |
| `active` | no | `true` shows the role, `false` hides it. Defaults to `true` |

### The sections

| Heading | Required | Format |
| --- | --- | --- |
| `## About the role` | yes | Paragraphs. `**bold**` and `[links](https://...)` work |
| `## Responsibilities` | no | Bullet list, one `- ` per item |
| `## Requirements` | no | Bullet list |
| `## Nice to have` | no | Bullet list |

Any other heading is an error. List items are plain text: bold and links in a bullet keep their words only.

Anything still reading `FILL IN` is an error, so you can use it as a placeholder while drafting.

---

## Running it

```
npm run import:roles                           Check every file. Writes nothing, no network.
npm run import:roles -- --only senior-brand-designer
npm run import:roles -- --commit               Publish to Sanity.
npm run import:roles -- --commit --overwrite   Replace roles that already exist.
```

Always run without `--commit` first and read the output.

- **New roles** are created and published, with today's date as the published date.
- **A role whose slug already exists** is skipped, unless you pass `--overwrite`. Overwrite replaces the role with the file's contents and keeps its original published date.
- **Nothing is ever deleted.** To take a role down, set `active: false` and rerun with `--commit --overwrite`, or switch it off in Studio.
