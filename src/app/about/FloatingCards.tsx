"use client";

import { useMemo, type CSSProperties } from "react";
import Image from "next/image";
import type { TechItem } from "./types";

interface FloatingCardsProps {
  activeItem: TechItem;
}

const TWO_COLOR_SECONDARY_HUES: Record<string, number> = {
  python: 48,
  figma: 268,
  supabase: 168,
  javascript: 36,
  mysql: 28,
  gitlab: 42,
  api: 192,
  "cloud-native": 188,
  oop: 215,
  uml: 196,
  agile: 174,
};

/**
 * Collector-style 3D foil card hovering over the V3 machined aluminum and
 * dual bright-blue side-light plinth. Uses the portfolio's existing 3D `.webp` logos.
 */
export function FloatingCards({ activeItem }: FloatingCardsProps) {
  const meta = useMemo(() => {
    const twoColorHue = TWO_COLOR_SECONDARY_HUES[activeItem.id];
    const colorMode = twoColorHue !== undefined ? "two" : "one";
    const secondaryHue = twoColorHue ?? (activeItem.accentHue + 24) % 360;
    const isDark = activeItem.plateTone === "dark";
    const trackLabel =
      activeItem.track === "language"
        ? "LANGUAGE"
        : activeItem.track === "devops"
          ? "DEVOPS"
          : activeItem.track.toUpperCase();

    return {
      secondaryHue,
      colorMode,
      tone: isDark ? "dark" : "light",
      trackLabel,
    };
  }, [activeItem]);

  const theme = {
    "--about3d-hue": activeItem.accentHue,
    "--about3d-hue2": meta.secondaryHue,
  } as CSSProperties;

  return (
    <div
      className="about3d-parent select-none"
      data-tone={meta.tone}
      data-color-mode={meta.colorMode}
      style={theme}
    >
      {/* Floating Collector 3D Card — key triggers coin-flip animation on every switch */}
      <div key={activeItem.id} className="about3d-card">
        <div className="about3d-edge" aria-hidden="true" />
        <div className="about3d-collector-face">
          <div className="about3d-foil-clip" aria-hidden="true">
            <div className="about3d-foil-glare" />
          </div>

          <div className="about3d-glass">
            {/* Printed Foil Card Header */}
            <div className="about3d-header">
              <span className="about3d-category">{meta.trackLabel}</span>
              <h3 className="about3d-title">{activeItem.name}</h3>
            </div>

            {/* Recessed 3D White Mirror Stage Window with Pop-Out .webp 3D Logo */}
            <div className="about3d-diorama-frame">
              <span className="about3d-diorama-window">
                <span className="about3d-diorama-sky" aria-hidden="true" />
                <span className="about3d-mirror-floor" aria-hidden="true">
                  <span className="about3d-mirror-sheen" />
                </span>
                <span className="about3d-floor-shadow" aria-hidden="true" />
                <span className="about3d-logo-reflection" aria-hidden="true">
                  <Image
                    src={activeItem.image}
                    alt=""
                    width={128}
                    height={128}
                    sizes="110px"
                    className="about3d-logo-refl-img"
                  />
                </span>
              </span>
              <span className="about3d-logo-slot">
                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  width={192}
                  height={192}
                  sizes="160px"
                  quality={95}
                  className="about3d-logo-img"
                />
              </span>
            </div>

            {/* Type-Switch Style Subheading + Crisp Card Description */}
            <div className="about3d-content">
              <h4 className="about3d-ability">{activeItem.category}</h4>
              <p className="about3d-text">{activeItem.shortDescription}</p>
            </div>

            {/* Official Website Footer Button (Uiverse.io style) */}
            <div className="about3d-bottom">
              <a
                href={activeItem.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about3d-link"
              >
                <span className="truncate">{activeItem.linkDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* V3 Machined Aluminum & Dual Bright-Blue Side-Light Pedestal Base */}
      <div className="about3d-plinth-v3" aria-hidden="true">
        <div className="about3d-plinth-floor-shadow" />
        <div className="about3d-plinth-alu-foot" />
        <div className="about3d-plinth-alu-top" />
        <div className="about3d-emitter-left" />
        <div className="about3d-emitter-right" />
        <div className="about3d-beam-left" />
        <div className="about3d-beam-right" />
      </div>
    </div>
  );
}
