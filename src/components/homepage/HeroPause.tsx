"use client";
// A client component: the button that stops and restarts what moves in the hero, the rotating images
// and the word that follows them. WCAG 2.2.2 (Pause, Stop, Hide) asks for one on anything that moves
// on its own for more than five seconds. Hidden with reduced motion, where nothing moves.
// Its name says what it will do and matches its icon: "Pause the animation" with the pause bars,
// "Play the animation" with the play triangle. No aria-pressed: a name that changes and a pressed
// state together read as a contradiction ("Play the animation, pressed").

import { track } from "@/lib/analytics";

export default function HeroPause({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="hero-pause needs-js"
      aria-label={paused ? "Play the animation" : "Pause the animation"}
      onClick={() => {
        track("hero_pause_toggle", { state: paused ? "playing" : "paused" });
        onToggle();
      }}
    >
      <span className={paused ? "hero-pause-play" : "hero-pause-bars"} aria-hidden="true" />
    </button>
  );
}
