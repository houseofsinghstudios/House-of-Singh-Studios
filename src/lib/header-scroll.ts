// When the site header hides and shows as the page scrolls. Pure, so the rules are tested without a
// browser; src/lib/use-header-scroll.ts runs it on every scroll frame.
//
// - Always visible near the top of the page.
// - Hides only below HIDE_AFTER, and only once the page has moved down by more than THRESHOLD since
//   the last change of direction, so trackpad and Lenis jitter never flicker it.
// - Shows again on any upward move of more than THRESHOLD.
// - Locked (the phone drawer is open, or the visitor prefers reduced motion): always visible.

export const SCROLLED_AT = 20;
export const HIDE_AFTER = 400;
export const THRESHOLD = 8;

export interface HeaderScroll {
  // The last scroll position seen, and where the current direction of travel began.
  lastY: number;
  anchorY: number;
  direction: "up" | "down" | null;
  hidden: boolean;
}

export const INITIAL_SCROLL: HeaderScroll = { lastY: 0, anchorY: 0, direction: null, hidden: false };

export function nextHeaderScroll(state: HeaderScroll, y: number, locked: boolean): HeaderScroll {
  const delta = y - state.lastY;
  let { anchorY, direction } = state;
  if (delta > 0 && direction !== "down") {
    direction = "down";
    anchorY = state.lastY;
  } else if (delta < 0 && direction !== "up") {
    direction = "up";
    anchorY = state.lastY;
  }

  let hidden = state.hidden;
  if (locked || y <= SCROLLED_AT) hidden = false;
  else if (direction === "down" && y > HIDE_AFTER && y - anchorY > THRESHOLD) hidden = true;
  else if (direction === "up" && anchorY - y > THRESHOLD) hidden = false;

  return { lastY: y, anchorY, direction, hidden };
}

// The 1px line under the header shows once the page has scrolled past SCROLLED_AT.
export const isScrolled = (y: number) => y > SCROLLED_AT;
