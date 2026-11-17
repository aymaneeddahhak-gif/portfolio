"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

export interface ResumeModalProps {
  onClose: () => void;
}

export default function ResumeModal({ onClose }: ResumeModalProps) {
  const { lang, t } = useTranslation();
  // Default to the current site language (en -> EN.pdf, fr -> FR.pdf)
  const [version, setVersion] = useState<"en" | "fr">(
    lang === "fr" ? "fr" : "en",
  );

  const [loadedEn, setLoadedEn] = useState(false);
  const [loadedFr, setLoadedFr] = useState(false);
  const isCurrentLoaded = version === "en" ? loadedEn : loadedFr;

  const activePdfUrl = version === "fr" ? "/cvs/FR.pdf" : "/cvs/EN.pdf";
  const downloadFileName =
    version === "fr" ? "AED-Solutions-CV-FR.pdf" : "AED-Solutions-CV-EN.pdf";

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 md:p-6 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex h-[94vh] sm:h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-[#f6f7f9] shadow-[0_32px_90px_rgba(15,23,42,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="resume-modal-title" className="sr-only">
          {version === "fr"
            ? "Aperçu du CV - AED Solutions (FR)"
            : "CV Preview - AED Solutions (EN)"}
        </h2>

        {/* Compact Top Header Bar */}
        <div className="relative z-30 flex items-center justify-between gap-2 border-b border-slate-200/90 bg-[#f5f6f8] px-3 sm:px-5 py-2">
          {/* Left Title: "MY CV" */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] sm:text-[13px] font-black tracking-[0.2em] uppercase text-neutral-800 font-jakarta">
              MY CV
            </span>
          </div>

          {/* Centered Floating Notched Dock: [ FR | Download | EN ] */}
          <div className="relative mx-auto w-[280px] max-w-[calc(100vw-140px)] h-[62px] select-none">
            {/* Smooth Notched Curved SVG Silhouette */}
            <svg
              viewBox="0 0 280 62"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_8px_18px_rgba(15,23,42,0.1)] drop-shadow-[0_2px_6px_rgba(15,23,42,0.05)]"
            >
              <path
                d="
                  M 24 10
                  H 100
                  C 112 10, 118 16, 124 25
                  C 129 34, 134 42, 140 42
                  C 146 42, 151 34, 156 25
                  C 162 16, 168 10, 180 10
                  H 256
                  A 20 20 0 0 1 276 30
                  V 42
                  A 20 20 0 0 1 256 62
                  H 24
                  A 20 20 0 0 1 4 42
                  V 30
                  A 20 20 0 0 1 24 10
                  Z
                "
                fill="#ffffff"
              />
            </svg>

            {/* Center Elevated Raised Circular Download Button */}
            <a
              href={activePdfUrl}
              download={downloadFileName}
              title={
                version === "fr"
                  ? "Télécharger le CV (FR)"
                  : "Download CV (EN)"
              }
              aria-label={
                version === "fr"
                  ? "Télécharger le CV (FR)"
                  : "Download CV (EN)"
              }
              className="pointer-events-auto absolute -top-2 left-1/2 z-20 flex h-[46px] w-[46px] -translate-x-1/2 items-center justify-center rounded-full bg-[#18191b] text-white shadow-[0_8px_18px_rgba(24,25,27,0.38)] transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 cursor-pointer"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>

            {/* Dock Contents: FR on the Left of Download, EN on the Right of Download */}
            <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-between px-6 pt-2 pb-1.5">
              {/* Left Side: FR CV Tab */}
              <div className="flex w-[82px] items-center justify-center">
                <button
                  type="button"
                  onClick={() => setVersion("fr")}
                  className={`flex flex-col items-center gap-0.5 min-w-[48px] py-1 transition-colors duration-150 cursor-pointer ${
                    version === "fr"
                      ? "text-sky-600 font-black scale-105"
                      : "text-neutral-400 font-semibold hover:text-neutral-700"
                  }`}
                  title="Passer au CV Français (FR)"
                  aria-pressed={version === "fr"}
                >
                  <svg
                    className="h-4 w-4 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={version === "fr" ? 2.5 : 1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <line x1="7" y1="9" x2="17" y2="9" />
                    <line x1="7" y1="13" x2="14" y2="13" />
                  </svg>
                  <span className="text-[11px] font-bold tracking-tight">FR</span>
                </button>
              </div>

              {/* Right Side: EN CV Tab */}
              <div className="flex w-[82px] items-center justify-center">
                <button
                  type="button"
                  onClick={() => setVersion("en")}
                  className={`flex flex-col items-center gap-0.5 min-w-[48px] py-1 transition-colors duration-150 cursor-pointer ${
                    version === "en"
                      ? "text-sky-600 font-black scale-105"
                      : "text-neutral-400 font-semibold hover:text-neutral-700"
                  }`}
                  title="Switch to English CV (EN)"
                  aria-pressed={version === "en"}
                >
                  <svg
                    className="h-4 w-4 transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={version === "en" ? 2.5 : 1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <line x1="7" y1="9" x2="17" y2="9" />
                    <line x1="7" y1="13" x2="13" y2="13" />
                  </svg>
                  <span className="text-[11px] font-bold tracking-tight">EN</span>
                </button>
              </div>
            </div>

            {/* Subtle iOS-Style Bottom Home Indicator */}
            <div className="pointer-events-none absolute bottom-1 left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-neutral-200/90" />
          </div>

          {/* Right Header Controls: Open in New Tab & Close Modal */}
          <div className="flex items-center gap-2">
            {/* Open in New Tab */}
            <a
              href={activePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-neutral-700 bg-white border border-neutral-200/90 shadow-2xs hover:text-neutral-950 hover:border-neutral-300 transition-all cursor-pointer"
              title={
                lang === "fr"
                  ? "Ouvrir dans un nouvel onglet"
                  : "Open in new tab"
              }
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>{lang === "fr" ? "Ouvrir" : "Open"}</span>
            </a>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center h-8 w-8 rounded-full text-neutral-600 bg-white border border-neutral-200/90 shadow-2xs hover:text-neutral-950 hover:bg-neutral-100 transition-all cursor-pointer"
              title={t.resumeModal.close}
              aria-label={t.resumeModal.close}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body: Direct Preloaded Both CVs with Circular Loading Spinner */}
        <div className="relative flex-1 overflow-hidden bg-slate-100">
          {/* Circular Loading Animation Spinner */}
          {!isCurrentLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f6f7f9] transition-opacity duration-300">
              <div className="relative flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-[3px] border-neutral-200 border-t-neutral-900 animate-spin" />
              </div>
              <span className="mt-3 text-[11px] font-bold tracking-wider uppercase text-neutral-500 font-jakarta">
                {lang === "fr" ? "Chargement du CV..." : "Loading CV..."}
              </span>
            </div>
          )}

          {/* Preloaded EN CV Iframe */}
          <iframe
            src="/cvs/EN.pdf#view=FitH"
            title="AED Solutions CV - EN"
            onLoad={() => setLoadedEn(true)}
            className={`absolute inset-0 h-full w-full border-0 bg-slate-100 transition-opacity duration-200 ${
              version === "en"
                ? "opacity-100 z-[1] pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          />

          {/* Preloaded FR CV Iframe */}
          <iframe
            src="/cvs/FR.pdf#view=FitH"
            title="AED Solutions CV - FR"
            onLoad={() => setLoadedFr(true)}
            className={`absolute inset-0 h-full w-full border-0 bg-slate-100 transition-opacity duration-200 ${
              version === "fr"
                ? "opacity-100 z-[1] pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
