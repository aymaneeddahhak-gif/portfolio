"use client";

import { useMemo } from "react";

interface ParticleTextProps {
  text: string;
  color?: string;
  className?: string;
  duration?: number;
  mode?: "word" | "char";
}

/**
 * Direct Text Reveal — loads directly on the exact DOM text with a smooth,
 * staggered word-by-word or letter-by-letter reveal. No canvas rasterization,
 * zero word-wrap discrepancies, and zero random text scramble glitches.
 */
export function ParticleText({
  text,
  color,
  className = "",
  duration = 800,
  mode = "word",
}: ParticleTextProps) {
  const tokens = useMemo(
    () =>
      mode === "char"
        ? Array.from(text)
        : text.split(" ").filter(Boolean),
    [text, mode],
  );
  const staggerStep =
    mode === "char"
      ? Math.min(34, Math.max(18, Math.floor((duration * 0.78) / Math.max(tokens.length, 1))))
      : Math.min(26, Math.max(12, Math.floor((duration * 0.6) / Math.max(tokens.length, 1))));

  return (
    <p
      className={className}
      style={color ? { color } : undefined}
    >
      {tokens.map((token, i) => (
        <span
          key={`${i}-${token}`}
          className="inline-block animate-direct-text-reveal"
          style={{
            animationDelay: `${i * staggerStep}ms`,
            animationDuration: mode === "char" ? "240ms" : "360ms",
            animationFillMode: "both",
          }}
        >
          {mode === "char" ? (token === " " ? "\u00A0" : token) : <>{token}&nbsp;</>}
        </span>
      ))}
    </p>
  );
}
