"use client";

import IntentLink from "@/components/IntentLink";

interface NextProjectProps {
  slug: string;
  name: string;
}

export default function NextProject({ slug, name }: NextProjectProps) {
  return (
    <IntentLink
      href={`/work/${slug}`}
      className="cs-next-row row-bleed"
      data-cursor="expand"
    >
      <span className="cs-next-label editorial-label">(Next Project)</span>
      <span className="cs-next-name">
        {name} <span className="cs-next-arrow">→</span>
      </span>
    </IntentLink>
  );
}
