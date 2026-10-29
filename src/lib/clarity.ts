// Microsoft Clarity follows analytics consent the way Google Analytics does: nothing is loaded or sent
// until consent is granted. Granted: the official queue stub, the consent signal, then the tag, once
// per page. Withdrawn: Clarity is stopped (src/lib/consent.ts has already sent the denied signal and
// removed its cookies). Granted again on the same page: it starts again. Unit tested without a browser.

import type { ConsentState } from "@/lib/consent";

export type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
export type ClarityWindow = { clarity?: ClarityFn; __hosClarity?: "running" | "stopped" };

export function followClarity(state: ConsentState, w: ClarityWindow, loadTag: () => void) {
  if (state !== "granted") {
    if (w.__hosClarity === "running") {
      w.clarity?.("stop");
      w.__hosClarity = "stopped";
    }
    return;
  }
  if (w.__hosClarity === "running") return;
  if (w.__hosClarity === "stopped") {
    w.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
    w.clarity?.("start");
    w.__hosClarity = "running";
    return;
  }
  // The official snippet's queue stub: calls made before the tag loads are kept and replayed.
  w.clarity =
    w.clarity ||
    (function (...args: unknown[]) {
      (w.clarity!.q = w.clarity!.q || []).push(args);
    } as ClarityFn);
  w.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });
  loadTag();
  w.__hosClarity = "running";
}
