"use client";

import { useState, useRef, useCallback } from "react";
import { Link } from "next-view-transitions";

/* ── Question data ── */
const QUESTIONS = [
  {
    key: "businessDescription",
    text: "What does your business do?",
    type: "text" as const,
    placeholder: "e.g. Commercial real estate firm, SaaS product, restaurant group",
  },
  {
    key: "brandAge",
    text: "When was your brand identity last professionally designed or updated?",
    type: "select" as const,
    options: [
      "Less than 1 year ago",
      "1 to 3 years ago",
      "3 to 5 years ago",
      "More than 5 years ago",
      "It has never been professionally designed",
    ],
  },
  {
    key: "channelCount",
    text: "How many channels does your brand appear on?",
    type: "select" as const,
    options: [
      "1 to 3 (website, maybe social)",
      "4 to 7 (website, social, print, packaging, presentations)",
      "8 or more (all of the above plus signage, events, video, ads)",
    ],
  },
  {
    key: "biggestChallenge",
    text: "What is your biggest brand challenge right now?",
    type: "select" as const,
    options: [
      "Brand looks different on every channel",
      "Brand looks outdated compared to competitors",
      "No documented brand guidelines exist",
      "Preparing for a major growth phase or launch",
      "Need to stand out in a crowded market",
    ],
  },
  {
    key: "guidelinesStatus",
    text: "Do you have a documented brand guidelines system?",
    type: "select" as const,
    options: [
      "Yes, and the team uses it consistently",
      "Yes, but nobody follows it",
      "Partially (logo rules exist but nothing else)",
      "No",
    ],
  },
];

type Answers = {
  businessDescription: string;
  brandAge: string;
  channelCount: string;
  biggestChallenge: string;
  guidelinesStatus: string;
};

export default function BrandPulseCheck() {
  // 0=intro, 1-5=questions, 6=loading, 7=result
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    businessDescription: "",
    brandAge: "",
    channelCount: "",
    biggestChallenge: "",
    guidelinesStatus: "",
  });
  const [result, setResult] = useState<{
    heading: string;
    assessment: string;
  } | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  /* ── Transition helper ── */
  const transitionTo = useCallback((nextStep: number) => {
    const el = contentRef.current;
    if (!el) {
      setCurrentStep(nextStep);
      return;
    }
    el.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    el.style.opacity = "0";
    el.style.transform = "translateY(-10px)";

    const onEnd = () => {
      el.removeEventListener("transitionend", onEnd);
      setCurrentStep(nextStep);
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    };
    el.addEventListener("transitionend", onEnd, { once: true });
  }, []);

  /* ── Submit answers to API ── */
  const submitAssessment = useCallback(
    async (finalAnswers: Answers) => {
      transitionTo(6);

      try {
        const res = await fetch("/api/brand-pulse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalAnswers),
        });

        if (!res.ok) {
          setError("The assessment could not be generated. Please try again.");
          setCurrentStep(7);
          return;
        }

        const data = await res.json();
        setResult({ heading: data.heading, assessment: data.assessment });
        setError(null);

        // Transition to result with a short delay for the loading to feel intentional
        setTimeout(() => {
          const el = contentRef.current;
          if (el) {
            el.style.transition = "opacity 0.2s ease";
            el.style.opacity = "0";
            const onEnd = () => {
              el.removeEventListener("transitionend", onEnd);
              setCurrentStep(7);
              el.style.transition = "none";
              el.style.opacity = "0";
              el.style.transform = "translateY(20px)";
              requestAnimationFrame(() => {
                el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
              });
            };
            el.addEventListener("transitionend", onEnd, { once: true });
          } else {
            setCurrentStep(7);
          }
        }, 800);
      } catch {
        setError("The assessment could not be generated. Please try again.");
        setCurrentStep(7);
      }
    },
    [transitionTo]
  );

  /* ── Handle option selection (auto-advance) ── */
  function handleOptionSelect(questionKey: string, value: string) {
    const updated = { ...answers, [questionKey]: value };
    setAnswers(updated);

    const questionIndex = QUESTIONS.findIndex((q) => q.key === questionKey);
    if (questionIndex < QUESTIONS.length - 1) {
      transitionTo(questionIndex + 2); // +2 because step 0 is intro
    } else {
      // Last question — submit
      submitAssessment(updated);
    }
  }

  /* ── Handle text input next ── */
  function handleTextNext() {
    if (!answers.businessDescription.trim()) return;
    transitionTo(2); // Go to question 2
  }

  /* ── Handle email submit ── */
  async function handleEmailSubmit() {
    if (!email.trim() || !result) return;
    try {
      await fetch("/api/brand-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          email,
          heading: result.heading,
          assessment: result.assessment,
        }),
      });
      setEmailSubmitted(true);
    } catch {
      // Silently fail — the assessment was already delivered
    }
  }

  /* ── Reset ── */
  function handleReset() {
    setAnswers({
      businessDescription: "",
      brandAge: "",
      channelCount: "",
      biggestChallenge: "",
      guidelinesStatus: "",
    });
    setResult(null);
    setError(null);
    setEmail("");
    setEmailSubmitted(false);
    transitionTo(0);
  }

  /* ── Render content based on step ── */
  function renderStep() {
    /* INTRO */
    if (currentStep === 0) {
      return (
        <div>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              opacity: 0.4,
              marginBottom: 24,
            }}
          >
            (Try It)
          </p>
          <h2
            style={{
              fontFamily: "var(--sans)",
              fontWeight: 500,
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            See AI in action.
          </h2>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: 16,
              lineHeight: 1.6,
              opacity: 0.5,
              marginTop: 16,
            }}
          >
            Answer five questions about your business. Get a personalized brand
            assessment in 30 seconds.
          </p>
          <button className="pulse-start-btn" onClick={() => transitionTo(1)}>
            Start Assessment
          </button>
        </div>
      );
    }

    /* QUESTIONS 1-5 */
    if (currentStep >= 1 && currentStep <= 5) {
      const q = QUESTIONS[currentStep - 1];
      return (
        <div className="pulse-check-question">
          <p className="pulse-check-progress">
            {currentStep} of 5
          </p>
          <h3 className="pulse-check-question-text">{q.text}</h3>

          {q.type === "text" ? (
            <>
              <label htmlFor="pulse-business-desc" className="sr-only">
                {q.text}
              </label>
              <input
                id="pulse-business-desc"
                type="text"
                className="pulse-text-input"
                placeholder={q.placeholder}
                value={answers.businessDescription}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    businessDescription: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTextNext();
                }}
                autoFocus
              />
              <button
                className="pulse-next-btn"
                disabled={!answers.businessDescription.trim()}
                onClick={handleTextNext}
              >
                Next
              </button>
            </>
          ) : (
            <div>
              {q.options!.map((option) => (
                <button
                  key={option}
                  className={`pulse-option${answers[q.key as keyof Answers] === option ? " selected" : ""}`}
                  onClick={() => handleOptionSelect(q.key, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    /* LOADING */
    if (currentStep === 6) {
      return (
        <div className="pulse-loading">
          <p className="pulse-loading-text">Analyzing your brand signals...</p>
          <div
            className="pulse-loading-bar pulse-loading-bar-animated"
          />
        </div>
      );
    }

    /* RESULT or ERROR */
    if (currentStep === 7) {
      if (error) {
        return (
          <div className="pulse-result">
            <h3
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 500,
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              Something went wrong.
            </h3>
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 16,
                opacity: 0.5,
                marginTop: 12,
              }}
            >
              {error}
            </p>
            <button
              className="pulse-start-btn"
              style={{ marginTop: 32 }}
              onClick={handleReset}
            >
              Try Again
            </button>
          </div>
        );
      }

      if (result) {
        const paragraphs = result.assessment
          .split(/\n\n+/)
          .filter((p) => p.trim());

        return (
          <div className="pulse-result">
            <h3 className="pulse-result-heading">{result.heading}</h3>
            <div className="pulse-result-assessment">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="pulse-result-cta">
              Want to go deeper?{" "}
              <Link href="/contact">Start a conversation</Link>
            </div>

            {/* Email capture */}
            <div className="pulse-email-section">
              {emailSubmitted ? (
                <p
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 13,
                    opacity: 0.5,
                  }}
                >
                  Sent. Check your inbox.
                </p>
              ) : (
                <>
                  <p className="pulse-email-label">
                    Get the full assessment sent to your inbox.
                  </p>
                  <div className="pulse-email-row">
                    <label htmlFor="pulse-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="pulse-email"
                      type="email"
                      className="pulse-email-input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEmailSubmit();
                      }}
                    />
                    <button
                      className="pulse-email-send"
                      onClick={handleEmailSubmit}
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }
    }

    return null;
  }

  return (
    <section className="pulse-check-container">
      <div className="pulse-check-inner">
        <div ref={contentRef}>{renderStep()}</div>
      </div>
    </section>
  );
}
