// Whether a CSS media query matches, kept in step with the browser through useSyncExternalStore.
// The server render (and so the first, hydrating client render) answers false, then the real value
// follows straight away, as the effect-based checks this replaces did, without a state update
// inside an effect.
import { useCallback, useSyncExternalStore } from "react";

const notOnServer = () => false;

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );
  const matches = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, matches, notOnServer);
}
