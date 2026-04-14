"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { ServiceProject } from "@/lib/sanity/projects";

interface Props {
  projects: ServiceProject[];
}

export default function ServiceProjectCard({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(() =>
    projects.length > 1 ? Math.floor(Math.random() * projects.length) : 0,
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (projects.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [projects.length]);

  if (projects.length === 0) return null;

  const current = projects[activeIndex];

  return (
    <div>
      <Link
        href={`/work/${current.slug}`}
        className="svc-block-img"
        data-cursor="view"
        style={{ display: "block", position: "relative" }}
      >
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
      </Link>
      <div>
        <p className="svc-block-proj-tags">
          {current.disciplines
            .map((d) => d.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
            .join(" — ") || "Project"}
        </p>
        <p className="svc-block-proj-name">{current.name}</p>
      </div>
    </div>
  );
}
