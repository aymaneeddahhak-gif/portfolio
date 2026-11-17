"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type RefObject,
} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { soundFx } from "./about/sound";
import { ParticleText } from "./particle-text";
import { useTranslation } from "@/i18n/LanguageContext";
import {
  LazySection,
  PortfolioBootOverlay,
  usePortfolioBoot,
  useReplaySection,
  useTouchScrollChoreography,
} from "./motion-coordinator";

const ProjectShowcase = dynamic(() => import("./project-showcase"));
const AboutSection = dynamic(() => import("./about-section"));
const ContactSection = dynamic(() => import("./contact-section"));
const ResumeModal = dynamic(() => import("./resume-modal"), { ssr: false });

type HoveredSection = "default" | "mobile" | "web";
type InteractiveSection = Exclude<HoveredSection, "default">;
type ProjectShortcut = "a-task" | "a-store";
type LogoMedia =
  | { kind: "video"; src: string; label: string }
  | { kind: "image"; src: string; label: string };

const LOGO_MEDIA_SEQUENCE = [
  {
    kind: "video",
    src: "/videos/Logo1.webm",
    label: "AED Solutions animated brand mark one",
  },
  {
    kind: "image",
    src: "/images/logosultion.png",
    label: "AED Solutions brand mark",
  },
  {
    kind: "video",
    src: "/videos/LOGOvideo3.webm",
    label: "AED Solutions animated brand mark three",
  },
  {
    kind: "video",
    src: "/videos/logo3.webm",
    label: "AED Solutions animated brand mark four",
  },
] satisfies LogoMedia[];

const STATIC_LOGO_DURATION = 4010;

// The mobile clip's studio backdrop is keyed out of the file and shipped as a
// mask (see .product-overlay--mobile in globals.css), so a single matte source
// is all it needs; the web clip keeps its own framed screenshot.
const overlayConfig = {
  mobile: {
    video: "/videos/mobilecontexxt.mp4",
    type: "video/mp4",
    label: "Animated mobile application product showcase",
  },
  web: {
    video: "/videos/webcntx.webm",
    type: "video/webm",
    label: "Animated web development product showcase",
  },
} satisfies Record<
  InteractiveSection,
  { video: string; type: string; label: string }
>;

function NavLogoMedia({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const media = reducedMotion
    ? LOGO_MEDIA_SEQUENCE[1]
    : LOGO_MEDIA_SEQUENCE[mediaIndex];

  const advanceMedia = () => {
    setMediaIndex((index) => (index + 1) % LOGO_MEDIA_SEQUENCE.length);
  };

  useEffect(() => {
    if (!active || reducedMotion || media.kind !== "image") return;
    const timer = window.setTimeout(() => {
      setMediaIndex((index) => (index + 1) % LOGO_MEDIA_SEQUENCE.length);
    }, STATIC_LOGO_DURATION);
    return () => window.clearTimeout(timer);
  }, [active, media.kind, reducedMotion]);

  if (media.kind === "image") {
    return (
      <Image
        key={`${active}-${media.src}`}
        src={media.src}
        alt={media.label}
        width={1180}
        height={428}
        sizes="200px"
        className="site-nav__logo-item site-nav__logo-item--image"
        onError={advanceMedia}
      />
    );
  }

  return (
    <video
      key={`${active}-${media.src}`}
      className="site-nav__logo-item site-nav__logo-item--video"
      aria-label={media.label}
      autoPlay={active && !reducedMotion}
      controls={false}
      controlsList="nodownload noplaybackrate nofullscreen"
      disablePictureInPicture
      disableRemotePlayback
      muted
      playsInline
      preload={active ? "auto" : "metadata"}
      tabIndex={-1}
      onEnded={advanceMedia}
      onError={advanceMedia}
    >
      <source src={media.src} type="video/webm" />
    </video>
  );
}

// Letters for the stepped frosted-glass headings. "ink" = the dark base
// colour; the others are the Patrick Heng accent palette.
type HeadingLetter = readonly [char: string, color: string];
const INK = "ink";
const HEADING_LETTERS = {
  mobile: [
    [["M", INK], ["O", "#a855f7"], ["B", "#ec4899"], ["I", "#f97316"], ["L", INK], ["E", "#f59e0b"]],
    [["S", INK], ["E", "#f59e0b"], ["R", INK], ["V", "#a855f7"], ["I", INK], ["C", "#ec4899"], ["E", INK]],
  ],
  web: [
    [["W", INK], ["E", "#f59e0b"], ["B", "#0ea5e9"]],
    [["S", INK], ["E", "#0ea5e9"], ["R", INK], ["V", "#a855f7"], ["I", INK], ["C", "#f59e0b"], ["E", INK]],
  ],
} satisfies Record<InteractiveSection, HeadingLetter[][]>;

function GlassHeading({
  rows,
  align,
}: {
  rows: HeadingLetter[][];
  align: "start" | "end";
}) {
  const [top, bottom] = rows;
  const box =
    "flex items-center gap-[1px] sm:gap-1 border border-white/80 bg-white/75 shadow-[0_8px_30px_rgba(0,0,0,0.10)] backdrop-blur-md";
  const letter = ([char, color]: HeadingLetter, i: number) => (
    <span
      key={i}
      className="font-syne font-black text-[13px] min-[400px]:text-[15px] sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[48px] leading-none"
      style={
        color === INK
          ? { color: "#111111" }
          : { color, textShadow: "1.2px 1.2px 0 #111111" }
      }
    >
      {char}
    </span>
  );

  return (
    <div
      className={`flex flex-col ${
        align === "start" ? "items-start" : "items-end"
      } group-hover/heading:scale-[1.02] transition-transform duration-200`}
    >
      <div className={`${box} border-b-0 px-2 min-[400px]:px-2.5 sm:px-6 py-1 sm:py-2 rounded-t-lg sm:rounded-t-2xl`}>
        {top.map(letter)}
      </div>
      <div className={`${box} px-2.5 min-[400px]:px-3 sm:px-8 py-1 sm:py-2 rounded-b-lg sm:rounded-b-2xl`}>
        {bottom.map(letter)}
      </div>
    </div>
  );
}

function ProductOverlayVideo({
  videoRef,
  className,
  label,
  src,
  type,
  hidden = false,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  className: string;
  label?: string;
  src: string;
  type: string;
  hidden?: boolean;
}) {
  return (
    <video
      ref={videoRef}
      className={className}
      aria-label={label}
      aria-hidden={hidden || undefined}
      controls={false}
      controlsList="nodownload noplaybackrate nofullscreen"
      disablePictureInPicture
      disableRemotePlayback
      loop
      muted
      playsInline
      preload="metadata"
      tabIndex={-1}
    >
      <source src={src} type={type} />
    </video>
  );
}

function EndlessWritingTip({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const span = textRef.current;
    if (!el || !span) return;

    if (reducedMotion) {
      span.textContent = text;
      return;
    }

    let count = 0;
    let deleting = false;
    let timer = 0;
    let inView = true;

    const schedule = (ms: number) => {
      if (timer) window.clearTimeout(timer);
      if (!inView || document.hidden) return;
      timer = window.setTimeout(step, ms);
    };

    const step = () => {
      timer = 0;
      if (!inView || document.hidden) return;

      if (!deleting) {
        if (count >= text.length) {
          deleting = true;
          schedule(1400);
          return;
        }
        count += 1;
      } else {
        if (count <= 0) {
          deleting = false;
          schedule(360);
          return;
        }
        count -= 1;
      }

      span.textContent = text.slice(0, count);
      const nextDelay =
        !deleting && count >= text.length
          ? 1400
          : deleting && count <= 0
            ? 360
            : deleting
              ? 42
              : 65;
      schedule(nextDelay);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        inView = Boolean(entries[0]?.isIntersecting);
        if (inView && !timer && !document.hidden) {
          schedule(65);
        } else if (!inView && timer) {
          window.clearTimeout(timer);
          timer = 0;
        }
      },
      { threshold: 0.05 },
    );

    const onVisibility = () => {
      if (document.hidden && timer) {
        window.clearTimeout(timer);
        timer = 0;
      } else if (!document.hidden && inView && !timer) {
        schedule(65);
      }
    };

    span.textContent = "";
    observer.observe(el);
    document.addEventListener("visibilitychange", onVisibility);
    schedule(65);

    return () => {
      if (timer) window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [text, reducedMotion]);

  return (
    <p
      ref={containerRef}
      aria-label={text}
      className="min-h-[16px] text-[10.5px] font-extrabold tracking-[-0.03em] leading-tight text-slate-950 whitespace-nowrap overflow-hidden"
    >
      <span ref={textRef}>{reducedMotion ? text : ""}</span>
      {!reducedMotion && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[11px] w-[1.5px] align-middle bg-slate-950 animate-pulse"
        />
      )}
    </p>
  );
}

export default function Home() {
  const { lang, setLang, t } = useTranslation();
  const [hoveredSection, setHoveredSection] = useState<HoveredSection>("default");
  const [autoSection, setAutoSection] = useState<HoveredSection>("default");
  const [expandedDesc, setExpandedDesc] = useState<InteractiveSection | null>(null);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [isPointerInPage, setIsPointerInPage] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTipDismissed, setIsTipDismissed] = useState(false);
  const boot = usePortfolioBoot();

  const mobileVideo = useRef<HTMLVideoElement>(null);
  const webVideo = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const heroMotion = useReplaySection(heroSectionRef, {
    enabled: boot.phase !== "loading",
  });

  useTouchScrollChoreography(heroSectionRef, {
    enabled: heroMotion.isVisible && !boot.reducedMotion,
    onProgress: (progress, el) => {
      el.style.setProperty("--hero-scroll-y", `${(progress * -14).toFixed(1)}px`);
    },
  });

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavVisible(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.05 },
    );
    observer.observe(navEl);
    return () => observer.disconnect();
  }, []);

  // Reset Hero hover & auto-showcase cleanly whenever scrolling away from Hero or leaving the browser window
  useEffect(() => {
    const resetToDefault = () => {
      setHoveredSection("default");
      setAutoSection("default");
      setExpandedDesc(null);
    };

    const handleWindowBlur = () => {
      setIsWindowFocused(false);
      resetToDefault();
    };
    const handleWindowFocus = () => {
      setIsWindowFocused(true);
    };
    const handleDocLeave = () => {
      setIsPointerInPage(false);
      resetToDefault();
    };
    const handleDocEnter = () => {
      setIsPointerInPage(true);
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("mouseleave", handleDocLeave);
    document.addEventListener("mouseenter", handleDocEnter);
    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("mouseleave", handleDocLeave);
      document.removeEventListener("mouseenter", handleDocEnter);
    };
  }, []);

  // Also reset Hero hover when Hero scrolls completely out of viewport so scrolling back up starts fresh
  useEffect(() => {
    if (heroMotion.isVisible) return;
    const resetTimer = window.setTimeout(() => {
      setHoveredSection("default");
      setAutoSection("default");
      setExpandedDesc(null);
    }, 0);
    return () => window.clearTimeout(resetTimer);
  }, [heroMotion.isVisible]);

  const isUserInteracting = hoveredSection !== "default";

  // Auto-switch between mobile and web contexts only while Hero is visible, browser is focused, and pointer is active
  useEffect(() => {
    if (boot.reducedMotion || boot.phase === "loading") return;
    if (!heroMotion.isVisible || isResumeOpen || !isWindowFocused || !isPointerInPage) return;
    if (isUserInteracting) return;

    const delay = autoSection === "default" ? 3500 : 5000;

    const timer = window.setTimeout(() => {
      setAutoSection((prev) => (prev === "mobile" ? "web" : "mobile"));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    autoSection,
    isUserInteracting,
    boot.reducedMotion,
    boot.phase,
    heroMotion.isVisible,
    isResumeOpen,
    isWindowFocused,
    isPointerInPage,
  ]);

  const effectiveSection: HoveredSection =
    hoveredSection !== "default" ? hoveredSection : autoSection;

  const handlePassiveLeave = () => {
    setHoveredSection("default");
    setAutoSection("default");
    setExpandedDesc(null);
  };

  const handleExplicitDismiss = () => {
    soundFx.playPop(480);
    setHoveredSection("default");
    setAutoSection("default");
    setExpandedDesc(null);
  };

  const handleColumnBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setHoveredSection("default");
    }
  };

  const handleViewWork = (projectId: ProjectShortcut) => {
    window.dispatchEvent(
      new CustomEvent("portfolio:select-project", { detail: projectId }),
    );
  };

  // Only the overlay that is actually on screen plays; the hidden one is paused
  useEffect(() => {
    const entries = [
      ["mobile", mobileVideo.current],
      ["web", webVideo.current],
    ] as const;

    entries.forEach(([section, video]) => {
      if (!video) return;
      const shouldPlay =
        !boot.reducedMotion &&
        heroMotion.isVisible &&
        !isResumeOpen &&
        effectiveSection === section;
      if (!shouldPlay) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        video.pause();
      });
    });
  }, [boot.reducedMotion, heroMotion.isVisible, isResumeOpen, effectiveSection]);

  return (
    <div className="bg-transparent text-gray-900 min-h-screen relative overflow-x-hidden glow-effect">
      <PortfolioBootOverlay
        phase={boot.phase}
        reducedMotion={boot.reducedMotion}
        onFinished={boot.finishBoot}
      />

      <header className="relative z-30">
        {!isTipDismissed && (
          <div className="lg:hidden container mx-auto px-2.5 pt-2">
            <div className="flex items-center justify-between gap-2 border-b border-slate-900/20 pb-1.5">
              <div className="min-w-0 flex-1 flex items-center justify-center text-center">
                <EndlessWritingTip
                  key={lang}
                  text={
                    lang === "fr"
                      ? "Tips : Expérience complète sur navigateur PC"
                      : "Tips : Best experienced on a laptop browser"
                  }
                  reducedMotion={boot.reducedMotion}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsTipDismissed(true)}
                aria-label={lang === "fr" ? "Fermer" : "Close"}
                title={lang === "fr" ? "Fermer" : "Close"}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-slate-900 hover:bg-slate-900/10 hover:text-black transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <nav
          ref={navRef}
          aria-label="Primary navigation"
          className="site-nav container mx-auto px-2 sm:px-6 py-2.5 sm:py-8 flex justify-between items-center gap-1 sm:gap-3"
          data-boot-state={boot.phase}
        >
          <a
            href="#"
            aria-label="AED Solutions Home"
            className="site-nav__logo nav-motion-logo !w-[62px] !h-[36px] min-[400px]:!w-[74px] min-[400px]:!h-[42px] sm:!w-[168px] sm:!h-[94px] lg:!w-[200px] lg:!h-[112px] shrink-0"
          >
            <NavLogoMedia
              active={boot.phase !== "loading" && isNavVisible}
              reducedMotion={boot.reducedMotion}
            />
          </a>

          {/* Primary Desktop Links */}
          <div className="hidden lg:flex items-center space-x-7 xl:space-x-10 font-bold text-sm">
            <a
              className="inline-flex min-h-[44px] items-center text-gray-700 hover:text-black transition-colors nav-motion-link"
              style={{ "--motion-delay": "45ms" } as CSSProperties}
              href="#projects"
            >
              {t.nav.projects}
            </a>
            <a
              className="inline-flex min-h-[44px] items-center text-gray-700 hover:text-black transition-colors nav-motion-link"
              style={{ "--motion-delay": "120ms" } as CSSProperties}
              href="#about"
            >
              {t.nav.about}
            </a>
            <a
              className="inline-flex min-h-[44px] items-center text-gray-700 hover:text-black transition-colors nav-motion-link"
              style={{ "--motion-delay": "180ms" } as CSSProperties}
              href="#contact"
            >
              {t.nav.contact}
            </a>
          </div>

          {/* Right Action Cluster: CV (Preview + Download) + Work Together + Language + Mobile Menu */}
          <div className="flex items-center gap-1 sm:gap-2.5 lg:gap-3 shrink-0 min-w-0">
            {/* CV Preview + Direct Download Split Pill */}
            <div
              className="nav-motion-link inline-flex min-h-[30px] sm:min-h-[44px] items-center rounded-full border border-neutral-300/90 bg-white/85 shadow-2xs backdrop-blur-md overflow-hidden"
              style={{ "--motion-delay": "200ms" } as CSSProperties}
              role="group"
              aria-label="CV"
            >
              <button
                type="button"
                onClick={() => setIsResumeOpen(true)}
                title={t.nav.previewResume}
                aria-label={t.nav.previewResume}
                className="inline-flex min-h-[30px] sm:min-h-[44px] items-center gap-0.5 min-[400px]:gap-1 sm:gap-1.5 pl-1.5 pr-1 min-[400px]:pl-2 min-[400px]:pr-1.5 sm:pl-3.5 sm:pr-3 text-[9px] min-[400px]:text-[10px] sm:text-xs font-extrabold tracking-wide text-neutral-800 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
              >
                <svg
                  className="h-2.5 w-2.5 min-[400px]:h-3 min-[400px]:w-3 sm:h-3.5 sm:w-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>CV</span>
              </button>
              <span
                className="h-3.5 sm:h-5 w-px bg-neutral-300/90"
                aria-hidden="true"
              />
              <a
                href={lang === "fr" ? "/cvs/FR.pdf" : "/cvs/EN.pdf"}
                download={
                  lang === "fr"
                    ? "AED-Solutions-CV-FR.pdf"
                    : "AED-Solutions-CV-EN.pdf"
                }
                title={t.nav.downloadResume}
                aria-label={t.nav.downloadResume}
                className="inline-flex min-h-[30px] sm:min-h-[44px] min-w-[24px] min-[400px]:min-w-[28px] sm:min-w-[42px] items-center justify-center px-1 min-[400px]:px-1.5 sm:px-2.5 text-neutral-800 hover:bg-sky-600 hover:text-white transition-colors"
              >
                <svg
                  className="h-2.5 w-2.5 min-[400px]:h-3 min-[400px]:w-3 sm:h-3.5 sm:w-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>

            {/* Expanding Pill Primary CTA (shown on top bar across mobile & desktop) */}
            <a
              href="#contact"
              className="inline-flex uiverse-cta nav-motion-cta relative min-h-[30px] sm:min-h-[44px] items-center rounded-full px-1.5 min-[400px]:px-2.5 sm:px-4 py-0.5 sm:py-2.5 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <span className="uiverse-cta-pill" aria-hidden="true"></span>
              <span className="uiverse-cta-text !text-[8px] min-[400px]:!text-[9.5px] sm:!text-[13px] !tracking-tight sm:!tracking-[0.06em]">
                {t.nav.workTogether}
              </span>
              <svg
                className="uiverse-cta-arrow hidden sm:inline"
                width="15px"
                height="10px"
                viewBox="0 0 13 10"
                aria-hidden="true"
              >
                <path d="M1,5 L11,5"></path>
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </a>

            {/* Language Switcher Button (EN | FR) */}
            <div
              className="inline-flex min-h-[30px] sm:min-h-[44px] items-center rounded-full bg-neutral-200/85 p-0.5 sm:p-1 border border-neutral-300/90 text-[8.5px] min-[400px]:text-[10px] sm:text-xs font-bold shadow-2xs backdrop-blur-xs select-none"
              role="group"
              aria-label="Language selector"
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`min-h-[24px] sm:min-h-[34px] min-w-[20px] min-[400px]:min-w-[24px] sm:min-w-[34px] px-1 min-[400px]:px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === "en"
                    ? "bg-black text-white shadow-xs font-black"
                    : "text-neutral-700 hover:text-black"
                }`}
                aria-pressed={lang === "en"}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`min-h-[24px] sm:min-h-[34px] min-w-[20px] min-[400px]:min-w-[24px] sm:min-w-[34px] px-1 min-[400px]:px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all duration-200 cursor-pointer ${
                  lang === "fr"
                    ? "bg-black text-white shadow-xs font-black"
                    : "text-neutral-700 hover:text-black"
                }`}
                aria-pressed={lang === "fr"}
                title="Français"
              >
                FR
              </button>
            </div>

            {/* Mobile / Tablet Navigation Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              className="lg:hidden inline-flex h-7 w-7 min-[400px]:h-8 min-[400px]:w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-neutral-300/90 bg-white/85 text-neutral-800 shadow-2xs backdrop-blur-md transition hover:bg-neutral-900 hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-3.5 w-3.5 min-[400px]:h-4 min-[400px]:w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  className="h-3.5 w-3.5 min-[400px]:h-4 min-[400px]:w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile / Tablet Navigation Drawer — Projects, About, Contact only */}
        {isMobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="lg:hidden container mx-auto px-4 sm:px-6 pb-4 animate-fade-in"
          >
            <div className="rounded-2xl border border-neutral-200/90 bg-white/95 p-3 shadow-xl backdrop-blur-md space-y-1">
              <a
                href="#projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 text-sm font-extrabold text-neutral-800 hover:bg-neutral-100"
              >
                {t.nav.projects}
              </a>
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 text-sm font-extrabold text-neutral-800 hover:bg-neutral-100"
              >
                {t.nav.about}
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 text-sm font-extrabold text-neutral-800 hover:bg-neutral-100"
              >
                {t.nav.contact}
              </a>
            </div>
          </div>
        )}
      </header>

      <main
        ref={heroSectionRef}
        onMouseLeave={handlePassiveLeave}
        onClick={(e) => {
          if (
            effectiveSection !== "default" &&
            !(e.target as HTMLElement).closest(".hero-concept")
          ) {
            handleExplicitDismiss();
          }
        }}
        className="hero-section container mx-auto px-3 sm:px-6 relative z-10 pt-2 sm:pt-6 lg:pt-8 pb-8 sm:pb-16 lg:pb-24"
        data-motion-state={heroMotion.motionState}
        data-motion-reentry={heroMotion.isReentry ? "true" : "false"}
        data-has-entered={heroMotion.motionState === "entered" ? "true" : undefined}
      >
        <div className="flex flex-row justify-between items-start relative h-full min-h-[320px] sm:min-h-[450px] lg:min-h-[580px] xl:min-h-[720px] pt-8 sm:pt-10 gap-2 lg:gap-0">
          <h1 className="sr-only">
            AED Solutions — Mobile and Web Product Engineering
          </h1>

          {/* Mobile Service Column */}
          <div
            tabIndex={0}
            onMouseEnter={() => setHoveredSection("mobile")}
            onMouseLeave={handlePassiveLeave}
            onClick={(e) => {
              e.stopPropagation();
              setHoveredSection("mobile");
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) {
                setHoveredSection("mobile");
              }
            }}
            onBlur={handleColumnBlur}
            aria-label="Explore AED Solutions mobile engineering service"
            className={`hero-concept hero-concept--mobile w-[48%] lg:w-1/3 z-20 text-left mt-2 sm:mt-4 lg:mt-0 flex flex-col items-start transition-[opacity,transform] duration-[420ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-purple-600 cursor-pointer lg:cursor-default ${
              effectiveSection === "web"
                ? "opacity-0 scale-95 -translate-x-4 lg:-translate-x-6 pointer-events-none"
                : "opacity-100 scale-100 translate-x-0"
            }`}
          >
            {/* Patrick Heng stepped block heading — X button out-of-flow for zero CLS */}
            <div className="relative mb-2 sm:mb-4 flex flex-col items-start text-left">
              {effectiveSection === "mobile" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExplicitDismiss();
                  }}
                  className="group/close flex absolute -top-8 sm:-top-10 lg:-top-12 left-0 items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-neutral-900/90 hover:bg-black text-white hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer animate-fade-in z-30"
                  title={lang === "fr" ? "Fermer" : "Close"}
                  aria-label={lang === "fr" ? "Fermer" : "Close"}
                >
                  <span className="text-xs sm:text-base lg:text-lg font-black leading-none group-hover/close:rotate-90 transition-transform">
                    ✕
                  </span>
                </button>
              )}

              <div className="group/heading hero-heading hero-heading--mobile relative flex flex-col items-start select-none outline-none">
                <GlassHeading rows={HEADING_LETTERS.mobile} align="start" />
              </div>
            </div>

            {effectiveSection === "mobile" && (
              <div className="hero-description relative mb-1 lg:min-h-[136px] max-w-[175px] sm:max-w-xs lg:max-w-sm w-full text-left transition-all duration-300 animate-fade-in">
                <div
                  className={
                    expandedDesc === "mobile"
                      ? "bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-xl p-2 sm:p-0"
                      : "line-clamp-3 lg:line-clamp-none bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-xl p-2 sm:p-0"
                  }
                >
                  <ParticleText
                    key={`mobile-full-${lang}`}
                    text={`${t.hero.mobileDesc} ${t.hero.mobileTypewriter}`}
                    color="#374151"
                    className="text-gray-800 text-[11px] sm:text-sm md:text-base leading-snug sm:leading-relaxed font-medium"
                    duration={800}
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedDesc((prev) => (prev === "mobile" ? null : "mobile"));
                  }}
                  className="lg:hidden mt-1 inline-flex items-center gap-1 rounded-full bg-white/85 border border-black/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-purple-700 shadow-xs hover:bg-white cursor-pointer"
                >
                  {expandedDesc === "mobile"
                    ? lang === "fr"
                      ? "Voir moins"
                      : "View less"
                    : lang === "fr"
                      ? "Voir plus"
                      : "View more"}
                </button>
              </div>
            )}

            {effectiveSection === "mobile" && (
              <a
                href="#projects"
                className="hero-work-link hero-work-link--mobile hero-action hero-work-link--compact transition-transform duration-300 mt-2 sm:mt-4 animate-fade-in"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewWork("a-task");
                }}
                aria-label="View AED Solutions mobile app work"
              >
                <div className="hero-work-link__content">
                  <p className="hero-work-link__text">{t.hero.viewOurWork}</p>
                </div>
              </a>
            )}
          </div>

          {/* Portrait stage — absolute centre stage across mobile & desktop matching laptop layout */}
          <div className="absolute top-3 sm:top-6 lg:top-8 inset-x-0 z-10 w-full pointer-events-none">
            <div
              className={`product-stage product-stage--${effectiveSection} hero-stage-motion`}
              aria-live="polite"
            >
              {(Object.keys(overlayConfig) as InteractiveSection[]).map(
                (section) => {
                  const overlay = overlayConfig[section];
                  const isActive = effectiveSection === section;

                  return (
                    <ProductOverlayVideo
                      key={section}
                      videoRef={section === "mobile" ? mobileVideo : webVideo}
                      className={`product-overlay product-overlay--${section} ${
                        isActive ? "is-active" : ""
                      }`}
                      label={overlay.label}
                      src={overlay.video}
                      type={overlay.type}
                      hidden={!isActive}
                    />
                  );
                },
              )}

              <Image
                alt="AED Solutions Product Stage"
                src="/images/mainphoto.png"
                width={1402}
                height={1122}
                preload={true}
                sizes="(max-width: 767px) 260px, (max-width: 1023px) 420px, 750px"
                className="product-stage__portrait hero-portrait-motion h-[215px] min-[400px]:h-[230px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[600px] w-auto object-contain filter drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Web Service Column */}
          <div
            tabIndex={0}
            onMouseEnter={() => setHoveredSection("web")}
            onMouseLeave={handlePassiveLeave}
            onClick={(e) => {
              e.stopPropagation();
              setHoveredSection("web");
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) {
                setHoveredSection("web");
              }
            }}
            onBlur={handleColumnBlur}
            aria-label="Explore AED Solutions web engineering service"
            className={`hero-concept hero-concept--web w-[48%] lg:w-1/3 z-20 text-right mt-2 sm:mt-4 lg:mt-0 flex flex-col items-end transition-[opacity,transform] duration-[420ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-blue-600 cursor-pointer lg:cursor-default ${
              effectiveSection === "mobile"
                ? "opacity-0 scale-95 translate-x-4 lg:translate-x-6 pointer-events-none"
                : "opacity-100 scale-100 translate-x-0"
            }`}
          >
            {/* Patrick Heng stacked heading — X button out-of-flow for zero CLS */}
            <div className="relative mb-2 sm:mb-4 flex flex-col items-end text-right">
              {effectiveSection === "web" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExplicitDismiss();
                  }}
                  className="group/close flex absolute -top-8 sm:-top-10 lg:-top-12 right-0 items-center justify-center w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-neutral-900/90 hover:bg-black text-white hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer animate-fade-in z-30"
                  title={lang === "fr" ? "Fermer" : "Close"}
                  aria-label={lang === "fr" ? "Fermer" : "Close"}
                >
                  <span className="text-xs sm:text-base lg:text-lg font-black leading-none group-hover/close:rotate-90 transition-transform">
                    ✕
                  </span>
                </button>
              )}

              <div className="group/heading hero-heading hero-heading--web relative flex flex-col items-end select-none outline-none">
                <GlassHeading rows={HEADING_LETTERS.web} align="end" />
              </div>
            </div>

            {effectiveSection === "web" && (
              <div className="hero-description relative mb-1 lg:min-h-[136px] max-w-[175px] sm:max-w-xs lg:max-w-sm ml-auto w-full text-right lg:text-left transition-all duration-300 animate-fade-in">
                <div
                  className={
                    expandedDesc === "web"
                      ? "bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-xl p-2 sm:p-0"
                      : "line-clamp-3 lg:line-clamp-none bg-white/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-xl p-2 sm:p-0"
                  }
                >
                  <ParticleText
                    key={`web-full-${lang}`}
                    text={`${t.hero.webDesc} ${t.hero.webTypewriter}`}
                    color="#374151"
                    className="text-gray-800 text-[11px] sm:text-sm md:text-base leading-snug sm:leading-relaxed font-medium text-right lg:text-left"
                    duration={800}
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedDesc((prev) => (prev === "web" ? null : "web"));
                  }}
                  className="lg:hidden mt-1 inline-flex items-center gap-1 rounded-full bg-white/85 border border-black/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-sky-700 shadow-xs hover:bg-white cursor-pointer"
                >
                  {expandedDesc === "web"
                    ? lang === "fr"
                      ? "Voir moins"
                      : "View less"
                    : lang === "fr"
                      ? "Voir plus"
                      : "View more"}
                </button>
              </div>
            )}

            {effectiveSection === "web" && (
              <a
                href="#projects"
                className="hero-work-link hero-work-link--web hero-action hero-work-link--compact transition-transform duration-300 mt-2 sm:mt-4 animate-fade-in"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewWork("a-store");
                }}
                aria-label="View AED Solutions web app work"
              >
                <div className="hero-work-link__content">
                  <p className="hero-work-link__text">{t.hero.viewOurWork}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </main>

      <LazySection id="projects" minHeight="85vh">
        <ProjectShowcase />
      </LazySection>

      <AboutSection />

      <LazySection id="contact" minHeight="75vh">
        <ContactSection />
      </LazySection>

      <footer className="relative z-10 px-3 sm:px-6 py-4 sm:py-8">
        <div className="container mx-auto flex flex-row flex-nowrap items-center justify-center gap-2 sm:gap-4">
          <span className="text-[11px] sm:text-[15px] font-semibold tracking-wide text-neutral-600 whitespace-nowrap">
            {t.footer.createdBy}
          </span>
          <Image
            src="/images/mascot.png"
            alt="AED Solutions mascot"
            width={1024}
            height={1536}
            sizes="56px"
            className="h-8 sm:h-14 w-auto object-contain shrink-0"
          />
          <Image
            src="/images/logosultion.png"
            alt="AED Solutions"
            width={1180}
            height={428}
            sizes="130px"
            className="h-7 sm:h-11 w-auto object-contain shrink-0"
          />
        </div>
      </footer>

      {isResumeOpen && <ResumeModal onClose={() => setIsResumeOpen(false)} />}
    </div>
  );
}
