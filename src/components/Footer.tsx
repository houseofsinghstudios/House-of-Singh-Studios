import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <p className="footer-studio-name">House of Singh Studios</p>
          <p className="footer-tagline">
            Design studio. AI powered. Brand focused.
          </p>
        </div>

        <div className="footer-col">
          <p className="footer-col-label">Pages</p>
          <nav className="footer-col-links">
            <Link href="/work">Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/ai">AI Lab</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>

        <div className="footer-col">
          <p className="footer-col-label">Services</p>
          <nav className="footer-col-links">
            <Link href="/services/brand-identity">Brand Identity</Link>
            <Link href="/services/visual-media">Visual Media</Link>
            <Link href="/services/digital-design">Digital Design</Link>
            <Link href="/services/creative-strategy">Creative Strategy</Link>
          </nav>
        </div>

        <div className="footer-col">
          <p className="footer-col-label">Connect</p>
          <nav className="footer-col-links">
            <a href="mailto:hello@houseofsingh.com">Email</a>
            <a href="https://instagram.com/houseofsingh" target="_blank" rel="noopener">Instagram</a>
            <a href="https://linkedin.com/company/houseofsingh" target="_blank" rel="noopener">LinkedIn</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2025 House of Singh Studios Inc.</span>
        <span>Toronto, Canada</span>
      </div>
    </footer>
  )
}
