import { gsap } from "gsap";

/**
 * Initialize magnetic pull behavior on all [data-cursor="magnetic"] elements.
 * Buttons physically shift toward the cursor on hover with elastic snap-back on leave.
 */
export function initMagneticButtons() {
  const buttons = document.querySelectorAll('[data-cursor="magnetic"]');

  buttons.forEach((btn) => {
    const el = btn as HTMLElement;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: relX * 0.25,
        y: relY * 0.25,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.5)",
      });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  });
}
