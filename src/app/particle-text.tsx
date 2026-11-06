"use client";

import { useMemo } from "react";

interface ParticleTextProps {
  text: string;
  color?: string;
  className?: string;
  duration?: number;
}

/**
 * Direct Text Reveal — loads directly on the exact DOM text with a smooth,
 * staggered word-by-word reveal. No canvas rasterization, zero word-wrap
 * discrepancies, and zero random text scramble glitches.
 */
export function ParticleText({
  text,
  color,
  className = "",
  duration = 800,
}: ParticleTextProps) {
  const words = useMemo(() => text.split(" ").filter(Boolean), [text]);
  const staggerStep = Math.min(
    26,
    Math.max(12, Math.floor((duration * 0.6) / Math.max(words.length, 1))),
  );

  return (
    <p
      className={className}
      style={color ? { color } : undefined}
    >
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          className="inline-block animate-direct-text-reveal will-change-[opacity,transform,filter]"
          style={{
            animationDelay: `${i * staggerStep}ms`,
            animationDuration: "360ms",
            animationFillMode: "both",
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
}
