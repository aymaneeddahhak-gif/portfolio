"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FloatingCards } from "./about/FloatingCards";
import { HeldBadge } from "./about/HeldBadge";
import { TechRail } from "./about/TechRail";
import { soundFx } from "./about/sound";
import { TECH_ITEMS } from "./about/tech-items";
import type { TechItem, TechTrack } from "./about/types";
import {
  useReplaySection,
  useTouchScrollChoreography,
} from "./motion-coordinator";
import { useTranslation } from "@/i18n/LanguageContext";

const PORTRAIT = "/images/aboutme.png";
const CYCLE_SECONDS = 5;

export default function AboutSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const { isVisible, motionState, isReentry, reducedMotion } =
    useReplaySection(sectionRef);

  const [activeItemId, setActiveItemId] = useState<string>(TECH_ITEMS[0].id);
  const [activeTrack, setActiveTrack] = useState<TechTrack | "all">("all");
  const [isHovered, setIsHovered] = useState(false);

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

  const advanceSpotlight = useCallback(() => {
    setActiveItemId((prevId) => {
      const idx = visibleItems.findIndex((item) => item.id === prevId);
      const nextIdx = (idx + 1) % visibleItems.length;
      return visibleItems[nextIdx].id;
    });
  }, [visibleItems]);

  const prevSpotlight = useCallback(() => {
    setActiveItemId((prevId) => {
      const idx = visibleItems.findIndex((item) => item.id === prevId);
      const prevIdx = (idx - 1 + visibleItems.length) % visibleItems.length;
      return visibleItems[prevIdx].id;
    });
  }, [visibleItems]);

  // Automatic switching: advances only while visible on screen and not hovered
  useEffect(() => {
    if (!isVisible || reducedMotion || isHovered) return;

    const timer = window.setInterval(advanceSpotlight, CYCLE_SECONDS * 1000);
    return () => window.clearInterval(timer);
  }, [isVisible, reducedMotion, isHovered, advanceSpotlight]);

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

  // Mobile centered hover trigger (IntersectionObserver-based, no scroll rAF)
  useTouchScrollChoreography(sectionRef, {
    enabled: isVisible && !reducedMotion,
  });

  const handleSelectItem = (item: TechItem) => {
    soundFx.playChime();
    setActiveItemId(item.id);
  };

  const handleSelectTrack = (track: TechTrack | "all") => {
    soundFx.playPop(520);
    const items =
      track === "all" ? TECH_ITEMS : TECH_ITEMS.filter((item) => item.track === track);
    if (track === "all") {
      setActiveItemId(items[0].id);
    } else if (items.length && !items.some((item) => item.id === activeItemId)) {
      setActiveItemId(items[0].id);
    }
    setActiveTrack(track);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      data-visible={isVisible ? "true" : "false"}
      data-motion-state={motionState}
      data-motion-reentry={isReentry ? "true" : "false"}
      className="about-section scroll-reveal-section relative isolate flex min-h-[520px] lg:min-h-[100svh] w-full flex-col justify-center overflow-hidden select-none pb-6 lg:pb-0"
    >
      {/* Top Centered Header */}
      <div
        data-reveal-step="1"
        className="relative z-20 mx-auto w-full max-w-4xl px-3 sm:px-4 text-center pt-6 sm:pt-8 lg:pt-6 pb-2"
      >
        <h2
          id="about-heading"
          className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-900 font-jakarta"
        >
          {t.about.heading}
        </h2>
      </div>

      {/* Bounded Stage Wrapper: anchors Left Card, Portrait & Right Rail together across all aspect ratios (including 1024×1366 iPad Pro 13) */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 lg:flex-none lg:h-[500px] xl:h-[600px] 2xl:h-[660px] flex-col items-center justify-center gap-2 lg:gap-0 px-2 sm:px-6 lg:px-8 xl:px-14">
        {/* Discipline filter (horizontal top on < lg, vertical right panel inside bounded stage on lg+) */}
        <div
          data-reveal-step="2"
          className="order-1 lg:order-none relative z-30 w-full px-1 sm:px-2 mb-1 lg:mb-0 lg:w-auto lg:max-w-[480px] lg:absolute lg:top-1/2 lg:right-3 xl:right-6 lg:-translate-y-1/2 flex justify-center lg:justify-end"
        >
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

        {/* Stage Row: Smaller Left Description Card + Hero-sized Portrait */}
        <div
          data-reveal-step="3"
          className="order-2 lg:order-none relative z-10 flex w-full flex-row items-center justify-center gap-0 sm:gap-4 lg:gap-0"
        >
          {/* Left Description Card — anchored to bounded stage bottom-left on lg+, never sinks under portrait on tall screens */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="about3d-slot order-1 lg:order-none relative z-20 w-[124px] sm:w-[178px] lg:w-[215px] xl:w-[275px] -mr-6 sm:-mr-2 lg:mr-0 shrink-0 transition-transform duration-700 ease-out lg:absolute lg:bottom-4 lg:left-2 xl:bottom-8 xl:left-6"
          >
            <div
              className="will-change-transform"
              style={{
                transform:
                  "translate3d(var(--cards-x, 0px), var(--cards-y, 0px), 0)",
              }}
            >
              <FloatingCards activeItem={activeItem} />
            </div>
          </div>

          {/* Centre portrait matching Hero portrait scale, with the held badge levitating above his hand */}
          <div
            className="order-2 lg:order-none relative z-10 flex flex-1 lg:flex-none justify-center transition-transform duration-500 ease-out will-change-transform lg:-translate-x-10 xl:-translate-x-6 2xl:translate-x-0"
            style={{
              transform:
                "translate3d(var(--portrait-x, 0px), var(--portrait-y, 0px), 0)",
            }}
          >
            <div className="relative aspect-[1402/1122] h-[215px] min-[400px]:h-[230px] sm:h-[320px] md:h-[360px] w-auto lg:h-[390px] xl:h-[510px] 2xl:h-[580px]">
              <Image
                src={PORTRAIT}
                alt="AED Solutions Tech Showcase"
                width={1402}
                height={1122}
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 425px, 780px"
                className="h-full w-full object-contain object-bottom drop-shadow-[0_28px_38px_rgba(27,39,87,0.18)]"
              />

              {/* The badge, hovering over the raised hand */}
              <div
                className="absolute top-[31%] left-[93%] z-20 w-[19.5%] will-change-transform"
                style={{
                  transform:
                    "translate3d(var(--badge-x, 0px), var(--badge-y, 0px), 0)",
                }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <div className="about-float-badge w-full">
                    <HeldBadge item={activeItem} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
