"use client";
// A client component: hovering or focusing a field previews its project in the hero, and what an item
// does depends on the screen. Desktop (above 1080px): each field is a link to its case study ("All
// work" to /work), previewed on hover or focus. 1080px and below: each field is a button that only
// previews; the image and the caption link to the project.
//
// The list stays laid out while closed on desktop (hidden, so nothing below moves when it opens).
// On phones it opens by height. The last item, "Not on the list? Tell us yours", goes to /start.

import { Link } from "next-view-transitions";
import { track } from "@/lib/analytics";

export interface FieldItem {
  index: number;
  field: string;
}

interface Props {
  id: string;
  items: FieldItem[];
  slugs: string[];
  active: number | null;
  open: boolean;
  compact: boolean;
  onPreview: (field: number | null) => void;
  onOpenProject: (slug: string) => void;
}

function Item({ label, field, href, active, compact, onPreview, onOpen }: { label: string; field: number | null; href: string; active: boolean; compact: boolean; onPreview: (f: number | null) => void; onOpen?: () => void }) {
  const content = (
    <>
      <span className="hero-field-tick" aria-hidden="true" />
      {label}
    </>
  );
  if (compact) {
    return (
      <button type="button" className="hero-field" aria-current={active || undefined} onClick={() => onPreview(field)}>
        {content}
      </button>
    );
  }
  return (
    <Link
      href={href}
      className="hero-field"
      aria-current={active || undefined}
      onPointerEnter={() => onPreview(field)}
      onFocus={() => onPreview(field)}
      onClick={onOpen}
    >
      {content}
    </Link>
  );
}

export default function HeroFieldList({ id, items, slugs, active, open, compact, onPreview, onOpenProject }: Props) {
  return (
    <ul id={id} className="hero-fields" data-open={open}>
      <li>
        <Item label="All work" field={null} href="/work" active={active === null} compact={compact} onPreview={onPreview} />
      </li>
      {items.map((item) => (
        <li key={item.index}>
          <Item
            label={item.field}
            field={item.index}
            href={`/work/${slugs[item.index]}`}
            active={active === item.index}
            compact={compact}
            onPreview={onPreview}
            onOpen={() => onOpenProject(slugs[item.index])}
          />
        </li>
      ))}
      <li className="hero-fields-other">
        <Link href="/start" className="hero-field" onClick={() => track("hero_unlisted_field_click")}>
          Not on the list? Tell us yours
        </Link>
      </li>
    </ul>
  );
}
