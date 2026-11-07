import type { CSSProperties } from "react";
import { ExternalLink } from "lucide-react";
import type { TechItem } from "./types";

interface FloatingCardsProps {
  activeItem: TechItem;
  onCardClick?: () => void;
}

// The About Me description as a permanently tilted 3D card, ported from the
// uiverse 3D-card build in newdesigndevis-3Dcard: the plate keeps its
// rotate3d perspective at rest, sits behind a glass sheet, and stacks two
// concentric halos over the technology's own logo — the same motion the
// hero-work card uses, only full height and carrying the write-up.
//
// Every colour on the card is derived from `activeItem.accentHue`, the hue
// sampled from that logo's own pixels (see tech-items.ts), so the plate takes
// the brand colour of whatever is in focus: JS yellow, Flutter cyan, Laravel
// red. The two near-monochrome marks (GitHub, Next.js) carry
// `plateTone: "dark"` instead: their plates take the logo's own dark tone and
// the write-up switches to neutral ink. The logo carries no plate or ring in
// either tone — it floats on the card exactly the way the same icons float on
// the rail beside the portrait.
// Tapping the name opens the full detail modal; the pill at the bottom-right
// goes straight out to the technology's official site.
export function FloatingCards({ activeItem, onCardClick }: FloatingCardsProps) {
  const theme = { "--about3d-hue": activeItem.accentHue } as CSSProperties;
  const tone = activeItem.plateTone === "dark" ? "dark" : "light";

  return (
    <div className="about3d-parent select-none" data-tone={tone} style={theme}>
      <div className="about3d-card">
        {/* The logo itself, floating free of any plate — the same treatment as
            the icons on the rail, no disc and no ring behind it */}
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

        {/* Glass sheet in front of the coloured plate */}
        <div className="about3d-glass" />

        {/* The write-up itself. The name leads and the discipline sits under it
            as the kicker — the other way round the little caps line read first
            and the big word looked like a caption for it. */}
        <div className="about3d-content">
          <button
            type="button"
            onClick={onCardClick}
            className="about3d-title cursor-pointer text-left"
          >
            {activeItem.name}
          </button>
          <span className="about3d-category">{activeItem.category}</span>
          <p className="about3d-text">{activeItem.shortDescription}</p>
        </div>

        {/* Official site, tucked into the card's right-hand side (the side
            nearest the portrait's open hand) and lifted furthest forward */}
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
  );
}
