// "More from the studio" at the end of an article: two cards. The editor's hand picked posts come
// first, in the order chosen (a removed or unpublished pick, a repeat, or the article itself is
// skipped). Any slot left over is filled from the latest other articles, the same category first,
// never repeating a card; with no picks at all, both cards come from there, as before.

export interface RelatedCandidate {
  _id: string;
  category?: string;
}

export const RELATED_CARDS = 2;

// The latest other articles in fallback order: the same category first, then the rest, each newest
// first.
function fallbackOrder<T extends RelatedCandidate>(latest: T[], current: RelatedCandidate): T[] {
  const others = latest.filter((p) => p._id !== current._id);
  return [...others.filter((p) => p.category === current.category), ...others.filter((p) => p.category !== current.category)];
}

export function relatedPostsFor<T extends RelatedCandidate>(
  chosen: (T | null)[] | null | undefined,
  latest: T[] | null | undefined,
  current: RelatedCandidate
): T[] {
  const cards: T[] = [];
  const add = (p: T | null | undefined) => {
    if (cards.length < RELATED_CARDS && p?._id && p._id !== current._id && !cards.some((c) => c._id === p._id)) cards.push(p);
  };
  (chosen || []).forEach(add);
  fallbackOrder(latest || [], current).forEach(add);
  return cards;
}
