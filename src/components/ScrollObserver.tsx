"use client";

// Client component: it watches the page in the browser. The shared reveal (globals.css): each reveal
// element gets .in-view once, at once when it is already on screen, as it enters for the rest, and for
// elements added later (a new page, a filter). The class is never removed, so nothing reverses on the
// way back up. The inline script in (site)/layout.tsx arms the hidden starting state; window.__hosReveal
// tells that script's safety timer this observer is running.
import { useEffect } from "react";
import { onScreen, REVEAL_SELECTOR } from "@/lib/reveal";

declare global {
  interface Window {
    __hosReveal?: boolean;
  }
}

const reveal = (el: Element) => el.classList.add("in-view");

export default function ScrollObserver() {
  useEffect(() => {
    window.__hosReveal = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      // An element entering from below reveals once its top is a tenth of the screen in.
      { rootMargin: "0px 0px -10% 0px" },
    );
    const take = (el: Element) => {
      if (el.classList.contains("in-view")) return;
      if (onScreen(el.getBoundingClientRect(), window.innerHeight)) reveal(el);
      else io.observe(el);
    };
    const scan = (root: Element | Document) => {
      if (root instanceof Element && root.matches(REVEAL_SELECTOR)) take(root);
      root.querySelectorAll(REVEAL_SELECTOR).forEach(take);
    };
    scan(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && scan(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
