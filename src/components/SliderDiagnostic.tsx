"use client";

import { useState, useCallback, useEffect } from "react";
import { Link } from "next-view-transitions";

const SLIDER_CONFIG = [
  {
    name: "Brand consistency",
    labels: [
      "Inconsistent",
      "Mostly inconsistent",
      "Mixed",
      "Mostly consistent",
      "Consistent",
    ],
  },
  {
    name: "Marketing effectiveness",
    labels: [
      "Not converting",
      "Rarely",
      "Sometimes",
      "Usually",
      "Converting well",
    ],
  },
  {
    name: "Team independence",
    labels: [
      "Not confident",
      "Rarely",
      "Sometimes",
      "Mostly",
      "Independent",
    ],
  },
];

const RESULTS: Record<
  string,
  { title: string; desc: string; href: string; cta: string }
> = {
  brand: {
    title: "Your business has grown. Your brand has not kept up.",
    desc: "A brand identity system that matches the scale and credibility of what you have built.",
    href: "/services/brand-identity",
    cta: "Fix your brand identity",
  },
  media: {
    title: "Your content has no visual thread.",
    desc: "We build content systems that are planned, directed, and designed to maintain brand consistency at scale.",
    href: "/services/visual-media",
    cta: "Build a content system",
  },
  digital: {
    title: "Your website is not working for you.",
    desc: "We design digital experiences where every page has a job: build trust, demonstrate capability, and move visitors toward a conversation.",
    href: "/services/digital-design",
    cta: "Redesign your digital presence",
  },
  strategy: {
    title: "Your team has no playbook.",
    desc: "A strategic framework and brand governance system that lets your team operate confidently without you.",
    href: "/services/creative-strategy",
    cta: "Get a strategic framework",
  },
  overhaul: {
    title: "Your brand needs a comprehensive overhaul.",
    desc: "Start with Brand Identity and layer in other services through a phased engagement. A discovery call will help us scope the right sequence.",
    href: "/contact",
    cta: "Book a discovery call",
  },
  healthy: {
    title: "Your brand is in good shape.",
    desc: "If something still feels off, book a discovery call. Sometimes the problem is not visible from inside the business.",
    href: "/contact",
    cta: "Book a discovery call",
  },
};

function getResult(v1: number, v2: number, v3: number): string {
  const l1 = v1 <= 2,
    l2 = v2 <= 2,
    l3 = v3 <= 2;
  const count = [l1, l2, l3].filter(Boolean).length;
  if (count >= 3) return "overhaul";
  if (l1 && l2) return "brand";
  if (l1 && l3) return "brand";
  if (l2 && l3) return "strategy";
  if (l1) return "brand";
  if (l2) return v1 <= 3 ? "media" : "digital";
  if (l3) return "strategy";
  return "healthy";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SliderDiagnostic({ isOpen, onClose }: Props) {
  const [values, setValues] = useState([3, 3, 3]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSlider = useCallback((index: number, value: number) => {
    setTouched(true);
    setValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  if (!isOpen) return null;

  const result = touched
    ? RESULTS[getResult(values[0], values[1], values[2])]
    : null;

  return (
    <div className="diag-overlay" onClick={onClose}>
      <div className="diag-modal" onClick={(e) => e.stopPropagation()}>
        <button className="diag-close" onClick={onClose}>
          Close
        </button>

        <p className="diag-label">(Brand Diagnostic)</p>
        <p className="diag-heading">Where does your brand stand?</p>
        <p className="diag-sub">Move the sliders. Be honest.</p>

        <div className="diag-sliders">
          {SLIDER_CONFIG.map((slider, i) => (
            <div key={i} className="diag-slider-col">
              <div className="diag-slider-top">
                <span className="diag-slider-num">{values[i]}</span>
                <span className="diag-slider-status">
                  {slider.labels[values[i] - 1]}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={values[i]}
                onChange={(e) => handleSlider(i, parseInt(e.target.value))}
                className="sld-range"
                aria-label={slider.name}
              />
              <span className="diag-slider-name">{slider.name}</span>
            </div>
          ))}
        </div>

        {result && (
          <div className="diag-result">
            <p className="diag-result-title">{result.title}</p>
            <p className="diag-result-desc">{result.desc}</p>
            <Link
              href={result.href}
              className="diag-result-cta"
              data-cursor="link"
              onClick={onClose}
            >
              {result.cta} &rarr;
            </Link>
          </div>
        )}

        {!result && (
          <div className="diag-result diag-result-empty">
            <p className="diag-result-desc">
              Move the sliders to see your recommendation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
