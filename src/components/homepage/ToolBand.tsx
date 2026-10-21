// "Two ways to start": the homepage band that leads into Brand Pulse and the Project Planner.
// A server component: every word, link and the final visual state is in the server HTML, so the
// band works in full without JavaScript. The Brand Pulse question and answers come straight from
// the Brand Pulse content, so the band always matches the check itself.
//
// Placement rule: no two tool prompts within one viewport. On phones and desktops the band sits
// more than a viewport from the hero's Start a Project button and from the final call to action.
// Documented exception: tall portrait tablets (about 820x1180 and 1024x1366), where the band's
// buttons and the final Start a Project button come within about 0.85 to 0.9 of a viewport.

import { Link } from "next-view-transitions";
import Button from "@/components/ui/Button";
import ToolBandSwitch from "./ToolBandSwitch";
import { QUESTIONS, VITALS } from "@/lib/brand-pulse/content";
import "./tool-band.css";

export const TOOL_BAND = {
  label: "(04) Two ways to start",
  heading: "Start with a check, or start with a plan.",
  pulse: {
    tag: "Brand Pulse · About a minute",
    heading: "Something feels off with your brand?",
    body: "Five vital signs, one clear next step. Free, no sign up.",
    button: "Take the Brand Pulse",
  },
  planner: {
    tag: "Project Planner · Two minutes",
    heading: "Know what you need?",
    body: "Turn it into a first phase brief with starting prices, before you share any details.",
    question: "What are you looking to create or improve?",
    button: "Plan Your Project",
  },
};

// The planner services offered as chips, with their planner codes.
const PLANNER_CHIPS = [
  { code: "identity", label: "Brand identity" },
  { code: "website", label: "Website" },
  { code: "photo", label: "Photography" },
  { code: "video", label: "Video" },
  { code: "packaging", label: "Packaging" },
] as const;

// Brand Pulse: the question about when the brand was last professionally updated.
const PULSE_QUESTION = "updated";
const pulseOptions = Object.entries(QUESTIONS[PULSE_QUESTION].options).map(([id, o]) => ({ id, label: o.label }));

// The full name keeps the visible words, so voice control users can say what they see.
const pulseChipName = (id: string, label: string) =>
  `Start Brand Pulse: ${id === "never" ? "" : "updated "}${label.charAt(0).toLowerCase()}${label.slice(1)}`;

export const pulseChipHref = (id: string) => `/brand-pulse?q=${PULSE_QUESTION}:${id}&from=home_band_chip`;
export const plannerChipHref = (code: string) => `/start?service=${code}&from=home_band_chip&begin=1`;
export const PULSE_BUTTON_HREF = "/brand-pulse?from=home_band_button";
export const PLANNER_BUTTON_HREF = "/start?from=home_band_button";

function ColumnText({ tag, heading, body }: { tag: string; heading: string; body: string }) {
  return (
    <>
      <p className="tb-tag">{tag}</p>
      <h3 className="tb-col-heading">{heading}</h3>
      <p className="tb-body">{body}</p>
    </>
  );
}

function Chips({ labelledBy, chips }: { labelledBy: string; chips: { href: string; label: string; name: string; tool: string; value: string }[] }) {
  return (
    <ul className="tb-chips" aria-labelledby={labelledBy}>
      {chips.map((c) => (
        <li key={c.href}>
          <Link href={c.href} className="tb-chip" aria-label={c.name} data-tb-tool={c.tool} data-tb-kind="chip" data-tb-value={c.value}>
            {c.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ToolButton({ href, tool, children }: { href: string; tool: string; children: string }) {
  return (
    <div className="tb-action">
      <Button href={href} variant="primary-inverted" className="tb-button" data-cursor="link" data-tb-tool={tool} data-tb-kind="button" data-tb-value="">
        {children} <span className="tb-arrow" aria-hidden="true">&rarr;</span>
      </Button>
    </div>
  );
}

export function PulseColumn() {
  return (
    <>
      <ColumnText {...TOOL_BAND.pulse} />
      <div className="tb-visual">
        {/* Drawn at 1:1 pixels: the flat line runs on and the column clips it, at any width. */}
        <svg className="tb-pulse" aria-hidden="true" focusable="false">
          <path className="tb-pulse-path" d="M0 24 H150 L160 24 L170 4 L180 36 L188 14 L194 24 H4000" />
        </svg>
        <ul className="tb-signs">
          {VITALS.map((v) => (
            <li key={v.id} className="tb-sign">{v.label}</li>
          ))}
        </ul>
      </div>
      <p id="tb-q-pulse" className="tb-question">{QUESTIONS[PULSE_QUESTION].text}</p>
      <Chips
        labelledBy="tb-q-pulse"
        chips={pulseOptions.map((o) => ({ href: pulseChipHref(o.id), label: o.label, name: pulseChipName(o.id, o.label), tool: "brand_pulse", value: o.id }))}
      />
      <ToolButton href={PULSE_BUTTON_HREF} tool="brand_pulse">{TOOL_BAND.pulse.button}</ToolButton>
    </>
  );
}

export function PlannerColumn() {
  return (
    <>
      <ColumnText {...TOOL_BAND.planner} />
      <div className="tb-visual">
        <div className="tb-brief" aria-hidden="true">
          <span className="tb-brief-line" />
          <span className="tb-brief-line" />
          <span className="tb-brief-line" />
        </div>
      </div>
      <p id="tb-q-planner" className="tb-question">{TOOL_BAND.planner.question}</p>
      <Chips
        labelledBy="tb-q-planner"
        chips={PLANNER_CHIPS.map((c) => ({ href: plannerChipHref(c.code), label: c.label, name: `Plan a ${c.label.toLowerCase()} project`, tool: "project_planner", value: c.code }))}
      />
      <ToolButton href={PLANNER_BUTTON_HREF} tool="project_planner">{TOOL_BAND.planner.button}</ToolButton>
    </>
  );
}

export default function ToolBand() {
  return (
    <section className="tb" aria-labelledby="tb-heading">
      <div className="tb-header">
        <p className="editorial-label tb-label">{TOOL_BAND.label}</p>
        <h2 id="tb-heading" className="tb-heading">{TOOL_BAND.heading}</h2>
      </div>
      <ToolBandSwitch pulse={<PulseColumn />} planner={<PlannerColumn />} />
    </section>
  );
}
