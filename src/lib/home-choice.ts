// The business type chosen in the homepage (01) Selected work, shared with (04) Start, which shows it on
// the call brief. Page state only: it lives in memory for this visit to the homepage, never in the
// address or in storage. Selected work sets it (and clears it when it leaves the page); Start reads it.
import { useSyncExternalStore } from "react";
import type { BusinessTypeId } from "@/lib/work-index";

let sector: BusinessTypeId | undefined;
const listeners = new Set<() => void>();

export function setHomeSector(next: BusinessTypeId | undefined) {
  if (next === sector) return;
  sector = next;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

// Nothing is chosen on the server, so the first render always matches.
export function useHomeSector(): BusinessTypeId | undefined {
  return useSyncExternalStore(subscribe, () => sector, () => undefined);
}
