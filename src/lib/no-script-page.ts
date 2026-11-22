// The page a form route answers with when the browser posts the form itself, because JavaScript has
// not run, instead of the page sending JSON. Nothing in that post is read or forwarded. The contact
// form, the careers form and the article newsletter post here without JavaScript (homepage audit
// H-14), so a visitor gets a written answer, never a dead button, and no details land in an address.
import { NextResponse } from "next/server";
import { STUDIO_EMAIL } from "@/lib/constants/contact";
import { isJsonRequest, originAllowed } from "@/lib/request-guards";

interface NoScriptCopy {
  // The page title and heading, e.g. "Your message was not sent."
  heading: string;
  // Where to go back to, and its words in the sentence: "the contact page".
  backHref: string;
  backLabel: string;
}

function noScriptHtml({ heading, backHref, backLabel }: NoScriptCopy): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${heading.replace(/\.$/, "")} | House of Singh Studios</title>
<style>
  body { margin: 0; background: #F7F6F5; color: #22211F; font-family: system-ui, sans-serif; }
  main { max-width: 560px; padding: 120px max(24px, 8vw); }
  h1 { font-size: 32px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 16px; }
  p { color: #5C5B58; font-size: 16px; line-height: 1.6; margin: 0 0 16px; }
  a { color: #22211F; }
</style>
</head>
<body>
<main>
  <h1>${heading}</h1>
  <p>The form needs the page to finish loading before it can send. Please go back to <a href="${backHref}">${backLabel}</a> and try again.</p>
  <p>Or email us directly at <a href="mailto:${STUDIO_EMAIL}">${STUDIO_EMAIL}</a>.</p>
</main>
</body>
</html>`;
}

// A 415: the request was not the JSON the route takes.
export const noScriptResponse = (copy: NoScriptCopy) =>
  new NextResponse(noScriptHtml(copy), { status: 415, headers: { "content-type": "text/html; charset=utf-8" } });

// For a route whose form posts here without JavaScript: the written page for a plain post from the
// site itself, else null (a foreign origin still gets the JSON refusal from refuseRequest).
export const noScriptPost = (request: Request, copy: NoScriptCopy) =>
  originAllowed(request) && !isJsonRequest(request) ? noScriptResponse(copy) : null;
