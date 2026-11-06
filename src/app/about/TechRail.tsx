"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TECH_FILTERS } from "./tech-items";
import { soundFx } from "./sound";
import type { TechItem, TechTrack } from "./types";
import { useTranslation } from "@/i18n/LanguageContext";

interface TechRailProps {
  items: TechItem[];
  activeItemId: string;
  activeTrack: TechTrack | "all";
  onSelectItem: (item: TechItem) => void;
  onSelectTrack: (track: TechTrack | "all") => void;
  onNext?: () => void;
  onPrev?: () => void;
}

/**
 * The toolset, filterable: one 3D squircle per language or tool the portfolio
 * ships with, under a column of discipline buttons. Beside the discipline buttons,
 * two vertical switching buttons (Prev / Next) allow cycling through the tech list.
 * Below the filter, a compact horizontal rail shows 3 to 4 icons at a time,
 * with shadow overlays covering remaining items and smooth horizontal scrolling.
 */
export function TechRail({
  items,
  activeItemId,
  activeTrack,
  onSelectItem,
  onSelectTrack,
  onNext,
  onPrev,
}: TechRailProps) {
  const { t } = useTranslation();
  const railRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    soundFx.playChime();
    if (onPrev) {
      onPrev();
      return;
    }
    const currentIndex = items.findIndex((item) => item.id === activeItemId);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onSelectItem(items[prevIndex]);
  };

  const handleNext = () => {
    soundFx.playChime();
    if (onNext) {
      onNext();
      return;
    }
    const currentIndex = items.findIndex((item) => item.id === activeItemId);
    const nextIndex = (currentIndex + 1) % items.length;
    onSelectItem(items[nextIndex]);
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const updateScrollIndicators = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    setCanScrollLeft(scrollLeft > 3);
    setCanScrollRight(scrollLeft < maxScroll - 3);
  }, []);

  // Update scroll indicators on items change, scroll, or resize
  useEffect(() => {
    updateScrollIndicators();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollIndicators, { passive: true });
    window.addEventListener("resize", updateScrollIndicators);
    return () => {
      el.removeEventListener("scroll", updateScrollIndicators);
      window.removeEventListener("resize", updateScrollIndicators);
    };
  }, [items, updateScrollIndicators]);

  // Center active thumbnail horizontally as spotlight advances
  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>("[data-active='true']");
    if (!rail || !active) return;

    const left = active.offsetLeft;
    const targetScroll = left - rail.clientWidth / 2 + active.offsetWidth / 2;
    rail.scrollTo({ left: targetScroll, behavior: "smooth" });

    const timer = setTimeout(updateScrollIndicators, 350);
    return () => clearTimeout(timer);
  }, [activeItemId, activeTrack, updateScrollIndicators]);

  // Mouse wheel horizontal scrolling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (railRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        railRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Mouse drag-to-scroll support
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - rail.offsetLeft;
    scrollLeftRef.current = rail.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !railRef.current) return;
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    railRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex w-full flex-col items-center lg:items-end gap-3 max-w-full">
      {/* Top row: Filter list (ALL, Languages, Web, etc.) + TWO Vertical Switching Buttons beside it */}
      <div className="flex items-center gap-2.5">
        {/* Filter options (All, Languages, Web & UI, Mobile, etc.) in a vertical column */}
        <div
          role="radiogroup"
          aria-label="Filter technologies by discipline"
          className="about-filter shrink-0 w-[175px]"
        >
          {TECH_FILTERS.map((filter) => (
            <label key={filter.id} className="about-filter__option">
              <input
                type="radio"
                name="tech-track"
                checked={filter.id === activeTrack}
                onChange={() => onSelectTrack(filter.id)}
              />
              <span className="about-filter__label">
                {t.about.filters[filter.id as keyof typeof t.about.filters] || filter.label}
              </span>
            </label>
          ))}
        </div>

        {/* TWO vertical switching buttons placed directly beside the filter list */}
        <div className="flex flex-col gap-2 shrink-0 justify-center">
          {/* Previous Tech Button (Up / Prev) */}
          <button
            type="button"
            onClick={handlePrev}
            title={t.about.prevTech}
            aria-label={t.about.prevTech}
            className="group/prev-tech relative flex h-[48px] w-[48px] shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white/75 hover:bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all duration-200 backdrop-blur-md active:scale-95 text-neutral-800 hover:text-black"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover/prev-tech:-translate-y-0.5 text-neutral-700 group-hover/prev-tech:text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
            <span className="sr-only">{t.about.prevTech}</span>
          </button>

          {/* Next Tech Button (Down / Next) */}
          <button
            type="button"
            onClick={handleNext}
            title={t.about.nextTech}
            aria-label={t.about.nextTech}
            className="group/next-tech relative flex h-[48px] w-[48px] shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-white/75 hover:bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all duration-200 backdrop-blur-md active:scale-95 text-neutral-800 hover:text-black"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover/next-tech:translate-y-0.5 text-neutral-700 group-hover/next-tech:text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            <span className="sr-only">{t.about.nextTech}</span>
          </button>
        </div>
      </div>

      {/* Row containing the little tech icons list aligned underneath the filter */}
      <div className="relative w-[175px] max-w-[175px] shrink-0">
        {/* Left shadow overlay over icons scrolled out to the left */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-8 rounded-l-2xl transition-opacity duration-300 bg-gradient-to-r from-slate-900/35 via-slate-900/15 to-transparent ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right shadow overlay over remaining icons */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-11 rounded-r-2xl transition-opacity duration-300 bg-gradient-to-l from-slate-900/40 via-slate-900/15 to-transparent ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scrollable track showing 3-4 icons */}
        <div
          ref={railRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto py-2 px-2.5 rounded-2xl bg-white/50 border border-neutral-200/80 backdrop-blur-md shadow-xs justify-start cursor-grab active:cursor-grabbing select-none"
          role="list"
          aria-label="Languages and tools"
        >
          {items.map((item) => {
            const isActive = item.id === activeItemId;

            return (
              <div key={item.id} role="listitem" className="shrink-0">
                <button
                  type="button"
                  data-active={isActive ? "true" : undefined}
                  onClick={() => {
                    if (hasDraggedRef.current) return;
                    onSelectItem(item);
                  }}
                  title={item.name}
                  aria-label={`Show ${item.name}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group/rail relative flex cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
                >
                  {/* Selection halo — active icon is ringed and highlighted */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -inset-1 rounded-xl border-2 border-purple-600 bg-purple-500/10 shadow-sm shadow-purple-500/25 transition-all duration-300"
                    />
                  )}
                  <span
                    className={`flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "h-8 w-8 scale-105 drop-shadow-[0_6px_14px_rgba(147,51,234,0.35)]"
                        : "h-6 w-6 opacity-65 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </span>

                  {/* Name, on hover — tooltip pops up directly above the icon */}
                  <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] whitespace-nowrap text-[#151722] uppercase shadow-md backdrop-blur-md group-hover/rail:block z-30">
                    {item.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
