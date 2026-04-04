'use client'

import { useState, useCallback } from 'react'
import SliderDiagnostic from './SliderDiagnostic'

export default function DiagnosticTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button className="diag-bar" onClick={() => setIsOpen(true)}>
        <span className="diag-bar-dot" />
        <span className="diag-bar-text">Not sure where to start? Take the brand diagnostic</span>
        <span className="diag-bar-arrow">&rarr;</span>
      </button>
      <SliderDiagnostic isOpen={isOpen} onClose={handleClose} />
    </>
  )
}
