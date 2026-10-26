"use client";
// The Project Planner flow: intro, five questions (four when unsure), then the brief.
// Client component: it holds the draft in memory only (never stored in the browser), recomputes the
// brief as answers change and sends the four events. The brief comes from the same rule based
// engine the server uses. No AI is involved, and nothing is sent until the visitor starts.

import { useEffect, useMemo, useRef, useState } from "react";
import { buildBrief, validateAnswers, withNeeds, withPrimary, type Draft } from "@/lib/project-planner/engine";
import { bookingUrl } from "@/lib/project-planner/links";
import { FLOW } from "@/lib/project-planner/content";
import type { ActionId, Optional, Pricing, ServiceId } from "@/lib/project-planner/types";
import PlannerIntro from "./PlannerIntro";
import PlannerStep, { type StepKey } from "./PlannerStep";
import PlannerBrief, { type CaseStudyLink } from "./PlannerBrief";
import PlannerSendForm from "./PlannerSendForm";
import { sendEvent, startSession, type Contact, type Heard, type Session } from "./events";
import "./planner.css";

interface Props {
  pricing: Pricing;
  related: CaseStudyLink[];
  initialService: ServiceId | null;
  // ?begin=1: skip the intro and open the first question, with any preselected service showing.
  begin?: boolean;
}

type Screen = "intro" | "step" | "brief";

const stepsFor = (d: Draft): StepKey[] => ["needs", "start", "goal", ...(d.needs.includes("unsure") ? [] : (["priorities"] as StepKey[])), "timing"];
const emptyDraft = (service: ServiceId | null): Draft => (service ? { needs: [service], primary: service } : { needs: [] });

function scrollToTop(el: HTMLElement | null) {
  if (!el || el.getBoundingClientRect().top >= 0) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -96, immediate: true });
  else el.scrollIntoView({ block: "start" });
}

export default function ProjectPlanner({ pricing, related, initialService, begin = false }: Props) {
  const [screen, setScreen] = useState<Screen>(begin ? "step" : "intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(initialService));
  const [optional, setOptional] = useState<Optional>({});
  const [editing, setEditing] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [briefId, setBriefId] = useState("");
  const session = useRef<Session | null>(null);
  const viewedFor = useRef<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const steps = stepsFor(draft);
  const valid = useMemo(() => validateAnswers(draft), [draft]);
  const answers = valid.ok ? valid.answers : null;
  const brief = useMemo(() => (answers ? buildBrief(answers, pricing, optional) : null), [answers, pricing, optional]);

  function go(next: Screen, index = stepIndex) {
    setScreen(next);
    setStepIndex(index);
    requestAnimationFrame(() => scrollToTop(rootRef.current));
  }

  function start() {
    session.current = startSession();
    setBriefId(session.current.briefId);
    viewedFor.current = null;
    void sendEvent(session.current, { event: "started" });
    go("step", 0);
  }

  // A begin link skips the intro, so the session starts here, with the same started event.
  useEffect(() => {
    if (!begin || session.current) return;
    session.current = startSession();
    void sendEvent(session.current, { event: "started" });
  }, [begin]);

  function showBrief() {
    if (session.current) setBriefId(session.current.briefId);
    go("brief");
  }

  function announce() {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(FLOW.updated));
  }

  function continueFrom() {
    const firstMissing = steps.findIndex((s, i) => i > stepIndex && !isAnswered(s, draft));
    if (editing && answers && firstMissing === -1) {
      setEditing(false);
      showBrief();
      announce();
    } else if (stepIndex === steps.length - 1) {
      if (answers) showBrief();
    } else {
      go("step", stepIndex + 1);
    }
  }

  // The first time the finished brief appears for this brief id, record it (no contact details).
  useEffect(() => {
    const s = session.current;
    if (screen !== "brief" || !answers || !s || viewedFor.current === s.briefId) return;
    viewedFor.current = s.briefId;
    void sendEvent(s, { event: "viewed", answers });
  }, [screen, answers]);

  useEffect(() => {
    if (screen === "brief") rootRef.current?.querySelector<HTMLElement>(".pp-headline")?.focus({ preventScroll: true });
  }, [screen]);

  function onAction(action: ActionId) {
    if (action === "book") {
      if (session.current) void sendEvent(session.current, { event: "call_clicked" });
      return;
    }
    setShowSend(true);
    requestAnimationFrame(() => document.getElementById("pp-send-heading")?.focus());
  }

  async function onSend(contact: Contact, honeypot: string, heard: Heard): Promise<boolean> {
    if (!session.current || !answers) return false;
    return sendEvent(session.current, { event: "sent", answers, optional, contact, honeypot, ...heard });
  }

  function startAgain() {
    setDraft(emptyDraft(null));
    setOptional({});
    setShowSend(false);
    setEditing(false);
    session.current = null;
    go("intro", 0);
  }

  return (
    <div ref={rootRef} className="pp-root">
      <div key={screen === "step" ? `s${stepIndex}` : screen} className="pp-screen">
        {screen === "intro" && <PlannerIntro onStart={start} />}
        {screen === "step" && (
          <PlannerStep
            step={steps[stepIndex]}
            index={stepIndex}
            total={steps.length}
            draft={draft}
            onNeeds={(needs) => setDraft((d) => withNeeds(d, needs))}
            onPrimary={(p) => setDraft((d) => withPrimary(d, p))}
            onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
            onContinue={continueFrom}
            onBack={() => (stepIndex === 0 ? go("intro", 0) : go("step", stepIndex - 1))}
            isLast={stepIndex === steps.length - 1}
          />
        )}
        {screen === "brief" && brief && answers && (
          <>
            <PlannerBrief
              brief={brief}
              optional={optional}
              related={related}
              bookingHref={bookingUrl(briefId, brief, answers)}
              onEditStep={(step) => { setEditing(true); go("step", step - 1); }}
              onOptional={(patch) => { setOptional((o) => ({ ...o, ...patch })); if (patch.investment) announce(); }}
              onAction={onAction}
              onEdit={() => { setEditing(true); go("step", 0); }}
              onPrint={() => window.print()}
              onStartAgain={startAgain}
              announcement={announcement}
            />
            {showSend && <PlannerSendForm onSend={onSend} />}
          </>
        )}
      </div>
    </div>
  );
}

function isAnswered(step: StepKey, d: Draft): boolean {
  if (step === "needs") return d.needs.length > 0;
  if (step === "priorities") return (d.priorities ?? []).length > 0;
  return Boolean(d[step]);
}
