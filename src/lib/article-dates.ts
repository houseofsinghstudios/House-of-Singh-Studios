// "Updated October 2026" under an article's date, when it was changed more than 30 days after it
// was published. null otherwise, and the line is not shown.
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function updatedLabel(publishedAt?: string | null, updatedAt?: string | null): string | null {
  if (!publishedAt || !updatedAt) return null;
  const published = Date.parse(publishedAt);
  const updated = Date.parse(updatedAt);
  if (!Number.isFinite(published) || !Number.isFinite(updated) || updated - published <= THIRTY_DAYS) return null;
  const month = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "America/Toronto" }).format(new Date(updated));
  return `Updated ${month}`;
}
