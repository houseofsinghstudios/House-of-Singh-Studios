"use client";

import { useEffect, useRef, useCallback } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";
import { gsap } from "gsap";
import { vertexShader, fragmentShader } from "@/lib/ogl/displacement-shader";
import { createPlaceholderData, gradientToHex } from "@/lib/ogl/create-placeholder-texture";

interface OGLCanvasProps {
  imageSrc: string;
  className?: string;
  intensity?: number;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export default function OGLCanvas({
  imageSrc,
  className = "",
  intensity = 1,
  scrollContainerRef,
}: OGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rendererRef = useRef<Renderer | null>(null);
  const rafRef = useRef<number>(0);
  const mouseTarget = useRef({ x: 0.5, y: 0.5 });
  const mouseCurrent = useRef({ x: 0.5, y: 0.5 });

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (rendererRef.current) {
      rendererRef.current.gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    rendererRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const renderer = new Renderer({
      canvas,
      width,
      height,
      dpr,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0.98, 0.98, 0.97, 1);

    // Geometry
    const geometry = new Triangle(gl);

    // Texture — start with placeholder
    const texture = new Texture(gl);
    const isGradientOrEmpty =
      !imageSrc || imageSrc.startsWith("linear-gradient");

    if (isGradientOrEmpty) {
      const hex = gradientToHex(imageSrc);
      const data = createPlaceholderData(hex);
      texture.image = data as unknown as HTMLImageElement;
      texture.width = 2;
      texture.height = 2;
    } else {
      const img = new Image();
      img.crossOrigin = "";
      img.src = imageSrc;
      img.onload = () => {
        texture.image = img;
      };
    }

    // Program
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: [0.5, 0.5] },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uResolution: { value: [width, height] },
        uScrollProgress: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // RAF loop
    let startTime = performance.now();
    function animate() {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      // Lerp mouse
      mouseCurrent.current.x +=
        (mouseTarget.current.x - mouseCurrent.current.x) * 0.08;
      mouseCurrent.current.y +=
        (mouseTarget.current.y - mouseCurrent.current.y) * 0.08;

      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = [
        mouseCurrent.current.x,
        mouseCurrent.current.y,
      ];

      // Scroll progress
      if (container) {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = 1 - (rect.top + rect.height) / (vh + rect.height);
        program.uniforms.uScrollProgress.value = Math.max(0, Math.min(1, progress));
      }

      renderer.render({ scene: mesh });
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    // Mouse events
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseTarget.current.x = (e.clientX - rect.left) / rect.width;
      mouseTarget.current.y = 1 - (e.clientY - rect.top) / rect.height;
    }

    function onMouseEnter() {
      gsap.to(program.uniforms.uHover, {
        value: 1 * intensity,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    function onMouseLeave() {
      gsap.to(program.uniforms.uHover, {
        value: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Resize
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          renderer.setSize(w, h);
          program.uniforms.uResolution.value = [w, h];
        }
      }
    });
    ro.observe(container);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      ro.disconnect();
      cleanup();
    };
  }, [imageSrc, intensity, scrollContainerRef, cleanup]);

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
