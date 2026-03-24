"use client";

import { Link } from "next-view-transitions";

interface NextProjectProps {
  slug: string;
  name: string;
}

export default function NextProject({ slug, name }: NextProjectProps) {
  return (
    <Link
      href={`/work/${slug}`}
      className="cs-next-row"
      data-cursor="expand"
    >
      <span className="cs-next-label editorial-label">(Next Project)</span>
      <span className="cs-next-name">
        {name} <span className="cs-next-arrow">→</span>
      </span>
    </Link>
  );
}
