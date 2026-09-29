"use client";

import { motion, AnimatePresence } from "motion/react";
import type { ShowcaseApp } from "../showcase-apps";

export function AbstractBackdrop({ currentApp }: { currentApp: ShowcaseApp }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentApp.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 will-change-transform"
        >
          <div
            className="absolute top-[8%] left-[2%] w-[58%] h-[68%] rounded-[45%_55%_65%_35%/50%_45%_55%_50%] blur-2xl opacity-60 transition-all duration-700 will-change-transform"
            style={{
              background: currentApp.ambientColor || "rgba(94, 106, 210, 0.45)",
            }}
          />

          {/* ponytail: top wave SVG removed — its flat top edge drew a hard separator line against the hero */}

          <div className="absolute top-[28%] left-[42%] font-syne text-[160px] font-black text-stone-900/[0.03] select-none pointer-events-none leading-none tracking-tighter">
            {currentApp.namePart2}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
