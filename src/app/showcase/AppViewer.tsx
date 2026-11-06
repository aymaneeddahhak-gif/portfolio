"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { Clapperboard, ExternalLink, Sparkles, Eye } from "lucide-react";
import type { ShowcaseApp } from "../showcase-apps";
import { soundFx } from "../about/sound";

interface AppViewerProps {
  app: ShowcaseApp;
  direction?: number;
  active?: boolean;
  onOpenLivePreview?: () => void;
}

export function AppViewer({
  app,
  direction = 1,
  active = true,
  onOpenLivePreview,
}: AppViewerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasVideo = Boolean(app.videoUrl);
  const [isHovered, setIsHovered] = useState(false);

  // Play subtle sound effect on app switch
  useEffect(() => {
    soundFx.playPop(540);
  }, [app.id]);

  // Video playback management
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;
    if (!active) {
      video.pause();
      return;
    }
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [app.id, active, hasVideo]);

  // Interactive 3D Gyroscope / Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  // Specular light sheen position
  const sheenX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, 80]), springConfig);
  const sheenY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, 80]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Next-Level Arc-Swoop Transition Trajectory (Faithfully derived from switch.mp4)
  const arcVariants: Variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 320 : -320,
      y: -140,
      rotateZ: dir > 0 ? 24 : -24,
      rotateY: dir > 0 ? 20 : -20,
      rotateX: 10,
      scale: 0.72,
      opacity: 0,
      filter: "blur(6px)",
    }),
    animate: {
      x: 0,
      y: 0,
      rotateZ: 0,
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 19,
        mass: 0.85,
        restDelta: 0.001,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -320 : 320,
      y: -140,
      rotateZ: dir > 0 ? -24 : 24,
      rotateY: dir > 0 ? -20 : 20,
      rotateX: 10,
      scale: 0.7,
      opacity: 0,
      filter: "blur(6px)",
      transition: {
        duration: 0.38,
        ease: [0.32, 0, 0.67, 0], // Fast arc launch out
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center select-none w-full max-w-[440px] sm:max-w-[540px] lg:max-w-[640px] aspect-[16/10] cursor-grab active:cursor-grabbing"
      style={{ perspective: 1400 }}
    >
      {/* 1. Dynamic Ambient Radial Bloom Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`glow-${app.id}`}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: isHovered ? 0.85 : 0.65, scale: isHovered ? 1.08 : 1 }}
          exit={{ opacity: 0, scale: 0.75 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute w-[110%] h-[110%] rounded-[40px] blur-3xl pointer-events-none -z-20 transition-opacity"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${app.accentColor} 0%, ${app.ambientColor} 50%, rgba(255,255,255,0) 75%)`,
          }}
        />
      </AnimatePresence>

      {/* 2. Realistic 3D Depth Shadow floating under the device */}
      <motion.div
        key={`shadow-${app.id}`}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: isHovered ? 0.45 : 0.32,
          scale: isHovered ? 1.02 : 0.94,
          y: isHovered ? 34 : 26,
        }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="absolute w-[88%] h-[82%] rounded-3xl bg-black/40 blur-2xl pointer-events-none -z-10"
      />

      {/* 3. 3D Gyroscope Tilt & Arc Stage */}
      <motion.div
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full will-change-transform flex items-center justify-center"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={app.id}
            custom={direction}
            variants={arcVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-stone-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Holographic Specular Glass Reflection Sheen */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-30 opacity-35 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.15) 30%, transparent 65%)`,
              }}
            />

            {/* Glowing Edge Rim Accent */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none z-20 border-[1.5px] opacity-70"
              style={{
                borderColor: app.accentColor,
                boxShadow: `inset 0 0 20px ${app.accentColor}33`,
              }}
            />

            {/* Content: Video or Sleek Commercial Teaser */}
            {hasVideo ? (
              <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={app.videoUrl}
                  autoPlay={active}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover select-none pointer-events-auto"
                />

                {/* Floating "Live Preview" hover pill */}
                {onOpenLivePreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLivePreview();
                    }}
                    className={`absolute bottom-3 right-3 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                      isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expand</span>
                  </button>
                )}
              </div>
            ) : (
              /* Commerce promo video placeholder card */
              <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-950 to-neutral-900 overflow-hidden">
                {/* Subtle mesh background accent */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${app.accentColor} 0%, transparent 70%)`,
                  }}
                />

                {/* Status Header Badge */}
                <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700/80 text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>Commerce Video In Production</span>
                </div>

                {/* Center Slate */}
                <div className="relative z-10 flex flex-col items-center text-center my-auto py-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 shadow-inner">
                    <Sparkles className="w-7 h-7 text-amber-300" />
                  </div>
                  <h3 className="font-syne font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
                    {app.namePart1}
                    {app.namePart2} Commercial Video
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 max-w-sm mt-1.5 font-medium">
                    Official commercial video dropping soon. Click below to experience the live preview now!
                  </p>
                </div>

                {/* Live Preview CTA Button */}
                {onOpenLivePreview && (
                  <button
                    type="button"
                    onClick={onOpenLivePreview}
                    className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <span>View Live Preview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
