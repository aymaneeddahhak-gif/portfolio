"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Particle Assemble" reveal for the hero's more-text.
 *
 * The text is rasterised once onto an offscreen canvas, its filled pixels are
 * sampled into particles, and the particles fly in from random positions and
 * settle into the glyph shapes. When the run ends the canvas is cleared and
 * the real, selectable DOM text fades in.
 *
 * It uses a plain 2D canvas instead of a WebGL/Three.js context on purpose:
 * one short burst of a few hundred points doesn't need a GPU pipeline, and
 * skipping it means no extra context, no shader compilation, and no stutter on hover.
 */
export function ParticleText({
  text,
  color,
  className = "",
  duration = 1100,
}: {
  text: string;
  color: string;
  className?: string;
  duration?: number;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The component is re-mounted (via `key`) for every new reveal, so "done"
  // only ever flips false → true, always from a callback (rAF / microtask).
  const [done, setDone] = useState(false);

  useEffect(() => {
    const textEl = textRef.current;
    const canvas = canvasRef.current;
    if (!textEl || !canvas) return;

    let raf = 0;
    const finish = () => {
      raf = requestAnimationFrame(() => setDone(true));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return () => cancelAnimationFrame(raf);
    }

    const rect = textEl.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    if (!width || !height) {
      finish();
      return () => cancelAnimationFrame(raf);
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      finish();
      return () => cancelAnimationFrame(raf);
    }
    ctx.scale(dpr, dpr);

    // Rasterise the text with the same font metrics as the DOM paragraph.
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const o = off.getContext("2d", { willReadFrequently: true });
    if (!o) {
      finish();
      return () => cancelAnimationFrame(raf);
    }
    const cs = getComputedStyle(textEl);
    const letterSpacing = parseFloat(cs.letterSpacing) || 0;
    o.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ("letterSpacing" in o) {
      (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
    }
    o.textBaseline = "top";
    o.fillStyle = "#000";
    const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
    const drawn = cs.textTransform === "uppercase" ? text.toUpperCase() : text;
    const words = drawn.split(" ");
    let line = "";
    let y = (lineHeight - parseFloat(cs.fontSize)) / 2;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (o.measureText(test).width > width && line) {
        o.fillText(line, 0, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    }
    o.fillText(line, 0, y);

    // Sample filled pixels into particles (step 2 keeps it to a few hundred).
    const data = o.getImageData(0, 0, width, height).data;
    const particles: { tx: number; ty: number; x: number; y: number; d: number }[] = [];
    const step = 2;
    for (let py = 0; py < height; py += step) {
      for (let px = 0; px < width; px += step) {
        if (data[(py * width + px) * 4 + 3] > 128) {
          particles.push({
            tx: px,
            ty: py,
            x: Math.random() * width,
            y: -40 + Math.random() * (height + 80),
            d: Math.random() * 300,
          });
        }
      }
    }

    const start = performance.now();
    const travel = duration - 300;
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);
      let finished = true;
      ctx.fillStyle = color;
      for (const p of particles) {
        const k = Math.max(0, Math.min(1, (elapsed - p.d) / travel));
        if (k < 1) finished = false;
        const e = 1 - Math.pow(1 - k, 3);
        ctx.fillRect(p.x + (p.tx - p.x) * e, p.y + (p.ty - p.y) * e, 1.6, 1.6);
      }
      if (finished) {
        ctx.clearRect(0, 0, width, height);
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [text, color, duration]);

  return (
    <div className="relative flex-1">
      <p
        ref={textRef}
        className={`${className} transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}
      >
        {text}
      </p>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
