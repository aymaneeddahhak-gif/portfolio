"use client";

import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  return (
    <div className="relative flex items-center gap-1 sm:gap-2 select-none z-10 w-full max-w-2xl overflow-hidden">
      <button
        onClick={onPrev}
        aria-label="Previous app"
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-2xs border border-stone-300/60 flex items-center justify-center transition-all duration-150 active:scale-90 hover:shadow-sm flex-shrink-0 backdrop-blur-md"
      >
        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1.5 sm:py-2 px-1 flex-1">
        {apps.map((app, idx) => {
          const isActive = idx === currentAppIndex;
          return (
            <div
              key={app.id}
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
                  <video
                    src={app.videoUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover rounded-md sm:rounded-lg shadow-xs"
                  />
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
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-2xs border border-stone-300/60 flex items-center justify-center transition-all duration-150 active:scale-90 hover:shadow-sm flex-shrink-0 backdrop-blur-md"
      >
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}
