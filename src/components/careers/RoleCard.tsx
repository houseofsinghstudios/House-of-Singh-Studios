"use client";
// A client component: one open role on /careers, opened and closed by its header. The role's title
// is a button inside the h2 (aria-expanded, aria-controls), stretched over the whole header so a
// click anywhere on it still opens the role (careers.css). Until the page runs in the browser the
// title is plain text and the body is neither inert nor collapsed: the body collapses only under
// html[data-js], set before the page paints, so without JavaScript every role reads in full and with
// it nothing flashes (site audit S-01, 22 Nov 2026).

import { PortableText } from "@portabletext/react";
import type { PortableTextComponents, PortableTextMarkComponentProps } from "@portabletext/react";
import { useInBrowser } from "@/lib/use-in-browser";

const DEPARTMENT_LABELS: Record<string, string> = {
  "brand-identity": "Brand Identity and Visual Design",
  "visual-media": "Visual Media and Content Production",
  "digital-design": "Digital Design and Experience",
  "creative-strategy": "Creative Strategy and Systems",
  operations: "Operations",
};

const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  freelance: "Freelance",
};

export interface Role {
  _id: string;
  title: string;
  slug: { current: string };
  department: string;
  type: string;
  location?: string;
  summary: string;
  description?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  publishedAt?: string;
}

const bodyText = { fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1.6, color: "var(--text-secondary)" } as const;
const listLabel = { fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-label)", marginBottom: 12 } as const;

type LinkMark = { _type: "link"; href?: string };

const roleTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p style={{ ...bodyText, marginBottom: 16 }}>{children}</p>,
    h2: ({ children }) => (
      <h3 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(22px, 2.8vw, 30px)", lineHeight: 1.2, letterSpacing: "-0.02em", marginTop: 32, marginBottom: 16 }}>
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.3, marginTop: 24, marginBottom: 12 }}>{children}</h4>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 500 }}>{children}</strong>,
    em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
    link: ({ children, value }: PortableTextMarkComponentProps<LinkMark>) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a href={href} style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border)", textDecoration: "none" }} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul style={{ listStyleType: "disc", paddingLeft: 24, marginBottom: 16 }}>{children}</ul>,
    number: ({ children }) => <ol style={{ listStyleType: "decimal", paddingLeft: 24, marginBottom: 16 }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li style={{ ...bodyText, marginBottom: 6 }}>{children}</li>,
    number: ({ children }) => <li style={{ ...bodyText, marginBottom: 6 }}>{children}</li>,
  },
};

function RoleList({ label, items, top }: { label: string; items?: string[]; top: number }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginTop: top }}>
      <p style={listLabel}>{label}</p>
      {items.map((item, i) => (
        <p key={i} style={{ ...bodyText, marginBottom: 8 }}>
          · {item}
        </p>
      ))}
    </div>
  );
}

function RoleHeader({ role, isOpen, bodyId, inBrowser, onToggle }: { role: Role; isOpen: boolean; bodyId: string; inBrowser: boolean; onToggle: () => void }) {
  return (
    <div className="role-card-header">
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 className="role-card-title" style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
          {inBrowser ? (
            <button type="button" className="role-card-btn" aria-expanded={isOpen} aria-controls={bodyId} onClick={onToggle}>
              {role.title}
            </button>
          ) : (
            role.title
          )}
        </h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-label)", marginTop: 6 }}>
          {DEPARTMENT_LABELS[role.department] || role.department}
          {" / "}
          {TYPE_LABELS[role.type] || role.type}
        </p>
      </div>
      <div className="role-card-meta">
        {role.location && <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-secondary)" }}>{role.location}</span>}
        <span className="role-card-toggle" data-open={isOpen} aria-hidden="true">
          +
        </span>
      </div>
    </div>
  );
}

export default function RoleCard({ role, isOpen, onToggle, onApply }: { role: Role; isOpen: boolean; onToggle: () => void; onApply: () => void }) {
  const inBrowser = useInBrowser();
  const bodyId = `role-${role.slug.current}`;
  return (
    <div className="role-card">
      <RoleHeader role={role} isOpen={isOpen} bodyId={bodyId} inBrowser={inBrowser} onToggle={onToggle} />
      <div id={bodyId} className="role-card-body" data-open={isOpen} inert={inBrowser && !isOpen}>
        <div className="role-card-body-inner">
          <p style={{ fontFamily: "var(--sans)", fontSize: 17, lineHeight: 1.6, color: "var(--text-secondary)" }}>{role.summary}</p>
          {role.description && (
            <div style={{ marginTop: 24 }}>
              <PortableText value={role.description} components={roleTextComponents} />
            </div>
          )}
          <RoleList label="(What you will do)" items={role.responsibilities} top={32} />
          <RoleList label="(What you bring)" items={role.requirements} top={28} />
          <RoleList label="(Nice to have)" items={role.niceToHave} top={28} />
          <button
            type="button"
            onClick={onApply}
            className="apply-role-btn needs-js"
            style={{ fontFamily: "var(--sans)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", background: "none", border: "none", borderBottom: "1px solid var(--text-primary)", paddingBottom: 4, paddingTop: 0, paddingLeft: 0, paddingRight: 0, marginTop: 32, cursor: "pointer", color: "var(--text-primary)", transition: "opacity 0.3s ease", display: "inline-block" }}
          >
            Apply for this role
          </button>
        </div>
      </div>
    </div>
  );
}
