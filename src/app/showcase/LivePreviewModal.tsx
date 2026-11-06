"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Play, Lock, RefreshCw, Smartphone, Laptop } from "lucide-react";
import type { ShowcaseApp } from "../showcase-apps";

interface LivePreviewModalProps {
  app: ShowcaseApp | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LivePreviewModal({ app, isOpen, onClose }: LivePreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Restart video playback when opened
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, app?.id]);

  if (!app) return null;

  const isVideoWalkthrough = Boolean(app.livePreviewVideoUrl);
  const isInteractiveMobile = app.id === "a-task";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative w-full max-w-4xl bg-stone-900 border-2 sm:border-3 border-stone-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col text-white"
          >
            {/* Top Chrome Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-stone-950/90 border-b border-stone-800 select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-bold text-stone-400 hidden sm:inline-flex items-center gap-1.5">
                  {isInteractiveMobile ? (
                    <>
                      <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                      Mobile App Live Preview
                    </>
                  ) : (
                    <>
                      <Laptop className="w-3.5 h-3.5 text-blue-400" />
                      Web Platform Live Preview
                    </>
                  )}
                </span>
              </div>

              {/* Fake browser URL pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-[11px] text-stone-300 font-mono max-w-[260px] sm:max-w-xs truncate">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">
                  {isInteractiveMobile
                    ? "a-task.solutions/demo"
                    : "a-store.solutions/live-preview"}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close live preview"
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Preview Display Area */}
            <div className="relative w-full aspect-video sm:aspect-[16/10] bg-stone-950 flex items-center justify-center overflow-hidden">
              {isVideoWalkthrough ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={app.livePreviewVideoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : isInteractiveMobile ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <iframe
                    src="/a-task"
                    title="A-Task Interactive Preview"
                    className="w-full h-full border-0 rounded-xl"
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-stone-400">
                  <p>Interactive preview available at live destination.</p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-stone-950 border-t border-stone-800 text-xs select-none">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase">
                  {app.platform}
                </span>
                <span className="font-extrabold text-stone-200">
                  {app.namePart1}
                  {app.namePart2}
                </span>
                <span className="text-stone-500 hidden sm:inline">· {app.category}</span>
              </div>

              <div className="flex items-center gap-2">
                {app.githubUrl && (
                  <a
                    href={app.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-colors"
                  >
                    <span>GitHub Code</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {app.liveUrl && app.liveUrl !== "#contact" && (
                  <a
                    href={app.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold transition-colors"
                  >
                    <span>Open Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
