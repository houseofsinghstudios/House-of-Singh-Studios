"use client";
// A client component: it crossfades between the projects' images as the rotation moves, mounts each
// image only when it is about to show (so a phone does not fetch every project image at once), and
// runs the progress line along the image's foot.
//
// The whole image is one link to the project on screen. The progress line's CSS animation times the
// hold: when it ends the image is due, and HeroInteractive decides when it moves (never within 500ms
// of a word change). Pausing the animation pauses the hold, so the line and the timer agree.

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { IMAGE_HOLD_MS, type HeroEntry } from "@/lib/homepage-hero";

const SIZES = "(max-width: 1080px) 100vw, 54vw";

interface Props {
  entries: HeroEntry[];
  index: number;
  // Counts every move, so the progress line restarts for each image.
  step: number;
  rotating: boolean;
  halted: boolean;
  onDue: () => void;
  onOpen: () => void;
}

// Which images are mounted and which one shows. An image fades in only once it has loaded; until
// then the one before stays.
function useSlides(current: number, next: number) {
  const [mounted, setMounted] = useState<number[]>([current]);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [shown, setShown] = useState(current);
  const missing = [current, next].filter((k) => !mounted.includes(k));
  // Adjusting state while rendering (React's pattern for state that follows props): no extra pass.
  if (missing.length) setMounted([...mounted, ...missing]);
  if (shown !== current && loaded.includes(current)) setShown(current);
  const onLoad = (key: number) => setLoaded((l) => (l.includes(key) ? l : [...l, key]));
  return { mounted, shown, onLoad };
}

function Slide({ entry, visible, first, onLoad }: { entry: HeroEntry; visible: boolean; first: boolean; onLoad: () => void }) {
  const { image } = entry;
  return (
    <div className={`hero-slide hero-slide--${entry.heroFit}`} data-visible={visible}>
      <div className="hero-slide-frame">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={SIZES}
          // Quality 60 from a clean quality 90 source (heroImageUrl), served as AVIF where possible.
          quality={60}
          // The first image is the page's largest paint: preloaded and fetched first. The rest load lazily.
          preload={first}
          loading={first ? "eager" : "lazy"}
          fetchPriority={first ? "high" : "auto"}
          placeholder={image.lqip ? "blur" : "empty"}
          blurDataURL={image.lqip}
          style={{ objectFit: entry.heroFit === "contain" ? "contain" : "cover", objectPosition: image.position }}
          onLoad={onLoad}
          // A broken image counts as loaded, so the rotation never waits on it.
          onError={onLoad}
        />
      </div>
    </div>
  );
}

export default function HeroImages({ entries, index, step, rotating, halted, onDue, onOpen }: Props) {
  const { mounted, shown, onLoad } = useSlides(index, (index + 1) % entries.length);
  const entry = entries[index];

  return (
    <>
      <Link href={`/work/${entry.slug}`} className="hero-media-link" aria-label={`View the ${entry.heroName} project`} data-cursor="view" onClick={onOpen}>
        {mounted.map((key) => (
          <Slide key={key} entry={entries[key]} visible={key === shown} first={key === 0} onLoad={() => onLoad(key)} />
        ))}
      </Link>
      {rotating && (
        <div className="hero-progress" aria-hidden="true">
          <span
            key={step}
            className="hero-progress-fill"
            data-halted={halted}
            style={{ animationDuration: `${IMAGE_HOLD_MS}ms` }}
            onAnimationEnd={(e) => e.target === e.currentTarget && onDue()}
          />
        </div>
      )}
    </>
  );
}
