"use client";
// A client component: the button that stops and restarts what moves in the hero, the rotating images
// and the cycling word together. WCAG 2.2.2 (Pause, Stop, Hide) asks for one on anything that moves
// on its own for more than five seconds. Hidden with reduced motion, where nothing moves.

import { track } from "@/lib/analytics";

export default function HeroPause({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="hero-pause"
      aria-pressed={paused}
      aria-label={paused ? "Play the project images" : "Pause the project images"}
      onClick={() => {
        track("hero_pause_toggle", { state: paused ? "playing" : "paused" });
        onToggle();
      }}
    >
      <span className={paused ? "hero-pause-play" : "hero-pause-bars"} aria-hidden="true" />
    </button>
  );
}
