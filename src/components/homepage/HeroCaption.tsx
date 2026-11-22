"use client";
// A client component: the caption follows the image on show, fading out and back in when the project
// changes (with reduced motion it swaps at once).
//
// Desktop: the name, its line and "View project", stacked at the foot of the text column. Phones: the
// name and "View project" on one row under the image; the line is hidden. No Client or Exploration
// tag here, on purpose: the case study page carries it.

import { Link } from "next-view-transitions";
import { useEffect, useState } from "react";
import { heroLinkTopic, VIEW_PROJECT, type HeroEntry } from "@/lib/homepage-hero";

// The fade out, as in hero.css (.hero-caption-body); the new project then fades in over the same.
const FADE_MS = 250;

interface Props {
  entry: HeroEntry;
  reduceMotion: boolean;
  onOpen: (slug: string) => void;
}

export default function HeroCaption({ entry, reduceMotion, onOpen }: Props) {
  const [shown, setShown] = useState(entry);
  const [leaving, setLeaving] = useState(false);
  const changed = shown.slug !== entry.slug;
  // Adjusting state while rendering: with reduced motion the new project shows at once; otherwise the
  // caption fades out first.
  if (changed && reduceMotion) setShown(entry);
  else if (changed && !leaving) setLeaving(true);

  // Then, once faded, the swap. On a timer rather than transitionend, which never fires when the
  // caption is already at 0 (the project changing again within a frame); a newer change restarts it.
  useEffect(() => {
    if (!leaving) return;
    const swap = window.setTimeout(() => {
      setShown(entry);
      setLeaving(false);
    }, FADE_MS);
    return () => window.clearTimeout(swap);
  }, [leaving, entry]);

  // The outer box enters once with the page; the inner one fades between projects.
  return (
    <div className="hero-caption">
      <div className="hero-caption-body" data-leaving={leaving}>
        <p className="hero-caption-name">{shown.heroName}</p>
        {shown.heroLine && <p className="hero-caption-line">{shown.heroLine}</p>}
        <Link href={`/work/${shown.slug}`} className="hero-caption-link" onClick={() => onOpen(shown.slug)}>
          {VIEW_PROJECT}
          <span className="sr-only">{heroLinkTopic(shown.heroName)}</span>
        </Link>
      </div>
    </div>
  );
}
