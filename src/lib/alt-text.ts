// Alt text on case study images: "<project>: <what is shown>". The cover also names the primary
// discipline: "<project>, <discipline>: <what is shown>". The alt written in Sanity is kept as the
// description; only the prefix is added when it is missing. An empty alt falls back to the name.

const startsWithLabel = (text: string, label: string) => text.toLowerCase().startsWith(`${label.toLowerCase()}:`);

export function projectAlt(project: string, alt?: string | null): string {
  const name = project.trim();
  const text = (alt || "").trim();
  if (!name) return text;
  if (!text) return name;
  return startsWithLabel(text, name) ? text : `${name}: ${text}`;
}

export function coverAlt(project: string, alt?: string | null, discipline?: string | null): string {
  const name = project.trim();
  const area = (discipline || "").trim().toLowerCase();
  const head = name && area ? `${name}, ${area}` : name;
  let text = (alt || "").trim();
  if (startsWithLabel(text, head)) return text;
  if (name && startsWithLabel(text, name)) text = text.slice(name.length + 1).trim();
  if (!head) return text;
  return text ? `${head}: ${text}` : head;
}
