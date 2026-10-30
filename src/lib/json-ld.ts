// Structured data (JSON-LD) for a <script type="application/ld+json"> tag. The JSON is unchanged once
// parsed, but "<" is written as <, so text from Sanity can never close the script tag early
// (a title containing "</script>" stays inert), and the line and paragraph separators (U+2028,
// U+2029) are escaped as well.
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .split(LINE_SEPARATOR).join("\\u2028")
    .split(PARAGRAPH_SEPARATOR).join("\\u2029");
}
