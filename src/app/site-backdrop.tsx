"use client";

/**
 * The ambient backdrop for the whole site: the subtle architectural little
 * squares grid pattern across all pages, a soft radial light behind the content,
 * plus the levitating 3D orbs. It is pinned to the viewport and sits behind every
 * section — the sections themselves are transparent, so scrolling never breaks the lighting.
 */
export function SiteBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="site-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1. Subtle Architectural Little Squares Grid across all pages */}
      <div
        className="site-little-squares-grid absolute inset-0 pointer-events-none opacity-45"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.055) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, black 45%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, black 45%, transparent 100%)",
        }}
      />

      {/* 2. Wide soft light behind the content */}
      <div
        className="absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[860px] sm:w-[860px] lg:h-[1100px] lg:w-[1100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(224, 232, 248, 0.8) 0%, rgba(235, 241, 252, 0.45) 55%, rgba(237, 240, 248, 0) 72%)",
        }}
      />

      {/* 3. Floating 3D Orbs with smooth GPU keyframes */}
      {/* Bottom-left (largest) */}
      <div
        className="about-orb-gradient about-float-orb transform-gpu will-change-transform absolute bottom-[12%] left-[4%] h-20 w-20 rounded-full opacity-80 sm:h-28 sm:w-28 lg:h-32 lg:w-32"
        style={{ animationDuration: "9s" }}
      />

      {/* Mid-left */}
      <div
        className="about-orb-gradient about-float-slow transform-gpu will-change-transform absolute top-[38%] left-[2%] h-9 w-9 rounded-full opacity-70 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
        style={{ animationDuration: "7s" }}
      />

      {/* Top-right */}
      <div
        className="about-orb-gradient about-float-reverse transform-gpu will-change-transform absolute top-[14%] right-[8%] h-12 w-12 rounded-full opacity-65 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
        style={{ animationDuration: "8s" }}
      />

      {/* Bottom-centre, soft into the light */}
      <div
        className="about-orb-gradient about-float-slow transform-gpu will-change-transform absolute bottom-[-4%] left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-40 sm:h-44 sm:w-44 lg:h-56 lg:w-56"
        style={{ animationDuration: "10s" }}
      />
    </div>
  );
}
