"use client";
// "How did you hear about us?" and, for a recommendation or a partner, "Who recommended us?".
// Client component: the second field opens from the first answer. Used by the contact form, which
// reads the named fields from FormData, and the Project Planner, which listens through onChange.
// While closed the second field is inert and disabled, so it is never focused or sent.

import { useState } from "react";
import { asksWhoRecommended, FORM_COPY, HEAR_ABOUT, REFERRAL_LIMITS } from "@/lib/partners/forms";

interface Props {
  idPrefix: string;
  fieldClass?: string;
  disabled?: boolean;
  onChange?: (value: { hearAbout: string; recommendedBy: string }) => void;
}

export default function HearAboutFields({ idPrefix, fieldClass, disabled, onChange }: Props) {
  const [hearAbout, setHearAbout] = useState("");
  const [recommendedBy, setRecommendedBy] = useState("");
  const open = asksWhoRecommended(hearAbout);

  function update(nextHear: string, nextBy: string) {
    setHearAbout(nextHear);
    setRecommendedBy(nextBy);
    onChange?.({ hearAbout: nextHear, recommendedBy: asksWhoRecommended(nextHear) ? nextBy.trim() : "" });
  }

  return (
    <div className={fieldClass}>
      <label htmlFor={`${idPrefix}-hear`} className="contact-label">
        {FORM_COPY.hearAbout} {FORM_COPY.optional}
      </label>
      <select
        id={`${idPrefix}-hear`}
        name="hearAbout"
        className="contact-input"
        value={hearAbout}
        onChange={(e) => update(e.target.value, recommendedBy)}
        disabled={disabled}
      >
        <option value="">{FORM_COPY.hearAboutPlaceholder}</option>
        {HEAR_ABOUT.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <span className="focus-line" />
      <div className={`hear-reveal${open ? " is-open" : ""}`} inert={!open}>
        <div className="hear-reveal-inner">
          <label htmlFor={`${idPrefix}-recommended`} className="contact-label">
            {FORM_COPY.recommendedBy} {FORM_COPY.optional}
          </label>
          <input
            id={`${idPrefix}-recommended`}
            type="text"
            name="recommendedBy"
            className="contact-input"
            maxLength={REFERRAL_LIMITS.recommendedBy}
            autoComplete="off"
            value={recommendedBy}
            onChange={(e) => update(hearAbout, e.target.value)}
            disabled={disabled || !open}
          />
          <span className="focus-line" />
        </div>
      </div>
    </div>
  );
}
