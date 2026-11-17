"use client";

import { motion, AnimatePresence } from "motion/react";
import type { ShowcaseApp } from "../showcase-apps";
import { ShowcaseThreeCanvas } from "./ShowcaseThreeCanvas";

export function AbstractBackdrop({
  currentApp,
  active = true,
}: {
  currentApp: ShowcaseApp;
  active?: boolean;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Ambient Floating Particle Field (Lightweight 2D Canvas) */}
      <ShowcaseThreeCanvas
        accentColor={currentApp.accentColor}
        ambientColor={currentApp.ambientColor}
        active={active}
      />

      {/* 2. Soft, clean ambient radial bloom */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentApp.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Subtle soft ambient radial glow behind the active card */}
          <div
            className="absolute top-[10%] left-[8%] w-[55%] h-[65%] rounded-full opacity-35 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${currentApp.accentColor} 0%, ${currentApp.ambientColor} 50%, transparent 75%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
