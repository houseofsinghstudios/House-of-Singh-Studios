'use client'

import { useState, useCallback } from 'react'
import SliderDiagnostic from './SliderDiagnostic'

export default function DiagnosticTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <div
        className="diag-wrap"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setIsOpen(true) }}
      >
        <div className="diag-q-row">
          <span className="diag-breathe" />
          <span className="diag-q-text">Not sure where to start?</span>
        </div>
        <div className="diag-ticker">
          <div className="diag-track">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="diag-tick-item">
                <span className="diag-tick-dot" />
                <span className="diag-tick-text">Take the brand diagnostic</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <SliderDiagnostic isOpen={isOpen} onClose={handleClose} />
    </>
  )
}
