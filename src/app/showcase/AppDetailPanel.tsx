"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Cpu } from "lucide-react";
import type { ShowcaseApp } from "../showcase-apps";

interface AppDetailPanelProps {
  app: ShowcaseApp;
  viewTab: "overview" | "features";
  onChangeTab: (tab: "overview" | "features") => void;
}

export function AppDetailPanel({
  app,
  viewTab,
  onChangeTab,
}: AppDetailPanelProps) {
  const stackItems = app.techStack.split("•").map((item) => item.trim());

  return (
    <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] border border-white/95 flex flex-col justify-between select-none z-10 transition-all duration-300 mx-auto lg:mx-0 min-h-[360px]">
      <div>
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-3 mb-4">
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-full w-full">
            <button
              onClick={() => onChangeTab("overview")}
              className={`relative flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-center ${
                viewTab === "overview"
                  ? "text-stone-900 font-bold"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {viewTab === "overview" && (
                <motion.div
                  layoutId="panelTabIndicator"
                  className="absolute inset-0 bg-white rounded-full shadow-2xs"
                />
              )}
              <span className="relative z-10">Overview</span>
            </button>

            <button
              onClick={() => onChangeTab("features")}
              className={`relative flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 text-center ${
                viewTab === "features"
                  ? "text-stone-900 font-bold"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {viewTab === "features" && (
                <motion.div
                  layoutId="panelTabIndicator"
                  className="absolute inset-0 bg-white rounded-full shadow-2xs"
                />
              )}
              <span className="relative z-10">Feature &amp; Tech Stack</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewTab === "overview" ? (
            <motion.div
              key={`overview-${app.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3.5"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-700">
                    {app.rankLabel}
                  </span>
                  <span className="text-[11px] font-medium text-stone-500">
                    {app.platform}
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-lg sm:text-xl text-stone-900 leading-tight">
                  {app.shortName}
                </h4>
                <p className="text-xs text-stone-500 font-medium">{app.category}</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50/90 border border-stone-200/80">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  {app.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`features-${app.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3.5 max-h-[250px] overflow-y-auto pr-1"
            >
              <div className="flex flex-col gap-2 p-3 rounded-2xl bg-stone-50/90 border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>Technologies &amp; Architecture</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {stackItems.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-semibold text-stone-800 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
                  <span>Architecture Highlights</span>
                  <span>{app.features.length} features</span>
                </div>
                {app.features.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight">
                        {feat.name}
                      </span>
                      <span className="text-[11px] text-stone-600 leading-normal block mt-0.5">
                        {feat.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
