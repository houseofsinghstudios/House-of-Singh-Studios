import Link from "next/link";
import { PROJECTS } from "@/lib/constants/homepage-data";
import EditorialLabel from "@/components/ui/EditorialLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function WorkSection() {
  return (
    <section style={{ padding: "120px var(--page-px) 160px" }}>
      <ScrollReveal>
        <EditorialLabel text="Selected Work" className="mb-6" />
      </ScrollReveal>

      <div className="work-grid mt-8">
        {PROJECTS.map((project, i) => (
          <ScrollReveal key={project.href} delay={i < 2 ? 0 : 0.15}>
            <Link
              href={project.href}
              className="project-card block no-underline"
            >
              <div
                className="overflow-hidden relative"
                style={{ aspectRatio: "4/3", background: project.color }}
              >
                <div className="project-image-inner ken-burns w-full h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex items-center justify-center relative"
                      style={{
                        width: "60%",
                        height: "60%",
                        border: `1px solid ${project.accent}33`,
                      }}
                    >
                      <div
                        style={{
                          width: "70%",
                          height: "70%",
                          border: `1px solid ${project.accent}55`,
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: `${project.accent}22`,
                          border: `1px solid ${project.accent}44`,
                        }}
                      />
                    </div>
                  </div>
                  <span
                    className="relative z-10 font-[var(--sans)] text-[11px] uppercase tracking-[0.12em]"
                    style={{ color: `${project.accent}88` }}
                  >
                    {project.name.split(" ")[0]}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-[var(--sans)] font-medium text-base text-[color:var(--text-primary)] m-0">
                  {project.name}
                </p>
                <p className="mt-1.5 font-[var(--sans)] font-normal text-xs uppercase tracking-[0.08em] text-[#999]">
                  {project.label}
                </p>
                <p className="project-sentence font-[var(--sans)] font-normal text-sm text-[color:var(--text-muted)]">
                  {project.sentence}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3} className="mt-12">
        <Link href="/work" className="arrow-link no-underline">
          <span className="font-[var(--sans)] font-medium text-[13px] text-[color:var(--text-primary)]">
            View All Projects <span className="arrow-icon">&rarr;</span>
          </span>
        </Link>
      </ScrollReveal>
    </section>
  );
}
