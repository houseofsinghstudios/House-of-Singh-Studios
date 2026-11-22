"use client";
// A client component: it crossfades between the projects' images as the rotation moves, mounts each
// image only when it is about to show (so a phone does not fetch every project image at once), and
// runs the progress line along the image's foot.
//
// The whole image is one link to the project on screen. The progress line's CSS animation is the
// clock: when it ends the rotation moves on, but only once the next image has loaded and decoded. If it
// is late, the current image, its word and its caption hold (the line stays full) until it is ready,
// then all of them change together and the line starts again. Pausing the animation pauses the hold,
// so the line and the timer always agree.

import Image from "next/image";
import { Link } from "next-view-transitions";
import { useCallback, useEffect, useRef, useState } from "react";
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

// Which images are mounted: the one on show and the next, so the next loads during the hold.
function useMounted(current: number, next: number) {
  const [mounted, setMounted] = useState<number[]>([current]);
  const missing = [current, next].filter((k) => !mounted.includes(k));
  // Adjusting state while rendering (React's pattern for state that follows props): no extra pass.
  if (missing.length) setMounted([...mounted, ...missing]);
  return mounted;
}

// The gate between the clock and the rotation: the clock asks to move on (clockEnded), and the move
// happens only once the next image is ready (loaded and decoded); a late image moves it on arrival,
// unless the hero is held (Pause, a pointer, focus or a finger), in which case on release.
function useAdvance(next: number, halted: boolean, onDue: () => void) {
  const ready = useRef(new Set<number>());
  const waiting = useRef(false);
  const nextRef = useRef(next);
  const haltedRef = useRef(halted);
  const tryMove = useCallback(() => {
    if (!waiting.current || haltedRef.current || !ready.current.has(nextRef.current)) return;
    waiting.current = false;
    onDue();
  }, [onDue]);
  useEffect(() => {
    nextRef.current = next;
  }, [next]);
  useEffect(() => {
    haltedRef.current = halted;
    tryMove();
  }, [halted, tryMove]);
  const markReady = useCallback(
    (key: number) => {
      ready.current.add(key);
      tryMove();
    },
    [tryMove],
  );
  const clockEnded = useCallback(() => {
    waiting.current = true;
    tryMove();
  }, [tryMove]);
  return { markReady, clockEnded };
}

// Loaded is not enough for a crossfade without a blank frame: wait for the decode too. A broken image
// counts as ready, so the rotation never waits on it.
const whenDecoded = (img: HTMLImageElement, done: () => void) => {
  img.decode().then(done, done);
};

function Slide({ entry, visible, first, onReady }: { entry: HeroEntry; visible: boolean; first: boolean; onReady: () => void }) {
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
          onLoad={(e) => whenDecoded(e.currentTarget, onReady)}
          onError={onReady}
        />
      </div>
    </div>
  );
}

export default function HeroImages({ entries, index, step, rotating, halted, onDue, onOpen }: Props) {
  const next = (index + 1) % entries.length;
  const mounted = useMounted(index, next);
  const { markReady, clockEnded } = useAdvance(next, halted, onDue);
  const entry = entries[index];

  return (
    <>
      <Link href={`/work/${entry.slug}`} className="hero-media-link" aria-label={`View the ${entry.heroName} project`} data-cursor="view" onClick={onOpen}>
        {mounted.map((key) => (
          <Slide key={key} entry={entries[key]} visible={key === index} first={key === 0} onReady={() => markReady(key)} />
        ))}
      </Link>
      {rotating && (
        <div className="hero-progress" aria-hidden="true">
          <span
            key={step}
            className="hero-progress-fill"
            data-halted={halted}
            style={{ animationDuration: `${IMAGE_HOLD_MS}ms` }}
            onAnimationEnd={(e) => e.target === e.currentTarget && clockEnded()}
          />
        </div>
      )}
    </>
  );
}
