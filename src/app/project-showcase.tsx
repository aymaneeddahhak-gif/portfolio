"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Laptop, Smartphone, LayoutGrid } from "lucide-react";
import { SHOWCASE_APPS, type ShowcaseApp } from "./showcase-apps";
import { AbstractBackdrop } from "./showcase/AbstractBackdrop";
import { AppViewer } from "./showcase/AppViewer";
import { AppDetailPanel } from "./showcase/AppDetailPanel";
import { AppCarousel } from "./showcase/AppCarousel";
import { useReplaySection, useTouchScrollChoreography } from "./motion-coordinator";
import { useTranslation } from "@/i18n/LanguageContext";

const LivePreviewModal = dynamic(() =>
  import("./showcase/LivePreviewModal").then((m) => m.LivePreviewModal),
);

type PlatformFilter = "all" | "web" | "mobile";

const FILTERS: { id: PlatformFilter; icon: React.ReactNode }[] = [
  { id: "all", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "web", icon: <Laptop className="w-4 h-4" /> },
  { id: "mobile", icon: <Smartphone className="w-4 h-4" /> },
];

export default function ProjectShowcase() {
  const { lang } = useTranslation();
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [previewModalApp, setPreviewModalApp] = useState<ShowcaseApp | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const showcaseMotion = useReplaySection(sectionRef);
  const isVisible = showcaseMotion.isVisible;

  const filteredApps = SHOWCASE_APPS.filter((app) => {
    if (platformFilter === "all") return true;
    return app.platformFilter === platformFilter;
  });

  const displayApps = filteredApps.length > 0 ? filteredApps : SHOWCASE_APPS;
  const currentApp = displayApps[currentAppIndex % displayApps.length];

  useTouchScrollChoreography(sectionRef, {
    enabled: isVisible,
    onProgress: (progress, el) => {
      const lift = Math.cos(progress * Math.PI * 0.5) * -6;
      el.style.setProperty("--showcase-scroll-y", `${lift.toFixed(1)}px`);
    },
  });

  const handleNextApp = useCallback(() => {
    setDirection(1);
    setCurrentAppIndex((prev) => (prev + 1) % displayApps.length);
  }, [displayApps.length]);

  const handlePrevApp = useCallback(() => {
    setDirection(-1);
    setCurrentAppIndex((prev) => (prev - 1 + displayApps.length) % displayApps.length);
  }, [displayApps.length]);

  // Auto-cycle only while the section is on screen AND user is not reading/hovering or viewing modal
  useEffect(() => {
    if (!isVisible || isHovered || isPreviewModalOpen) return;
    const timer = setInterval(() => {
      if (!document.hidden) handleNextApp();
    }, 6000);
    return () => clearInterval(timer);
  }, [isVisible, isHovered, isPreviewModalOpen, handleNextApp]);

  // Hero "VIEW OUR WORK" buttons jump to a specific app
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      const idx = SHOWCASE_APPS.findIndex((a) => a.id === detail);
      if (idx === -1) return;
      const displayIdx = displayApps.findIndex((a) => a.id === detail);
      setPlatformFilter("all");
      setDirection(idx >= currentAppIndex ? 1 : -1);
      setCurrentAppIndex(displayIdx === -1 ? idx : displayIdx);
    };
    window.addEventListener("portfolio:select-project", handler);
    return () => window.removeEventListener("portfolio:select-project", handler);
  }, [currentAppIndex, displayApps]);

  // Keyboard navigation — scoped strictly to visible showcase & never hijacks text inputs
  useEffect(() => {
    if (!isVisible || isPreviewModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowRight") handleNextApp();
      else if (e.key === "ArrowLeft") handlePrevApp();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, isPreviewModalOpen, handleNextApp, handlePrevApp]);

  const handleSelectApp = (index: number) => {
    setDirection(index >= currentAppIndex ? 1 : -1);
    setCurrentAppIndex(index);
  };

  const handleOpenLivePreview = (appToPreview?: ShowcaseApp) => {
    const target = appToPreview || currentApp;
    setPreviewModalApp(target);
    setIsPreviewModalOpen(true);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="showcase-section scroll-reveal-section relative w-full bg-transparent py-8 sm:py-14 overflow-hidden selection:bg-amber-500 selection:text-white"
      data-motion-state={showcaseMotion.motionState}
      data-motion-reentry={showcaseMotion.isReentry ? "true" : "false"}
      aria-label="App showcase"
    >
      <div className="relative w-full max-w-[1440px] mx-auto min-h-[460px] sm:min-h-[600px] lg:aspect-[16/10] flex flex-col justify-between">
        <AbstractBackdrop currentApp={currentApp} active={isVisible} />

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-2 sm:p-4 md:p-6 lg:p-8 flex-1 gap-2 sm:gap-0">
          {/* Platform switch */}
          <header
            data-reveal-step="1"
            className="order-1 relative w-full flex items-center justify-center gap-2 pt-1 sm:pt-3 pb-1 sm:pb-2 select-none z-30"
          >
            <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-white/95 border border-stone-200/90 shadow-xs">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    setPlatformFilter(filter.id);
                    setCurrentAppIndex(0);
                    setDirection(1);
                  }}
                  title={
                    filter.id === "web"
                      ? "Web & Desktop Applications"
                      : filter.id === "mobile"
                        ? "Mobile Applications"
                        : "All Platforms"
                  }
                  className={`flex min-h-[34px] sm:min-h-[40px] items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold transition-all cursor-pointer ${
                    platformFilter === filter.id
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {filter.icon}
                  <span className="hidden sm:inline">
                    {filter.id === "all"
                      ? lang === "fr"
                        ? "Tous"
                        : "All"
                      : filter.id === "web"
                        ? "Web"
                        : "Mobile"}
                  </span>
                </button>
              ))}
            </div>
          </header>

          {/* Main stage: video above detail card on mobile, 2 columns side-by-side on laptop */}
          <div className="order-3 lg:order-2 relative flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-center my-auto min-h-0 py-1 sm:py-4">
            <div
              data-reveal-step="3"
              className="lg:col-span-6 flex items-center justify-center py-1 sm:py-3"
            >
              <AppViewer
                app={currentApp}
                direction={direction}
                active={isVisible}
                onOpenLivePreview={() => handleOpenLivePreview(currentApp)}
              />
            </div>

            <div
              data-reveal-step="4"
              className="lg:col-span-6 flex justify-center lg:justify-end w-full"
            >
              <AppDetailPanel
                app={currentApp}
                direction={direction}
                onViewApp={(app) => handleOpenLivePreview(app)}
              />
            </div>
          </div>

          {/* Switch controls: above video & card on mobile, below on laptop */}
          <div
            data-reveal-step="2"
            className="order-2 lg:order-3 relative flex items-center justify-center w-full pt-1 pb-1 lg:pt-2"
          >
            <AppCarousel
              apps={displayApps}
              currentAppIndex={currentAppIndex % displayApps.length}
              onSelectApp={handleSelectApp}
              onPrev={handlePrevApp}
              onNext={handleNextApp}
            />
          </div>
        </div>
      </div>

      {/* Live Preview Modal — lazy-loaded on demand */}
      {isPreviewModalOpen && (
        <LivePreviewModal
          app={previewModalApp}
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </section>
  );
}
