"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import ServiceImageCard from "./ServiceImageCard";

interface ServiceImage {
  src: string;
  alt: string;
  projectName: string;
  projectCategory: string;
}

interface ServiceScrollSectionProps {
  number: string;
  name: string;
  headline: string;
  body: string;
  deliverables: string[];
  slug: string;
  images: ServiceImage[];
  isFirst?: boolean;
}

export default function ServiceScrollSection({
  number,
  name,
  headline,
  body,
  deliverables,
  slug,
  images,
  isFirst = false,
}: ServiceScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [anyImageVisible, setAnyImageVisible] = useState(false);

  useEffect(() => {
    // Only highlight tags on devices with hover capability
    if (!window.matchMedia("(hover: hover)").matches) return;

    const section = sectionRef.current;
    if (!section) return;

    const imageEls = section.querySelectorAll("[data-service-image]");
    if (imageEls.length === 0) return;

    const visibleSet = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target);
          } else {
            visibleSet.delete(entry.target);
          }
        });
        setAnyImageVisible(visibleSet.size > 0);
      },
      {
        threshold: 0.3,
        rootMargin: "-120px 0px -30% 0px",
      }
    );

    imageEls.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={sectionRef} className="svc-theater-section">
      {/* Left column — sticky */}
      <div className="svc-theater-left">
        <p
          className={`editorial-label${isFirst ? " css-reveal" : " css-reveal"}`}
          style={isFirst ? { transitionDelay: "0ms" } : undefined}
        >
          ({number}) {name}
        </p>
        <h2
          className={`svc-theater-heading${isFirst ? " css-reveal" : " css-reveal"}`}
          style={isFirst ? { transitionDelay: "80ms" } : undefined}
        >
          {headline}
        </h2>
        <p
          className={`svc-theater-body${isFirst ? " css-reveal" : " css-reveal"}`}
          style={isFirst ? { transitionDelay: "160ms" } : undefined}
        >
          {body}
        </p>
        <p
          className={`svc-theater-tags${isFirst ? " css-reveal" : " css-reveal"}`}
          style={isFirst ? { transitionDelay: "240ms" } : undefined}
        >
          {deliverables.map((tag, i) => (
            <span key={i}>
              <span
                className={`svc-theater-tag${anyImageVisible ? " service-tag-active" : ""}`}
              >
                {tag}
              </span>
              {i < deliverables.length - 1 && (
                <span className="svc-theater-tag-dot"> · </span>
              )}
            </span>
          ))}
        </p>
        <div
          className={`svc-theater-link-wrap${isFirst ? " css-reveal" : " css-reveal"}`}
          style={isFirst ? { transitionDelay: "320ms" } : undefined}
        >
          <Link
            href={`/services/${slug}`}
            className="svc-theater-link"
            data-cursor="link"
          >
            View service <span className="svc-theater-link-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* Right column — scrolling images */}
      <div className="svc-theater-right">
        {images.map((img, i) => (
          <ServiceImageCard
            key={i}
            src={img.src}
            alt={img.alt}
            projectName={img.projectName}
            projectCategory={img.projectCategory}
            priority={isFirst && i === 0}
          />
        ))}
      </div>
    </div>
  );
}
