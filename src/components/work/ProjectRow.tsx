"use client";

import Link from "next/link";

interface ProjectRowProps {
  slug: string;
  number: string;
  name: string;
  categories: string[];
  year: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProjectRow({
  slug,
  number,
  name,
  categories,
  year,
  onMouseEnter,
  onMouseLeave,
}: ProjectRowProps) {
  return (
    <Link
      href={`/work/${slug}`}
      className="project-row"
      data-cursor="expand"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="project-row-left">
        <span className="project-row-number">{number}</span>
        <span className="project-row-name">{name}</span>
      </div>
      <span className="project-row-category">
        {categories.join(", ")}
      </span>
      <span className="project-row-year">{year}</span>
    </Link>
  );
}
