"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { ShowcaseApp } from "../showcase-apps";
import { useTranslation } from "@/i18n/LanguageContext";

interface AppDetailPanelProps {
  app: ShowcaseApp;
  direction?: number;
  viewTab?: "overview" | "features";
  onChangeTab?: (tab: "overview" | "features") => void;
  onViewApp?: (app: ShowcaseApp) => void;
}

// 3D squircle icons from the existing project image set
const STACK_LOGOS: Record<string, string> = {
  flutter: "/images/tech/flutter.webp",
  "react native": "/images/tech/react.webp",
  react: "/images/tech/react.webp",
  "next.js": "/images/tech/nextjs.webp",
  nextjs: "/images/tech/nextjs.webp",
  laravel: "/images/tech/laravel.webp",
  firebase: "/images/tech/api.webp",
  typescript: "/images/tech/javascript.webp",
  javascript: "/images/tech/javascript.webp",
  "node.js": "/images/tech/api.webp",
  nodejs: "/images/tech/api.webp",
  docker: "/images/tech/docker.webp",
  "cloud native": "/images/tech/cloud-native.webp",
  "cloud-native": "/images/tech/cloud-native.webp",
  supabase: "/images/tech/supabase.webp",
  android: "/images/tech/flutter.webp",
  ios: "/images/tech/flutter.webp",
  tailwind: "/images/tech/tailwind.webp",
  "tailwind css": "/images/tech/tailwind.webp",
};

// Mapping from tech name to About Me section tech ID
const TECH_NAME_TO_ABOUT_ID: Record<string, string> = {
  "next.js": "nextjs",
  nextjs: "nextjs",
  react: "react",
  "react native": "react",
  github: "github",
  docker: "docker",
  "cloud native": "cloud-native",
  "cloud-native": "cloud-native",
  supabase: "supabase",
  flutter: "flutter",
  typescript: "javascript",
  javascript: "javascript",
  html5: "html5",
  css: "css",
  tailwind: "tailwind",
  "tailwind css": "tailwind",
  bootstrap: "bootstrap",
  php: "php",
  laravel: "laravel",
  python: "python",
  mysql: "mysql",
  mongodb: "mongodb",
  api: "api",
  "node.js": "api",
  nodejs: "api",
  firebase: "api",
  android: "flutter",
  ios: "flutter",
  git: "git",
  gitlab: "gitlab",
  jira: "jira",
  agile: "agile",
  figma: "figma",
};

export function AppDetailPanel({
  app,
  direction = 1,
  onViewApp,
}: AppDetailPanelProps) {
  const { lang } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const stackItems = app.techStack.split("•").map((item) => item.trim());
  const displayItems = stackItems.slice(0, 4);

  const handleTechClick = (tech: string) => {
    const key = tech.toLowerCase();
    const aboutId = TECH_NAME_TO_ABOUT_ID[key] || "nextjs";
    window.dispatchEvent(
      new CustomEvent("select-about-tech", { detail: { techId: aboutId } }),
    );
  };

  return (
    <div className="relative w-full max-w-[540px] mx-auto select-none z-10 transition-all duration-300">
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={app.id}
          custom={direction}
          initial={{
            opacity: 0,
            x: direction > 0 ? 32 : -32,
            scale: 0.96,
            filter: "blur(3px)",
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: 0.42,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? -28 : 28,
            scale: 0.96,
            filter: "blur(3px)",
            transition: {
              duration: 0.25,
              ease: [0.32, 0, 0.67, 0],
            },
          }}
          className="neo-card"
        >
          {/* Background grid and dot patterns */}
          <div className="neo-card-pattern-grid" />
          <div className="neo-card-overlay-dots" />

          {/* Top-right corner SVG hatch */}
          <div className="neo-bold-pattern">
            <svg viewBox="0 0 100 100">
              <path
                strokeDasharray="15 10"
                strokeWidth="10"
                stroke="#000"
                fill="none"
                d="M0,0 L100,0 L100,100 L0,100 Z"
              />
            </svg>
          </div>

          {/* Card Title Ribbon showing the kind of app (e.g. TASK MANAGEMENT APP, E-COMMERCE APP) */}
          <div className="neo-card-title-area">
            <span>{app.category}</span>
            <span className="neo-card-tag">{app.rankLabel}</span>
          </div>

          {/* Unified Card Body */}
          <div className="neo-card-body">
            {/* Platform Badge (Case study removed) */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0_#000]">
                {app.platform}
              </span>
            </div>

            {/* Big Prominent Project Name with 'A-' prefix */}
            <div className="mb-3">
              <h2 className="font-syne font-black text-3xl sm:text-4xl lg:text-[42px] text-black uppercase tracking-tight leading-[0.92]">
                <span className="text-black">{app.namePart1}</span>
                <span className="text-stone-700">{app.namePart2}</span>
              </h2>
            </div>

            {/* Project Description with View More toggle */}
            <div className="neo-card-description mb-3">
              <span>{app.description}</span>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1 ml-1.5 font-black text-black hover:text-purple-600 underline decoration-2 underline-offset-2 cursor-pointer transition-colors text-[11px] uppercase tracking-wide"
              >
                {showDetails ? "View Less ▲" : "View More ▼"}
              </button>

              {/* Expanded details in same card same style */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-2.5 pt-2 border-t-2 border-dashed border-black/20"
                  >
                    <p className="text-[10px] font-black uppercase text-black tracking-wider mb-1.5">
                      Key Highlights & Architecture:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {app.features.map((feat) => (
                        <div
                          key={feat.id}
                          className="p-1.5 rounded-md bg-stone-50 border-2 border-black text-[11px] shadow-[1px_1px_0_#000]"
                        >
                          <span className="font-extrabold text-black block leading-tight">
                            {feat.name}
                          </span>
                          <span className="text-stone-600 text-[10px] leading-tight block mt-0.5">
                            {feat.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Feature & Tech Grid with existing 3D project icons — Clickable to guide to About Me */}
            <div className="neo-feature-grid">
              {displayItems.map((tech) => {
                const key = tech.toLowerCase();
                const logo = STACK_LOGOS[key];

                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleTechClick(tech)}
                    title={`Click to explore ${tech} in About Me section`}
                    className="neo-feature-item cursor-pointer text-left group/tech transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
                  >
                    <div className="neo-feature-icon transition-transform duration-200 group-hover/tech:scale-110">
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt={tech}
                          className="h-full w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-[10px] font-black uppercase text-stone-700">
                          {tech.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="neo-feature-text transition-colors group-hover/tech:text-purple-600">
                        {tech}
                      </span>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider -mt-0.5 group-hover/tech:text-purple-500">
                        Explore ↗
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dashed cut-line with scissors & Action Row - Explore App centered */}
            <div className="neo-card-actions justify-center gap-3">
              {app.githubUrl && (
                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View GitHub Repository"
                  className="p-2.5 rounded-lg border-2 border-black bg-white hover:bg-stone-100 text-black shadow-[2px_2px_0_#000] hover:shadow-[3px_3px_0_#000] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                  aria-label={`View GitHub repository for ${app.shortName}`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              )}
              <button
                type="button"
                onClick={() => onViewApp?.(app)}
                className="neo-card-button px-6 cursor-pointer"
                aria-label={`View live preview of ${app.shortName}`}
              >
                <span>{lang === "fr" ? "Voir l'App" : "View App"}</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Decorative Dot Pattern */}
          <div className="neo-dots-pattern">
            <svg viewBox="0 0 80 40">
              <circle fill="#000" r="3" cy="10" cx="10" />
              <circle fill="#000" r="3" cy="10" cx="30" />
              <circle fill="#000" r="3" cy="10" cx="50" />
              <circle fill="#000" r="3" cy="10" cx="70" />
              <circle fill="#000" r="3" cy="20" cx="20" />
              <circle fill="#000" r="3" cy="20" cx="40" />
              <circle fill="#000" r="3" cy="20" cx="60" />
              <circle fill="#000" r="3" cy="30" cx="10" />
              <circle fill="#000" r="3" cy="30" cx="30" />
              <circle fill="#000" r="3" cy="30" cx="50" />
              <circle fill="#000" r="3" cy="30" cx="70" />
            </svg>
          </div>

          {/* Accent Shapes */}
          <div className="neo-accent-shape" />
          <div className="neo-corner-slice" />

          {/* Approved Stamp */}
          <div className="neo-stamp">
            <span className="neo-stamp-text">Approved</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
