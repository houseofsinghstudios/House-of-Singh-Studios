// The founder's RGD credential, linked to his member profile. It takes on the surrounding text
// exactly; only an underline on hover and the keyboard focus outline show it is a link.
// RgdText links each standalone "RGD" in a plain string. Never use either inside another link.
import { Fragment } from "react";
import { FOUNDER_PROFILES } from "@/lib/constants/profiles";
import { splitRgd } from "@/lib/rgd";

export default function RgdLink() {
  return (
    <a
      href={FOUNDER_PROFILES.rgd}
      target="_blank"
      rel="noopener"
      className="rgd-link"
      aria-label="Maninder Singh's RGD member profile (opens in a new tab)"
    >
      RGD
    </a>
  );
}

export function RgdText({ text }: { text: string }) {
  return (
    <>
      {splitRgd(text).map((part, i) => (part.rgd ? <RgdLink key={i} /> : <Fragment key={i}>{part.text}</Fragment>))}
    </>
  );
}
