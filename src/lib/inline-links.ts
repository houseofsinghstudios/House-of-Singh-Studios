// Links written as text inside a plain answer: [visible text](/path) or [visible text](https://...).
// Nothing else is markup. Brackets that are not followed by a path or a web address stay as text.
// Pure, so it is tested without React; the page renders the segments with InlineLinks.
// A path is "/" not followed by "/" or "\": "//host" and "/\host" are addresses on another site that
// browsers open as such, so they are never treated as internal and stay as text.

const LINK = /\[([^\]\n]+)\]\(((?:\/(?![/\\])|https?:\/\/)[^\s()]*)\)/g;

export type InlineSegment = { text: string; href?: string };

export function parseInlineLinks(text: string): InlineSegment[] {
  const out: InlineSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at) });
    out.push({ text: m[1], href: m[2] });
    last = at + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

// The visible words only: what a reader sees, and what the FAQPage structured data says.
export const plainText = (text: string) => parseInlineLinks(text).map((s) => s.text).join("");

export const isExternal = (href: string) => /^https?:\/\//.test(href);
