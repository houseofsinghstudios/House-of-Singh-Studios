"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { ServiceProject } from "@/lib/sanity/projects";
import DisciplineTags from "@/components/work/DisciplineTags";
import { disciplineLabel } from "@/lib/disciplines";

interface Props {
  projects: ServiceProject[];
}

export default function ServiceProjectCard({ projects }: Props) {
  // The server and the first browser render both show the first project, so hydration matches.
  // A random starting project is picked on the first frame after mount. Every image is already
  // stacked in the same box, so the swap changes only opacity and text, never the layout.
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (projects.length <= 1) return;
    const frame = requestAnimationFrame(() => {
      setActiveIndex(Math.floor(Math.random() * projects.length));
    });
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => {
      cancelAnimationFrame(frame);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [projects.length]);

  if (projects.length === 0) return null;

  const current = projects[activeIndex];

  const tags = current.disciplines.length > 0
    ? current.disciplines.map((d) => ({ value: d, label: disciplineLabel(d) }))
    : [{ value: "project", label: "Project" }];

  // One link for the whole card: image, tags and name all open the project.
  return (
    <Link href={`/work/${current.slug}`} className="svc-block-card no-underline" data-cursor="view">
      <div className="svc-block-img" style={{ position: "relative" }}>
        {projects.map((p, i) => (
          <Image
            key={p.slug}
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: "cover",
              opacity: i === activeIndex ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
            priority={i === 0}
          />
        ))}
      </div>
      <div className="svc-block-proj-meta">
        <DisciplineTags tags={tags} className="svc-block-proj-tags" projectType={current.projectType} />
        <p className="svc-block-proj-name">{current.name}</p>
      </div>
    </Link>
  );
}
