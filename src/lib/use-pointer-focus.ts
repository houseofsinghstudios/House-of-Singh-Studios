"use client";

import { useEffect, type RefObject } from "react";

// Browsers match :focus-visible on text fields and selects even after a mouse click. The keyboard
// focus style is for keyboard users, so a pointer press sets data-pointer-focus on the form, which
// holds that style back until the next Tab. The contact form does the same in ContactClient.
export function usePointerFocusFlag(formRef: RefObject<HTMLFormElement | null>, rerun?: unknown) {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onPointer = () => form.setAttribute("data-pointer-focus", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") form.removeAttribute("data-pointer-focus");
    };
    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [formRef, rerun]);
}
