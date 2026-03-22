"use client";

import { useState, useCallback } from "react";
import SliderDiagnostic from "./SliderDiagnostic";

export default function DiagnosticTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        className="diag-trigger"
        onClick={() => setIsOpen(true)}
        data-cursor="link"
      >
        <span className="diag-trigger-dot" />
        Not sure where to start? Take the brand diagnostic
      </button>
      <SliderDiagnostic isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
