// Read time: words in the article body's text blocks, 200 a minute, rounded up, at least 1 (0 with no
// body). The article page and every card (/insights, Related thinking) use this one calculation, on
// the server. Cards fetch only the block text with READ_TIME_BLOCKS, so no body reaches the browser.
export const READ_TIME_BLOCKS = `"readBody": body[_type == "block"]{ _type, children[]{ text } }`;

export function calculateReadTime(
  body: Array<{ _type: string; children?: Array<{ text?: string }> }> | undefined
): number {
  if (!body || !Array.isArray(body)) return 0;

  const text = body
    .filter((block) => block._type === "block")
    .map((block) => {
      if (!block.children) return "";
      return block.children.map((child) => child.text || "").join("");
    })
    .join(" ");

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);
  return Math.max(1, readTime);
}
