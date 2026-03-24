"use client";

import { useState, useEffect } from "react";
import EditorialLabel from "@/components/ui/EditorialLabel";

const clients = [
  {
    name: "TEDxToronto",
    tags: "Brand Identity — Visual Design",
    description:
      "Event branding and visual system for one of Canada\u2019s largest TEDx events. Complete identity across 14 touchpoints.",
  },
  {
    name: "Meridian Financial Group",
    tags: "Brand Identity",
    description:
      "Brand identity system for a mid-market financial services firm. Typography-led identity with restrained color palette.",
  },
  {
    name: "Soulbound Publication",
    tags: "Publication Design — Art Direction",
    description:
      "Publication cover design and art direction for a leadership book. Typographic approach differentiating it from the crowded genre.",
  },
  {
    name: "Nomad Kitchen",
    tags: "Brand Identity — Packaging",
    description:
      "Brand identity and packaging for a modern South Asian food brand. Visual system connecting cultural authenticity with contemporary design.",
  },
  {
    name: "Ferrari",
    tags: "Creative Strategy",
    description:
      "Creative process consulting and brand structure advisory for operational teams within a globally recognized automotive brand.",
  },
  {
    name: "Planning and Logistics Corp",
    tags: "Creative Direction — Systems",
    description:
      "Creative direction and operational alignment for a director-level logistics firm. Timelines, communication, and brand intentionality.",
  },
];

export default function ClientsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      className="css-reveal"
      style={{ padding: "clamp(80px, 10vw, 140px) var(--page-px)" }}
    >
      <EditorialLabel text="(05) Clients" className="mb-6" />
      <h2
        className="font-[var(--sans)] font-medium tracking-[-0.025em] text-[color:var(--text-primary)] m-0 mb-12"
        style={{
          fontSize: "clamp(28px, 3vw, 40px)",
          lineHeight: 1.15,
        }}
      >
        Brands we&rsquo;ve worked with.
      </h2>

      <div className="clients-accordion reveal-stagger-parent">
        {clients.map((client, i) => {
          const isOpen = isMobile || openIndex === i;
          return (
            <div key={client.name} className="clients-accordion-row" data-cursor="link">
              <button
                className="clients-accordion-header"
                onClick={() => { if (!isMobile) setOpenIndex(isOpen ? null : i); }}
                aria-expanded={isOpen}
              >
                <span className="clients-accordion-name">{client.name}</span>
                <span className="clients-accordion-tags">{client.tags}</span>
                <span
                  className="clients-accordion-toggle"
                  style={{
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              <div
                className="clients-accordion-body"
                style={{
                  maxHeight: isOpen ? 200 : 0,
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <p className="clients-accordion-desc">{client.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
