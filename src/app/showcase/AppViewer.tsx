"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { ShowcaseApp } from "../showcase-apps";

interface AppViewerProps {
  app: ShowcaseApp;
  direction?: number;
  active?: boolean;
  onOpenLivePreview?: () => void;
}

/**
 * AppViewer — Left stage video placeholder for both showcase apps.
 * Clean, blank frame without 3D tilt, arc, or glare effects, ready for
 * auto-playing videos (matching the contact mascot video style).
 */
export function AppViewer({ app }: AppViewerProps) {
  return (
    <div className="relative flex items-center justify-center w-full max-w-[480px] sm:max-w-[560px] lg:max-w-[620px] aspect-[16/10] select-none">
      <motion.div
        key={app.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full h-full rounded-2xl sm:rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-md flex flex-col items-center justify-center p-6 text-center overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
            <Play className="w-5 h-5 fill-neutral-400/40 text-neutral-400 translate-x-0.5" />
          </div>
          <p className="text-sm sm:text-base font-medium text-neutral-400 tracking-wide">
            video auto played here
          </p>
        </div>
      </motion.div>
    </div>
  );
}
