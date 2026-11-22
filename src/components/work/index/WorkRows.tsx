"use client";
// A client component: the index rows tell the image window what the visitor is pointing at or has
// focused (WorkIndex owns that state). Matches first; then "Other work" and the rest, dimmed in
// colour (never opacity). Nothing is ever hidden.

import Image from "next/image";
import IntentLink from "@/components/IntentLink";
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
  // How many strip images show: six on /work, three on the homepage.
  stripMax: number;
  // False until intent on the homepage: the strip keeps its space but loads nothing with the hero.
  armed: boolean;
}

// The strip: up to six images, 24px tall at their true proportions. Decorative: the name is the link.
function Strip({ item, stripMax, armed, onImageEnter, onImageLeave }: Pick<RowProps, "item" | "stripMax" | "armed" | "onImageEnter" | "onImageLeave">) {
  return (
    <div className="wi-strip" aria-hidden="true">
      {item.images.slice(0, stripMax).map((image, i) => (
        <span key={image.src} className="wi-strip-item" onPointerEnter={() => onImageEnter(item, i)} onPointerLeave={onImageLeave}>
          {armed ? (
            <Image src={image.src} alt="" width={image.width} height={image.height} sizes="60px" loading="lazy" className="wi-strip-img" />
          ) : (
            <span className="wi-strip-img" style={{ aspectRatio: `${image.width} / ${image.height}` }} />
          )}
        </span>
      ))}
    </div>
  );
}

function Row({ item, dim, stripMax, armed, onRowEnter, onRowFocus, onImageEnter, onImageLeave }: RowProps) {
  return (
    <li className="wi-row" data-dim={dim || undefined} data-slug={item.slug} onPointerEnter={() => onRowEnter(item)} onFocus={() => onRowFocus(item)}>
      <span className="wi-num" aria-hidden="true">
        {String(item.number).padStart(2, "0")}
      </span>
      {/* The one view transition name per project on this page, so the case study title morphs. */}
      <h3 className="wi-name" style={{ viewTransitionName: `project-${item.slug}` }}>
        <IntentLink href={`/work/${item.slug}`} className="wi-name-link">
          {item.title}
        </IntentLink>
      </h3>
      <Strip item={item} stripMax={stripMax} armed={armed} onImageEnter={onImageEnter} onImageLeave={onImageLeave} />
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
  // The homepage: three strip images, and "More from the studio" as a small label (the section's
  // sentence is its h2) where /work has the h2 "Other work".
  home?: boolean;
  // The homepage holds the strip images until intent (HomeWorkIndex); /work shows them at once.
  armed?: boolean;
}

export default function WorkRows({ matches, rest, hasChoice, question, listRef, onListLeave, home, armed = true, ...handlers }: Props) {
  const noMatch = hasChoice && matches.length === 0;
  const stripMax = home ? 3 : 6;
  const row = (item: WorkItem, dim: boolean) => <Row key={item.slug} item={item} dim={dim} stripMax={stripMax} armed={armed} {...handlers} />;
  return (
    <div className="wi-list" ref={listRef} onPointerLeave={onListLeave}>
      {noMatch && <p className="wi-empty">Nothing for that combination yet.</p>}
      {matches.length > 0 && <ul className="wi-rows">{matches.map((item) => row(item, false))}</ul>}
      {matches.length > 0 && question && (
        <div className="wi-invite">
          <p className="wi-invite-question">{question}</p>
          <IntentLink href="/start" className="wi-invite-link" data-cursor="link">
            Plan your project
          </IntentLink>
        </div>
      )}
      {hasChoice && rest.length > 0 && (home ? <p className="editorial-label wi-other">More from the studio</p> : <h2 className="editorial-label wi-other">Other work</h2>)}
      <ul className="wi-rows">{rest.map((item) => row(item, hasChoice))}</ul>
    </div>
  );
}
