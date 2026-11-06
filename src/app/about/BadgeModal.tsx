"use client";

import { useEffect } from "react";
import { ExternalLink, Layers, Sparkles, Terminal, X } from "lucide-react";
import type { TechItem } from "./types";

interface BadgeModalProps {
  item: TechItem | null;
  onClose: () => void;
}

// Full detail for whichever badge the visitor tapped on the stage.
export function BadgeModal({ item, onClose }: BadgeModalProps) {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="presentation"
      className="about-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-badge-modal-title"
        className="about-card-shadow relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-white p-6 sm:p-8"
        style={{ boxShadow: "0 25px 60px -15px rgba(27, 39, 87, 0.25)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          autoFocus
          className="absolute top-5 right-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* The logo art is already cut out, so it floats on the card light
              with a soft shadow instead of sitting in a plate. */}
          <div className="mb-4 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain drop-shadow-[0_16px_24px_rgba(27,39,87,0.28)]"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mb-2 inline-flex items-center space-x-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold tracking-widest text-[#313bac] uppercase">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{item.category}</span>
          </div>

          <h3
            id="about-badge-modal-title"
            className="text-2xl font-extrabold tracking-tight text-[#151722] sm:text-3xl"
          >
            {item.name}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5a6475]">
            {item.fullDescription}
          </p>
        </div>

        <div className="mt-6 flex flex-col space-y-4 border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center space-x-1.5 font-semibold text-gray-400">
              <Layers aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Key domains</span>
            </span>
            <span className="flex flex-wrap justify-end gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center space-x-1.5 font-semibold text-gray-400">
              <Terminal aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Official domain</span>
            </span>
            <span className="text-[11px] font-bold text-[#313bac] sm:text-xs">
              {item.linkDisplay}
            </span>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <a
            href={item.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center space-x-1.5 rounded-xl bg-[#313bac] px-4 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-md shadow-[#313bac]/25 transition-all hover:bg-[#272f8d] active:scale-98"
          >
            <span>Visit documentation</span>
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 px-5 py-3 text-xs font-semibold tracking-wider text-gray-600 uppercase transition-colors hover:bg-gray-50 active:scale-98"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
