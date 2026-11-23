'use client'
// A client component: Copy link writes to the clipboard and says so. The button is named by its own
// words (no aria-label, so "Copied" never contradicts its name; site audit S-14), and a polite live
// region announces "Link copied." for screen readers.

import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  return (
    <div className="share-buttons">
      <span className="share-label">Share</span>
      <button
        type="button"
        className="share-btn needs-js"
        onClick={handleCopy}
      >
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied.' : ''}
      </span>
      <a
        className="share-btn"
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        X
      </a>
      <a
        className="share-btn"
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </a>
    </div>
  )
}
