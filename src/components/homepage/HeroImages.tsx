"use client";
// A client component: it crossfades between images as the rotation moves, mounts each image only
// when it is about to show (so a phone does not fetch every project image at once), and runs the
// progress line whose animation times the rotation.
//
// The whole image is one link to the current project. The progress line's CSS animation is the
// timer: when it ends the next image shows, and pausing the animation pauses the rotation, so the
// line and the timer can never disagree.

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useState } from "react";
import type { HeroEntry, HeroFrame } from "@/lib/homepage-hero";

const SIZES = "(max-width: 1080px) 100vw, 54vw";
const keyOf = (f: HeroFrame) => `${f.project}:${f.image}`;

interface Props {
  entries: HeroEntry[];
  frames: HeroFrame[];
  index: number;
  // Counts every move of the rotation, so the progress line restarts even on the same image.
  step: number;
  holdMs: number;
  rotating: boolean;
  halted: boolean;
  onDone: () => void;
  onOpen: () => void;
}

// Which images are mounted and which one shows. An image fades in only once it has loaded; until
// then the one before stays.
function useSlides(current: string, next: string) {
  const [mounted, setMounted] = useState<string[]>([current]);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [shown, setShown] = useState(current);
  const missing = [current, next].filter((k) => !mounted.includes(k));
  // Adjusting state while rendering (React's pattern for state that follows props): no extra pass.
  if (missing.length) setMounted([...mounted, ...missing]);
  if (shown !== current && loaded.includes(current)) setShown(current);
  const onLoad = (key: string) => setLoaded((l) => (l.includes(key) ? l : [...l, key]));
  return { mounted, shown, onLoad };
}

function Slide({ entry, image, visible, first, onLoad }: { entry: HeroEntry; image: number; visible: boolean; first: boolean; onLoad: () => void }) {
  const slide = entry.slides[image];
  return (
    <div className={`hero-slide hero-slide--${entry.heroFit}`} data-visible={visible}>
      <div className="hero-slide-frame">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          sizes={SIZES}
          // The first image is the page's largest paint: preloaded and fetched first. The rest load lazily.
          preload={first}
          loading={first ? "eager" : "lazy"}
          fetchPriority={first ? "high" : "auto"}
          placeholder={slide.lqip ? "blur" : "empty"}
          blurDataURL={slide.lqip}
          style={{ objectFit: entry.heroFit === "contain" ? "contain" : "cover", objectPosition: slide.position }}
          onLoad={onLoad}
          // A broken image counts as loaded, so the rotation never waits on it.
          onError={onLoad}
        />
      </div>
    </div>
  );
}

export default function HeroImages({ entries, frames, index, step, holdMs, rotating, halted, onDone, onOpen }: Props) {
  const frame = frames[index] ?? frames[0];
  const current = keyOf(frame);
  const { mounted, shown, onLoad } = useSlides(current, keyOf(frames[(index + 1) % frames.length] ?? frame));
  const entry = entries[frame.project];

  return (
    <>
      <Link
        href={`/work/${entry.slug}`}
        className="hero-media-link"
        aria-label={`View the ${entry.heroName} project`}
        data-cursor="view"
        onClick={onOpen}
      >
        {mounted.map((key) => {
          const [p, i] = key.split(":").map(Number);
          return <Slide key={key} entry={entries[p]} image={i} visible={key === shown} first={key === "0:0"} onLoad={() => onLoad(key)} />;
        })}
      </Link>
      {rotating && (
        <div className="hero-progress" aria-hidden="true">
          <span
            key={step}
            className="hero-progress-fill"
            data-halted={halted}
            style={{ animationDuration: `${holdMs}ms` }}
            onAnimationEnd={(e) => e.target === e.currentTarget && onDone()}
          />
        </div>
      )}
    </>
  );
}
