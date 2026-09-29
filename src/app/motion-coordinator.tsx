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
    const startTimer = window.setTimeout(() => {
      if (!video || video.ended) return;

      // Strict Mode can pause the same media element between effect passes.
      // Resume it from its current frame, but never rewind or replay it.
      void video.play().catch(() => {
        if (playbackFailureTimer.current !== null) return;
        playbackFailureTimer.current = window.setTimeout(onFinished, 250);
      });
    }, 0);
    const fallbackTimer = window.setTimeout(onFinished, 8000);

    // The clip's last ~0.5s scales the logo up to fill the frame. Start the
    // full-screen zoom slightly before that so the logo visually swallows the
    // page as we "enter" the site. Timer (not rAF) so it still fires when the
    // tab is not painting.
    const finaleWatcher = window.setInterval(() => {
      if (video && !video.ended && video.currentTime >= 1.7) {
        setZoomed(true);
        window.clearInterval(finaleWatcher);
      }
    }, 100);

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
        onEnded={onFinished}
        onError={onFinished}
      >
        <source
          src="/videos/firstlodingvideor.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}

const REARM_COOLDOWN = 800;

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
    }, 720);
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
    enterThreshold = 0.27,
    exitThreshold = 0.09,
  }: ReplayOptions = {},
) {
  const reducedMotion = useReducedMotionPreference();
  const [motionState, setMotionState] = useState<MotionState>("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [entryCount, setEntryCount] = useState(0);
  const armed = useRef(true);
  const lastEntryAt = useRef(0);
  const rearmTimer = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reducedMotion) {
      return;
    }

    const rearm = () => {
      armed.current = true;
      setMotionState("idle");
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        setIsVisible(ratio > 0);

        if (!enabled) return;

        if (ratio > exitThreshold && rearmTimer.current !== null) {
          window.clearTimeout(rearmTimer.current);
          rearmTimer.current = null;
        }

        if (ratio >= enterThreshold && armed.current) {
          armed.current = false;
          lastEntryAt.current = performance.now();
          setEntryCount((count) => count + 1);
          setMotionState("entered");
          if (rearmTimer.current !== null) {
            window.clearTimeout(rearmTimer.current);
            rearmTimer.current = null;
          }
          return;
        }

        if (ratio <= exitThreshold && !armed.current) {
          const wait = Math.max(
            0,
            REARM_COOLDOWN - (performance.now() - lastEntryAt.current),
          );
          if (rearmTimer.current !== null) window.clearTimeout(rearmTimer.current);
          rearmTimer.current = window.setTimeout(rearm, wait);
        }
      },
      { threshold: [0, exitThreshold, enterThreshold, 0.5, 1] },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (rearmTimer.current !== null) window.clearTimeout(rearmTimer.current);
    };
  }, [enabled, enterThreshold, exitThreshold, reducedMotion, sectionRef]);

  const visibleMotionState = reducedMotion ? "entered" : motionState;
  const visibleIsVisible = reducedMotion ? true : isVisible;

  return {
    motionState: visibleMotionState,
    isVisible: visibleIsVisible,
    isReentry: entryCount > 1,
    reducedMotion,
  };
}
