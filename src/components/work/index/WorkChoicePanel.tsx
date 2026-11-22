"use client";
// A client component: the list a choice opens (business types or disciplines), each option with the
// number of projects it would show (combined with the other choice) and up to three of their images.
// An option with nothing to show is greyed and cannot be chosen. The list opens by height, pushing the
// page down; it stays in the page (inert) while closed so the choice's aria-controls always points
// at it.

import { useState } from "react";
import Image from "next/image";
import IntentLink from "@/components/IntentLink";
import type { WorkImage } from "./types";

export interface ChoiceOption {
  key: string;
  label: string;
  count: number;
  thumbs: WorkImage[];
  current: boolean;
  onChoose: () => void;
}

interface Props {
  id: string;
  open: boolean;
  label: string;
  options: ChoiceOption[];
  // The business list ends with a way to tell us about a business that is not listed.
  withOther?: boolean;
  onClose: () => void;
}

function Thumbs({ images }: { images: WorkImage[] }) {
  if (images.length === 0) return null;
  return (
    <span className="wi-option-thumbs" aria-hidden="true">
      {images.map((image) => (
        <Image key={image.src} src={image.src} alt="" width={image.width} height={image.height} sizes="60px" loading="lazy" className="wi-option-thumb" />
      ))}
    </span>
  );
}

function Option({ option, withThumbs }: { option: ChoiceOption; withThumbs: boolean }) {
  const disabled = option.count === 0;
  return (
    <li>
      <button
        type="button"
        className="wi-option"
        aria-disabled={disabled || undefined}
        aria-current={option.current || undefined}
        onClick={() => !disabled && option.onChoose()}
      >
        <span className="wi-option-label">{option.label}</span>
        <span className="wi-option-side">
          {withThumbs && <Thumbs images={option.thumbs} />}
          <span className="wi-option-count">
            <span aria-hidden="true">{String(option.count).padStart(2, "0")}</span>
            <span className="sr-only">{`, ${option.count} ${option.count === 1 ? "project" : "projects"}`}</span>
          </span>
        </span>
      </button>
    </li>
  );
}

export default function WorkChoicePanel({ id, open, label, options, withOther, onClose }: Props) {
  // The thumbnails load once the list has first opened, never with the page.
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);
  return (
    <div id={id} className="wi-panel" data-open={open} inert={!open}>
      <div className="wi-panel-clip">
        <div className="wi-panel-body">
          <div className="wi-panel-head">
            <p className="editorial-label">{label}</p>
            <button type="button" className="wi-close" onClick={onClose}>
              Close
            </button>
          </div>
          <ul className="wi-options">
            {options.map((option) => (
              <Option key={option.key} option={option} withThumbs={opened} />
            ))}
            {withOther && (
              <li>
                <IntentLink href="/start" className="wi-option wi-option--other">
                  <span className="wi-option-label">Something else? Tell us about yours</span>
                  <span className="editorial-label">Plan your project</span>
                </IntentLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
