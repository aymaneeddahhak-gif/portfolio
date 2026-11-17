"use client";

import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type MotionPhase = "loading" | "handoff" | "complete";
export type MotionState = "idle" | "entered";

export type MotionStyle = CSSProperties & {
  "--motion-delay"?: string;
};

const BOOT_VIDEO_PLAYBACK_RATE = 1.0;
const BOOT_SESSION_KEY = "aed-portfolio-booted";

export function PortfolioBootOverlay({
  phase,
  reducedMotion,
  onFinished,
}: {
  phase: MotionPhase;
  reducedMotion: boolean;
  onFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackFailureTimer = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "loading" || reducedMotion) return;

    const video = videoRef.current;
    if (video) {
      video.playbackRate = BOOT_VIDEO_PLAYBACK_RATE;
    }

    const startTimer = window.setTimeout(() => {
      if (!video || video.ended) return;

      video.playbackRate = BOOT_VIDEO_PLAYBACK_RATE;

      void video.play().catch(() => {
        if (playbackFailureTimer.current !== null) return;
        playbackFailureTimer.current = window.setTimeout(onFinished, 300);
      });
    }, 0);
    // Safe fallback timer (10 seconds) only in case browser blocks or fails video decoding
    const fallbackTimer = window.setTimeout(onFinished, 10000);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(fallbackTimer);
      if (playbackFailureTimer.current !== null) {
        window.clearTimeout(playbackFailureTimer.current);
        playbackFailureTimer.current = null;
      }
    };
  }, [onFinished, phase, reducedMotion]);

  if (phase === "complete") {
    return <div className="portfolio-boot" data-phase="complete" aria-hidden="true" />;
  }

  return (
    <div
      className="portfolio-boot"
      data-phase={phase}
    >
      <video
        ref={videoRef}
        className="portfolio-boot__video"
        aria-hidden="true"
        controls={false}
        controlsList="nodownload noplaybackrate nofullscreen"
        disablePictureInPicture
        disableRemotePlayback
        muted
        playsInline
        preload={reducedMotion ? "none" : "auto"}
        tabIndex={-1}
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = BOOT_VIDEO_PLAYBACK_RATE;
        }}
        onPlay={(e) => {
          e.currentTarget.playbackRate = BOOT_VIDEO_PLAYBACK_RATE;
        }}
        onEnded={onFinished}
        onError={onFinished}
      >
        <source src="/videos/firstldgvideo.webm" type="video/webm" />
        <source src="/videos/firstldgvideo.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function usePortfolioBoot() {
  const reducedMotion = useReducedMotionPreference();
  const [phase, setPhase] = useState<MotionPhase>("loading");
  const finished = useRef(false);
  const handoffTimer = useRef<number | null>(null);

  const finishBoot = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(BOOT_SESSION_KEY, "1");
      document.documentElement.setAttribute("data-booted", "1");
    } catch {}
    setPhase("handoff");
    handoffTimer.current = window.setTimeout(() => {
      setPhase("complete");
    }, 520);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");

    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem(BOOT_SESSION_KEY) === "1";
    } catch {}

    if (alreadyBooted) {
      finished.current = true;
      try {
        document.documentElement.setAttribute("data-booted", "1");
      } catch {}
      const immediateTimer = window.setTimeout(() => {
        setPhase("complete");
      }, 0);
      return () => window.clearTimeout(immediateTimer);
    }

    const reducedMotionTimer = reducedMotion
      ? window.setTimeout(finishBoot, 120)
      : null;

    return () => {
      if (reducedMotionTimer !== null) window.clearTimeout(reducedMotionTimer);
      if (handoffTimer.current !== null) window.clearTimeout(handoffTimer.current);
    };
  }, [finishBoot, reducedMotion]);

  return { phase, reducedMotion, finishBoot };
}

type ReplayOptions = {
  enabled?: boolean;
  enterThreshold?: number;
  exitThreshold?: number;
  rootMargin?: string;
};

export function useReplaySection<T extends HTMLElement>(
  sectionRef: RefObject<T | null>,
  {
    enabled = true,
    enterThreshold = 0.06,
    rootMargin = "120px 0px",
  }: ReplayOptions = {},
) {
  const reducedMotion = useReducedMotionPreference();
  const [motionState, setMotionState] = useState<MotionState>(() =>
    reducedMotion ? "entered" : "idle",
  );
  const [isVisible, setIsVisible] = useState(false);
  const [hasEnteredOnce, setHasEnteredOnce] = useState(false);
  const [isReentry, setIsReentry] = useState(false);
  const seenRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    if (!section) {
      const fallbackId = requestAnimationFrame(() => {
        setMotionState("entered");
        setHasEnteredOnce(true);
      });
      return () => cancelAnimationFrame(fallbackId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = Boolean(entry?.isIntersecting);
        const ratio = entry?.intersectionRatio ?? 0;

        setIsVisible(intersecting);

        if (intersecting && ratio >= enterThreshold) {
          if (seenRef.current) {
            setIsReentry(true);
          } else {
            seenRef.current = true;
            setHasEnteredOnce(true);
          }
          setMotionState("entered");
        } else if (!intersecting) {
          // Reset cleanly when scrolled completely out (up or down) so re-entering replays the staggered reveal
          setMotionState("idle");
        }
      },
      { threshold: [0, enterThreshold, 0.15], rootMargin },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [enabled, enterThreshold, rootMargin, sectionRef]);

  return {
    motionState: reducedMotion ? "entered" : motionState,
    isVisible,
    hasEnteredOnce: reducedMotion || hasEnteredOnce,
    isReentry,
    reducedMotion,
  };
}

type TouchScrollOptions<T extends HTMLElement> = {
  enabled?: boolean;
  hoverThreshold?: number;
  onProgress?: (progress: number, el: T) => void;
};

/**
 * Site-wide Option 1 — Scroll = Hover Choreography Engine for touch viewports.
 * Translates normalized vertical scroll progress (-1..1 around viewport center)
 * into `data-scroll-hover="true"` states and 60fps rAF CSS custom property updates
 * without forcing React re-renders.
 */
export function useTouchScrollChoreography<T extends HTMLElement>(
  sectionRef: RefObject<T | null>,
  { enabled = true, hoverThreshold = 0.45, onProgress }: TouchScrollOptions<T> = {},
) {
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    if (!enabled) return;
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: none), (pointer: coarse)").matches
    ) {
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCentered = Boolean(entry?.isIntersecting);
        if (isCentered) {
          if (el.getAttribute("data-scroll-hover") !== "true") {
            el.setAttribute("data-scroll-hover", "true");
          }
          onProgressRef.current?.(0, el);
        } else if (el.hasAttribute("data-scroll-hover")) {
          el.removeAttribute("data-scroll-hover");
        }
      },
      { threshold: Math.min(0.95, Math.max(0.15, hoverThreshold)) },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeAttribute("data-scroll-hover");
    };
  }, [enabled, hoverThreshold, sectionRef]);
}

/**
 * Scroll Option 1 — Defers mounting heavy below-the-fold sections until scrolled
 * near the viewport (or jumped to via hash/nav), avoiding upfront load lag while
 * allowing bidirectional staggered entrance animations on scroll up & down.
 */
export function LazySection({
  id,
  minHeight = "70vh",
  children,
}: {
  id: string;
  minHeight?: string;
  children: ReactNode;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    // Immediately mount if URL already targets this anchor or a lower section
    const hash = window.location.hash.replace("#", "");
    if (hash === id) {
      const t = window.setTimeout(() => setMounted(true), 0);
      return () => window.clearTimeout(t);
    }

    const onJump = () => setMounted(true);
    window.addEventListener("hashchange", onJump);
    window.addEventListener("portfolio:select-project", onJump);
    window.addEventListener("select-about-tech", onJump);

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", onJump);
      window.removeEventListener("portfolio:select-project", onJump);
      window.removeEventListener("select-about-tech", onJump);
    };
  }, [id, mounted]);

  if (mounted) {
    return <>{children}</>;
  }

  return (
    <div
      id={id}
      ref={sentinelRef}
      style={{ minHeight }}
      aria-hidden="true"
      className="w-full"
    />
  );
}
