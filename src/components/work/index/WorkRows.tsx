"use client";
// A client component: the index rows tell the image window what the visitor is pointing at or has
// focused (WorkIndex owns that state). Matches first; then "Other work" and the rest, dimmed in
// colour (never opacity). Nothing is ever hidden.

import Image from "next/image";
import { Link } from "next-view-transitions";
import type { WorkItem } from "./types";

interface RowHandlers {
  onRowEnter: (item: WorkItem) => void;
  onRowFocus: (item: WorkItem) => void;
  onImageEnter: (item: WorkItem, image: number) => void;
  onImageLeave: () => void;
}

interface RowProps extends RowHandlers {
  item: WorkItem;
  dim: boolean;
}

// The strip: up to six images, 24px tall at their true proportions. Decorative: the name is the link.
function Strip({ item, onImageEnter, onImageLeave }: Pick<RowProps, "item" | "onImageEnter" | "onImageLeave">) {
  return (
    <div className="wi-strip" aria-hidden="true">
      {item.images.map((image, i) => (
        <span key={image.src} className="wi-strip-item" onPointerEnter={() => onImageEnter(item, i)} onPointerLeave={onImageLeave}>
          <Image src={image.src} alt="" width={image.width} height={image.height} sizes="60px" loading="lazy" className="wi-strip-img" />
        </span>
      ))}
    </div>
  );
}

function Row({ item, dim, onRowEnter, onRowFocus, onImageEnter, onImageLeave }: RowProps) {
  return (
    <li className="wi-row" data-dim={dim || undefined} data-slug={item.slug} onPointerEnter={() => onRowEnter(item)} onFocus={() => onRowFocus(item)}>
      <span className="wi-num" aria-hidden="true">
        {String(item.number).padStart(2, "0")}
      </span>
      {/* The one view transition name per project on this page, so the case study title morphs. */}
      <h3 className="wi-name" style={{ viewTransitionName: `project-${item.slug}` }}>
        <Link href={`/work/${item.slug}`} className="wi-name-link">
          {item.title}
        </Link>
      </h3>
      <Strip item={item} onImageEnter={onImageEnter} onImageLeave={onImageLeave} />
      <p className="wi-meta">
        <span>{item.meta}</span>
        {(item.year || item.typeLabel) && (
          <span className="wi-year">
            {item.year}
            {item.typeLabel && <span className="editorial-label wi-type">{item.typeLabel}</span>}
          </span>
        )}
      </p>
    </li>
  );
}

interface Props extends RowHandlers {
  matches: WorkItem[];
  rest: WorkItem[];
  hasChoice: boolean;
  question: string | null;
  listRef: React.RefObject<HTMLDivElement | null>;
  onListLeave: () => void;
}

export default function WorkRows({ matches, rest, hasChoice, question, listRef, onListLeave, ...handlers }: Props) {
  const noMatch = hasChoice && matches.length === 0;
  return (
    <div className="wi-list" ref={listRef} onPointerLeave={onListLeave}>
      {noMatch && <p className="wi-empty">Nothing for that combination yet.</p>}
      {matches.length > 0 && (
        <ul className="wi-rows">
          {matches.map((item) => (
            <Row key={item.slug} item={item} dim={false} {...handlers} />
          ))}
        </ul>
      )}
      {matches.length > 0 && question && (
        <div className="wi-invite">
          <p className="wi-invite-question">{question}</p>
          <Link href="/start" className="wi-invite-link" data-cursor="link">
            Plan your project
          </Link>
        </div>
      )}
      {hasChoice && rest.length > 0 && <h2 className="editorial-label wi-other">Other work</h2>}
      <ul className="wi-rows">
        {rest.map((item) => (
          <Row key={item.slug} item={item} dim={hasChoice} {...handlers} />
        ))}
      </ul>
    </div>
  );
}
