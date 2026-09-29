"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Laptop, Smartphone, LayoutGrid } from "lucide-react";
import { SHOWCASE_APPS } from "./showcase-apps";
import { AbstractBackdrop } from "./showcase/AbstractBackdrop";
import { AppViewer } from "./showcase/AppViewer";
import { AppHeader } from "./showcase/AppHeader";
import { AppDetailPanel } from "./showcase/AppDetailPanel";
import { AppCarousel } from "./showcase/AppCarousel";

type PlatformFilter = "all" | "web" | "mobile";
type ViewTab = "overview" | "features";

const FILTERS: { id: PlatformFilter; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "web", label: "Web", icon: <Laptop className="w-4 h-4" /> },
  { id: "mobile", label: "Mobile", icon: <Smartphone className="w-4 h-4" /> },
];

export default function ProjectShowcase() {
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [viewTab, setViewTab] = useState<ViewTab>("overview");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const filteredApps = SHOWCASE_APPS.filter((app) => {
    if (platformFilter === "all") return true;
    return app.platformFilter === platformFilter;
  });

  const displayApps = filteredApps.length > 0 ? filteredApps : SHOWCASE_APPS;
  const currentApp = displayApps[currentAppIndex % displayApps.length];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleNextApp = useCallback(() => {
    setDirection(1);
    setCurrentAppIndex((prev) => (prev + 1) % displayApps.length);
  }, [displayApps.length]);

  const handlePrevApp = useCallback(() => {
    setDirection(-1);
    setCurrentAppIndex((prev) => (prev - 1 + displayApps.length) % displayApps.length);
  }, [displayApps.length]);

  // Auto-cycle only while the section is on screen
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      if (!document.hidden) handleNextApp();
    }, 6000);
    return () => clearInterval(timer);
  }, [isVisible, handleNextApp]);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextApp();
      else if (e.key === "ArrowLeft") handlePrevApp();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextApp, handlePrevApp]);

  const handleSelectApp = (index: number) => {
    setDirection(index >= currentAppIndex ? 1 : -1);
    setCurrentAppIndex(index);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="showcase-section relative w-full bg-white py-10 sm:py-14 overflow-hidden selection:bg-amber-500 selection:text-white"
      aria-label="App showcase"
    >
      <div className="relative w-full max-w-[1440px] mx-auto min-h-[640px] lg:aspect-[16/10] flex flex-col justify-between">
        <AbstractBackdrop currentApp={currentApp} />

        <div className="relative z-10 w-full h-full flex flex-col justify-between p-2 sm:p-4 md:p-6 lg:p-8 flex-1">
          {/* Platform switch */}
          <header className="relative w-full flex items-center justify-center gap-2 pt-2 sm:pt-3 pb-2 select-none z-30">
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-xs">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
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
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    platformFilter === filter.id
                      ? "bg-stone-900 text-white shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {filter.icon}
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>
          </header>

          {/* Main stage */}
          <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center my-auto min-h-0 py-2 sm:py-4">
            <div className="lg:col-span-5 flex items-center justify-center py-1 sm:py-3">
              <AppViewer app={currentApp} direction={direction} active={isVisible} />
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center px-1 sm:px-3 text-center lg:text-left items-center lg:items-start">
              <AppHeader app={currentApp} direction={direction} />
            </div>

            <div className="lg:col-span-3 flex justify-center lg:justify-end w-full">
              <AppDetailPanel
                app={currentApp}
                viewTab={viewTab}
                onChangeTab={setViewTab}
              />
            </div>
          </div>

          {/* Carousel */}
          <div className="relative flex items-center justify-center w-full pt-2 pb-1">
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
    </section>
  );
}
