"use client";
// A client component: the two choices in "Work for [your kind of business], in [every discipline]."
// open and close their lists from the keyboard as well as the pointer. Choice is shared with the
// homepage's Selected work ("See our work for [your kind of business].").
//
// Each choice is a span with role="button", not a <button>: a button cannot break across lines, and
// at 76px "your kind of business" has to wrap with the sentence. Its words carry one continuous 2px
// underline (a bottom border, cloned on every line), and the chevron is glued to the last word so it
// never wraps alone. Enter and Space open it; Escape (WorkIndex) closes it and comes back here.

export type ListId = "business" | "discipline";

interface ChoiceProps {
  words: string;
  open: boolean;
  controls: string;
  onToggle: () => void;
  choiceRef: React.RefObject<HTMLSpanElement | null>;
}

export function Choice({ words, open, controls, onToggle, choiceRef }: ChoiceProps) {
  const parts = words.split(" ");
  const last = parts.pop();
  const lead = parts.join(" ");
  return (
    <span
      ref={choiceRef}
      role="button"
      tabIndex={0}
      className="wi-choice"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        onToggle();
      }}
    >
      <span className="wi-choice-words">
        {lead && `${lead} `}
        <span className="wi-nowrap">
          {last}
          <span className="wi-chev" aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}

interface Props {
  words: { business: string; discipline: string };
  open: ListId | null;
  onToggle: (list: ListId) => void;
  refs: Record<ListId, React.RefObject<HTMLSpanElement | null>>;
  ids: Record<ListId, string>;
}

export default function WorkSentence({ words, open, onToggle, refs, ids }: Props) {
  return (
    <p className="wi-sentence">
      Work for{" "}
      <Choice words={words.business} open={open === "business"} controls={ids.business} onToggle={() => onToggle("business")} choiceRef={refs.business} />
      ,<br className="wi-br" /> in{" "}
      <Choice words={words.discipline} open={open === "discipline"} controls={ids.discipline} onToggle={() => onToggle("discipline")} choiceRef={refs.discipline} />.
    </p>
  );
}
