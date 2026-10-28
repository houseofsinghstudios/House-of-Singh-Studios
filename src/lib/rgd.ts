// The founder's RGD credential: finding the standalone word "RGD" in text, so it can link to the
// member profile. Pure, so it is tested without React. Whole word only: never inside another word,
// an email address or a web address (rgd.ca, /RGD/), and lower case rgd is never matched.

// Not preceded by a letter, digit, underscore, dot, slash, @, colon or hyphen; not followed by a
// letter, digit, underscore, @, hyphen, or a dot that starts a domain or file name.
const RGD = /(?<![\w./@:-])RGD(?![\w@-]|\.[A-Za-z0-9])/g;

export type RgdSegment = { text: string; rgd: boolean };

// The text in order, with each standalone "RGD" as its own segment.
export function splitRgd(text: string): RgdSegment[] {
  const out: RgdSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(RGD)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: text.slice(last, at), rgd: false });
    out.push({ text: "RGD", rgd: true });
    last = at + 3;
  }
  if (last < text.length) out.push({ text: text.slice(last), rgd: false });
  return out;
}

export const hasRgd = (text: string) => splitRgd(text).some((s) => s.rgd);

// Portable text: each span's standalone "RGD" becomes its own span with an rgdLink mark, so the
// article renderer links it. Spans already inside a link are left exactly as they are, so a link is
// never placed inside another link.
export const RGD_MARK = "rgd-link";

type Span = { _type?: string; _key?: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string };
type Block = { _type?: string; children?: Span[]; markDefs?: MarkDef[] };

export function linkRgdInBlocks<T extends Block>(blocks: T[] | null | undefined): T[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((block) => {
    if (block?._type !== "block" || !Array.isArray(block.children)) return block;
    const linkKeys = new Set((block.markDefs || []).filter((d) => d._type === "link").map((d) => d._key));
    let changed = false;
    const children = block.children.flatMap((span) => {
      const marks = span.marks || [];
      if (span._type !== "span" || typeof span.text !== "string" || marks.some((m) => linkKeys.has(m))) return [span];
      const parts = splitRgd(span.text);
      if (!parts.some((p) => p.rgd)) return [span];
      changed = true;
      return parts.map((p, i) => ({ ...span, _key: `${span._key ?? "s"}-rgd${i}`, text: p.text, marks: p.rgd ? [...marks, RGD_MARK] : marks }));
    });
    if (!changed) return block;
    return { ...block, children, markDefs: [...(block.markDefs || []), { _key: RGD_MARK, _type: "rgdLink" }] };
  });
}
