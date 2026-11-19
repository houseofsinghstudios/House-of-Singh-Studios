// The order and the pages of the Insights listing, shared by /insights and /insights/page/N so
// both always show the same posts in the same places.
//
// Order: one hero (the newest post marked Featured, otherwise the newest post), then every other
// post, newest first. Featured never pushes a newer post below an older one.
// Pages: page 1 is /insights (the hero and the first POSTS_PER_PAGE others); page N shows the next
// POSTS_PER_PAGE each. The "Load more" link on /insights points at the next page, so every post is
// reachable through plain links.

export const POSTS_PER_PAGE = 6;

type Listable = { featured?: boolean; publishedAt?: string };

const time = (date?: string) => {
  const t = date ? Date.parse(date) : NaN;
  return Number.isNaN(t) ? -Infinity : t;
};

// Newest first, then the hero moved to the front. A post without a date goes last.
export function orderForListing<T extends Listable>(posts: readonly T[]): T[] {
  const byDate = [...posts].sort((a, b) => time(b.publishedAt) - time(a.publishedAt));
  const heroIndex = Math.max(0, byDate.findIndex((p) => p.featured === true));
  const [hero] = byDate.splice(heroIndex, 1);
  return hero ? [hero, ...byDate] : byDate;
}

// How many pages the listing has: always at least 1.
export function pageCount(total: number): number {
  return total <= 1 + POSTS_PER_PAGE ? 1 : 1 + Math.ceil((total - 1 - POSTS_PER_PAGE) / POSTS_PER_PAGE);
}

// The posts on one page of an ordered list. Page 1 includes the hero.
export function postsForPage<T>(ordered: readonly T[], page: number): T[] {
  if (page <= 1) return ordered.slice(0, 1 + POSTS_PER_PAGE);
  const start = 1 + POSTS_PER_PAGE * (page - 1);
  return ordered.slice(start, start + POSTS_PER_PAGE);
}

export function pageHref(page: number): string {
  return page <= 1 ? "/insights" : `/insights/page/${page}`;
}

// A page number from the address: digits only, no leading zero. Anything else is null.
export function parsePageNumber(value: string): number | null {
  return /^[1-9]\d{0,3}$/.test(value) ? Number(value) : null;
}
