"use client";
// The Brand Pulse flow: intro, seven questions, the reading screen and the result.
// Client component: it holds the answers, times the screens and sends events.
// The result comes from the same rule based engine the server uses. No AI is involved.

import { useEffect, useMemo, useRef, useState } from "react";
import { assess } from "@/lib/brand-pulse/engine";
import { GATE_COPY, INTRO, KEEP_IT } from "@/lib/brand-pulse/content";
import { bookingUrl, shareUrl } from "@/lib/brand-pulse/links";
import { GATE } from "@/lib/brand-pulse/settings";
import { serviceForSiteSlug, startHref } from "@/lib/project-planner/start-links";
import { QUESTION_ORDER, type Answers, type Feedback, type Gate } from "@/lib/brand-pulse/types";
import PulseIntro from "./PulseIntro";
import PulseQuestion from "./PulseQuestion";
import PulseEvaluating from "./PulseEvaluating";
import PulseResultView from "./PulseResultView";
import PulseFollowUp from "./PulseFollowUp";
import PulseEmailForm from "./PulseEmailForm";
import { sendEvent, startSession, type LeadContact, type ProfileContact, type PulseSession, type SendStatus } from "./events";
import { trackOnce } from "@/lib/analytics";
import { sessionStore } from "@/lib/campaign";
import { readLeadSource } from "@/lib/lead-source";
import "./brand-pulse.css";

type Screen = "intro" | "gate" | "question" | "evaluating" | "result";

interface Props {
  gate?: Gate;
  startLabel?: string;
  headingLevel?: "h1" | "h2";
  // One answer chosen on the link in (?q=): the flow skips the intro and starts at question 1, and
  // that answer is already selected, and changeable, when the visitor reaches its question.
  prefill?: Partial<Answers> | null;
}

const FADE_MS = 200;
const CHOOSE_MS = 250;
const READ_MS = 2500;
const READ_REDUCED_MS = 600;
const STAGE_MS = 400;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BrandPulse({ gate = GATE, startLabel = INTRO.button, headingLevel = "h2", prefill = null }: Props) {
  const [screen, setScreen] = useState<Screen>(() => (!prefill ? "intro" : gate === "before-questions" ? "gate" : "question"));
  const [leaving, setLeaving] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>(() => prefill ?? {});
  const [pending, setPending] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [lead, setLead] = useState<SendStatus>("idle");
  const [contact, setContact] = useState<LeadContact | null>(null);
  const [unlocked, setUnlocked] = useState(gate !== "before-full-result");
  const session = useRef<PulseSession | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const complete = screen === "result" ? (answers as Answers) : null;
  const result = useMemo(() => (complete ? assess(complete) : null), [complete]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // A prefilled start skips the intro, so the session (and its attribution) begins here instead.
  useEffect(() => {
    if (prefill && !session.current) session.current = startSession();
  }, [prefill]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  function scrollToTop() {
    const el = rootRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -96, immediate: true });
    else el.scrollIntoView({ block: "start" });
  }

  function goTo(next: Screen, nextStep = step) {
    setLeaving(true);
    later(() => {
      setScreen(next);
      setStep(nextStep);
      setPending(null);
      choosing.current = false;
      setLeaving(false);
      scrollToTop();
      if (next === "evaluating") later(showResult, reducedMotion() ? READ_REDUCED_MS : READ_MS);
    }, FADE_MS);
  }

  function showResult() {
    const reduced = reducedMotion();
    setStage(reduced ? 3 : 0);
    setScreen("result");
    if (!reduced) [1, 2, 3].forEach((s) => later(() => setStage(s), s * STAGE_MS));
  }

  // Move focus to the result heading once it is on screen, so keyboard and screen reader users land on it.
  useEffect(() => {
    if (screen === "result") rootRef.current?.querySelector<HTMLElement>(".bp-result-name")?.focus({ preventScroll: true });
  }, [screen]);

  function start() {
    session.current = startSession();
    setAnswers({});
    setLead("idle");
    setUnlocked(gate !== "before-full-result");
    goTo(gate === "before-questions" && !contact ? "gate" : "question", 0);
  }

  // A ref, not state: a key press and its click can both arrive before the next render.
  const choosing = useRef(false);
  function choose(id: string) {
    if (choosing.current) return;
    choosing.current = true;
    setPending(id);
    later(() => {
      const q = QUESTION_ORDER[step];
      setAnswers((a) => ({ ...a, [q]: id }));
      if (step === QUESTION_ORDER.length - 1) goTo("evaluating");
      else goTo("question", step + 1);
    }, CHOOSE_MS);
  }

  function back() {
    goTo(step === 0 ? "intro" : "question", Math.max(0, step - 1));
  }

  // Sends the email with the result. Under a gate the result unlocks whether or not the send worked.
  async function submitLead(c: LeadContact, honeypot: string, forAnswers: Answers) {
    if (!session.current || lead === "sending") return;
    setContact(c);
    setLead("sending");
    // The email goes with where this session began (session only).
    const ok = await sendEvent(session.current, gate, forAnswers, { event: "lead", contact: c, honeypot, leadSource: readLeadSource(sessionStore()) });
    setLead(ok ? "success" : "error");
    setUnlocked(true);
  }

  // The completed event goes once, when the result is first shown. Under a gate,
  // an email given earlier in the session goes with it.
  const sentFor = useRef<string | null>(null);
  useEffect(() => {
    const s = session.current;
    if (!complete || !s || sentFor.current === s.resultId) return;
    sentFor.current = s.resultId;
    // brand_pulse_complete once the server has the result, never before, and once per result id.
    void sendEvent(s, gate, complete, { event: "completed" }).then((ok) => ok && trackOnce("brand_pulse_complete", s.resultId));
    // Sent alongside, not after: a slow n8n must not hold up the email.
    if (gate !== "none" && contact) void submitLead(contact, "", complete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  // The copy link uses this site's address; the booking notes always carry the public one.
  const share = complete ? shareUrl(complete, window.location.origin) : "";
  const booking = complete && result ? bookingUrl(complete, result, shareUrl(complete)) : "";

  async function submitProfile(c: ProfileContact, honeypot: string) {
    if (!session.current || !complete) return false;
    return sendEvent(session.current, gate, complete, { event: "profile", contact: c, honeypot, leadSource: readLeadSource(sessionStore()) });
  }

  function sendFeedback(feedback: Feedback) {
    if (session.current && complete) void sendEvent(session.current, gate, complete, { event: "feedback", feedback });
  }

  return (
    <div ref={rootRef} className={`bp-root${leaving ? " is-leaving" : ""}`}>
      {/* Where the check is the page (h1), its main heading lives in the intro. Whenever the intro is
          not on screen (a link that starts at a question, or a flow already under way), the same
          words stay as a visually hidden h1, so the page always has exactly one. */}
      {headingLevel === "h1" && screen !== "intro" && <h1 className="sr-only">{INTRO.heading}</h1>}
      <div key={screen === "question" ? `q${step}` : screen} className="bp-screen">
        {screen === "intro" && <PulseIntro headingLevel={headingLevel} startLabel={startLabel} onStart={start} />}

        {screen === "gate" && (
          <div className="bp-gate">
            <h2 className="bp-heading">{GATE_COPY.heading}</h2>
            <p className="bp-text">{KEEP_IT.text}</p>
            <PulseEmailForm
              id="bp-gate-start"
              buttonLabel={GATE_COPY.button}
              status="idle"
              onSubmit={(c) => {
                setContact(c);
                goTo("question", 0);
              }}
            />
          </div>
        )}

        {screen === "question" && <PulseQuestion step={step} answers={answers} pending={pending} onChoose={choose} onBack={back} />}

        {screen === "evaluating" && <PulseEvaluating />}

        {screen === "result" && result && complete && (
          <>
            <PulseResultView result={result} stage={stage} locked={!unlocked} />
            {!unlocked && stage >= 1 && (
              <div className="bp-gate bp-reveal">
                <h3 className="bp-block-heading">{GATE_COPY.heading}</h3>
                <p className="bp-text">{KEEP_IT.text}</p>
                <PulseEmailForm id="bp-gate-result" buttonLabel={GATE_COPY.button} status={lead} onSubmit={(c, h) => submitLead(c, h, complete)} />
              </div>
            )}
            {unlocked && stage >= 3 && (
              <PulseFollowUp
                bookingHref={booking}
                shareHref={share}
                planHref={startHref("brand_pulse", serviceForSiteSlug(result.service.slug))}
                lead={lead}
                leadEmail={contact?.email ?? null}
                onFeedback={sendFeedback}
                onLead={(c, h) => submitLead(c, h, complete)}
                onProfile={submitProfile}
                onRestart={() => goTo("intro", 0)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
