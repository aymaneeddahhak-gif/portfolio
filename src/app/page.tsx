"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import ProjectShowcase from "./project-showcase";
import AboutSection from "./about-section";
import ContactSection from "./contact-section";
import { soundFx } from "./about/sound";
import { ParticleText } from "./particle-text";
import { useTranslation } from "@/i18n/LanguageContext";
import {
  PortfolioBootOverlay,
  usePortfolioBoot,
  useReplaySection,
} from "./motion-coordinator";

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
    label: "Ayman Developer animated logo variation one",
  },
  {
    kind: "image",
    src: "/images/logosultion.png",
    label: "Ayman Developer logo",
  },
  {
    kind: "video",
    src: "/videos/LOGOvideo3.webm",
    label: "Ayman Developer animated logo variation three",
  },
  {
    kind: "video",
    src: "/videos/logo3.webm",
    label: "Ayman Developer animated logo variation four",
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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={`${active}-${media.src}`}
        src={media.src}
        alt={media.label}
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
    "flex items-center gap-0.5 sm:gap-1 border border-white/70 bg-white/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.10)]";
  const letter = ([char, color]: HeadingLetter, i: number) => (
    <span
      key={i}
      className="font-syne font-black text-2xl sm:text-4xl lg:text-[44px] xl:text-[48px] leading-none"
      style={
        color === INK
          ? { color: "#111111" }
          : { color, textShadow: "1.5px 1.5px 0 #111111" }
      }
    >
      {char}
    </span>
  );

  return (
    <div
      className={`flex flex-col items-center ${
        align === "start" ? "lg:items-start" : "lg:items-end"
      } group-hover/heading:scale-[1.02] transition-transform duration-200`}
    >
      <div className={`${box} border-b-0 px-4 sm:px-6 py-1 sm:py-2 rounded-t-xl sm:rounded-t-2xl`}>
        {top.map(letter)}
      </div>
      <div className={`${box} px-5 sm:px-8 py-1 sm:py-2 rounded-b-xl sm:rounded-b-2xl`}>
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
      preload="auto"
      tabIndex={-1}
    >
      <source src={src} type={type} />
    </video>
  );
}


export default function Home() {
  const { lang, setLang, t } = useTranslation();
  const [hoveredSection, setHoveredSection] = useState<HoveredSection>("default");
  const [autoSection, setAutoSection] = useState<HoveredSection>("default");
  const boot = usePortfolioBoot();

  const isUserInteracting = hoveredSection !== "default";

  // Auto-switch between mobile and web contexts when user is idle
  useEffect(() => {
    if (boot.reducedMotion || boot.phase === "loading") return;
    if (isUserInteracting) return;

    // Start with a 3.5s delay on initial default load, or 5s for alternating
    const delay = autoSection === "default" ? 3500 : 5000;

    const timer = window.setTimeout(() => {
      setAutoSection((prev) => (prev === "mobile" ? "web" : "mobile"));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [autoSection, isUserInteracting, boot.reducedMotion, boot.phase]);

  // Effective active section:
  // 1. Manual user hover has highest priority
  // 2. Auto-cycling runs if user is idle
  const effectiveSection: HoveredSection =
    hoveredSection !== "default" ? hoveredSection : autoSection;

  const handleDismiss = () => {
    soundFx.playPop(480);
    setHoveredSection("default");
    setAutoSection("default");
  };
  const mobileVideo = useRef<HTMLVideoElement>(null);
  const webVideo = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMotion = useReplaySection(heroSectionRef, {
    enabled: boot.phase !== "loading",
  });

  const handleViewWork = (projectId: ProjectShortcut) => {
    window.dispatchEvent(
      new CustomEvent("portfolio:select-project", { detail: projectId }),
    );
  };


  // Only the overlay that is actually on screen plays; the hidden one is
  // paused (not rewound) so it resumes exactly where it left off. Decoding
  // two looping clips at once was a main source of hero jank.
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
        effectiveSection === section;
      if (!shouldPlay) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        video.pause();
      });
    });
  }, [boot.reducedMotion, heroMotion.isVisible, effectiveSection]);

  // Touch devices have no hover, so the mobile/web overlay showcase would
  // never trigger there — the scroll becomes the driver instead: whichever
  // hero column (mobile / web) holds the middle of the viewport picks the
  // active overlay. Desktop hover behavior is untouched.
  useEffect(() => {
    if (boot.reducedMotion) return;
    if (!window.matchMedia("(hover: none)").matches) return;

    const mobileCol = document.querySelector(".hero-concept--mobile");
    const webCol = document.querySelector(".hero-concept--web");
    if (!mobileCol || !webCol) return;

    const pick = () => {
      if (window.scrollY > window.innerHeight * 1.2) {
        setHoveredSection("default");
        return;
      }
      const mid = window.innerHeight * 0.5;
      const m = mobileCol.getBoundingClientRect();
      const w = webCol.getBoundingClientRect();
      const mDist = Math.abs((m.top + m.bottom) / 2 - mid);
      const wDist = Math.abs((w.top + w.bottom) / 2 - mid);
      // Only the column actually near the middle drives the overlay; when
      // both are far (tech lists / buttons dominate), clear the stage.
      const near = Math.min(mDist, wDist);
      if (near > window.innerHeight * 0.45) {
        setHoveredSection("default");
      } else {
        setHoveredSection(mDist <= wDist ? "mobile" : "web");
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        pick();
        ticking = false;
      });
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [boot.reducedMotion]);

  return (
    <div className="bg-transparent text-gray-900 min-h-screen relative overflow-x-hidden glow-effect">
      <PortfolioBootOverlay
        phase={boot.phase}
        reducedMotion={boot.reducedMotion}
        onFinished={boot.finishBoot}
      />

      <nav
        className="site-nav container mx-auto px-6 py-8 flex justify-between items-center relative z-20"
        data-boot-state={boot.phase}
      >
        <div className="site-nav__logo nav-motion-logo">
          <NavLogoMedia
            active={boot.phase !== "loading"}
            reducedMotion={boot.reducedMotion}
          />
        </div>
        <div className="hidden md:flex space-x-10 font-bold text-sm">
          <a
            className="text-gray-600 hover:text-black transition-colors nav-motion-link"
            style={{ "--motion-delay": "45ms" } as CSSProperties}
            href="#projects"
          >
            {t.nav.projects}
          </a>
          <a
            className="text-gray-600 hover:text-black transition-colors nav-motion-link"
            style={{ "--motion-delay": "120ms" } as CSSProperties}
            href="#about"
          >
            {t.nav.about}
          </a>
          <a
            className="text-gray-600 hover:text-black transition-colors nav-motion-link"
            style={{ "--motion-delay": "180ms" } as CSSProperties}
            href="#contact"
          >
            {t.nav.contact}
          </a>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <a
            href="#contact"
            className="uiverse-cta nav-motion-cta relative inline-flex items-center rounded-full px-4 py-2.5 transition-all duration-200 cursor-pointer"
          >
            <span className="uiverse-cta-pill" aria-hidden="true"></span>
            <span className="uiverse-cta-text">{t.nav.workTogether}</span>
            <svg
              className="uiverse-cta-arrow"
              width="15px"
              height="10px"
              viewBox="0 0 13 10"
              aria-hidden="true"
            >
              <path d="M1,5 L11,5"></path>
              <polyline points="8 1 12 5 8 9"></polyline>
            </svg>
          </a>

          {/* Language Switcher Button (FR | EN) */}
          <div
            className="inline-flex items-center rounded-full bg-neutral-200/80 p-0.5 sm:p-1 border border-neutral-300/80 text-[11px] sm:text-xs font-bold shadow-2xs backdrop-blur-xs select-none"
            role="group"
            aria-label="Language selector"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                lang === "en"
                  ? "bg-black text-white shadow-xs font-black"
                  : "text-neutral-600 hover:text-black"
              }`}
              aria-pressed={lang === "en"}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                lang === "fr"
                  ? "bg-black text-white shadow-xs font-black"
                  : "text-neutral-600 hover:text-black"
              }`}
              aria-pressed={lang === "fr"}
              title="Français"
            >
              FR
            </button>
          </div>
        </div>
      </nav>

      <main
        ref={heroSectionRef}
        onMouseLeave={handleDismiss}
        className="hero-section container mx-auto px-6 relative z-10 pt-4 sm:pt-6 lg:pt-8 pb-16 lg:pb-24"
        data-motion-state={heroMotion.motionState}
        data-motion-reentry={heroMotion.isReentry ? "true" : "false"}
        data-has-entered={heroMotion.motionState === "entered" ? "true" : undefined}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start relative h-full min-h-[580px] lg:min-h-[720px] pt-4 sm:pt-6 lg:pt-8">
          <h1 className="sr-only">Aymane Eddahak — Mobile and Web Developer</h1>
          <div
            onMouseEnter={() => setHoveredSection("mobile")}
            onMouseLeave={handleDismiss}
            onFocus={() => setHoveredSection("mobile")}
            onBlur={handleDismiss}
            aria-label="Explore mobile developer work"
            className={`hero-concept hero-concept--mobile w-full lg:w-1/3 z-20 text-center lg:text-left mt-8 lg:mt-0 flex flex-col items-center lg:items-start transition-[opacity,transform,filter] duration-[420ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-purple-600 ${
              effectiveSection === "web"
                ? "opacity-0 blur-sm scale-95 -translate-x-6"
                : "opacity-100 blur-0 scale-100 translate-x-0"
            }`}
          >
            {/* Patrick Heng stepped block heading */}
            <div className="relative mb-3 sm:mb-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Big X Button on top of the headline when active */}
              {effectiveSection === "mobile" && (
                <div className="flex items-center gap-2 mb-2 animate-fade-in">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss();
                    }}
                    className="group/close flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 hover:bg-black text-white hover:scale-110 active:scale-95 shadow-md transition-all cursor-pointer"
                    title={lang === "fr" ? "Fermer" : "Close"}
                    aria-label="Close"
                  >
                    <span className="text-base sm:text-lg font-black leading-none group-hover:rotate-90 transition-transform">✕</span>
                  </button>
                </div>
              )}

              <div className="group/heading hero-heading hero-heading--mobile relative flex flex-col items-center lg:items-start select-none outline-none">
                <GlassHeading rows={HEADING_LETTERS.mobile} align="start" />
              </div>
            </div>

            <div className="hero-description relative mb-1 max-w-sm mx-auto lg:mx-0 w-full text-center lg:text-left transition-all duration-300">
              {effectiveSection === "mobile" && (
                <div className="animate-fade-in">
                  <ParticleText
                    key={`mobile-full-${lang}`}
                    text={`${t.hero.mobileDesc} ${t.hero.mobileTypewriter}`}
                    color="#374151"
                    className="text-gray-700 text-sm md:text-base leading-relaxed font-medium"
                    duration={950}
                  />
                </div>
              )}
            </div>

            <a
              href="#projects"
              className="hero-work-link hero-work-link--mobile hero-action transition-transform duration-300 mt-3 sm:mt-4"
              onClick={() => handleViewWork("a-task")}
              aria-label="View our mobile app work"
            >
              <div className="hero-work-link__content">
                <p className="hero-work-link__text">{t.hero.viewOurWork}</p>
              </div>
            </a>
          </div>

          {/* Portrait stage — aligned on the same horizontal line as Mobile & Web Service headings */}
          <div className="absolute top-4 sm:top-6 lg:top-8 inset-x-0 z-10 hidden lg:block pointer-events-none">
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

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Ayman Developer Portrait"
                className="product-stage__portrait hero-portrait-motion lg:h-[600px] w-auto object-contain filter drop-shadow-2xl"
                src="/images/mainphoto.png"
              />
            </div>
          </div>

          <div
            onMouseEnter={() => setHoveredSection("web")}
            onMouseLeave={handleDismiss}
            onFocus={() => setHoveredSection("web")}
            onBlur={handleDismiss}
            tabIndex={0}
            className={`hero-concept hero-concept--web w-full lg:w-1/3 z-20 text-center lg:text-right mt-14 lg:mt-0 flex flex-col items-center lg:items-end transition-[opacity,transform,filter] duration-[420ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-blue-600 ${
              effectiveSection === "mobile"
                ? "opacity-0 blur-sm scale-95 translate-x-6"
                : "opacity-100 blur-0 scale-100 translate-x-0"
            }`}
          >
            {/* Patrick Heng stacked heading */}
            <div className="relative mb-3 sm:mb-4 flex flex-col items-center lg:items-end text-center lg:text-right">
              {/* Big X Button on top of the headline when active */}
              {effectiveSection === "web" && (
                <div className="flex items-center gap-2 mb-2 animate-fade-in justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss();
                    }}
                    className="group/close flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 hover:bg-black text-white hover:scale-110 active:scale-95 shadow-md transition-all cursor-pointer"
                    title={lang === "fr" ? "Fermer" : "Close"}
                    aria-label="Close"
                  >
                    <span className="text-base sm:text-lg font-black leading-none group-hover:rotate-90 transition-transform">✕</span>
                  </button>
                </div>
              )}

              <div className="group/heading hero-heading hero-heading--web relative flex flex-col items-center lg:items-end select-none outline-none">
                <GlassHeading rows={HEADING_LETTERS.web} align="end" />
              </div>
            </div>

            <div className="hero-description relative mb-1 max-w-sm mx-auto lg:mx-0 lg:ml-auto w-full text-center lg:text-left transition-all duration-300">
              {effectiveSection === "web" && (
                <div className="animate-fade-in">
                  <ParticleText
                    key={`web-full-${lang}`}
                    text={`${t.hero.webDesc} ${t.hero.webTypewriter}`}
                    color="#374151"
                    className="text-gray-700 text-sm md:text-base leading-relaxed font-medium text-center lg:text-left"
                    duration={800}
                  />
                </div>
              )}
            </div>

            <a
              href="#projects"
              className="hero-work-link hero-work-link--web hero-action transition-transform duration-300 mt-3 sm:mt-4"
              onClick={() => handleViewWork("a-store")}
              aria-label="View our web app work"
            >
              <div className="hero-work-link__content">
                <p className="hero-work-link__text">{t.hero.viewOurWork}</p>
              </div>
            </a>
          </div>
        </div>
      </main>

      <ProjectShowcase />

      <AboutSection />

      <ContactSection />

      {/* Site footer — small "created by" credit with the mascot and the
          Logosolution brand mark. It sits straight on the site's ambient
          backdrop now (the old white strip read as a separate band under the
          new lighting); the marks are already cut out, so nothing needs a
          plate behind it. */}
      <footer className="relative z-10 px-6 py-6 sm:py-8">
        <div className="container mx-auto flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
          <span className="text-[13px] sm:text-[15px] font-semibold tracking-wide text-neutral-400">
            {t.footer.createdBy}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mascot.png"
            alt="Ayman mascot"
            className="h-12 sm:h-14 w-auto object-contain"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logosultion.png"
            alt="Logosolution"
            className="h-10 sm:h-11 w-auto object-contain"
          />
        </div>
      </footer>
    </div>
  );
}
