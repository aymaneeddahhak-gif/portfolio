"use client";

import { useEffect, useRef } from "react";

interface ShowcaseThreeCanvasProps {
  accentColor: string;
  ambientColor: string;
  active: boolean;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function parseRgb(col?: string, fallback: RgbColor = { r: 99, g: 102, b: 241 }): RgbColor {
  if (!col) return fallback;
  const rgbaMatch = col.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbaMatch) {
    return {
      r: Number(rgbaMatch[1]),
      g: Number(rgbaMatch[2]),
      b: Number(rgbaMatch[3]),
    };
  }
  const hex = col.replace("#", "").trim();
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) || fallback.r,
      g: parseInt(hex.slice(2, 4), 16) || fallback.g,
      b: parseInt(hex.slice(4, 6), 16) || fallback.b,
    };
  }
  return fallback;
}

const PARTICLES = Array.from({ length: 45 }, (_, i) => {
  const s1 = ((i * 73 + 19) % 97) / 97;
  const s2 = ((i * 53 + 41) % 89) / 89;
  const s3 = ((i * 37 + 11) % 67) / 67;
  return {
    x: s1,
    y: s2,
    depth: 0.35 + s3 * 0.85,
    radius: 1.4 + s3 * 2.2,
  };
});

/**
 * Static Ambient Dust Field — paints 45 soft depth-parallax particles once per
 * color/resize change (0fps idle CPU/GPU usage).
 */
export function ShowcaseThreeCanvas({
  accentColor,
  ambientColor,
  active,
}: ShowcaseThreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const color = parseRgb(ambientColor || accentColor);
    const fill = `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, 0.34)`;

    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(bounds.width));
      const h = Math.max(1, Math.floor(bounds.height));
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fill;

      for (let i = 0; i < PARTICLES.length; i++) {
        const p = PARTICLES[i];
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.radius * p.depth, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [accentColor, ambientColor, active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}
