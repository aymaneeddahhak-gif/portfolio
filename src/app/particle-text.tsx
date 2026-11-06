"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface ParticleTextProps {
  text: string;
  color?: string;
  className?: string;
  duration?: number;
}

interface Particle {
  tx: number; // target X (exact DOM glyph coordinate)
  ty: number; // target Y (exact DOM glyph coordinate)
  startX: number;
  startY: number;
  startZ: number;
  delay: number;
  baseRadius: number;
  hueShift: number; // subtle stardust sparkle during flight
}

/**
 * 3D Particle Assemble / Constellation Text Reveal.
 *
 * Samples glyph target coordinates directly from the rendered DOM word spans,
 * guaranteeing 100% exact layout, zero line-wrap discrepancies, and zero
 * random scramble glitches. Particles assemble inward with 3D depth,
 * stardust shimmer, and a seamless crossfade directly into the solid DOM text.
 */
export function ParticleText({
  text,
  color = "#374151",
  className = "",
  duration = 950,
}: ParticleTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  // Split into words so the browser computes 100% exact word wrapping
  const words = useMemo(() => text.split(" ").filter(Boolean), [text]);

  useEffect(() => {
    const textEl = textRef.current;
    const canvas = canvasRef.current;
    if (!textEl || !canvas) return;

    let rafId = 0;
    const finish = () => {
      rafId = requestAnimationFrame(() => setDone(true));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return () => cancelAnimationFrame(rafId);
    }

    const rect = textEl.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    if (!width || !height) {
      finish();
      return () => cancelAnimationFrame(rafId);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      finish();
      return () => cancelAnimationFrame(rafId);
    }
    ctx.scale(dpr, dpr);

    // Rasterise words onto an offscreen canvas at their EXACT DOM layout positions
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) {
      finish();
      return () => cancelAnimationFrame(rafId);
    }

    const cs = getComputedStyle(textEl);
    offCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    offCtx.textBaseline = "top";
    offCtx.fillStyle = "#ffffff";

    const wordSpans = textEl.querySelectorAll<HTMLSpanElement>(".particle-word");
    const containerRect = textEl.getBoundingClientRect();

    wordSpans.forEach((span, i) => {
      const sRect = span.getBoundingClientRect();
      const x = sRect.left - containerRect.left;
      const y = sRect.top - containerRect.top;
      const wordText = words[i] || "";
      offCtx.fillText(wordText, x, y);
    });

    // Sample pixels into particles mapped to exact glyph coordinates
    const imgData = offCtx.getImageData(0, 0, width, height).data;
    const particles: Particle[] = [];
    const step = width < 420 ? 3 : 2; // Optimal density (~400-650 particles)

    for (let py = 0; py < height; py += step) {
      for (let px = 0; px < width; px += step) {
        const alpha = imgData[(py * width + px) * 4 + 3];
        if (alpha > 128) {
          // Progress wave flows from left to right across the sentence
          const waveDelay = (px / Math.max(width, 1)) * 260;
          const jitter = (Math.random() - 0.5) * 80;
          const delay = Math.max(0, waveDelay + jitter);

          // 3D dispersion: particles emerge from nearby depth and stardust cloud
          const angle = Math.random() * Math.PI * 2;
          const dist = 18 + Math.random() * 42;
          const startX = px + Math.cos(angle) * dist;
          const startY = py + Math.sin(angle) * dist - 8;
          const startZ = (Math.random() - 0.4) * 120; // depth into/out of screen

          particles.push({
            tx: px,
            ty: py,
            startX,
            startY,
            startZ,
            delay,
            baseRadius: 1.1 + Math.random() * 0.8,
            hueShift: Math.random(),
          });
        }
      }
    }

    if (particles.length === 0) {
      finish();
      return () => cancelAnimationFrame(rafId);
    }

    const startTime = performance.now();
    const travelTime = Math.max(480, duration - 280);

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let allSettled = true;
      const fov = 320;
      const cx = width * 0.5;
      const cy = height * 0.5;

      // Overall fade out of canvas during the final 220ms as DOM text fades in
      const remainingTime = duration - elapsed;
      const canvasAlpha =
        remainingTime <= 240
          ? Math.max(0, remainingTime / 240)
          : 1;

      ctx.save();
      ctx.globalAlpha = canvasAlpha;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pElapsed = elapsed - p.delay;

        if (pElapsed <= 0) {
          // Particle has not started yet
          allSettled = false;
          continue;
        }

        const rawK = Math.min(1, pElapsed / travelTime);
        if (rawK < 1) {
          allSettled = false;
        }

        // Quintic ease-out for smooth stardust convergence
        const ease = 1 - Math.pow(1 - rawK, 4);

        const curX = p.startX + (p.tx - p.startX) * ease;
        const curY = p.startY + (p.ty - p.startY) * ease;
        const curZ = p.startZ * (1 - ease);

        // 3D perspective projection
        const scale = fov / (fov + curZ);
        const projX = cx + (curX - cx) * scale;
        const projY = cy + (curY - cy) * scale;
        const radius = Math.max(0.6, p.baseRadius * scale);

        // Subtle stardust sparkle during travel that settles into solid text color
        if (rawK < 0.85 && p.hueShift > 0.6) {
          ctx.fillStyle =
            p.hueShift > 0.82
              ? "rgba(168, 85, 247, 0.9)" // soft purple sparkle
              : "rgba(14, 165, 233, 0.9)"; // soft blue sparkle
        } else {
          ctx.fillStyle = color;
        }

        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // When all particles have converged or duration has elapsed, finish cleanly
      if ((allSettled && elapsed >= duration * 0.75) || elapsed >= duration) {
        ctx.clearRect(0, 0, width, height);
        setDone(true);
        return;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, width, height);
    };
  }, [words, color, duration]);

  return (
    <div className="relative flex-1">
      {/* Real DOM text: exact wrapping, crisp rendering, selectable, and accessible */}
      <p
        ref={textRef}
        className={`${className} transition-opacity duration-300 ${
          done ? "opacity-100" : "opacity-0"
        }`}
        style={color ? { color } : undefined}
      >
        {words.map((word, i) => (
          <span
            key={`${i}-${word}`}
            className="particle-word inline-block mr-[0.25em]"
          >
            {word}
          </span>
        ))}
      </p>

      {/* 3D Particle Assemble Canvas: overlays exact coordinate space */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-200 ${
          done ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
