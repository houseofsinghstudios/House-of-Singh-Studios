"use client";

import { useState, useCallback, useEffect } from "react";

const ROWS = [
  {
    number: "01",
    title: "Brand Identity and Visual Design",
    capabilities: [
      "Logo System",
      "Primary and Secondary Marks",
      "Typography System",
      "Color Architecture",
      "Brand Guidelines",
      "Business Cards and Stationery",
      "Presentation Templates",
      "Collateral Suite",
      "Art Direction",
    ],
  },
  {
    number: "02",
    title: "Visual Media and Content",
    capabilities: [
      "Brand Photography",
      "Campaign Films",
      "Social Content Systems",
      "Art Direction",
      "Script and Narrative",
      "Content Templates",
      "Platform-Specific Formats",
    ],
  },
  {
    number: "03",
    title: "Digital Design and Experience",
    capabilities: [
      "Website Design Direction",
      "Content Architecture",
      "Interface Design",
      "Digital Brand Systems",
      "Component Libraries",
      "Design Tokens",
      "Ongoing Support",
    ],
  },
  {
    number: "04",
    title: "Creative Strategy and Systems",
    capabilities: [
      "Positioning Workshops",
      "Creative Frameworks",
      "Content Strategy",
      "Channel Plans",
      "Visual Consistency Systems",
      "AI Workflow Integration",
      "Team Playbooks",
    ],
  },
];

export default function ServicesUnpackedAccordion() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggle = useCallback(
    (i: number) => {
      if (isMobile) return;
      setActiveIndex((prev) => (prev === i ? -1 : i));
    },
    [isMobile]
  );

  return (
    <div className="su-accordion">
      <div className="su-top-divider" />
      {ROWS.map((row, i) => {
        const isOpen = isMobile || activeIndex === i;
        return (
          <div key={i} className={`su-row${isOpen ? " su-row--open" : ""}`}>
            <button
              type="button"
              className="su-row-trigger"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <div className="su-row-left">
                <span className="su-row-num">({row.number})</span>
                <span className="su-row-title">{row.title}</span>
              </div>
              <span className="su-row-icon" aria-hidden="true">
                {isOpen ? "\u2014" : "+"}
              </span>
            </button>
            <div
              className="su-row-panel"
              style={{
                maxHeight: isOpen ? 600 : 0,
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="su-cap-grid">
                {row.capabilities.map((cap, j) => (
                  <span key={j} className="su-cap-item">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
