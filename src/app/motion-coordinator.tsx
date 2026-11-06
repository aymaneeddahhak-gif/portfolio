"use client";

import {
  type CSSProperties,
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

// Playback speed for the intro boot video (1.5x cuts duration from ~4.1s to ~2.7s for a snappier load)
const BOOT_VIDEO_PLAYBACK_RATE = 1.5;

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
  // Flips true when the clip reaches its logo scale-up scene, driving the
  // data-phase="finale" full-screen zoom (see portfolio-boot-expand CSS).
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (phase !== "loading" || reducedMotion) return;

    const video = videoRef.current;
    if (video) {
      video.playbackRate = BOOT_VIDEO_PLAYBACK_RATE;
    }

    const startTimer = window.setTimeout(() => {
      if (!video || video.ended) return;

      video.playbackRate = BOOT_VIDEO_PLAYBACK_RATE;

      // Strict Mode can pause the same media element between effect passes.
      // Resume it from its current frame, but never rewind or replay it.
      void video.play().catch(() => {
        if (playbackFailureTimer.current !== null) return;
        playbackFailureTimer.current = window.setTimeout(onFinished, 250);
      });
    }, 0);
    const fallbackTimer = window.setTimeout(onFinished, 5000);

    // firstldgvideo.mp4 (4.06s): the character types at his laptop, the camera
    // pans around behind him, and zooms into the laptop screen with AED SOLUTIONS.
    // At ~2.9s the zoom into the logo begins and lands at 4.0s.
    const finaleWatcher = window.setInterval(() => {
      if (video && !video.ended && video.currentTime >= 2.9) {
        setZoomed(true);
        window.clearInterval(finaleWatcher);
      }
    }, 80);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(fallbackTimer);
      window.clearInterval(finaleWatcher);
      if (playbackFailureTimer.current !== null) {
        window.clearTimeout(playbackFailureTimer.current);
        playbackFailureTimer.current = null;
      }
    };
  }, [onFinished, phase, reducedMotion]);

  // "finale" is a display phase: once triggered it holds until the real phase
  // leaves loading (handoff/complete take over from the parent).
  const shownPhase = phase === "loading" && zoomed ? "finale" : phase;

  return (
    <div
      className="portfolio-boot"
      data-phase={shownPhase}
      data-zoomed={zoomed && !reducedMotion ? "true" : undefined}
      aria-hidden={phase === "complete"}
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
        preload={reducedMotion ? "metadata" : "auto"}
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
        <source
          src="/videos/firstldgvideo.webm"
          type="video/webm"
        />
        <source
          src="/videos/firstldgvideo.mp4"
          type="video/mp4"
        />
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
    setPhase("handoff");
    handoffTimer.current = window.setTimeout(() => {
      setPhase("complete");
    }, 520);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
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
};

export function useReplaySection<T extends HTMLElement>(
  sectionRef: RefObject<T | null>,
  {
    enabled = true,
  }: ReplayOptions = {},
) {
  const reducedMotion = useReducedMotionPreference();
  const [motionState, setMotionState] = useState<MotionState>(() =>
    reducedMotion ? "entered" : "idle",
  );

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    if (!enabled) return;

    if (motionState === "entered") {
      return;
    }

    let rafId = 0;
    const enter = () => {
      rafId = requestAnimationFrame(() => {
        setMotionState("entered");
      });
    };

    // If near the top on load/scroll, enter immediately!
    if (typeof window !== "undefined" && window.scrollY < 400) {
      enter();
      return () => cancelAnimationFrame(rafId);
    }

    const section = sectionRef.current;
    if (!section) {
      enter();
      return () => cancelAnimationFrame(rafId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting || (entry?.intersectionRatio ?? 0) > 0) {
          enter();
          observer.disconnect();
        }
      },
      { threshold: [0, 0.05, 0.2] },
    );

    observer.observe(section);

    const onScroll = () => {
      if (window.scrollY < 400) {
        enter();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, motionState, reducedMotion, sectionRef]);

  return {
    motionState: reducedMotion ? "entered" : motionState,
    isVisible: true,
    isReentry: false,
    reducedMotion,
  };
}
