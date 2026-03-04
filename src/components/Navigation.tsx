import Link from 'next/link'

export default function Navigation() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          House of Singh Studios
        </Link>

        <nav className="nav-links">
          <Link href="/work">Work</Link>
          <Link href="/services">Services</Link>
          <Link href="/about">About</Link>
          <Link href="/ai">AI Lab</Link>
          <Link href="/insights">Insights</Link>
        </nav>

        <Link href="/contact" className="nav-cta btn-secondary"
              style={{ padding: '10px 24px', fontSize: '12px' }}>
          Start a Project
        </Link>

        {/* Mobile hamburger placeholder */}
        <button className="nav-hamburger" aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
