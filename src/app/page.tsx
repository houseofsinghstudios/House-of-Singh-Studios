export default function HomePage() {
  return (
    <>
      {/* ================================== */}
      {/* SECTION 1: THE OPENING (Hero)      */}
      {/* ================================== */}
      <section className="hero">
        <div className="hero-center-line" />

        <span className="editorial-label hero-label">
          (Creative Direction Studio)
        </span>

        <div className="hero-content">
          <div className="hero-headline">
            <div className="hero-line">
              <span className="hero-left">AI can generate</span>
              <span className="hero-right">assets.</span>
            </div>
            <div className="hero-line">
              <span className="hero-left">It cannot build</span>
              <span className="hero-right">a brand.</span>
            </div>
          </div>

          <div className="hero-support">
            <p className="hero-support-text">
              A design studio powered by AI systems and led by creative direction.
            </p>
            <div className="hero-ctas">
              <a href="/work" className="btn-primary">View Projects</a>
              <a href="/contact" className="btn-secondary">Start a Project</a>
            </div>
          </div>
        </div>

        <span className="hero-scroll">(Scroll)</span>
      </section>

      {/* ================================== */}
      {/* SECTION 2: THE PROOF (Work)        */}
      {/* ================================== */}
      <section className="work section-padding">
        <span className="editorial-label">
          (Selected Work)
        </span>

        <div className="work-grid">
          {[
            {
              num: '01',
              name: 'TEDxToronto',
              category: 'Brand Identity',
              year: '2024',
              desc: 'A complete visual identity system for Toronto\'s flagship ideas conference.',
              slug: '/work/tedxtoronto',
            },
            {
              num: '02',
              name: 'Parampara',
              category: 'Visual Media',
              year: '2023',
              desc: 'Heritage meets modernity in a visual narrative for a South Asian luxury brand.',
              slug: '/work/parampara',
            },
            {
              num: '03',
              name: 'Northward Studio',
              category: 'Digital Design',
              year: '2024',
              desc: 'Digital presence and brand system for an architecture practice.',
              slug: '/work/northward-studio',
            },
            {
              num: '04',
              name: 'Civic Grounds',
              category: 'Creative Strategy',
              year: '2023',
              desc: 'Brand positioning and identity for a community-driven real estate developer.',
              slug: '/work/civic-grounds',
            },
          ].map((project) => (
            <a key={project.num} href={project.slug} className="work-card">
              <div className="work-card-image">
                {/* Placeholder image block */}
                <div className="work-card-placeholder" />
              </div>
              <div className="work-card-info">
                <span className="work-card-ghost">{project.num}</span>
                <h3 className="work-card-name">{project.name}</h3>
                <span className="work-card-meta">
                  {project.category} | {project.year}
                </span>
                <p className="work-card-desc">{project.desc}</p>
                <span className="link-arrow" style={{ marginTop: 24 }}>
                  View Project
                </span>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <a href="/work" className="link-arrow">View All Projects</a>
        </div>
      </section>

      {/* ================================== */}
      {/* SECTION 3: THE ARGUMENT             */}
      {/* ================================== */}
      <section className="argument">
        <h2 className="argument-headline">
          Your business has evolved. Your brand has not.
        </h2>
        <p className="argument-fix">We fix that.</p>
        <div className="argument-steps">
          <p className="argument-step">
            <strong>Discover</strong> what your brand should be.
          </p>
          <p className="argument-step">
            <strong>Design</strong> the system that makes it real.
          </p>
          <p className="argument-step">
            <strong>Deliver</strong> assets that hold up everywhere.
          </p>
        </div>
      </section>

      {/* ================================== */}
      {/* SECTION 4: THE METHOD (Services)    */}
      {/* ================================== */}
      {[
        {
          num: '01',
          name: 'Brand Identity and Visual Design',
          tint: 'var(--tint-brand)',
          desc: 'We build the visual foundation your business stands on. Logo systems, typography, color architecture, and brand guidelines that hold up across every medium and market.',
          deliverables: 'Logo system, brand marks, color and typography system, visual language, brand guidelines, packaging and collateral, art direction',
          href: '/services/brand-identity',
        },
        {
          num: '02',
          name: 'Visual Media and Content Production',
          tint: 'var(--tint-media)',
          desc: 'We direct and produce the visual content that brings your brand to life. Campaign films, photography, social systems, and narrative content built on strategic intent.',
          deliverables: 'Brand films, campaign direction, photography, social content systems, art direction, script development',
          href: '/services/visual-media',
        },
        {
          num: '03',
          name: 'Digital Design and Experience',
          tint: 'var(--tint-digital)',
          desc: 'We design the digital spaces where your brand meets your audience. Websites, interfaces, and interactive experiences built for clarity, speed, and conversion.',
          deliverables: 'Website design, interface systems, interactive experiences, content architecture, ongoing digital support',
          href: '/services/digital-design',
        },
        {
          num: '04',
          name: 'Creative Strategy and Systems',
          tint: 'var(--tint-strategy)',
          desc: 'We build the operating system behind your brand. Positioning clarity, creative direction frameworks, content strategy, and AI workflow integration that makes everything else work harder.',
          deliverables: 'Brand positioning workshops, creative direction frameworks, content strategy, visual consistency systems, AI workflow integration',
          href: '/services/creative-strategy',
        },
      ].map((service, i) => (
        <section
          key={service.num}
          className="service-block"
          style={{ background: service.tint }}
        >
          {i === 0 && (
            <span className="editorial-label" style={{ marginBottom: 48 }}>
              (Services)
            </span>
          )}
          <div className="service-inner">
            <div className="service-text">
              <span className="service-ghost">{service.num}</span>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-desc">{service.desc}</p>
              <p className="service-deliverables">{service.deliverables}</p>
              <a href={service.href} className="link-arrow" style={{ marginTop: 28 }}>
                Learn More
              </a>
            </div>
            <div className="service-image">
              <div className="service-image-placeholder" />
            </div>
          </div>
        </section>
      ))}

      {/* ================================== */}
      {/* SECTION 5: THE EVIDENCE             */}
      {/* ================================== */}
      <section className="evidence section-padding">
        <span className="editorial-label" style={{ marginBottom: 48 }}>
          (Evidence)
        </span>

        <div className="stats-row">
          {[
            { number: '110+', label: 'Projects Delivered' },
            { number: '12+', label: 'Years of Practice' },
            { number: '6+', label: 'Countries Served' },
            { number: '15+', label: 'Industries Served' },
          ].map((stat) => (
            <div key={stat.label} className="stat-cell">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="testimonials">
          {[
            {
              quote: 'Exactly what our business needed. The brand system they built gives us consistency we never had before.',
              name: 'Sarah Chen, Northward Studio',
            },
            {
              quote: 'The process was clear from day one. No surprises, no scope creep. Just sharp work delivered on schedule.',
              name: 'Lovejot Singh, Parampara',
            },
            {
              quote: 'Working with House of Singh Studios during TEDxToronto was a standout collaboration. They brought intentional, structured creative direction to every deliverable.',
              name: 'Yanina Munoz, TEDxToronto',
            },
          ].map((t) => (
            <div key={t.name} className="testimonial-card">
              <span className="testimonial-quote-mark">&ldquo;</span>
              <p className="testimonial-text">{t.quote}</p>
              <span className="testimonial-name">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================================== */}
      {/* SECTION 6: THE INVITATION (CTA)     */}
      {/* ================================== */}
      <section className="cta">
        <h2 className="cta-headline">Start a project.</h2>
        <p className="cta-subtext">We respond within 24 hours.</p>
        <div className="cta-buttons">
          <a href="/contact" className="btn-primary" style={{ padding: '16px 40px', fontSize: '14px' }}>
            Book a Call
          </a>
          <a href="/contact" className="btn-secondary" style={{ padding: '16px 40px', fontSize: '14px' }}>
            Send a Brief
          </a>
        </div>
      </section>

    </>
  )
}
