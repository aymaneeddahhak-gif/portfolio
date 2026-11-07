import type { CSSProperties } from "react";
import { ExternalLink } from "lucide-react";
import type { TechItem } from "./types";

interface FloatingCardsProps {
  activeItem: TechItem;
  onCardClick?: () => void;
}

/**
 * 3D Physical Tactile Block Card (derived faithfully from user's 3D render reference).
 * Features a double-layered 3D extruded block (darker base tray + satin front face),
 * top-right floating sculpted 3D logo, tactile 3D cream pill button, and ambient
 * floating spheres (glass bubbles, chrome mirror, and glossy marbles).
 */
export function FloatingCards({ activeItem, onCardClick }: FloatingCardsProps) {
  const theme = { "--about3d-hue": activeItem.accentHue } as CSSProperties;
  const tone = activeItem.plateTone === "dark" ? "dark" : "light";

  return (
    <div className="about3d-parent select-none" data-tone={tone} style={theme}>
      {/* Floating 3D Ambient Spheres (Matching Reference Image) */}
      <div className="about3d-orbs-container" aria-hidden="true">
        <div className="about3d-orb about3d-orb--bubble-tl" />
        <div className="about3d-orb about3d-orb--pearl-tl" />
        <div className="about3d-orb about3d-orb--chrome-tr" />
        <div className="about3d-orb about3d-orb--yellow-tr" />
        <div className="about3d-orb about3d-orb--blue-bl" />
        <div className="about3d-orb about3d-orb--gold-bl" />
        <div className="about3d-orb about3d-orb--glass-br" />
      </div>

      {/* Main 3D Card Block (Extruded Base Tray + Front Face) */}
      <div className="about3d-block">
        {/* Layer 1: Extruded Base Tray for genuine 3D physical block depth */}
        <div className="about3d-tray" aria-hidden="true" />

        {/* Layer 2: Tactile Front Face Plate */}
        <div className="about3d-card">
          {/* Top-Right 3D Logo Badge */}
          <div className="about3d-logo">
            <span className="about3d-logo-slot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.image}
                alt=""
                aria-hidden="true"
                className="about3d-logo-img"
              />
            </span>
          </div>

          {/* Title & Category Header */}
          <div className="about3d-header">
            <button
              type="button"
              onClick={onCardClick}
              className="about3d-title cursor-pointer text-left"
            >
              {activeItem.name}
            </button>
            <span className="about3d-category">{activeItem.category}</span>
          </div>

          {/* Body Description */}
          <div className="about3d-body">
            <p className="about3d-text">{activeItem.shortDescription}</p>
          </div>

          {/* Tactile 3D Pill Button at Bottom-Right */}
          <div className="about3d-bottom">
            <a
              href={activeItem.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="about3d-link"
            >
              <span>{activeItem.linkDisplay}</span>
              <ExternalLink aria-hidden="true" className="about3d-link__icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
