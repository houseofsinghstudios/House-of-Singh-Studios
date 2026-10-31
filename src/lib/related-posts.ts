// "More from the studio" at the end of an article: two cards. The editor's hand picked posts win, in
// the order chosen (a removed or unpublished pick, or the article itself, is skipped). Without a
// choice, the latest three other articles, the same category first.

export interface RelatedCandidate {
  _id: string;
  category?: string;
}

export const RELATED_CARDS = 2;

export function relatedPostsFor<T extends RelatedCandidate>(
  chosen: (T | null)[] | null | undefined,
  latest: T[] | null | undefined,
  current: { _id: string; category?: string }
): T[] {
  const picked = (chosen || []).filter((p): p is T => Boolean(p?._id) && p!._id !== current._id);
  if (picked.length > 0) return picked.slice(0, RELATED_CARDS);
  const others = latest || [];
  const same = others.filter((p) => p.category === current.category).slice(0, RELATED_CARDS);
  if (same.length >= RELATED_CARDS) return same;
  return [...same, ...others.filter((p) => !same.some((s) => s._id === p._id)).slice(0, RELATED_CARDS - same.length)];
}
