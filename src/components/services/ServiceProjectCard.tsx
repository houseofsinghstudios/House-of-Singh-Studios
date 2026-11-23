"use client";
// A client component: it rotates the service's projects every 5s. Every project's image and every
// project's tags and name are always in the card, stacked in the same box; only the current one
// shows, so a change never alters the card's height (site audit S-12: tags that wrapped to one more
// or one fewer line moved the page by 21px, with no input).

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import IntentLink from "@/components/IntentLink";
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
  const tagsFor = (p: ServiceProject) =>
    p.disciplines.length > 0 ? p.disciplines.map((d) => ({ value: d, label: disciplineLabel(d) })) : [{ value: "project", label: "Project" }];

  // One link for the whole card: image, tags and name all open the project.
  return (
    <IntentLink href={`/work/${current.slug}`} className="svc-block-card no-underline" data-cursor="view">
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
          />
        ))}
      </div>
      {/* All in one grid cell, as tall as the tallest; the others hidden, so the link reads the current one. */}
      <div className="svc-block-proj-meta">
        {projects.map((p, i) => (
          <div key={p.slug} className="svc-block-proj-item" data-active={i === activeIndex ? "true" : "false"} aria-hidden={i === activeIndex ? undefined : true}>
            <DisciplineTags tags={tagsFor(p)} className="svc-block-proj-tags" projectType={p.projectType} />
            <p className="svc-block-proj-name">{p.name}</p>
          </div>
        ))}
      </div>
    </IntentLink>
  );
}
