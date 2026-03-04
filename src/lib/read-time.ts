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
