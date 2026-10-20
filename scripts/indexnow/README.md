# IndexNow

IndexNow is a simple way to tell search engines that a page on the site is new or has changed, instead of waiting for them to find it. Bing uses it, and so do a few other engines (Yandex, Seznam, Naver). A submission is a hint, not a guarantee: Bing still decides when to crawl.

**Google does not use IndexNow.** For Google, the sitemap at `https://studios.houseofsingh.com/sitemap.xml` and Google Search Console remain the way in.

It runs on your own computer only. It is never part of the website itself.

## The key

IndexNow checks that a submission really comes from the site owner by reading a key file from the site:

- Key: `e429c4e541804de19f12392ad262cb0f`
- File: `public/e429c4e541804de19f12392ad262cb0f.txt`, served at
  `https://studios.houseofsingh.com/e429c4e541804de19f12392ad262cb0f.txt`

The key is public by design, so it lives in the repo (`scripts/indexnow/config.mjs`). Do not rename or delete the key file: submissions are refused (HTTP 403) while it is not live.

## Commands

```
npm run indexnow -- --all                      Dry run: every URL in the live sitemap.
npm run indexnow -- --url <url> --url <url>    Dry run for specific pages.
npm run indexnow -- --all --commit             Send every sitemap URL to IndexNow.
npm run indexnow -- --url <url> --commit       Send specific pages.
npm run indexnow -- --all --sitemap <file>     Read the URLs from a saved sitemap file instead.
```

A dry run (the default) prints the URLs and the exact request, and never contacts IndexNow. `--all` reads the sitemap to find the URLs.

Only URLs on `https://studios.houseofsingh.com` are accepted. Anything else stops the command before anything is sent.

URLs go in one request, in batches of up to 10,000.

## What the answers mean

| Answer | Meaning |
| --- | --- |
| 200 or 202 | Submitted, Bing accepted the URLs. |
| 400 | Bad request. |
| 403 | Key not valid: the key file may not be live yet. |
| 422 | A URL does not match the host or key. |
| 429 | Too many submissions, try again later. |

## Automatic submission after imports

After a successful `--commit`:

- `npm run import:portfolio` submits every case study it created or replaced, plus `/work`.
- `npm run import:roles` submits `/careers`.

If IndexNow fails, the import prints one warning line and still succeeds. Dry runs never submit. To skip the submission, add `--no-indexnow`.

Pages only appear after Vercel has deployed and Sanity content has refreshed (about a minute), so an automatic submission straight after an import may reach Bing before the page is live. Bing simply crawls again later; to be sure, run `npm run indexnow -- --url <url> --commit` a few minutes afterwards.
