'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'next-view-transitions'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const SLIDERS = [
  { name: 'Brand Clarity', low: 'Unclear', high: 'Crystal clear' },
  { name: 'Visual Consistency', low: 'Fragmented', high: 'Unified' },
  { name: 'Digital Presence', low: 'Underperforming', high: 'Converting' },
]

function getStatus(value: number): string {
  if (value <= 3) return 'Needs work'
  if (value <= 6) return 'Getting there'
  return 'Strong'
}

function getRecommendation(values: number[]): {
  title: string
  desc: string
  link: string
  label: string
} | null {
  const [brand, visual, digital] = values
  const avg = (brand + visual + digital) / 3

  if (avg <= 3) {
    return {
      title: 'Start with Brand Identity',
      desc: 'Your brand needs foundational work. A complete visual identity system will give every other effort a solid base to build on.',
      link: '/services/brand-identity',
      label: 'Explore Brand Identity',
    }
  }
  if (brand <= 4 && visual <= 4) {
    return {
      title: 'Start with Creative Strategy',
      desc: 'You need the strategic layer before the visual work. Positioning, audience clarity, and a framework your team can follow.',
      link: '/services/creative-strategy',
      label: 'Explore Creative Strategy',
    }
  }
  if (digital <= 4) {
    return {
      title: 'Start with Digital Design',
      desc: 'Your brand has potential but your digital presence is not converting. A redesign focused on commercial outcomes will change that.',
      link: '/services/digital-design',
      label: 'Explore Digital Design',
    }
  }
  if (visual <= 5) {
    return {
      title: 'Start with Visual Media',
      desc: 'Your strategy is sound but your content is inconsistent. Directed photography, video, and content systems will close the gap.',
      link: '/services/visual-media',
      label: 'Explore Visual Media',
    }
  }
  return null
}

export default function SliderDiagnostic({ isOpen, onClose }: Props) {
  const [values, setValues] = useState([5, 5, 5])
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback((index: number, val: number) => {
    setValues((prev) => {
      const next = [...prev]
      next[index] = val
      return next
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const recommendation = getRecommendation(values)

  return (
    <div
      className="diag-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="diag-modal">
        <button className="diag-close" onClick={onClose}>
          Close
        </button>
        <p className="diag-label">(Brand Diagnostic)</p>
        <h2 className="diag-heading">Where does your brand stand?</h2>
        <p className="diag-sub">
          Rate each area honestly. We will recommend where to start.
        </p>

        <div className="diag-sliders">
          {SLIDERS.map((slider, i) => (
            <div key={slider.name} className="diag-slider-col">
              <div className="diag-slider-top">
                <span className="diag-slider-num">{values[i]}</span>
                <span className="diag-slider-status">
                  {getStatus(values[i])}
                </span>
              </div>
              <p className="diag-slider-name">{slider.name}</p>
              <input
                type="range"
                min={1}
                max={10}
                value={values[i]}
                onChange={(e) => handleChange(i, Number(e.target.value))}
                className="sld-range"
              />
            </div>
          ))}
        </div>

        <div className="diag-result">
          {recommendation ? (
            <>
              <h3 className="diag-result-title">{recommendation.title}</h3>
              <p className="diag-result-desc">{recommendation.desc}</p>
              <Link
                href={recommendation.link}
                className="diag-result-cta"
                onClick={onClose}
              >
                {recommendation.label}
              </Link>
            </>
          ) : (
            <p className="diag-result-empty diag-result-desc">
              Your brand is in a strong position. If you want to push further,{' '}
              <Link href="/contact" onClick={onClose} style={{ color: 'inherit', textDecoration: 'underline' }}>
                start a conversation
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
