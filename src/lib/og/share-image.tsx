// Share images (Open Graph and Twitter) for the homepage and the two lead tools, drawn with next/og
// at build time, so all three look like one family.
// Editorial, like the site: Obsidian ground, Mist type, zero radius, generous margins.
// Inter (400 and 500, Latin) is bundled here for these images only; see fonts/OFL.txt.
// CSS variables do not reach next/og, so the palette is repeated from the tokens in CLAUDE.md.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";

export const SHARE_SIZE = { width: 1200, height: 630 };
export const SHARE_CONTENT_TYPE = "image/png";

const OBSIDIAN = "#22211F";
const MIST = "#F7F6F5";
const MIST_MUTED = "rgba(247, 246, 245, 0.5)";
const MIST_BODY = "rgba(247, 246, 245, 0.65)";
const MARGIN = 80;

async function fonts() {
  const dir = join(process.cwd(), "src/lib/og/fonts");
  const [regular, medium] = await Promise.all([readFile(join(dir, "inter-latin-400-normal.woff")), readFile(join(dir, "inter-latin-500-normal.woff"))]);
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: medium, weight: 500 as const, style: "normal" as const },
  ];
}

interface ShareImage {
  label: string;
  heading: string;
  line: string;
  // An optional drawing above the footer line.
  motif?: ReactNode;
  // The footer line, bottom left. Defaults to the studio name.
  footer?: string;
}

export async function shareImage({ label, heading, line, motif, footer = "House of Singh Studios" }: ShareImage) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: OBSIDIAN, color: MIST, fontFamily: "Inter", padding: MARGIN }}>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.12em", color: MIST_MUTED }}>{label}</div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 68, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: 940 }}>{heading}</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 28, lineHeight: 1.4, color: MIST_BODY, maxWidth: 940 }}>{line}</div>
        <div style={{ display: "flex", flexGrow: 1 }} />
        {motif}
        <div style={{ display: "flex", marginTop: 40, fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>{footer}</div>
      </div>
    ),
    { ...SHARE_SIZE, fonts: await fonts() },
  );
}

const CONTENT_WIDTH = SHARE_SIZE.width - MARGIN * 2;

// Brand Pulse: a flat line with one heartbeat, across the width.
export function PulseMotif() {
  return (
    <svg width={CONTENT_WIDTH} height={72} viewBox={`0 0 ${CONTENT_WIDTH} 72`}>
      <path d={`M0 44 H430 L448 44 L466 6 L486 66 L500 26 L512 44 H${CONTENT_WIDTH}`} fill="none" stroke={MIST} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Project Planner: a brief taking shape, three lines of different lengths in an outlined block.
export function BriefMotif() {
  const bar = (width: string) => <div style={{ display: "flex", width, height: 3, background: MIST_MUTED }} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: CONTENT_WIDTH, height: 88, padding: "20px 28px", border: `2px solid ${MIST_MUTED}` }}>
      {bar("70%")}
      {bar("92%")}
      {bar("55%")}
    </div>
  );
}
