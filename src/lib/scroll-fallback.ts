/**
 * Scroll fallback functions.
 * The ScrollObserver component handles all IntersectionObserver-based
 * reveal logic via CSS classes. These functions are kept as no-ops for
 * backward compatibility with components that still call them during
 * mount/unmount.
 */

export function initScrollFallbacks() {
  // No-op: ScrollObserver handles .scroll-reveal-up and .scroll-clip-reveal
}

export function cleanScrollFallbacks() {
  // No-op: ScrollObserver handles cleanup
}
