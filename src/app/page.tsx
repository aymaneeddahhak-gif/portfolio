"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import ProjectShowcase from "./project-showcase";
import ContactSection from "./contact-section";
import {
  PortfolioBootOverlay,
  usePortfolioBoot,
  useReplaySection,
} from "./motion-coordinator";

type HoveredSection = "default" | "mobile" | "web";
type InteractiveSection = Exclude<HoveredSection, "default">;
type ProjectShortcut = "estate-elite" | "a-store";
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
    src: "/images/logo.png",
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

const overlayConfig = {
  mobile: {
    video: "/videos/phones.mp4",
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

function HeroTypewriter({ text }: { text: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= text.length) return;
    const timer = window.setTimeout(() => setCount((c) => c + 1), 10);
    return () => window.clearTimeout(timer);
  }, [count, text]);

  return (
    <>
      {text.slice(0, count)}
      <span
        aria-hidden="true"
        className={`text-purple-600 ${count < text.length ? "animate-pulse" : "hidden"}`}
      >
        |
      </span>
    </>
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
  const [hoveredSection, setHoveredSection] = useState<HoveredSection>("default");
  const boot = usePortfolioBoot();
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

  // Both clips autoplay and loop natively for as long as the hero is on
  // screen — the browser restarts a looping clip with no gap at all, so the
  // float never visibly stops. Hovering only chooses which overlay is on
  // screen; it never pauses, rewinds or restarts anything.
  useEffect(() => {
    const videos = [mobileVideo.current, webVideo.current];

    videos.forEach((video) => {
      if (!video) return;
      if (boot.reducedMotion || !heroMotion.isVisible) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        video.pause();
      });
    });
  }, [boot.reducedMotion, heroMotion.isVisible]);

  return (
    <div className="bg-white text-gray-900 min-h-screen relative overflow-x-hidden glow-effect">
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
            PROJECTS
          </a>
          <a
            className="text-gray-600 hover:text-black transition-colors nav-motion-link"
            style={{ "--motion-delay": "180ms" } as CSSProperties}
            href="#contact"
          >
            CONTACT
          </a>
        </div>
        <a
          href="#contact"
          className="nav-motion-cta bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          LET&apos;S WORK TOGETHER
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </a>
      </nav>

      <main
        ref={heroSectionRef}
        className="hero-section container mx-auto px-6 relative z-10 pt-10 pb-20"
        data-motion-state={heroMotion.motionState}
        data-motion-reentry={heroMotion.isReentry ? "true" : "false"}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center relative h-full min-h-[70vh]">
          <h1 className="sr-only">Aymane Eddahak — Mobile and Web Developer</h1>
          <div
            onMouseEnter={() => setHoveredSection("mobile")}
            onMouseLeave={() => setHoveredSection("default")}
            onFocus={() => setHoveredSection("mobile")}
            onBlur={() => setHoveredSection("default")}
            tabIndex={hoveredSection === "web" ? -1 : 0}
            aria-hidden={hoveredSection === "web"}
            aria-label="Explore mobile developer work"
            className={`hero-concept hero-concept--mobile w-full lg:w-1/3 z-20 text-center lg:text-left mt-10 lg:mt-0 flex flex-col items-center lg:items-start transition-[opacity,transform] duration-[420ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-purple-600 ${hoveredSection === "web" ? "pointer-events-none -translate-x-3 opacity-0" : "translate-x-0 opacity-100"}`}
          >
            <h2 className="hero-heading hero-heading--mobile text-5xl lg:text-[64px] font-black leading-[0.9] tracking-tighter mb-6 relative w-full">
              MOBILE
              <br />
              DEVELOPER
              <span className="hero-accent absolute -bottom-4 left-0 lg:left-0 w-16 h-1 bg-purple-600 mx-auto lg:mx-0 inline-block hidden lg:block"></span>
              <span className="hero-accent absolute -bottom-4 left-0 w-16 h-1 bg-purple-600 mx-auto inline-block lg:hidden"></span>
            </h2>
            <div className="hero-description relative mt-8 mb-10 max-w-sm mx-auto lg:mx-0 w-full h-52">
              <p className="absolute inset-x-0 top-0 text-gray-600 text-sm md:text-base leading-relaxed font-medium">
                I create high-performance mobile apps for Android and iOS —
                built to solve real problems, not just ship screens.{" "}
                {hoveredSection === "mobile" && (
                    <HeroTypewriter text="We resolve the problem first, then design the solution: Flutter and React Native apps with Firebase auth, push notifications, offline support, new ways of AI integration and creative design that feels native — plus store deployment." />
                )}
              </p>
            </div>
            <div className="hero-tech-list flex flex-wrap justify-center lg:justify-start gap-6 max-w-sm">
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-flutter text-4xl text-blue-400 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  Flutter
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-react text-4xl text-cyan-400 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  React Native
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-android text-4xl text-green-500 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  Android
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-solid fa-fire text-4xl text-orange-400 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  Firebase
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-apple text-4xl text-black tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  iOS
                </span>
              </div>
            </div>
            <a
              href="#projects"
              className="hero-work-link hero-work-link--mobile hero-action"
              onClick={() => handleViewWork("estate-elite")}
            >
              VIEW OUR WORK
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="absolute bottom-0 inset-x-0 z-10 hidden lg:block pointer-events-none">
            <div
              className={`product-stage product-stage--${hoveredSection} hero-stage-motion`}
              aria-live="polite"
            >
              {(Object.keys(overlayConfig) as InteractiveSection[]).map(
                (section) => {
                  const overlay = overlayConfig[section];
                  const isActive = hoveredSection === section;

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
            onMouseLeave={() => setHoveredSection("default")}
            onFocus={() => setHoveredSection("web")}
            onBlur={() => setHoveredSection("default")}
            tabIndex={hoveredSection === "mobile" ? -1 : 0}
            aria-hidden={hoveredSection === "mobile"}
            aria-label="Explore web developer work"
            className={`hero-concept hero-concept--web w-full lg:w-1/3 z-20 text-center lg:text-right mt-16 lg:mt-0 flex flex-col items-center lg:items-end transition-[opacity,transform] duration-[420ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-blue-600 ${hoveredSection === "mobile" ? "pointer-events-none translate-x-3 opacity-0" : "translate-x-0 opacity-100"}`}
          >
            <h2 className="hero-heading hero-heading--web text-5xl lg:text-[64px] font-black leading-[0.9] tracking-tighter mb-6 relative w-full">
              WEB
              <br />
              DEVELOPER
              <span className="hero-accent absolute -bottom-4 right-0 lg:right-0 w-24 h-4 bg-blue-600 mx-auto lg:mx-0 inline-block hidden lg:block"></span>
              <span className="hero-accent absolute -bottom-4 left-0 w-24 h-4 bg-blue-600 mx-auto inline-block lg:hidden"></span>
            </h2>
            <div className="hero-description relative mt-8 mb-10 max-w-sm mx-auto lg:mx-0 lg:ml-auto w-full h-52">
              <p className="absolute inset-x-0 top-0 text-gray-600 text-sm md:text-base leading-relaxed font-medium lg:text-left">
                I build fast, responsive and scalable web apps with clean
                architecture — creative design and AI integration that
                actually pays off.{" "}
                {hoveredSection === "web" && (
                    <HeroTypewriter text="Full products with Next.js, React and TypeScript on Laravel or Node.js APIs — we solve the real problem first, then ship the cleanest solution: SEO-ready rendering, responsive UI, auth, payments and production deployment." />
                )}
              </p>
            </div>
            <div className="hero-tech-list grid grid-cols-4 sm:grid-cols-5 gap-y-8 gap-x-4 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-html5 text-4xl text-orange-600 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  HTML5
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-css3-alt text-4xl text-blue-600 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  CSS3
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-js text-4xl text-yellow-400 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  JavaScript
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold tech-icon">
                  TS
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  TypeScript
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-react text-4xl text-cyan-400 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  React
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-black text-white rounded-full text-xs flex items-center justify-center font-bold tech-icon">
                  N
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  Next.js
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-laravel text-4xl text-red-500 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  Laravel
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <i className="fa-brands fa-node-js text-4xl text-green-500 tech-icon"></i>
                <span className="text-[10px] font-bold text-gray-500">
                  Node.js
                </span>
              </div>
            </div>
            <a
              href="#projects"
              className="hero-work-link hero-work-link--web hero-action"
              onClick={() => handleViewWork("a-store")}
            >
              VIEW OUR WORK
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </main>

      <ProjectShowcase />

      <ContactSection />
    </div>
  );
}
