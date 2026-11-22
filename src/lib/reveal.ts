// The shared reveal (globals.css, "The shared reveal"): which elements it covers and the inline script
// that arms it. Pure strings, so the rules are tested without a browser.

// Every element the reveal hides until it has been seen once. ScrollObserver adds .in-view to each.
export const REVEAL_SELECTOR = [
  ".css-reveal",
  ".scroll-reveal-up",
  ".scroll-clip-reveal",
  ".about-process-step",
  ".founder-photo-reveal",
  ".reveal-clip",
  ".reveal-stagger-parent",
  ".reveal-text",
  ".ins-card",
  ".ins-featured",
  ".about-team-card",
].join(", ");

// How long the page waits for ScrollObserver before it gives up and shows everything at once.
export const REVEAL_SAFETY_MS = 4000;

// Runs in the page before it paints (src/app/(site)/layout.tsx), so it only ever runs with JavaScript:
// without it nothing is armed and every element shows at full strength. It sets two flags on <html>:
// data-js, always (what needs JavaScript to work, such as the What we do accordion, collapses only under
// it), and data-reveal, the shared reveal's hidden starting states. If ScrollObserver has not started
// within REVEAL_SAFETY_MS (a script failed to load), data-reveal is removed and everything shows;
// data-js stays, so nothing that already collapsed jumps open.
// Inline scripts are allowed by the site's Content Security Policy (script-src 'unsafe-inline').
export const REVEAL_ARM_SCRIPT =
  "(function(){try{var d=document.documentElement;d.setAttribute('data-js','');" +
  "if(!('IntersectionObserver' in window))return;" +
  "d.setAttribute('data-reveal','');setTimeout(function(){if(!window.__hosReveal)d.removeAttribute('data-reveal')}," +
  REVEAL_SAFETY_MS +
  ")}catch(e){}})();";

// On screen now: any part of the element inside the viewport.
export const onScreen = (rect: { top: number; bottom: number; width: number; height: number }, viewportHeight: number) =>
  rect.width > 0 && rect.height > 0 && rect.top < viewportHeight && rect.bottom > 0;
