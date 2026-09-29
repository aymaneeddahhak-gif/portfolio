"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ShowcaseApp } from "../showcase-apps";

interface AppViewerProps {
  app: ShowcaseApp;
  direction?: number;
  active?: boolean;
}

export function AppViewer({ app, direction = 1, active = true }: AppViewerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // ponytail: pause offscreen video — decoding a 3MB mp4 while scrolling the hero is the scroll jank
    if (!active) {
      video.pause();
      return;
    }
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [app.id, active]);

  return (
    <div className="relative flex items-center justify-center select-none w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[620px] aspect-[16/10]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${app.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.65, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute w-full h-full rounded-3xl blur-3xl pointer-events-none -z-10"
          style={{
            background: `radial-gradient(ellipse at center, ${app.accentColor} 0%, ${app.ambientColor} 45%, rgba(255,255,255,0) 75%)`,
          }}
        />
      </AnimatePresence>

      <motion.div
        key={`shadow-${app.id}`}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 0.3, scale: 1, y: 24 }}
        exit={{ opacity: 0, scale: 0.4 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="absolute w-[90%] h-[85%] rounded-3xl bg-stone-950/30 blur-2xl pointer-events-none -z-10"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={app.id}
          initial={{ x: direction > 0 ? 100 : -100, y: 380, scale: 0.16, opacity: 0.8 }}
          animate={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 130, damping: 20, mass: 0.85 },
          }}
          exit={{
            x: direction > 0 ? -100 : 100,
            y: 380,
            scale: 0.16,
            opacity: 0.3,
            transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] },
          }}
          className="relative w-full h-full will-change-transform"
        >
          <video
            ref={videoRef}
            src={app.videoUrl}
            autoPlay={active}
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.25)]"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
