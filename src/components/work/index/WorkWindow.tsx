"use client";
// A client component: the image window shows the project the visitor points at, flipping through its
// images on the progress line's clock. Decorative: hidden from screen readers, no links, nothing
// focusable (the names in the list are the links).

import Image, { getImageProps } from "next/image";
import { frameCode } from "@/lib/work-index";
import type { WorkImage, WorkItem } from "./types";

// The window's width: full width at 1080px and below, 590px beside the list above.
const WINDOW_SIZES = "(max-width: 1080px) 100vw, 590px";

// Fetches an image the window is about to show, with the very URL next/image will ask for.
const preloaded = new Set<string>();
export function preloadWindowImage(image: WorkImage | undefined) {
  if (!image || preloaded.has(image.src) || typeof window === "undefined") return;
  preloaded.add(image.src);
  const { props } = getImageProps({ src: image.src, alt: "", fill: true, sizes: WINDOW_SIZES });
  const img = new window.Image();
  if (props.sizes) img.sizes = props.sizes;
  if (props.srcSet) img.srcset = props.srcSet;
  img.src = props.src;
}

interface Props {
  item: WorkItem | undefined;
  image: number;
  // Restarts the time line for every image shown.
  step: number;
  cycling: boolean;
  onCycleEnd: () => void;
  windowRef: React.RefObject<HTMLDivElement | null>;
}

export default function WorkWindow({ item, image, step, cycling, onCycleEnd, windowRef }: Props) {
  const shown = item?.images[image] ?? item?.images[0];
  const total = item?.images.length ?? 0;
  return (
    <div className="wi-window" aria-hidden="true" ref={windowRef}>
      <div className="wi-frame" style={shown ? ({ "--ratio": shown.height / shown.width } as React.CSSProperties) : undefined}>
        {shown && (
          <Image
            src={shown.src}
            alt=""
            fill
            sizes={WINDOW_SIZES}
            loading="eager"
            placeholder={shown.lqip ? "blur" : "empty"}
            blurDataURL={shown.lqip}
            className="wi-frame-img"
            style={{ objectFit: "cover", objectPosition: shown.position }}
          />
        )}
        {cycling && <span key={step} className="wi-timer" onAnimationEnd={(e) => e.target === e.currentTarget && onCycleEnd()} />}
      </div>
      {item && (
        <div className="wi-caption">
          <p className="wi-caption-codes">
            <span>{frameCode(item.number, shown ? item.images.indexOf(shown) : 0)}</span>
            {total > 1 && <span>{`${String(image + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</span>}
          </p>
          <p className="wi-caption-name">
            {item.title} <span className="editorial-label">{item.kind}</span>
          </p>
          {item.line && <p className="wi-caption-line">{item.line}</p>}
          <p className="wi-caption-view">View case study</p>
        </div>
      )}
    </div>
  );
}
