"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { BadgeModal } from "./about/BadgeModal";
import { FloatingCards } from "./about/FloatingCards";
import { HeldBadge } from "./about/HeldBadge";
import { TechRail } from "./about/TechRail";
import { soundFx } from "./about/sound";
import { TECH_ITEMS } from "./about/tech-items";
import type { TechItem, TechTrack } from "./about/types";
import { useReplaySection } from "./motion-coordinator";
import { useTranslation } from "@/i18n/LanguageContext";

const PORTRAIT = "/images/aboutme.png";
const CYCLE_SECONDS = 5;
const PARALLAX_INTENSITY = 18;
const NO_POINTER = { x: 0, y: 0 };

/**
 * The About stage: the portrait, full height, with the active technology
 * levitating above his raised hand like a badge he is holding up. The
 * languages and tools the portfolio ships with live on the rail, and the
 * description card names and explains whichever one is in focus.
 *
 * The spotlight advances on its own every few seconds (and on any rail or
 * badge tap), the portrait and the badge sit at different pointer-parallax
 * depths, and the ambient orbs behind everything come from the shared
 * <SiteBackdrop /> rather than this section. The rail can be narrowed to one
 * discipline, which also narrows what the stage cycles through.
 */
export default function AboutSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  // The shared observer tells us when the stage is on screen — used to gate
  // the pointer listener and the auto-cycle so an offscreen about section
  // never re-renders on every mouse move.
  const { isVisible, reducedMotion } = useReplaySection(sectionRef);

  const [activeItemId, setActiveItemId] = useState<string>(TECH_ITEMS[0].id);
  const [activeTrack, setActiveTrack] = useState<TechTrack | "all">("all");
  const [activeModalItem, setActiveModalItem] = useState<TechItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // The filter narrows the rail and, with it, the automatic cycle — the stage
  // only ever shows something the visitor can see on the rail.
  const visibleItems = useMemo(
    () =>
      activeTrack === "all"
        ? TECH_ITEMS
        : TECH_ITEMS.filter((item) => item.track === activeTrack),
    [activeTrack],
  );

  const activeIndex = visibleItems.findIndex((item) => item.id === activeItemId);
  const activeItem =
    (activeIndex >= 0 ? visibleItems[activeIndex] : undefined) ||
    visibleItems[0] ||
    TECH_ITEMS[0];
  const parallaxActive = isVisible && !reducedMotion;

  // Advance to next tech in line
  const advanceSpotlight = () => {
    setActiveItemId((prevId) => {
      const idx = visibleItems.findIndex((item) => item.id === prevId);
      const nextIdx = (idx + 1) % visibleItems.length;
      return visibleItems[nextIdx].id;
    });
  };

  // Go back to previous tech in line
  const prevSpotlight = () => {
    setActiveItemId((prevId) => {
      const idx = visibleItems.findIndex((item) => item.id === prevId);
      const prevIdx = (idx - 1 + visibleItems.length) % visibleItems.length;
      return visibleItems[prevIdx].id;
    });
  };

  // Automatic switching: advances while visible, pauses on card hover so user can read/click official link
  useEffect(() => {
    if (!isVisible || reducedMotion || isHovered) return;

    const timer = window.setInterval(advanceSpotlight, CYCLE_SECONDS * 1000);

    return () => window.clearInterval(timer);
  }, [isVisible, reducedMotion, visibleItems, isHovered]);

  // Listen for tech selection from App Showcase cards
  useEffect(() => {
    const handleSelectTech = (e: Event) => {
      const customEvent = e as CustomEvent<{ techId: string }>;
      const targetId = customEvent.detail?.techId;
      if (!targetId) return;

      const found = TECH_ITEMS.find((item) => item.id === targetId);
      if (found) {
        if (activeTrack !== "all" && found.track !== activeTrack) {
          setActiveTrack("all");
        }
        setActiveItemId(found.id);
        const aboutEl = document.getElementById("about");
        if (aboutEl) {
          aboutEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("select-about-tech", handleSelectTech);
    return () => window.removeEventListener("select-about-tech", handleSelectTech);
  }, [activeTrack]);

  // Pointer parallax; rAF-throttled so a fast mouse cannot flood React. The
  // listener only lives while the stage is on screen, and the resting position
  // is derived rather than reset in an effect — so leaving view simply settles
  // the layers back to centre.
  useEffect(() => {
    if (!parallaxActive) return;

    let frame = 0;
    const handleMouseMove = (event: MouseEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const { innerWidth, innerHeight } = window;
        setMousePos({
          x: (event.clientX - innerWidth / 2) / (innerWidth / 2),
          y: (event.clientY - innerHeight / 2) / (innerHeight / 2),
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [parallaxActive]);

  const handleSelectItem = (item: TechItem) => {
    soundFx.playChime();
    setActiveItemId(item.id);
  };

  // Switching track keeps the spotlight valid: if what is on the card is not
  // part of the new filter, the first entry of that filter takes its place.
  const handleSelectTrack = (track: TechTrack | "all") => {
    soundFx.playPop(520);
    const items =
      track === "all" ? TECH_ITEMS : TECH_ITEMS.filter((item) => item.track === track);
    if (items.length && !items.some((item) => item.id === activeItemId)) {
      setActiveItemId(items[0].id);
    }
    setActiveTrack(track);
  };

  const handleOpenDetails = () => {
    soundFx.playPop(620);
    setActiveModalItem(activeItem);
  };

  // Depth layers: the portrait drifts with the pointer while the card and the
  // held badge counter-move, which is what sells the diorama.
  const pointer = parallaxActive ? mousePos : NO_POINTER;
  const p = PARALLAX_INTENSITY;
  const portraitOffset = { x: pointer.x * p * 0.4, y: pointer.y * p * 0.3 };
  const badgeOffset = { x: pointer.x * p * 0.7, y: pointer.y * p * 0.55 };
  const cardsOffset = { x: pointer.x * p * -0.9, y: pointer.y * p * -0.8 };

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About Aymane Eddahak"
      className="about-section relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden select-none"
    >
      {/* Top Centered Header — Option C: Clean & Minimal */}
      <div className="relative z-20 mx-auto max-w-3xl px-4 text-center pt-8 sm:pt-12 pb-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-900 font-jakarta">
          {t.about.heading}
        </h2>
      </div>

      {/* Stage: portrait centre, description card left, tool rail right. */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-4 pt-4 pb-8 sm:px-8 md:px-14 lg:flex-row lg:gap-0 lg:px-20 lg:py-6">
        {/* Centre portrait, with the held badge levitating above his hand */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex justify-center transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${portraitOffset.x}px, ${portraitOffset.y}px, 0)`,
          }}
        >
          {/* Sized by width on phones and by height on desktop, so the pose
              never overflows and the badge rides the hand at every size */}
          <div className="relative aspect-[1402/1122] w-full max-w-[350px] sm:max-w-[470px] lg:h-[600px] lg:w-auto lg:max-w-none xl:h-[680px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT}
              alt="Aymane Eddahak"
              className="h-full w-full object-contain object-bottom drop-shadow-[0_28px_38px_rgba(27,39,87,0.18)]"
              referrerPolicy="no-referrer"
            />

            {/* The badge, hovering over the raised hand */}
            <div
              className="absolute top-[31%] left-[93%] z-20 w-[19.5%]"
              style={{
                transform: `translate3d(${badgeOffset.x}px, ${badgeOffset.y}px, 0)`,
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <div className="about-float-badge w-full">
                  <HeldBadge item={activeItem} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description card + official-site link: the 3D plate rides the
            pointer parallax, so it needs its own perspective wrapper rather
            than the flat card's translate only. Hovering pauses auto-cycling;
            leaving resumes immediately. */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            advanceSpotlight();
          }}
          className="about3d-slot relative z-20 w-full max-w-[330px] transition-transform duration-700 ease-out lg:absolute lg:bottom-[180px] lg:left-[1%] xl:bottom-[194px]"
        >
          <div style={{ transform: `translate3d(${cardsOffset.x}px, ${cardsOffset.y}px, 0)` }}>
            <div className="about-float-slow">
              <FloatingCards activeItem={activeItem} onCardClick={handleOpenDetails} />
            </div>
          </div>
        </div>

      </main>

      {/* Every language and tool the portfolio ships with, plus the discipline
          filter. A sibling of <main> on purpose: inside the centred max-w-7xl
          container the group could only ever be anchored to the container's
          edge, which is 100px inside the screen at 1440 — the filter crowded
          the portrait's hand from there. Against the section it parks on the
          real screen edge at every width. It is still a normal flow child
          below lg, so phones stack it under the portrait as before. */}
      <div className="relative z-20 w-full px-4 mt-6 lg:mt-0 lg:absolute lg:top-1/2 lg:right-4 xl:right-10 lg:w-auto lg:max-w-[480px] lg:-translate-y-1/2 flex justify-center lg:justify-end">
        <TechRail
          items={visibleItems}
          activeItemId={activeItem.id}
          activeTrack={activeTrack}
          onSelectItem={handleSelectItem}
          onSelectTrack={handleSelectTrack}
          onNext={advanceSpotlight}
          onPrev={prevSpotlight}
        />
      </div>

      <BadgeModal item={activeModalItem} onClose={() => setActiveModalItem(null)} />
    </section>
  );
}
