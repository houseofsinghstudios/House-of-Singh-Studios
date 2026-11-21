"use client";
// A client component: the keyword field and the service rows light each other up, so they share state
// here. On desktop they sit side by side. The open row keeps its disciplines Obsidian in the field and
// turns the others Accessible Ash; pointing at (or focusing) another row lights that row instead, and
// leaving the rows returns the light to the open one. With every row closed, every word is Obsidian.
// Pointing at a field word turns the other services' names Accessible Ash. Colour only, never opacity.
// One row is open at a time, the first from the start.

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { wwdLight, type WwdService, type WwdTerm, type WwdWork } from "@/lib/what-we-do";
import WwdField from "./WwdField";
import WwdRows from "./WwdRows";

interface Props {
  services: WwdService[];
  terms: WwdTerm[];
  work: Record<string, WwdWork>;
  // Each service's descriptive topic (src/lib/service-names.ts), read after its detail link's text.
  topics: Record<string, string>;
}

// Leaving the rows resets the lighting after this long, so moving between rows never flickers.
const RESET_MS = 150;

export default function WhatWeDo({ services, terms, work, topics }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const [litService, setLitService] = useState<string | null>(null);
  const [litWord, setLitWord] = useState<string | null>(null);
  const reset = useRef(0);

  const lightService = useCallback((slug: string) => {
    window.clearTimeout(reset.current);
    setLitService(slug);
  }, []);
  const releaseService = useCallback(() => {
    window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setLitService(null), RESET_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(reset.current), []);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    if (next !== null) track("home_wwd_service_open", { service: services[i].slug });
  };

  // The row pointed at or focused lights its words with bands; else the open row, by colour only.
  const light = wwdLight(litService, open !== null ? services[open].slug : null);

  return (
    <div className="wwd-island">
      <WwdField terms={terms} services={services} work={work} litService={light.lit} bandService={light.band} onWord={setLitWord} />
      <WwdRows
        services={services}
        work={work}
        topics={topics}
        open={open}
        onToggle={toggle}
        litWord={litWord}
        pointed={litService}
        onRowLight={lightService}
        onRowsLeave={releaseService}
      />
    </div>
  );
}
