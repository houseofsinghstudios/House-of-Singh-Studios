import Link from "next/link";
import {
  HERO,
  ARGUMENT,
  STATS,
  SERVICES,
  PROJECTS,
  TESTIMONIALS,
  CTA,
} from "@/lib/constants/homepage-data";

export default function Home() {
  return (
    <>
      {/* ─── SECTION 1: THE OPENING (Hero) ─── */}
      <section className="hero-section">
        {/* Center line */}
        <div className="hero-center-line" />

        {/* Crest top left */}
        <div className="hero-crest">
          <span className="hero-crest-text">HOUSE OF SINGH</span>
        </div>

        {/* Editorial label */}
        <span className="hero-label">({HERO.label})</span>

        {/* The split headline */}
        <div className="hero-headline-wrapper">
          <div className="hero-headline">
            <div className="hero-line">
              <span className="hero-left">{HERO.headline[0].left}</span>
              <span className="hero-right">{HERO.headline[0].right}</span>
            </div>
            <div className="hero-line">
              <span className="hero-left">{HERO.headline[1].left}</span>
              <span className="hero-right">{HERO.headline[1].right}</span>
            </div>
          </div>

          {/* Supporting text BELOW the headline, LEFT aligned */}
          <div className="hero-support">
            <p className="hero-support-text">{HERO.secondary}</p>
            <div className="hero-ctas">
              <Link href={HERO.cta.primary.href} className="btn-primary">
                {HERO.cta.primary.text}
              </Link>
              <Link href={HERO.cta.secondary.href} className="btn-secondary">
                {HERO.cta.secondary.text}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <span className="hero-scroll">(Scroll)</span>
      </section>

      {/* ─── SECTION 2: THE PROOF (Featured Work) ─── */}
      <section className="work-section">
        <div className="work-header">
          <p className="section-label">Selected Work</p>
          <h2 className="section-heading">Projects that speak for themselves.</h2>
        </div>

        <div className="work-grid">
          {PROJECTS.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="work-card"
              style={
                {
                  "--card-bg": project.color,
                  "--card-accent": project.accent,
                } as React.CSSProperties
              }
            >
              <div className="work-card-image" />
              <div className="work-card-info">
                <p className="work-card-label">{project.label}</p>
                <h3 className="work-card-name">{project.name}</h3>
                <p className="work-card-sentence">{project.sentence}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="work-view-all">
          <Link href="/work" className="btn-secondary">
            View All Projects
          </Link>
        </div>
      </section>

      {/* ─── SECTION 3: THE ARGUMENT ─── */}
      <section className="argument-section">
        <p className="section-label">{ARGUMENT.label}</p>
        <h2 className="argument-heading">{ARGUMENT.heading}</h2>
        <p className="argument-snap">{ARGUMENT.snap}</p>

        <div className="argument-steps">
          {ARGUMENT.steps.map((step, i) => (
            <div key={i} className="argument-step">
              <span className="argument-step-number">0{i + 1}</span>
              <p className="argument-step-text">
                <strong>{step.bold}</strong> {step.rest}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 4: THE METHOD (Services) ─── */}
      <section className="services-section">
        <div className="services-header">
          <p className="section-label">Capabilities</p>
          <h2 className="section-heading">Four capabilities. One studio.</h2>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="service-block"
              style={{ background: service.tint }}
            >
              <div className="service-block-inner">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-sentence">{service.sentence}</p>
                <p className="service-description">{service.description}</p>
                <p className="service-deliverables-label">Deliverables</p>
                <p className="service-deliverables">{service.deliverables}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── SECTION 5: THE EVIDENCE (Stats + Testimonials) ─── */}
      <section className="evidence-section">
        <div className="evidence-header">
          <p className="section-label">Results</p>
          <h2 className="section-heading">The work speaks. The numbers confirm.</h2>
        </div>

        <div className="stats-row">
          {STATS.targets.map((value, i) => (
            <div key={i} className="stat-item">
              <span className="stat-number">{value}+</span>
              <span className="stat-label">{STATS.labels[i]}</span>
            </div>
          ))}
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <blockquote key={i} className="testimonial-card">
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <cite className="testimonial-author">{t.author}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ─── SECTION 6: THE INVITATION (CTA) ─── */}
      <section className="cta-section">
        <h2 className="cta-heading">{CTA.heading}</h2>
        <p className="cta-subtext">{CTA.subtext}</p>
        <div className="cta-buttons">
          <Link href={CTA.buttons.primary.href} className="btn-primary">
            {CTA.buttons.primary.text}
          </Link>
          <Link href={CTA.buttons.secondary.href} className="btn-secondary">
            {CTA.buttons.secondary.text}
          </Link>
        </div>
      </section>
    </>
  );
}
