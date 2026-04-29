'use client'

import { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

const SLIDER_CONFIG = [
  {
    name: 'Brand Clarity',
    labels: ['Unclear', 'Mostly unclear', 'Mixed', 'Mostly clear', 'Clear'],
  },
  {
    name: 'Visual Consistency',
    labels: ['Inconsistent', 'Mostly inconsistent', 'Mixed', 'Mostly consistent', 'Consistent'],
  },
  {
    name: 'Digital Presence',
    labels: ['Not working', 'Underperforming', 'Average', 'Good', 'Strong'],
  },
]

const RESULTS: Record<string, { title: string; desc: string; href: string; cta: string; external?: boolean }> = {
  brand: {
    title: 'Start with Brand Identity',
    desc: 'Your brand foundation needs work. A complete visual identity system will give your business the credibility it deserves.',
    href: '/services/brand-identity',
    cta: 'Explore Brand Identity',
  },
  media: {
    title: 'Start with Visual Media',
    desc: 'Your strategy is sound but your content is inconsistent. Directed photography, video, and content systems will close the gap.',
    href: '/services/visual-media',
    cta: 'Explore Visual Media',
  },
  digital: {
    title: 'Start with Digital Design',
    desc: 'Your brand is clear but your digital presence is not converting. A redesigned experience will turn visitors into conversations.',
    href: '/services/digital-design',
    cta: 'Explore Digital Design',
  },
  strategy: {
    title: 'Start with Creative Strategy',
    desc: 'Your outputs look different every time because there is no system. A strategic framework will align your entire team.',
    href: '/services/creative-strategy',
    cta: 'Explore Creative Strategy',
  },
  overhaul: {
    title: 'Your brand needs a comprehensive overhaul.',
    desc: 'Multiple areas need attention. Start with a discovery call so we can scope the right sequence for your business.',
    href: 'https://cal.com/houseofsinghstudios/hr',
    cta: 'Book a Discovery Call',
    external: true,
  },
  healthy: {
    title: 'Your brand is in good shape.',
    desc: 'If something still feels off, book a discovery call. Sometimes the gap is not visible from inside the business.',
    href: 'https://cal.com/houseofsinghstudios/hr',
    cta: 'Book a Discovery Call',
    external: true,
  },
}

function getResult(v1: number, v2: number, v3: number): string {
  const low1 = v1 <= 2, low2 = v2 <= 2, low3 = v3 <= 2
  const count = [low1, low2, low3].filter(Boolean).length
  if (count >= 3) return 'overhaul'
  if (low1 && low2) return 'brand'
  if (low1 && low3) return 'brand'
  if (low2 && low3) return 'strategy'
  if (low1) return 'brand'
  if (low2) return v1 <= 3 ? 'media' : 'digital'
  if (low3) return 'strategy'
  return 'healthy'
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SliderDiagnostic({ isOpen, onClose }: Props) {
  const [values, setValues] = useState([3, 3, 3])
  const [touched, setTouched] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleSlider = useCallback((index: number, value: number) => {
    setTouched(true)
    setValues(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }, [])

  if (!isOpen || !mounted) return null

  const result = touched ? RESULTS[getResult(values[0], values[1], values[2])] : null

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 999999,
        background: 'rgba(34, 33, 31, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="diag-modal-box"
        style={{
          position: 'relative',
          background: '#F7F6F5',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '48px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            fontSize: '11px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            fontWeight: 500,
            color: '#A9A6A2',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Close
        </button>

        <p style={{
          fontSize: '11px',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.12em',
          color: '#A9A6A2',
          margin: '0 0 12px',
        }}>
          (Brand Diagnostic)
        </p>

        <p style={{
          fontSize: '28px',
          fontWeight: 500,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          color: '#22211F',
          margin: '0 0 8px',
        }}>
          Where does your brand stand?
        </p>

        <p style={{
          fontSize: '14px',
          color: '#5C5B58',
          lineHeight: 1.6,
          margin: '0 0 32px',
        }}>
          Rate each area honestly. We will recommend where to start.
        </p>

        <div
          className="diag-sliders-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
            borderBottom: '1px solid #E5E3E0',
            marginBottom: '32px',
          }}
        >
          {SLIDER_CONFIG.map((slider, i) => (
            <div
              key={i}
              style={{
                padding: '24px',
                borderLeft: i > 0 ? '1px solid #E5E3E0' : 'none',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: '12px',
              }}
            >
              <div>
                <span style={{
                  fontSize: '48px',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: '0.9',
                  color: '#22211F',
                  display: 'block',
                }}>
                  {values[i]}
                </span>
                <span style={{
                  fontSize: '10px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  color: '#A9A6A2',
                }}>
                  {slider.labels[values[i] - 1]}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={values[i]}
                onChange={(e) => handleSlider(i, parseInt(e.target.value))}
                className="diag-range"
              />
              <span style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#22211F',
              }}>
                {slider.name}
              </span>
            </div>
          ))}
        </div>

        {result && (
          <div style={{ padding: '24px 0 0' }}>
            <p style={{
              fontSize: '22px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              color: '#22211F',
              margin: '0 0 8px',
            }}>
              {result.title}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#5C5B58',
              lineHeight: 1.6,
              margin: '0 0 16px',
              maxWidth: '480px',
            }}>
              {result.desc}
            </p>
            {result.external ? (
              <a
                href={result.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  color: '#22211F',
                  textDecoration: 'none',
                  padding: '12px 24px',
                  border: '1px solid #22211F',
                }}
              >
                {result.cta} →
              </a>
            ) : (
              <Link
                href={result.href}
                onClick={onClose}
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  color: '#22211F',
                  textDecoration: 'none',
                  padding: '12px 24px',
                  border: '1px solid #22211F',
                }}
              >
                {result.cta} →
              </Link>
            )}
          </div>
        )}

        {!result && (
          <div style={{ padding: '24px 0 0', textAlign: 'center' as const }}>
            <p style={{ fontSize: '14px', color: '#5C5B58' }}>
              Move the sliders to see your recommendation.
            </p>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
