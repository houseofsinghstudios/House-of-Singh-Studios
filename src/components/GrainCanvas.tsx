"use client";

import { useEffect, useRef, useCallback } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { grainVertexShader, grainFragmentShader } from "@/lib/ogl/grain-shader";

/**
 * Section grain personality map.
 * Each section gets a grain intensity and color temperature.
 * colorTemp: 0 = warm, 1 = cool
 */
const SECTION_PERSONALITY: Record<string, { intensity: number; colorTemp: number }> = {
  hero: { intensity: 0.015, colorTemp: 0.3 },
  work: { intensity: 0.0, colorTemp: 0.5 },
  argument: { intensity: 0.025, colorTemp: 0.7 },
  services: { intensity: 0.015, colorTemp: 0.4 },
  evidence: { intensity: 0.0, colorTemp: 0.5 },
  cta: { intensity: 0.005, colorTemp: 0.3 },
};

function getSectionFromProgress(progress: number): { intensity: number; colorTemp: number } {
  // Map scroll progress (0-1) to sections
  if (progress < 0.15) return SECTION_PERSONALITY.hero;
  if (progress < 0.4) return SECTION_PERSONALITY.work;
  if (progress < 0.55) return SECTION_PERSONALITY.argument;
  if (progress < 0.7) return SECTION_PERSONALITY.services;
  if (progress < 0.85) return SECTION_PERSONALITY.evidence;
  return SECTION_PERSONALITY.cta;
}

export default function GrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (rendererRef.current) {
      rendererRef.current.gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    rendererRef.current = null;
  }, []);

  useEffect(() => {
    // Don't render on mobile
    const isTouchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouchOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer({
      canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: 1, // Low DPR for performance — grain doesn't need high res
      alpha: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: grainVertexShader,
      fragment: grainFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uScrollVelocity: { value: 0 },
        uGrainIntensity: { value: 0.015 },
        uColorTemp: { value: 0.3 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(gl, { geometry, program });
    const startTime = performance.now();

    // Scroll velocity tracking
    let velocityDecay = 0;
    const onScroll = () => {
      const current = window.scrollY;
      scrollVelocityRef.current = Math.abs(current - lastScrollRef.current);
      lastScrollRef.current = current;
      velocityDecay = scrollVelocityRef.current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Animation loop
    function animate() {
      const elapsed = (performance.now() - startTime) / 1000;

      // Decay scroll velocity
      velocityDecay *= 0.92;
      const normalizedVelocity = Math.min(velocityDecay / 100, 1);

      // Get section-based personality
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const personality = getSectionFromProgress(scrollProgress);

      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      program.uniforms.uScrollVelocity.value = normalizedVelocity;
      program.uniforms.uGrainIntensity.value = personality.intensity;
      program.uniforms.uColorTemp.value = personality.colorTemp;

      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(animate);
    }

    // Lazy init after first paint
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(() => {
        rafRef.current = requestAnimationFrame(animate);
      });
    } else {
      setTimeout(() => {
        rafRef.current = requestAnimationFrame(animate);
      }, 100);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cleanup();
    };
  }, [cleanup]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          width: "100%",
          height: "100%",
        }}
      />
      {/* Static grain overlay for mobile — CSS handles visibility via (pointer: coarse) */}
      <div className="grain-overlay" />
    </>
  );
}
