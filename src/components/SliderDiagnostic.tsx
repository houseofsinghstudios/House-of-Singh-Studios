"use client";

import { useState, useCallback } from "react";
import { Link } from "next-view-transitions";

const SLIDERS = [
  {
    id: "consistency",
    name: "Brand consistency",
    labels: ["Inconsistent", "Mostly inconsistent", "Mixed", "Mostly consistent", "Consistent"],
  },
  {
    id: "marketing",
    name: "Marketing effectiveness",
    labels: ["Not converting", "Rarely", "Sometimes", "Usually", "Converting well"],
  },
  {
    id: "independence",
    name: "Team independence",
    labels: ["Not confident", "Rarely", "Sometimes", "Mostly", "Independent"],
  },
] as const;

const CARDS = [
  {
    num: "01",
    service: "Brand Identity and Visual Design",
    headline: "Your business has grown. Your brand has not kept up.",
    description:
      "Prospects compare you to competitors with sharper visuals and walk away. Your team applies the brand differently every time because there is no system. We build the visual identity that matches what you have built.",
    cta: "Fix your brand identity",
    href: "/services/brand-identity",
  },
  {
    num: "02",
    service: "Visual Media and Content Production",
    headline: "Your content looks different on every platform. Nothing connects.",
    description:
      "Photos here, videos there, social posts everywhere. No visual thread. We direct and produce brand photography, video, and content systems that hold together across every channel.",
    cta: "Build a content system",
    href: "/services/visual-media",
  },
  {
    num: "03",
    service: "Digital Design and Experience",
    headline: "Your website exists. But it does not work for your business.",
    description:
      "It loads. It has your information. But it does not convert. People browse for 30 seconds and leave. We design digital experiences where every page has a job.",
    cta: "Redesign your digital presence",
    href: "/services/digital-design",
  },
  {
    num: "04",
    service: "Creative Strategy and Systems",
    headline: "Your team makes brand decisions without a playbook.",
    description:
      "Marketing, agencies, freelancers — they all interpret your brand differently. The logo gets stretched. The colors shift. We build the strategic framework that lets your team operate without you.",
    cta: "Get a strategic framework",
    href: "/services/creative-strategy",
  },
];

function getActiveCards(
  consistency: number,
  marketing: number,
  independence: number
): number[] {
  const cLow = consistency <= 2;
  const mLow = marketing <= 2;
  const iLow = independence <= 2;

  if (cLow && mLow && iLow) return [0, 1, 2, 3];
  if (cLow && mLow) return [0, 1];
  if (cLow && iLow) return [0, 3];
  if (mLow && iLow) return [2, 3];
  if (cLow) return [0];
  if (mLow && consistency <= 3) return [1];
  if (mLow) return [2];
  if (iLow) return [3];
  return [];
}

export default function SliderDiagnostic() {
  const [values, setValues] = useState({ consistency: 3, marketing: 3, independence: 3 });
  const [touched, setTouched] = useState(false);
  const [clickedCard, setClickedCard] = useState<number | null>(null);

  const handleSliderChange = useCallback((id: string, value: number) => {
    setTouched(true);
    setClickedCard(null);
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleCardClick = useCallback((index: number) => {
    setClickedCard((prev) => (prev === index ? null : index));
  }, []);

  // Determine card states
  const sliderActive = getActiveCards(values.consistency, values.marketing, values.independence);
  const hasRecommendation = touched && sliderActive.length > 0;

  function getCardState(index: number): "default" | "active" | "dim" {
    // Click override
    if (clickedCard !== null) {
      return index === clickedCard ? "active" : "dim";
    }
    // No slider interaction or all healthy
    if (!touched || sliderActive.length === 0) return "default";
    // Slider-driven
    if (sliderActive.includes(index)) return "active";
    return "dim";
  }

  return (
    <>
      {/* ── SECTION A: SLIDER DASHBOARD ── */}
      <div className="diag-dashboard">
        {SLIDERS.map((slider, i) => {
          const val = values[slider.id as keyof typeof values];
          const barHeight = val * 20;
          const isLow = val <= 2;
          const pct = ((val - 1) / 4) * 100;
          return (
            <div
              key={slider.id}
              className="diag-column"
              style={{
                paddingRight: i === 0 ? 24 : undefined,
                paddingLeft: i === 2 ? 24 : undefined,
                ...(i === 1 ? { padding: "0 12px" } : {}),
              }}
            >
              {i > 0 && <div className="diag-column-border" />}
              <div style={i === 1 ? { paddingLeft: 12 } : undefined}>
                <div className="diag-number">
                  {val}
                </div>
                <p className="diag-status">{slider.labels[val - 1]}</p>
                <div className="diag-bar-container">
                  <div
                    className="diag-bar-fill"
                    style={{
                      height: `${barHeight}%`,
                      background: isLow ? "var(--text-primary)" : "var(--text-muted)",
                    }}
                  />
                </div>
                <div className="diag-slider-wrap">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={val}
                    onChange={(e) =>
                      handleSliderChange(slider.id, parseInt(e.target.value, 10))
                    }
                    className="diag-range"
                    aria-label={slider.name}
                    style={{ "--slider-pct": `${pct}%` } as React.CSSProperties}
                  />
                </div>
                <p className="diag-slider-name">{slider.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SECTION B: SERVICE CARDS ── */}
      <div className="diag-cards" style={{ marginTop: "4rem" }}>
        {CARDS.map((card, i) => {
          const state = getCardState(i);
          const stateClass =
            state === "active" ? " active" : state === "dim" ? " dim" : "";
          return (
            <div
              key={card.num}
              className={`service-card${stateClass}`}
              style={{ transitionDelay: `${i * 0.06}s` }}
              onClick={() => handleCardClick(i)}
              data-cursor="link"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(i);
                }
              }}
            >
              <span className="service-card-ghost">{card.num}</span>
              <p className="service-card-service">{card.service}</p>
              <h3 className="service-card-headline">{card.headline}</h3>
              <p className="service-card-desc">{card.description}</p>
              <Link
                href={card.href}
                className="service-card-cta"
                data-cursor="link"
                onClick={(e) => e.stopPropagation()}
              >
                {card.cta} &rarr;
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── SECTION C: BOTTOM CTA ── */}
      <div className="diag-bottom-cta">
        <p className="diag-bottom-heading">
          Not sure? Let us figure it out.
        </p>
        <div className="diag-bottom-buttons">
          <Link href="/contact" className="diag-btn-primary" data-cursor="link">
            Discovery Call
          </Link>
          <Link href="/packages" className="diag-btn-secondary" data-cursor="link">
            Packages
          </Link>
        </div>
      </div>
    </>
  );
}
