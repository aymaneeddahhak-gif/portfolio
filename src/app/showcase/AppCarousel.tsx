"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Clapperboard } from "lucide-react";
import type { ShowcaseApp } from "../showcase-apps";

interface AppCarouselProps {
  apps: ShowcaseApp[];
  currentAppIndex: number;
  onSelectApp: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function AppCarousel({
  apps,
  currentAppIndex,
  onSelectApp,
  onPrev,
  onNext,
}: AppCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll active card into center view
  useEffect(() => {
    const activeEl = itemRefs.current[currentAppIndex];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentAppIndex]);

  return (
    <div className="relative flex items-center gap-1 sm:gap-2 select-none z-10 w-full max-w-2xl overflow-hidden">
      <button
        onClick={onPrev}
        aria-label="Previous app"
        className="uiverse-arrow group relative h-[52px] w-[52px] flex-shrink-0 cursor-pointer overflow-hidden rounded-full outline-none"
      >
        <span className="absolute inset-[7px] rounded-full border-[3px] border-stone-900 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] group-hover:scale-[0.7] group-hover:opacity-0" />
        <span className="absolute inset-[7px] scale-[1.3] rounded-full border-4 border-[#599a53] opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-100 group-hover:opacity-100" />
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 24 24"
            className="h-[26px] w-[26px] fill-stone-900 transition-transform duration-400 group-hover:-translate-x-[42px]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            <path
              className="translate-x-[42px] transition-transform duration-400 group-hover:translate-x-0"
              transform="translate(42 0)"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            />
          </svg>
        </span>
      </button>

      <div
        ref={containerRef}
        className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1.5 sm:py-2 px-1 flex-1 scroll-smooth"
      >
        {apps.map((app, idx) => {
          const isActive = idx === currentAppIndex;
          return (
            <div
              key={app.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => idx !== currentAppIndex && onSelectApp(idx)}
              className="relative flex flex-col items-center justify-center p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 cursor-pointer select-none min-w-[84px] sm:min-w-[96px] md:min-w-[108px] transition-transform active:scale-95"
            >
              {isActive && (
                <motion.div
                  layoutId="active-card-container"
                  className="absolute inset-0 bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-stone-200/90 z-0 pointer-events-none"
                  transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.7 }}
                />
              )}

              <motion.div
                className="relative z-10 flex flex-col items-center"
                animate={{
                  scale: isActive ? 1 : 0.94,
                  opacity: isActive ? 1 : 0.68,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <div className="relative w-12 h-9 sm:w-14 sm:h-10 md:w-16 md:h-11 rounded-lg sm:rounded-xl p-0.5 bg-stone-900 shadow-sm mb-1 flex items-center justify-center overflow-hidden border border-stone-300/80">
                  {app.videoUrl ? (
                    <video
                      src={app.videoUrl}
                      muted
                      playsInline
                      preload="none"
                      className="w-full h-full object-cover rounded-md sm:rounded-lg shadow-xs"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-md sm:rounded-lg flex items-center justify-center text-white"
                      style={{
                        background: `linear-gradient(135deg, #1c1917 0%, ${app.accentColor} 180%)`,
                      }}
                    >
                      <Clapperboard className="w-4 h-4 text-amber-300" />
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl border-2 border-amber-500 pointer-events-none animate-pulse" />
                  )}
                </div>

                <span
                  className={`text-[10px] sm:text-[11px] md:text-xs text-center line-clamp-1 sm:line-clamp-2 leading-tight px-0.5 max-w-[80px] sm:max-w-[92px] transition-colors duration-200 ${
                    isActive ? "font-bold text-stone-900" : "font-medium text-stone-600"
                  }`}
                >
                  {app.shortName}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        aria-label="Next app"
        className="uiverse-arrow group relative h-[52px] w-[52px] flex-shrink-0 cursor-pointer overflow-hidden rounded-full outline-none"
      >
        <span className="absolute inset-[7px] rounded-full border-[3px] border-stone-900 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] group-hover:scale-[0.7] group-hover:opacity-0" />
        <span className="absolute inset-[7px] scale-[1.3] rounded-full border-4 border-[#599a53] opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-100 group-hover:opacity-100" />
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 24 24"
            className="h-[26px] w-[26px] fill-stone-900 transition-transform duration-400 group-hover:translate-x-[42px]"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M4 13h12.17l-5.59 5.59L12 20l8-8-8-8-1.41 1.41L16.17 11H4v2z" />
            <path
              className="-translate-x-[42px] transition-transform duration-400 group-hover:translate-x-0"
              transform="translate(-42 0)"
              d="M4 13h12.17l-5.59 5.59L12 20l8-8-8-8-1.41 1.41L16.17 11H4v2z"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
