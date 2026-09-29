"use client";

import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Laptop } from "lucide-react";
import type { ShowcaseApp } from "../showcase-apps";

interface AppHeaderProps {
  app: ShowcaseApp;
  direction?: number;
}

export function AppHeader({ app, direction = 1 }: AppHeaderProps) {
  return (
    <div className="flex flex-col justify-center select-none z-10 items-center lg:items-start text-center lg:text-left">
      <div className="overflow-hidden mb-1 py-0.5 min-h-[26px]">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={`rank-${app.id}`}
            custom={direction}
            initial={{ opacity: 0, y: direction > 0 ? 16 : -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -16 : 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2"
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-stone-700 uppercase">
              {app.rankLabel}
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 hidden sm:block" />
            <span className="text-[10px] sm:text-xs font-medium text-stone-700">
              {app.category}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="py-0.5">
        <div className="flex flex-col font-syne font-black text-stone-900 leading-[0.88] tracking-tighter">
          <div className="overflow-hidden py-0.5">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.h3
                key={`p1-${app.id}`}
                custom={direction}
                initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.75 },
                }}
                exit={{
                  y: direction > 0 ? "-100%" : "100%",
                  opacity: 0,
                  transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] },
                }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-[56px] uppercase drop-shadow-xs will-change-transform"
              >
                {app.namePart1}
              </motion.h3>
            </AnimatePresence>
          </div>

          <div className="overflow-hidden py-0.5">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.h3
                key={`p2-${app.id}`}
                custom={direction}
                initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 220,
                    damping: 24,
                    mass: 0.75,
                    delay: 0.04,
                  },
                }}
                exit={{
                  y: direction > 0 ? "-100%" : "100%",
                  opacity: 0,
                  transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0], delay: 0.02 },
                }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-[56px] uppercase text-stone-700 will-change-transform"
              >
                {app.namePart2}
              </motion.h3>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 mt-3 sm:mt-5">
        <a
          href={app.liveUrl}
          title={`Open the live app: ${app.shortName}`}
          className="group flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-stone-900 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 border border-stone-800"
        >
          <div className="w-5 h-5 rounded-full bg-white text-stone-900 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ExternalLink className="w-2.5 h-2.5 text-stone-900" />
          </div>
          <span>Live App</span>
        </a>

        <div className="hidden xl:flex items-center gap-2 text-xs text-stone-500 font-medium ml-1">
          <span className="flex items-center gap-1 bg-white/60 px-2.5 py-1 rounded-full border border-stone-200">
            <Laptop className="w-3 h-3 text-stone-400" />
            {app.platform}
          </span>
        </div>
      </div>
    </div>
  );
}
