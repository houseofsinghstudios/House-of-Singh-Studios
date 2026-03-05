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
      {/* ─── SECTION 1: THE OPENING ─── */}
      <section className="hero-section">
        <div className="hero-center-line" />

        <div className="hero-crest">
          <span className="hero-crest-text">HOUSE OF SINGH</span>
        </div>

        <span className="hero-label">({HERO.label})</span>

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

        <span className="hero-scroll">(Scroll)</span>
      </section>

      {/* ─── SECTION 2: THE PROOF ─── */}
      <section className="work-section">
        <div className="work-section-header">
          <p className="editorial-label">(Selected Work)</p>
        </div>

        {PROJECTS.map((project, i) => (
          <Link
            key={project.name}
            href={project.href}
            className="work-card"
          >
            <div className="work-card-text">
              <div className="work-ghost-number">0{i + 1}</div>
              <h3 className="work-card-name">{project.name}</h3>
              <p className="work-card-meta">{project.label}</p>
              <p className="work-card-desc">{project.sentence}</p>
              <span className="link-arrow" style={{ marginTop: 24 }}>
                View Project
              </span>
            </div>
            <div className="work-card-image" />
          </Link>
        ))}

        <div className="work-view-all">
          <Link href="/work" className="link-arrow">
            View All Projects
          </Link>
        </div>
      </section>

      {/* ─── SECTION 3: THE ARGUMENT ─── */}
      <section className="argument-section">
        <p className="editorial-label">({ARGUMENT.label})</p>
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

      {/* ─── SECTION 4: THE METHOD ─── */}
      <section className="services-section">
        <div className="services-section-header">
          <p className="editorial-label">(Services)</p>
        </div>

        {SERVICES.map((service, i) => (
          <Link
            key={service.title}
            href={service.href}
            className="service-block"
            style={{ background: service.tint }}
          >
            <div className="service-text">
              <div className="service-ghost-number">0{i + 1}</div>
              <h3 className="service-name">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <p className="service-deliverables">{service.deliverables}</p>
              <span className="link-arrow" style={{ marginTop: 28 }}>
                Learn More
              </span>
            </div>
            <div className="service-image" />
          </Link>
        ))}
      </section>

      {/* ─── SECTION 5: THE EVIDENCE ─── */}
      <section className="evidence-section">
        <div className="evidence-section-header">
          <p className="editorial-label">(Evidence)</p>
        </div>

        <div className="stats-row">
          {STATS.targets.map((value, i) => (
            <div key={i} className="stat-cell">
              <span className="stat-number">{value}+</span>
              <span className="stat-label">{STATS.labels[i]}</span>
            </div>
          ))}
        </div>

        <div className="testimonials-row">
          {TESTIMONIALS.map((t, i) => (
            <blockquote key={i} className="testimonial-card">
              <div className="testimonial-quote-mark">&ldquo;</div>
              <p className="testimonial-text">{t.quote}</p>
              <cite className="testimonial-author">
                {t.author.toUpperCase()}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ─── SECTION 6: THE INVITATION ─── */}
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
