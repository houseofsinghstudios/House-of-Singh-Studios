// The header's scroll state on the page: whether it has scrolled (the line under the bar) and
// whether it is hidden (slid up). Runs src/lib/header-scroll.ts once per animation frame while the
// page scrolls. While locked the header is never hidden. "reveal" shows it at once: for keyboard
// focus moving into it, and when the drawer closes.
import { useCallback, useEffect, useRef, useState } from "react";
import { INITIAL_SCROLL, isScrolled, nextHeaderScroll } from "@/lib/header-scroll";

export function useHeaderScroll(locked: boolean) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const state = useRef(INITIAL_SCROLL);
  const lockedRef = useRef(locked);

  // The scroll handler reads the lock from here, so a change needs no new listener.
  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      state.current = nextHeaderScroll(state.current, y, lockedRef.current);
      setScrolled(isScrolled(y));
      setHidden(state.current.hidden);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    state.current = { ...INITIAL_SCROLL, lastY: window.scrollY, anchorY: window.scrollY };
    // The first reading (a page opened part way down) waits for the first frame, like every other.
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const reveal = useCallback(() => {
    state.current = { ...state.current, hidden: false };
    setHidden(false);
  }, []);

  // A lock (the drawer open, reduced motion) shows the header at once, whatever the scroll said.
  return { scrolled, hidden: hidden && !locked, reveal };
}
