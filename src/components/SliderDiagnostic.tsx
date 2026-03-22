"use client";

import { useState, useCallback, useRef } from "react";
import { Link } from "next-view-transitions";
import Button from "@/components/ui/Button";

const SLIDERS = [
  {
    id: "consistency",
    title: "Brand consistency",
    description:
      "How consistent does your brand look across your website, social, print, and sales materials?",
    left: "Inconsistent",
    right: "Fully consistent",
    labels: [
      "Inconsistent",
      "Mostly inconsistent",
      "Mixed",
      "Mostly consistent",
      "Fully consistent",
    ],
  },
  {
    id: "marketing",
    title: "Marketing effectiveness",
    description:
      "How well does your website, content, and marketing actually generate leads or sales?",
    left: "Not converting",
    right: "Converting well",
    labels: [
      "Not converting",
      "Rarely converting",
      "Sometimes",
      "Usually converting",
      "Converting well",
    ],
  },
  {
    id: "independence",
    title: "Team independence",
    description:
      "Can your team, agencies, or freelancers apply your brand correctly without checking with you?",
    left: "Not confident",
    right: "Fully independent",
    labels: [
      "Not confident",
      "Rarely confident",
      "Sometimes",
      "Mostly confident",
      "Fully independent",
    ],
  },
] as const;

const SITUATIONS = [
  {
    num: "01",
    headline: "Your business has grown. Your brand has not kept up.",
    body: "You started with a logo and some colors. Now your business is bigger than your brand. Prospects compare you to competitors with sharper visuals and walk away. Your team applies the brand differently every time because there is no system.",
    linkText: "Fix your brand identity",
    href: "/services/brand-identity",
  },
  {
    num: "02",
    headline:
      "Your content looks different on every platform. Nothing connects.",
    body: "Photos here, videos there, social posts everywhere. But there is no visual thread. Your Instagram does not look like your website. Every piece is made in isolation without a system behind it.",
    linkText: "Build a content system",
    href: "/services/visual-media",
  },
  {
    num: "03",
    headline: "Your website exists. But it does not work for your business.",
    body: "It loads. It has your information. But it does not convert. People land, browse for 30 seconds, and leave. Your digital presence is a brochure when it should be your hardest-working sales tool.",
    linkText: "Redesign your digital presence",
    href: "/services/digital-design",
  },
  {
    num: "04",
    headline:
      "Your team makes brand decisions without a playbook. Every output looks different.",
    body: "Marketing, agencies, freelancers — they all interpret your brand differently. The logo gets stretched. The colors shift. You spend more time correcting inconsistencies than building your business.",
    linkText: "Get a strategic framework",
    href: "/services/creative-strategy",
  },
];

interface Recommendation {
  title: string;
  body: string;
  highlights: number[];
}

function getRecommendation(
  consistency: number,
  marketing: number,
  independence: number
): Recommendation {
  const cLow = consistency <= 2;
  const mLow = marketing <= 2;
  const iLow = independence <= 2;

  if (cLow && mLow && iLow) {
    return {
      title: "Your brand needs a comprehensive overhaul.",
      body: "Brand consistency, marketing effectiveness, and team independence are all weak. The foundation is missing. Start with Brand Identity and layer in the other services through a phased engagement. A discovery call will help us scope the right sequence.",
      highlights: [0, 1, 2, 3],
    };
  }
  if (cLow && mLow) {
    return {
      title: "Your brand and your content are both working against you.",
      body: "An inconsistent brand combined with underperforming marketing means your audience does not recognize you or trust you. Start with Brand Identity to build the visual foundation, then build a content system on top of it.",
      highlights: [0, 1],
    };
  }
  if (cLow && iLow) {
    return {
      title: "You need a brand system your whole team can use.",
      body: "The brand itself is inconsistent and your team has no framework to work from. This is a Brand Identity engagement paired with Creative Strategy to build the guidelines and governance your team needs.",
      highlights: [0, 3],
    };
  }
  if (mLow && iLow) {
    return {
      title: "Your marketing has no system and no framework behind it.",
      body: "Content is not converting and your team operates without brand structure. Start with Creative Strategy to build the framework, then apply it to your digital presence and content production.",
      highlights: [2, 3],
    };
  }
  if (cLow) {
    return {
      title: "Your business has grown. Your brand has not kept up.",
      body: "You started with a logo and some colors. Now your business is bigger than your brand. Prospects compare you to competitors with sharper visuals and walk away. A brand identity system fixes that permanently.",
      highlights: [0],
    };
  }
  if (mLow && consistency <= 3) {
    return {
      title: "Your content looks different on every platform. Nothing connects.",
      body: "You are producing content but there is no visual thread. Your Instagram does not look like your website. We build content systems that are planned, directed, and designed to maintain brand consistency at scale.",
      highlights: [1],
    };
  }
  if (mLow) {
    return {
      title: "Your website exists. But it does not work for your business.",
      body: "Your brand is solid but your digital presence is not converting. People land, browse, and leave. We design digital experiences where every page has a job: build trust, demonstrate capability, and move visitors toward a conversation.",
      highlights: [2],
    };
  }
  if (iLow) {
    return {
      title: "Your team makes brand decisions without a playbook.",
      body: "Your brand may look good when you control it, but the moment someone else touches it, the quality drops. You need a strategic framework and brand governance system that lets your team operate confidently without you.",
      highlights: [3],
    };
  }
  return {
    title: "Your brand is in good shape.",
    body: "Based on your self-assessment, the fundamentals are solid. If you are still feeling like something is off, book a discovery call. Sometimes the problem is not visible from inside the business.",
    highlights: [0, 1, 2, 3],
  };
}

export default function SliderDiagnostic() {
  const [values, setValues] = useState<Record<string, number>>({
    consistency: 3,
    marketing: 3,
    independence: 3,
  });
  const [touched, setTouched] = useState(false);
  const situationsRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((id: string, value: number) => {
    setTouched(true);
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const recommendation = touched
    ? getRecommendation(values.consistency, values.marketing, values.independence)
    : null;

  const handleSkip = useCallback(() => {
    situationsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div>
      {/* Skip link */}
      <div style={{ textAlign: "right", marginBottom: 64 }}>
        <button
          onClick={handleSkip}
          className="slider-skip-link"
          data-cursor="link"
        >
          Skip to all services &rarr;
        </button>
      </div>

      {/* Sliders */}
      <div className="slider-diagnostic-sliders">
        {SLIDERS.map((slider) => {
          const val = values[slider.id];
          const pct = ((val - 1) / 4) * 100;
          return (
            <div key={slider.id} className="slider-group">
              <div className="slider-header">
                <div>
                  <h3 className="slider-title">{slider.title}</h3>
                  <p className="slider-description">{slider.description}</p>
                </div>
                <span className="slider-current-label">
                  {slider.labels[val - 1]}
                </span>
              </div>

              <div className="slider-track-wrap">
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={val}
                  onChange={(e) =>
                    handleChange(slider.id, parseInt(e.target.value, 10))
                  }
                  className="slider-input"
                  aria-label={slider.title}
                  style={
                    {
                      "--slider-pct": `${pct}%`,
                    } as React.CSSProperties
                  }
                />
              </div>

              <div className="slider-anchors">
                <span>{slider.left}</span>
                <span>{slider.right}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendation */}
      <div className="slider-recommendation">
        <div
          className="slider-divider"
          style={{ margin: "64px 0 48px" }}
        />
        <p className="editorial-label" style={{ marginBottom: 20 }}>
          (Your recommendation)
        </p>

        <div className="slider-rec-content">
          <h3 className="slider-rec-title">
            {recommendation
              ? recommendation.title
              : "Move the sliders to see your recommendation."}
          </h3>
          {recommendation && recommendation.body && (
            <p className="slider-rec-body">{recommendation.body}</p>
          )}
        </div>
      </div>

      {/* Situation blocks */}
      <div ref={situationsRef} className="slider-situations" id="situations">
        {SITUATIONS.map((sit, i) => {
          const highlighted =
            !touched ||
            !recommendation ||
            recommendation.highlights.includes(i);
          return (
            <div
              key={sit.num}
              className="slider-situation-block css-reveal"
              style={{
                opacity: highlighted ? 1 : 0.35,
                transition: "opacity 0.4s ease",
              }}
            >
              <p className="editorial-label" style={{ marginBottom: 16 }}>
                (Situation {sit.num})
              </p>
              <h3
                className="slider-situation-headline"
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(20px, 2.5vw, 24px)",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                  margin: "0 0 16px",
                }}
              >
                {sit.headline}
              </h3>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  maxWidth: 560,
                  margin: "0 0 24px",
                }}
              >
                {sit.body}
              </p>
              <Link
                href={sit.href}
                className="slider-situation-link"
                data-cursor="link"
              >
                {sit.linkText} &rarr;
              </Link>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="slider-cta">
        <h2
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          Not sure which situation fits?
        </h2>
        <p
          style={{
            fontFamily: "var(--sans)",
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            textAlign: "center",
            margin: "0 0 40px",
          }}
        >
          Book a discovery call. We will help you figure it out.
        </p>
        <div className="slider-cta-buttons">
          <Button href="/contact" variant="primary" data-cursor="link">
            Book a Discovery Call
          </Button>
          <Button href="/packages" variant="secondary" data-cursor="link">
            View Packages
          </Button>
        </div>
      </section>
    </div>
  );
}
