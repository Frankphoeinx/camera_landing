"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const HERO_CAPABILITY_TIME_SECONDS = 4;
const HERO_OPERATIONS_TIME_SECONDS = 10.5;
const HERO_FINAL_TIME_SECONDS = 14;
const REVERSE_TO_START_FALLBACK_SECONDS = 4.05;
const REVERSE_TO_CAPABILITY_FALLBACK_SECONDS = 6.55;
const REVERSE_TO_OPERATIONS_FALLBACK_SECONDS = 3.55;
const SCROLL_DIRECTION_THRESHOLD = 4;
const WHEEL_ACCUMULATION_RESET_MS = 180;
const START_FRAME_EPSILON_SECONDS = 0.05;
const VIDEO_LAYER_CROSSFADE_SECONDS = 0.22;
const DEFERRED_VIDEO_READY_TIMEOUT_MS = 2600;
const VIDEO_TRANSITION_STALL_TIMEOUT_MS = 4200;
const VIDEO_TRANSITION_TIMEOUT_BUFFER_MS = 5200;
const VIDEO_TRANSITION_MIN_TIMEOUT_MS = 7600;
const VIDEO_TRANSITION_PROGRESS_EPSILON_SECONDS = 0.025;
const INITIAL_FORWARD_WARMUP_DELAY_MS = 4800;
const INITIAL_FORWARD_WARMUP_IDLE_TIMEOUT_MS = 2400;
const HERO_INPUT_ALIGNMENT_TOLERANCE_PX = 24;
const HERO_VIDEO_FALLBACK_ASPECT_RATIO = 16 / 9;

type HeroVideoStep =
  | "start"
  | "playingToCapability"
  | "capability"
  | "playingToOperations"
  | "operations"
  | "playingToFinal"
  | "final"
  | "reversingToStart"
  | "reversingToCapability"
  | "reversingToOperations";

type ForwardTarget = "capability" | "operations" | "final";
type ReverseTarget = "start" | "capability" | "operations";
type SettledVideoStep = "start" | "capability" | "operations" | "final";
type DetailOverlayKind = "capability" | "operations" | "final";
type ScrollCueMode = "down" | "up" | "hidden";
type IdleCallbackWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseObjectPositionAxis = (
  token: string | undefined,
  startKeyword: string,
  endKeyword: string,
) => {
  if (!token || token === "center") {
    return 0.5;
  }

  if (token === startKeyword) {
    return 0;
  }

  if (token === endKeyword) {
    return 1;
  }

  if (token.endsWith("%")) {
    const value = Number.parseFloat(token);

    if (Number.isFinite(value)) {
      return clampNumber(value / 100, 0, 1);
    }
  }

  return 0.5;
};

const scrollCueCopy = {
  down: {
    ariaLabel: "Scroll down to continue",
    direction: "Down",
  },
  up: {
    ariaLabel: "Scroll up to review",
    direction: "Up",
  },
} satisfies Record<Exclude<ScrollCueMode, "hidden">, {
  ariaLabel: string;
  direction: string;
}>;

export function HeroSceneController() {
  const videoStepRef = useRef<HeroVideoStep>("start");

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-hero-scene]");
    const forwardVideoElement =
      root?.querySelector<HTMLVideoElement>("[data-hero-video]");
    const reverseVideoElement = root?.querySelector<HTMLVideoElement>(
      "[data-hero-video-reverse]",
    );
    const reverseToCapabilityVideoElement =
      root?.querySelector<HTMLVideoElement>(
        "[data-hero-video-reverse-operations]",
      );
    const reverseToOperationsVideoElement =
      root?.querySelector<HTMLVideoElement>(
        "[data-hero-video-reverse-final]",
      );

    if (
      !root ||
      !forwardVideoElement ||
      !reverseVideoElement ||
      !reverseToCapabilityVideoElement ||
      !reverseToOperationsVideoElement
    ) {
      return;
    }

    const forwardVideo = forwardVideoElement;
    const reverseToStartVideo = reverseVideoElement;
    const reverseToCapabilityVideo = reverseToCapabilityVideoElement;
    const reverseToOperationsVideo = reverseToOperationsVideoElement;
    const videoLayers = [
      forwardVideo,
      reverseToStartVideo,
      reverseToCapabilityVideo,
      reverseToOperationsVideo,
    ];
    const cinematicScrim = root.querySelector<HTMLElement>(
      "[data-hero-cinematic-scrim]",
    );
    const select = gsap.utils.selector(root);
    const capabilityRoot = root?.querySelector<HTMLElement>(
      "[data-capability-root]",
    );
    const operationsRoot = root?.querySelector<HTMLElement>(
      "[data-operations-root]",
    );
    const finalRoot = root?.querySelector<HTMLElement>("[data-final-root]");
    const hudRoot = root.querySelector<HTMLElement>("[data-hud-root]");
    const scrollCueElement =
      root.querySelector<HTMLElement>("[data-scroll-cue]");
    const scrollCueDirectionElement = root.querySelector<HTMLElement>(
      "[data-scroll-cue-direction]",
    );
    const detailOverlayRoots: Record<
      DetailOverlayKind,
      HTMLElement | null | undefined
    > = {
      capability: capabilityRoot,
      operations: operationsRoot,
      final: finalRoot,
    };
    const isDetailOverlayVisible: Record<DetailOverlayKind, boolean> = {
      capability: false,
      operations: false,
      final: false,
    };
    let isDisposed = false;
    let isHudHidden = false;
    let forwardTarget: ForwardTarget | null = null;
    let reverseTarget: ReverseTarget | null = null;
    let lastScrollY = window.scrollY;
    let lastTouchY: number | null = null;
    let accumulatedWheelDeltaY = 0;
    let wheelAccumulationTimeoutId: number | null = null;
    let forwardStopFrameId: number | null = null;
    let reverseStopFrameId: number | null = null;
    let isPageScrollLocked = false;
    let initialForwardWarmupTimeoutId: number | null = null;
    let initialForwardWarmupIdleId: number | null = null;
    const warmedDeferredVideos = new Set<HTMLVideoElement>();
    let lockedScrollX = window.scrollX;
    let lockedScrollY = window.scrollY;
    let transitionWatchdogFrameId: number | null = null;
    let transitionWatchdogTimeoutId: number | null = null;
    let traceLayoutFrameId: number | null = null;
    let removeTransitionVideoListeners: () => void = () => undefined;
    let activeTransition:
      | {
          expectedStep: HeroVideoStep;
          targetStep: SettledVideoStep;
          video: HTMLVideoElement;
          targetTime: number;
          lastCurrentTime: number;
          lastProgressAt: number;
        }
      | null = null;
    const warnedTransitionFailures = new Set<string>();

    const showScrollCue = (mode: Exclude<ScrollCueMode, "hidden">) => {
      const scrollCue = scrollCueCopy[mode];

      root.dataset.scrollCueMode = mode;

      if (scrollCueElement) {
        scrollCueElement.setAttribute("aria-label", scrollCue.ariaLabel);
      }

      if (scrollCueDirectionElement) {
        scrollCueDirectionElement.textContent = scrollCue.direction;
      }
    };

    const hideScrollCue = () => {
      root.dataset.scrollCueMode = "hidden";
    };

    const cancelForwardStopMonitor = () => {
      if (forwardStopFrameId === null) {
        return;
      }

      window.cancelAnimationFrame(forwardStopFrameId);
      forwardStopFrameId = null;
    };

    const clearWheelAccumulator = () => {
      accumulatedWheelDeltaY = 0;

      if (wheelAccumulationTimeoutId !== null) {
        window.clearTimeout(wheelAccumulationTimeoutId);
        wheelAccumulationTimeoutId = null;
      }
    };

    const getAccumulatedWheelDirection = (deltaY: number) => {
      if (deltaY === 0) {
        return null;
      }

      if (
        accumulatedWheelDeltaY !== 0 &&
        Math.sign(accumulatedWheelDeltaY) !== Math.sign(deltaY)
      ) {
        accumulatedWheelDeltaY = 0;
      }

      accumulatedWheelDeltaY += deltaY;

      if (wheelAccumulationTimeoutId !== null) {
        window.clearTimeout(wheelAccumulationTimeoutId);
      }

      wheelAccumulationTimeoutId = window.setTimeout(
        clearWheelAccumulator,
        WHEEL_ACCUMULATION_RESET_MS,
      );

      if (Math.abs(accumulatedWheelDeltaY) < SCROLL_DIRECTION_THRESHOLD) {
        return null;
      }

      const direction = accumulatedWheelDeltaY > 0 ? "down" : "up";
      clearWheelAccumulator();

      return direction;
    };

    const cancelReverseStopMonitor = () => {
      if (reverseStopFrameId === null) {
        return;
      }

      window.cancelAnimationFrame(reverseStopFrameId);
      reverseStopFrameId = null;
    };

    const getForwardStopTime = (targetTime: number) => {
      if (Number.isFinite(forwardVideo.duration) && forwardVideo.duration > 0) {
        return Math.min(targetTime, forwardVideo.duration);
      }

      return targetTime;
    };

    const getReverseStopTime = (
      video: HTMLVideoElement,
      fallbackDuration: number,
    ) => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        return video.duration;
      }

      return fallbackDuration;
    };

    const getVideoContentRect = () => {
      const videoRect = forwardVideo.getBoundingClientRect();
      const naturalAspectRatio =
        forwardVideo.videoWidth > 0 && forwardVideo.videoHeight > 0
          ? forwardVideo.videoWidth / forwardVideo.videoHeight
          : HERO_VIDEO_FALLBACK_ASPECT_RATIO;
      const containerAspectRatio = videoRect.width / videoRect.height;
      const contentWidth =
        containerAspectRatio > naturalAspectRatio
          ? videoRect.width
          : videoRect.height * naturalAspectRatio;
      const contentHeight =
        containerAspectRatio > naturalAspectRatio
          ? videoRect.width / naturalAspectRatio
          : videoRect.height;
      const [positionXToken, positionYToken] = window
        .getComputedStyle(forwardVideo)
        .objectPosition.trim()
        .split(/\s+/);
      const positionX = parseObjectPositionAxis(
        positionXToken,
        "left",
        "right",
      );
      const positionY = parseObjectPositionAxis(
        positionYToken,
        "top",
        "bottom",
      );

      return {
        height: contentHeight,
        left: videoRect.left + (videoRect.width - contentWidth) * positionX,
        top: videoRect.top + (videoRect.height - contentHeight) * positionY,
        width: contentWidth,
      };
    };

    const layoutAnchoredDetailTraces = (kind?: DetailOverlayKind) => {
      const contentRect = getVideoContentRect();
      const overlayKinds = kind
        ? [kind]
        : (["capability", "operations"] satisfies DetailOverlayKind[]);

      overlayKinds.forEach((overlayKind) => {
        const overlayRoot = detailOverlayRoots[overlayKind];

        if (!overlayRoot) {
          return;
        }

        const overlayRect = overlayRoot.getBoundingClientRect();
        const traceGroups = overlayRoot.querySelectorAll<HTMLElement>(
          "[data-video-anchor-x][data-video-anchor-y]",
        );

        traceGroups.forEach((traceGroup) => {
          const panel = traceGroup.closest<HTMLElement>(
            "[data-capability-panel], [data-operations-panel]",
          );
          const anchorX = Number.parseFloat(
            traceGroup.dataset.videoAnchorX ?? "",
          );
          const anchorY = Number.parseFloat(
            traceGroup.dataset.videoAnchorY ?? "",
          );

          if (
            !panel ||
            !Number.isFinite(anchorX) ||
            !Number.isFinite(anchorY) ||
            panel.offsetWidth <= 0 ||
            panel.offsetHeight <= 0
          ) {
            return;
          }

          const panelLeft = overlayRect.left + panel.offsetLeft;
          const panelTop = overlayRect.top + panel.offsetTop;
          const panelRight = panelLeft + panel.offsetWidth;
          const panelBottom = panelTop + panel.offsetHeight;
          const anchorClientX =
            contentRect.left + clampNumber(anchorX, 0, 1) * contentRect.width;
          const anchorClientY =
            contentRect.top + clampNumber(anchorY, 0, 1) * contentRect.height;
          const shouldUseLeftEdge =
            anchorClientX < panelLeft ||
            (anchorClientX <= panelRight &&
              Math.abs(anchorClientX - panelLeft) <
                Math.abs(anchorClientX - panelRight));
          const startClientX = shouldUseLeftEdge ? panelLeft : panelRight;
          const verticalInset = Math.min(28, panel.offsetHeight / 3);
          const minStartY = panelTop + verticalInset;
          const maxStartY = panelBottom - verticalInset;
          const startClientY =
            minStartY <= maxStartY
              ? clampNumber(anchorClientY, minStartY, maxStartY)
              : panelTop + panel.offsetHeight / 2;
          const deltaX = anchorClientX - startClientX;
          const deltaY = anchorClientY - startClientY;
          const traceWidth = Math.hypot(deltaX, deltaY);

          traceGroup.style.right = "auto";
          traceGroup.style.left = `${startClientX - panelLeft}px`;
          traceGroup.style.top = `${startClientY - panelTop}px`;
          traceGroup.style.width = `${traceWidth}px`;
          traceGroup.style.transform = `rotate(${Math.atan2(deltaY, deltaX)}rad)`;
          traceGroup.style.transformOrigin = "left center";
        });
      });
    };

    const scheduleAnchoredTraceLayout = () => {
      if (traceLayoutFrameId !== null) {
        window.cancelAnimationFrame(traceLayoutFrameId);
      }

      traceLayoutFrameId = window.requestAnimationFrame(() => {
        traceLayoutFrameId = null;
        layoutAnchoredDetailTraces();
      });
    };

    const cancelAnchoredTraceLayout = () => {
      if (traceLayoutFrameId === null) {
        return;
      }

      window.cancelAnimationFrame(traceLayoutFrameId);
      traceLayoutFrameId = null;
    };

    const lockPageScroll = () => {
      hideScrollCue();

      if (isPageScrollLocked) {
        return;
      }

      isPageScrollLocked = true;
      lockedScrollX = window.scrollX;
      lockedScrollY = window.scrollY;
    };

    const unlockPageScroll = () => {
      if (!isPageScrollLocked) {
        return;
      }

      isPageScrollLocked = false;
      lastScrollY = window.scrollY;
    };

    const keepLockedScrollPosition = () => {
      if (!isPageScrollLocked) {
        return;
      }

      window.scrollTo(lockedScrollX, lockedScrollY);
      lastScrollY = lockedScrollY;
    };

    const isHeroSceneActive = () => {
      const rect = root.getBoundingClientRect();

      return (
        Math.abs(rect.top) <= HERO_INPUT_ALIGNMENT_TOLERANCE_PX &&
        rect.bottom >= window.innerHeight - HERO_INPUT_ALIGNMENT_TOLERANCE_PX
      );
    };

    const isExternalHashNavigation = () => {
      const { hash } = window.location;

      if (!hash) {
        return false;
      }

      try {
        const target = document.getElementById(
          decodeURIComponent(hash.slice(1)),
        );

        return Boolean(target && !root.contains(target));
      } catch {
        return false;
      }
    };

    const showVideoLayer = (activeVideo: HTMLVideoElement) => {
      gsap.killTweensOf(videoLayers);
      gsap.set(videoLayers, { opacity: 0 });
      gsap.set(activeVideo, { opacity: 1 });
    };

    const showForwardVideo = () => showVideoLayer(forwardVideo);

    const warmVideoElement = (video: HTMLVideoElement) => {
      video.preload = "auto";

      if (video.networkState === video.NETWORK_EMPTY) {
        video.load();
      }
    };

    const warmDeferredVideo = (video: HTMLVideoElement) => {
      if (warmedDeferredVideos.has(video)) {
        return;
      }

      warmedDeferredVideos.add(video);
      warmVideoElement(video);
    };

    const cancelInitialForwardWarmup = () => {
      if (initialForwardWarmupTimeoutId !== null) {
        window.clearTimeout(initialForwardWarmupTimeoutId);
        initialForwardWarmupTimeoutId = null;
      }

      if (initialForwardWarmupIdleId !== null) {
        const idleWindow = window as IdleCallbackWindow;

        idleWindow.cancelIdleCallback?.(initialForwardWarmupIdleId);
        initialForwardWarmupIdleId = null;
      }
    };

    const scheduleInitialForwardWarmup = () => {
      if (
        initialForwardWarmupTimeoutId !== null ||
        initialForwardWarmupIdleId !== null
      ) {
        return;
      }

      initialForwardWarmupTimeoutId = window.setTimeout(() => {
        initialForwardWarmupTimeoutId = null;
        const idleWindow = window as IdleCallbackWindow;
        const warmForwardVideo = () => {
          initialForwardWarmupIdleId = null;

          if (!isDisposed) {
            warmVideoElement(forwardVideo);
          }
        };

        if (idleWindow.requestIdleCallback) {
          initialForwardWarmupIdleId = idleWindow.requestIdleCallback(
            warmForwardVideo,
            { timeout: INITIAL_FORWARD_WARMUP_IDLE_TIMEOUT_MS },
          );
          return;
        }

        window.requestAnimationFrame(warmForwardVideo);
      }, INITIAL_FORWARD_WARMUP_DELAY_MS);
    };

    const waitForVideoFrameReady = (
      video: HTMLVideoElement,
      timeoutMs = 420,
    ) =>
      new Promise<void>((resolve) => {
        let timeoutId: number | null = null;
        let firstFrameId: number | null = null;
        let secondFrameId: number | null = null;
        let didResolve = false;

        const cleanup = () => {
          video.removeEventListener("canplay", settle);
          video.removeEventListener("loadeddata", settle);
          video.removeEventListener("seeked", settle);
          video.removeEventListener("error", settle);

          if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
          }

          if (firstFrameId !== null) {
            window.cancelAnimationFrame(firstFrameId);
          }

          if (secondFrameId !== null) {
            window.cancelAnimationFrame(secondFrameId);
          }
        };

        const resolveAfterPaint = () => {
          firstFrameId = window.requestAnimationFrame(() => {
            secondFrameId = window.requestAnimationFrame(() => resolve());
          });
        };

        function settle() {
          if (didResolve) {
            return;
          }

          didResolve = true;
          cleanup();
          resolveAfterPaint();
        }

        if (!video.seeking && video.readyState >= video.HAVE_CURRENT_DATA) {
          settle();
          return;
        }

        video.addEventListener("canplay", settle, { once: true });
        video.addEventListener("loadeddata", settle, { once: true });
        video.addEventListener("seeked", settle, { once: true });
        video.addEventListener("error", settle, { once: true });
        timeoutId = window.setTimeout(settle, timeoutMs);
      });

    const waitForDeferredVideoFrameReady = (video: HTMLVideoElement) => {
      warmDeferredVideo(video);

      return waitForVideoFrameReady(video, DEFERRED_VIDEO_READY_TIMEOUT_MS);
    };

    const crossfadeVideoLayer = (
      fromVideo: HTMLVideoElement,
      toVideo: HTMLVideoElement,
    ) =>
      new Promise<void>((resolve) => {
        gsap.killTweensOf(videoLayers);
        gsap.set(videoLayers, { opacity: 0 });
        gsap.set([fromVideo, toVideo], { opacity: 1 });
        gsap.to(fromVideo, {
          duration: VIDEO_LAYER_CROSSFADE_SECONDS,
          ease: "power2.out",
          opacity: 0,
          onComplete: () => {
            resolve();
          },
        });
      });

    const prepareForwardFrame = (targetTime: number) => {
      forwardVideo.pause();

      const nextTime = getForwardStopTime(targetTime);

      if (
        forwardVideo.readyState >= forwardVideo.HAVE_METADATA &&
        Math.abs(forwardVideo.currentTime - nextTime) >
          START_FRAME_EPSILON_SECONDS
      ) {
        forwardVideo.currentTime = nextTime;
      }
    };

    const prepareReverseFrame = (
      video: HTMLVideoElement,
      targetTime = 0,
    ) => {
      video.pause();

      if (
        video.readyState >= video.HAVE_METADATA &&
        Math.abs(video.currentTime - targetTime) > START_FRAME_EPSILON_SECONDS
      ) {
        video.currentTime = targetTime;
      }
    };

    const getHudRevealTargets = () => {
      if (!select) {
        return [hudRoot, cinematicScrim].filter(Boolean) as Element[];
      }

      return [
        hudRoot,
        cinematicScrim,
        ...select("[data-hud-item]"),
        ...select("[data-headline-line]"),
        ...select("[data-status-row]"),
        ...select("[data-telemetry-item]"),
        ...select("[data-interface-line]"),
        ...select("[data-scan-line]"),
        ...select("[data-status-sweep]"),
        ...select("[data-cta-sheen]"),
      ].filter(Boolean) as Element[];
    };

    const killHudRevealTweens = () => {
      gsap.killTweensOf(getHudRevealTargets());
    };

    const getDetailOverlayTargets = (kind: DetailOverlayKind) => {
      const overlayRoot = detailOverlayRoots[kind];

      if (!select) {
        return [overlayRoot].filter(Boolean) as Element[];
      }

      return [
        overlayRoot,
        ...select(`[data-${kind}-panel]`),
        ...select(`[data-${kind}-trace]`),
        ...select(`[data-${kind}-marker]`),
        ...select(`[data-${kind}-sweep]`),
      ].filter(Boolean) as Element[];
    };

    const killDetailOverlayTweens = (kind: DetailOverlayKind) => {
      gsap.killTweensOf(getDetailOverlayTargets(kind));
    };

    const killAllDetailOverlayTweens = () => {
      killDetailOverlayTweens("capability");
      killDetailOverlayTweens("operations");
      killDetailOverlayTweens("final");
    };

    const showDetailOverlay = (kind: DetailOverlayKind) => {
      const overlayRoot = detailOverlayRoots[kind];

      if (!overlayRoot || !select || isDetailOverlayVisible[kind]) {
        return;
      }

      isDetailOverlayVisible[kind] = true;
      killDetailOverlayTweens(kind);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const panels = select(`[data-${kind}-panel]`);
      const traces = select(`[data-${kind}-trace]`);
      const markers = select(`[data-${kind}-marker]`);
      const sweeps = select(`[data-${kind}-sweep]`);

      layoutAnchoredDetailTraces(kind);

      if (reducedMotion) {
        gsap.set([overlayRoot, ...panels, ...traces, ...markers], {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });

        if (sweeps.length > 0) {
          gsap.set(sweeps, { autoAlpha: 0 });
        }

        return;
      }

      gsap.set(overlayRoot, { autoAlpha: 1 });

      if (panels.length > 0) {
        gsap.set(panels, {
          autoAlpha: 0,
          filter: "blur(14px)",
          scale: 0.96,
          y: 24,
        });
      }

      if (traces.length > 0) {
        gsap.set(traces, {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "left center",
        });
      }

      if (markers.length > 0) {
        gsap.set(markers, {
          opacity: 0,
          scale: 0.42,
        });
      }

      if (sweeps.length > 0) {
        gsap.set(sweeps, {
          autoAlpha: 0,
          xPercent: -120,
        });
      }

      const detailTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      if (panels.length > 0) {
        detailTimeline.to(
          panels,
          {
            autoAlpha: 1,
            duration: 0.72,
            filter: "blur(0px)",
            scale: 1,
            stagger: 0.18,
            y: 0,
          },
          0.08,
        );
      }

      if (traces.length > 0) {
        detailTimeline.to(
          traces,
          {
            duration: 0.68,
            opacity: 0.86,
            scaleX: 1,
            stagger: 0.16,
          },
          0.22,
        );
      }

      if (markers.length > 0) {
        detailTimeline.to(
          markers,
          {
            duration: 0.52,
            ease: "back.out(1.8)",
            opacity: 1,
            scale: 1,
            stagger: 0.14,
          },
          0.34,
        );
      }

      if (sweeps.length > 0) {
        detailTimeline
          .to(
            sweeps,
            {
              autoAlpha: 0.78,
              duration: 0.86,
              ease: "power2.inOut",
              stagger: 0.18,
              xPercent: 135,
            },
            0.42,
          )
          .set(sweeps, {
            autoAlpha: 0,
            xPercent: -120,
          });
      }
    };

    const hideDetailOverlay = (kind: DetailOverlayKind) => {
      const overlayRoot = detailOverlayRoots[kind];

      if (!overlayRoot || !isDetailOverlayVisible[kind]) {
        return;
      }

      isDetailOverlayVisible[kind] = false;
      killDetailOverlayTweens(kind);
      gsap.to(overlayRoot, {
        autoAlpha: 0,
        duration: 0.34,
        ease: "power2.in",
        y: -10,
        onComplete: () => {
          gsap.set(overlayRoot, { clearProps: "transform" });
        },
      });
    };

    const hideAllDetailOverlays = () => {
      hideDetailOverlay("capability");
      hideDetailOverlay("operations");
      hideDetailOverlay("final");
    };

    const hideHud = () => {
      if (isHudHidden) {
        return;
      }

      isHudHidden = true;
      killHudRevealTweens();

      if (hudRoot) {
        gsap.to(hudRoot, {
          autoAlpha: 0,
          duration: 0.68,
          ease: "power3.out",
          filter: "blur(14px)",
          pointerEvents: "none",
          y: -22,
        });
      }

      if (cinematicScrim) {
        gsap.set(cinematicScrim, { clearProps: "visibility" });
        gsap.to(cinematicScrim, {
          opacity: 0,
          duration: 0.72,
          ease: "power3.out",
        });
      }
    };

    const showHud = () => {
      if (!isHudHidden) {
        return;
      }

      isHudHidden = false;
      killHudRevealTweens();

      if (!hudRoot || !select) {
        if (hudRoot) {
          gsap.set(hudRoot, {
            autoAlpha: 1,
            filter: "blur(0px)",
            pointerEvents: "auto",
            y: 0,
          });
        }

        if (cinematicScrim) {
          gsap.set(cinematicScrim, {
            clearProps: "visibility",
            opacity: 1,
          });
        }

        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const hudItems = select("[data-hud-item]");
      const headlineLines = select("[data-headline-line]");
      const statusRows = select("[data-status-row]");
      const telemetryItems = select("[data-telemetry-item]");
      const interfaceLines = select("[data-interface-line]");
      const scanLines = select("[data-scan-line]");
      const statusSweeps = select("[data-status-sweep]");
      const ctaSheen = select("[data-cta-sheen]");

      if (reducedMotion) {
        gsap.set(hudRoot, {
          autoAlpha: 1,
          clearProps: "transform",
          filter: "blur(0px)",
          pointerEvents: "auto",
        });
        gsap.set(
          [
            ...hudItems,
            ...headlineLines,
            ...statusRows,
            ...telemetryItems,
            ...interfaceLines,
            ...scanLines,
            ...statusSweeps,
          ],
          { clearProps: "opacity,visibility,transform,filter" },
        );
        gsap.set(ctaSheen, {
          "--action-sheen-opacity": 0,
          "--action-sheen-x": "-240%",
        });

        if (cinematicScrim) {
          gsap.set(cinematicScrim, {
            clearProps: "visibility",
            opacity: 1,
          });
        }

        return;
      }

      gsap.set(hudRoot, {
        autoAlpha: 0,
        filter: "blur(18px)",
        pointerEvents: "none",
        y: 28,
      });
      gsap.set(hudItems, {
        autoAlpha: 0,
        filter: "blur(8px)",
        y: 18,
      });
      gsap.set(headlineLines, { yPercent: 112 });
      gsap.set([...statusRows, ...telemetryItems], {
        autoAlpha: 0,
        x: -18,
      });
      gsap.set(interfaceLines, {
        scaleY: 0,
      });
      gsap.set(scanLines, {
        autoAlpha: 0,
        yPercent: -120,
      });
      gsap.set(statusSweeps, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(ctaSheen, {
        "--action-sheen-opacity": 0,
        "--action-sheen-x": "-240%",
      });

      if (cinematicScrim) {
        gsap.set(cinematicScrim, { clearProps: "visibility" });
        gsap.set(cinematicScrim, { opacity: 0 });
      }

      const revealTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      if (cinematicScrim) {
        revealTimeline.to(
          cinematicScrim,
          {
            opacity: 1,
            duration: 1.05,
            ease: "sine.out",
          },
          0.12,
        );
      }

      revealTimeline
        .to(
          hudRoot,
          {
            autoAlpha: 1,
            duration: 0.8,
            filter: "blur(0px)",
            y: 0,
          },
          0.12,
        )
        .set(hudRoot, { pointerEvents: "auto" }, 0.12)
        .to(
          interfaceLines,
          {
            duration: 0.84,
            scaleY: 1,
          },
          0.18,
        )
        .to(
          hudItems,
          {
            autoAlpha: 1,
            duration: 0.72,
            filter: "blur(0px)",
            stagger: 0.1,
            y: 0,
          },
          0.34,
        )
        .to(
          headlineLines,
          {
            duration: 0.92,
            ease: "expo.out",
            stagger: 0.08,
            yPercent: 0,
          },
          0.48,
        )
        .to(
          statusRows,
          {
            autoAlpha: 1,
            duration: 0.58,
            stagger: 0.08,
            x: 0,
          },
          0.97,
        )
        .to(
          statusSweeps,
          {
            duration: 0.72,
            ease: "power2.out",
            stagger: 0.08,
            scaleX: 1,
          },
          1,
        )
        .to(
          telemetryItems,
          {
            autoAlpha: 1,
            duration: 0.54,
            stagger: 0.06,
            x: 0,
          },
          1.24,
        )
        .to(
          scanLines,
          {
            autoAlpha: 0.72,
            duration: 0.9,
            ease: "power2.inOut",
            yPercent: 120,
          },
          1.1,
        );
    };

    const getTransitionTimeoutMs = (durationSeconds: number) =>
      Math.max(
        VIDEO_TRANSITION_MIN_TIMEOUT_MS,
        durationSeconds * 1000 + VIDEO_TRANSITION_TIMEOUT_BUFFER_MS,
      );

    const hasDrawableFrame = (video: HTMLVideoElement) =>
      video.readyState >= video.HAVE_CURRENT_DATA;

    const hideAllDetailOverlaysNow = () => {
      killAllDetailOverlayTweens();
      (["capability", "operations", "final"] satisfies DetailOverlayKind[])
        .forEach((kind) => {
          const overlayRoot = detailOverlayRoots[kind];

          isDetailOverlayVisible[kind] = false;

          if (overlayRoot) {
            gsap.set(overlayRoot, {
              autoAlpha: 0,
              clearProps: "transform",
            });
          }
        });
    };

    const showSettledVideoFrame = (targetStep: SettledVideoStep) => {
      if (targetStep === "start") {
        prepareForwardFrame(0);
        showForwardVideo();
        return;
      }

      const targetTime =
        targetStep === "capability"
          ? HERO_CAPABILITY_TIME_SECONDS
          : targetStep === "operations"
            ? HERO_OPERATIONS_TIME_SECONDS
            : HERO_FINAL_TIME_SECONDS;
      const targetReverseVideo =
        targetStep === "capability"
          ? reverseToStartVideo
          : targetStep === "operations"
            ? reverseToCapabilityVideo
            : reverseToOperationsVideo;

      prepareForwardFrame(targetTime);
      prepareReverseFrame(targetReverseVideo, 0);
      showVideoLayer(
        hasDrawableFrame(targetReverseVideo) ? targetReverseVideo : forwardVideo,
      );
    };

    const warnTransitionRecovery = (
      transition: NonNullable<typeof activeTransition>,
      reason: string,
      error?: unknown,
    ) => {
      const warningKey = `${transition.expectedStep}:${reason}`;

      if (warnedTransitionFailures.has(warningKey)) {
        return;
      }

      warnedTransitionFailures.add(warningKey);
      console.warn("Hero video transition recovered by watchdog.", {
        error,
        reason,
        targetStep: transition.targetStep,
        transitionStep: transition.expectedStep,
      });
    };

    const cancelTransitionWatchdog = () => {
      if (transitionWatchdogFrameId !== null) {
        window.cancelAnimationFrame(transitionWatchdogFrameId);
        transitionWatchdogFrameId = null;
      }

      if (transitionWatchdogTimeoutId !== null) {
        window.clearTimeout(transitionWatchdogTimeoutId);
        transitionWatchdogTimeoutId = null;
      }

      removeTransitionVideoListeners();
      removeTransitionVideoListeners = () => undefined;
      activeTransition = null;
    };

    const forceCompleteTransition = (
      transition: NonNullable<typeof activeTransition>,
      reason: string,
      error?: unknown,
    ) => {
      if (isDisposed || videoStepRef.current !== transition.expectedStep) {
        return;
      }

      warnTransitionRecovery(transition, reason, error);
      forwardTarget = null;
      reverseTarget = null;
      cancelForwardStopMonitor();
      cancelReverseStopMonitor();
      cancelTransitionWatchdog();
      videoLayers.forEach((video) => {
        video.pause();
      });

      hideAllDetailOverlaysNow();
      showSettledVideoFrame(transition.targetStep);

      if (transition.targetStep === "start") {
        showHud();
      } else {
        hideHud();
        showDetailOverlay(transition.targetStep);
      }

      videoStepRef.current = transition.targetStep;
      showScrollCue(transition.targetStep === "final" ? "up" : "down");
      unlockPageScroll();
    };

    const forceCompleteActiveTransition = (
      reason: string,
      error?: unknown,
    ) => {
      const transition = activeTransition;

      if (!transition) {
        return;
      }

      forceCompleteTransition(transition, reason, error);
    };

    const startTransitionWatchdog = ({
      expectedStep,
      targetStep,
      targetTime,
      video,
    }: {
      expectedStep: HeroVideoStep;
      targetStep: SettledVideoStep;
      targetTime: number;
      video: HTMLVideoElement;
    }) => {
      cancelTransitionWatchdog();

      const currentTime = video.currentTime;
      const now = performance.now();
      const playbackDurationSeconds = Math.max(
        Math.abs(targetTime - currentTime),
        0.1,
      );

      activeTransition = {
        expectedStep,
        lastCurrentTime: currentTime,
        lastProgressAt: now,
        targetStep,
        targetTime,
        video,
      };

      const forceFromActiveTransition = (reason: string, error?: unknown) => {
        forceCompleteActiveTransition(reason, error);
      };
      const handleVideoWait = () => {
        const transition = activeTransition;

        if (transition && videoStepRef.current === transition.expectedStep) {
          transition.lastProgressAt = Math.min(
            transition.lastProgressAt,
            performance.now(),
          );
        }
      };
      const handleVideoError = () => {
        forceFromActiveTransition("error", video.error);
      };

      video.addEventListener("waiting", handleVideoWait);
      video.addEventListener("stalled", handleVideoWait);
      video.addEventListener("error", handleVideoError, { once: true });
      removeTransitionVideoListeners = () => {
        video.removeEventListener("waiting", handleVideoWait);
        video.removeEventListener("stalled", handleVideoWait);
        video.removeEventListener("error", handleVideoError);
      };

      transitionWatchdogTimeoutId = window.setTimeout(
        () => forceFromActiveTransition("timeout"),
        getTransitionTimeoutMs(playbackDurationSeconds),
      );

      const checkPlaybackProgress = () => {
        const transition = activeTransition;

        if (!transition || videoStepRef.current !== transition.expectedStep) {
          return;
        }

        const nextTime = transition.video.currentTime;

        if (
          Math.abs(nextTime - transition.lastCurrentTime) >=
          VIDEO_TRANSITION_PROGRESS_EPSILON_SECONDS
        ) {
          transition.lastCurrentTime = nextTime;
          transition.lastProgressAt = performance.now();
        } else if (
          performance.now() - transition.lastProgressAt >=
          VIDEO_TRANSITION_STALL_TIMEOUT_MS
        ) {
          forceCompleteTransition(transition, "stalled");
          return;
        }

        transitionWatchdogFrameId =
          window.requestAnimationFrame(checkPlaybackProgress);
      };

      transitionWatchdogFrameId =
        window.requestAnimationFrame(checkPlaybackProgress);
    };

    const settleAtCapability = (
      fromVideo: HTMLVideoElement,
      expectedStep: HeroVideoStep,
    ) => {
      prepareReverseFrame(reverseToStartVideo, 0);

      void waitForDeferredVideoFrameReady(reverseToStartVideo).then(() => {
        if (isDisposed || videoStepRef.current !== expectedStep) {
          return;
        }

        void crossfadeVideoLayer(fromVideo, reverseToStartVideo).then(() => {
          if (isDisposed || videoStepRef.current !== expectedStep) {
            return;
          }

            videoStepRef.current = "capability";
            prepareForwardFrame(HERO_CAPABILITY_TIME_SECONDS);
            showDetailOverlay("capability");
            showScrollCue("down");
            unlockPageScroll();
            cancelTransitionWatchdog();
          });
      });
    };

    const settleAtOperations = (
      fromVideo: HTMLVideoElement,
      expectedStep: HeroVideoStep,
    ) => {
      prepareReverseFrame(reverseToCapabilityVideo, 0);

      void waitForDeferredVideoFrameReady(reverseToCapabilityVideo).then(() => {
        if (isDisposed || videoStepRef.current !== expectedStep) {
          return;
        }

        void crossfadeVideoLayer(fromVideo, reverseToCapabilityVideo).then(
          () => {
            if (isDisposed || videoStepRef.current !== expectedStep) {
              return;
            }

            videoStepRef.current = "operations";
            prepareForwardFrame(HERO_OPERATIONS_TIME_SECONDS);
            showDetailOverlay("operations");
            showScrollCue("down");
            unlockPageScroll();
            cancelTransitionWatchdog();
          },
        );
      });
    };

    const settleAtFinal = (expectedStep: HeroVideoStep) => {
      prepareReverseFrame(reverseToOperationsVideo, 0);

      void waitForDeferredVideoFrameReady(reverseToOperationsVideo).then(() => {
        if (isDisposed || videoStepRef.current !== expectedStep) {
          return;
        }

        void crossfadeVideoLayer(forwardVideo, reverseToOperationsVideo).then(
          () => {
            if (isDisposed || videoStepRef.current !== expectedStep) {
              return;
            }

            videoStepRef.current = "final";
            prepareForwardFrame(HERO_FINAL_TIME_SECONDS);
            showDetailOverlay("final");
            showScrollCue("up");
            unlockPageScroll();
            cancelTransitionWatchdog();
          },
        );
      });
    };

    const settleAtStart = (
      fromVideo: HTMLVideoElement,
      expectedStep: HeroVideoStep,
    ) => {
      prepareForwardFrame(0);

      void waitForVideoFrameReady(forwardVideo).then(() => {
        if (isDisposed || videoStepRef.current !== expectedStep) {
          return;
        }

        void crossfadeVideoLayer(fromVideo, forwardVideo).then(() => {
          if (isDisposed || videoStepRef.current !== expectedStep) {
            return;
          }

          videoStepRef.current = "start";
          showHud();
          showScrollCue("down");
          unlockPageScroll();
          cancelTransitionWatchdog();
        });
      });
    };

    const pauseForwardAtStopTime = () => {
      if (forwardTarget === null) {
        return;
      }

      const stopTime = getForwardStopTime(
        forwardTarget === "capability"
          ? HERO_CAPABILITY_TIME_SECONDS
          : forwardTarget === "operations"
            ? HERO_OPERATIONS_TIME_SECONDS
            : HERO_FINAL_TIME_SECONDS,
      );

      if (forwardVideo.currentTime >= stopTime) {
        const completedTarget = forwardTarget;

        forwardVideo.pause();
        forwardVideo.currentTime = stopTime;
        forwardTarget = null;
        cancelForwardStopMonitor();

        if (completedTarget === "capability") {
          settleAtCapability(forwardVideo, "playingToCapability");
          return;
        }

        if (completedTarget === "operations") {
          settleAtOperations(forwardVideo, "playingToOperations");
          return;
        }

        settleAtFinal("playingToFinal");
        return;
      }

      forwardStopFrameId = window.requestAnimationFrame(pauseForwardAtStopTime);
    };

    const switchToStartFrame = () => {
      if (videoStepRef.current !== "start") {
        return;
      }

      forwardVideo.pause();
      reverseToStartVideo.pause();
      reverseToCapabilityVideo.pause();
      reverseToOperationsVideo.pause();
      forwardVideo.currentTime = 0;

      [reverseToStartVideo, reverseToCapabilityVideo, reverseToOperationsVideo]
        .filter((video) => video.readyState >= video.HAVE_METADATA)
        .forEach((video) => {
          video.currentTime = 0;
        });

      showForwardVideo();
      showScrollCue("down");
      scheduleInitialForwardWarmup();
    };

    const startForwardStopMonitor = (target: ForwardTarget) => {
      forwardTarget = target;
      cancelForwardStopMonitor();
      forwardStopFrameId = window.requestAnimationFrame(
        pauseForwardAtStopTime,
      );
    };

    const pauseReverseAtStopTime = () => {
      if (reverseTarget === null) {
        return;
      }

      const activeReverseVideo =
        reverseTarget === "start"
          ? reverseToStartVideo
          : reverseTarget === "capability"
            ? reverseToCapabilityVideo
            : reverseToOperationsVideo;
      const fallbackDuration =
        reverseTarget === "start"
          ? REVERSE_TO_START_FALLBACK_SECONDS
          : reverseTarget === "capability"
            ? REVERSE_TO_CAPABILITY_FALLBACK_SECONDS
            : REVERSE_TO_OPERATIONS_FALLBACK_SECONDS;
      const stopTime = getReverseStopTime(
        activeReverseVideo,
        fallbackDuration,
      );

      if (activeReverseVideo.currentTime >= stopTime) {
        const completedTarget = reverseTarget;

        activeReverseVideo.pause();
        activeReverseVideo.currentTime = stopTime;
        reverseTarget = null;
        cancelReverseStopMonitor();

        if (completedTarget === "start") {
          settleAtStart(activeReverseVideo, "reversingToStart");
          return;
        }

        if (completedTarget === "capability") {
          settleAtCapability(activeReverseVideo, "reversingToCapability");
          return;
        }

        settleAtOperations(activeReverseVideo, "reversingToOperations");
        return;
      }

      reverseStopFrameId = window.requestAnimationFrame(
        pauseReverseAtStopTime,
      );
    };

    const startReverseStopMonitor = (target: ReverseTarget) => {
      reverseTarget = target;
      cancelReverseStopMonitor();
      reverseStopFrameId = window.requestAnimationFrame(
        pauseReverseAtStopTime,
      );
    };

    const removeScrollListeners = () => {
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };

    const addScrollListeners = () => {
      window.addEventListener("scroll", handleWindowScroll, { passive: true });
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      window.addEventListener("keydown", handleKeyDown);
    };

    const playForwardToCapability = () => {
      if (videoStepRef.current !== "start") {
        return;
      }

      videoStepRef.current = "playingToCapability";
      hideScrollCue();
      lockPageScroll();
      hideAllDetailOverlays();
      cancelReverseStopMonitor();
      reverseToStartVideo.pause();
      reverseToCapabilityVideo.pause();
      reverseToOperationsVideo.pause();
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
      reverseToStartVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );
      reverseToCapabilityVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );
      reverseToOperationsVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );

      warmVideoElement(forwardVideo);
      prepareForwardFrame(0);
      showForwardVideo();
      startTransitionWatchdog({
        expectedStep: "playingToCapability",
        targetStep: "capability",
        targetTime: getForwardStopTime(HERO_CAPABILITY_TIME_SECONDS),
        video: forwardVideo,
      });

      void forwardVideo
        .play()
        .then(() => {
          if (
            !isDisposed &&
            videoStepRef.current === "playingToCapability"
          ) {
            startForwardStopMonitor("capability");
          }
        })
        .catch((error: unknown) => {
          if (
            isDisposed ||
            videoStepRef.current !== "playingToCapability"
          ) {
            return;
          }

          forceCompleteActiveTransition("play-rejected", error);
        });
    };

    const playForwardToOperations = () => {
      if (videoStepRef.current !== "capability") {
        return;
      }

      videoStepRef.current = "playingToOperations";
      hideScrollCue();
      lockPageScroll();
      hideDetailOverlay("capability");
      cancelReverseStopMonitor();
      reverseToStartVideo.pause();
      reverseToCapabilityVideo.pause();
      reverseToOperationsVideo.pause();
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
      reverseToStartVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );
      reverseToCapabilityVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );
      reverseToOperationsVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );

      warmVideoElement(forwardVideo);
      prepareForwardFrame(HERO_CAPABILITY_TIME_SECONDS);
      startTransitionWatchdog({
        expectedStep: "playingToOperations",
        targetStep: "operations",
        targetTime: getForwardStopTime(HERO_OPERATIONS_TIME_SECONDS),
        video: forwardVideo,
      });

      void waitForVideoFrameReady(forwardVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "playingToOperations") {
          return;
        }

        void crossfadeVideoLayer(reverseToStartVideo, forwardVideo).then(() => {
          if (isDisposed || videoStepRef.current !== "playingToOperations") {
            return;
          }

          void forwardVideo
            .play()
            .then(() => {
              if (
                !isDisposed &&
                videoStepRef.current === "playingToOperations"
              ) {
                startForwardStopMonitor("operations");
              }
            })
            .catch((error: unknown) => {
              if (
                isDisposed ||
                videoStepRef.current !== "playingToOperations"
              ) {
                return;
              }

              forceCompleteActiveTransition("play-rejected", error);
            });
        });
      });
    };

    const playForwardToFinal = () => {
      if (videoStepRef.current !== "operations") {
        return;
      }

      videoStepRef.current = "playingToFinal";
      hideScrollCue();
      lockPageScroll();
      hideDetailOverlay("operations");
      cancelReverseStopMonitor();
      reverseToStartVideo.pause();
      reverseToCapabilityVideo.pause();
      reverseToOperationsVideo.pause();
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
      reverseToStartVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );
      reverseToCapabilityVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );
      reverseToOperationsVideo.removeEventListener(
        "loadedmetadata",
        switchToStartFrame,
      );

      warmVideoElement(forwardVideo);
      prepareForwardFrame(HERO_OPERATIONS_TIME_SECONDS);
      startTransitionWatchdog({
        expectedStep: "playingToFinal",
        targetStep: "final",
        targetTime: getForwardStopTime(HERO_FINAL_TIME_SECONDS),
        video: forwardVideo,
      });

      void waitForVideoFrameReady(forwardVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "playingToFinal") {
          return;
        }

        void crossfadeVideoLayer(reverseToCapabilityVideo, forwardVideo).then(
          () => {
            if (isDisposed || videoStepRef.current !== "playingToFinal") {
              return;
            }

            void forwardVideo
              .play()
              .then(() => {
                if (
                  !isDisposed &&
                  videoStepRef.current === "playingToFinal"
                ) {
                  startForwardStopMonitor("final");
                }
              })
              .catch((error: unknown) => {
                if (
                  isDisposed ||
                  videoStepRef.current !== "playingToFinal"
                ) {
                  return;
                }

                forceCompleteActiveTransition("play-rejected", error);
              });
          },
        );
      });
    };

    const playReverseToStart = () => {
      if (videoStepRef.current !== "capability") {
        return;
      }

      videoStepRef.current = "reversingToStart";
      hideScrollCue();
      lockPageScroll();
      hideDetailOverlay("capability");
      cancelForwardStopMonitor();
      forwardVideo.pause();
      reverseToCapabilityVideo.pause();
      reverseToOperationsVideo.pause();
      prepareReverseFrame(reverseToStartVideo, 0);
      startTransitionWatchdog({
        expectedStep: "reversingToStart",
        targetStep: "start",
        targetTime: getReverseStopTime(
          reverseToStartVideo,
          REVERSE_TO_START_FALLBACK_SECONDS,
        ),
        video: reverseToStartVideo,
      });

      void waitForDeferredVideoFrameReady(reverseToStartVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "reversingToStart") {
          return;
        }

        showVideoLayer(reverseToStartVideo);

        void reverseToStartVideo
          .play()
          .then(() => {
            if (
              !isDisposed &&
              videoStepRef.current === "reversingToStart"
            ) {
              startReverseStopMonitor("start");
            }
          })
          .catch((error: unknown) => {
            if (
              isDisposed ||
              videoStepRef.current !== "reversingToStart"
            ) {
              return;
            }

            forceCompleteActiveTransition("play-rejected", error);
          });
      });
    };

    const playReverseToCapability = () => {
      if (videoStepRef.current !== "operations") {
        return;
      }

      videoStepRef.current = "reversingToCapability";
      hideScrollCue();
      lockPageScroll();
      hideDetailOverlay("operations");
      cancelForwardStopMonitor();
      forwardVideo.pause();
      reverseToStartVideo.pause();
      reverseToOperationsVideo.pause();
      prepareReverseFrame(reverseToCapabilityVideo, 0);
      startTransitionWatchdog({
        expectedStep: "reversingToCapability",
        targetStep: "capability",
        targetTime: getReverseStopTime(
          reverseToCapabilityVideo,
          REVERSE_TO_CAPABILITY_FALLBACK_SECONDS,
        ),
        video: reverseToCapabilityVideo,
      });

      void waitForDeferredVideoFrameReady(reverseToCapabilityVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "reversingToCapability") {
          return;
        }

        showVideoLayer(reverseToCapabilityVideo);

        void reverseToCapabilityVideo
          .play()
          .then(() => {
            if (
              !isDisposed &&
              videoStepRef.current === "reversingToCapability"
            ) {
              startReverseStopMonitor("capability");
            }
          })
          .catch((error: unknown) => {
            if (
              isDisposed ||
              videoStepRef.current !== "reversingToCapability"
            ) {
              return;
            }

            forceCompleteActiveTransition("play-rejected", error);
          });
      });
    };

    const playReverseToOperations = () => {
      if (videoStepRef.current !== "final") {
        return;
      }

      videoStepRef.current = "reversingToOperations";
      hideScrollCue();
      lockPageScroll();
      hideDetailOverlay("final");
      cancelForwardStopMonitor();
      forwardVideo.pause();
      reverseToStartVideo.pause();
      reverseToCapabilityVideo.pause();
      prepareReverseFrame(reverseToOperationsVideo, 0);
      startTransitionWatchdog({
        expectedStep: "reversingToOperations",
        targetStep: "operations",
        targetTime: getReverseStopTime(
          reverseToOperationsVideo,
          REVERSE_TO_OPERATIONS_FALLBACK_SECONDS,
        ),
        video: reverseToOperationsVideo,
      });

      void waitForDeferredVideoFrameReady(reverseToOperationsVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "reversingToOperations") {
          return;
        }

        showVideoLayer(reverseToOperationsVideo);

        void reverseToOperationsVideo
          .play()
          .then(() => {
            if (
              !isDisposed &&
              videoStepRef.current === "reversingToOperations"
            ) {
              startReverseStopMonitor("operations");
            }
          })
          .catch((error: unknown) => {
            if (
              isDisposed ||
              videoStepRef.current !== "reversingToOperations"
            ) {
              return;
            }

            forceCompleteActiveTransition("play-rejected", error);
          });
      });
    };

    const canStartDirection = (direction: "down" | "up") => {
      if (isPageScrollLocked) {
        return false;
      }

      if (direction === "down") {
        return (
          videoStepRef.current === "start" ||
          videoStepRef.current === "capability" ||
          videoStepRef.current === "operations"
        );
      }

      return (
        videoStepRef.current === "capability" ||
        videoStepRef.current === "operations" ||
        videoStepRef.current === "final"
      );
    };

    const handleDirection = (direction: "down" | "up") => {
      if (!canStartDirection(direction)) {
        return;
      }

      cancelInitialForwardWarmup();

      if (direction === "down") {
        if (videoStepRef.current === "start") {
          hideHud();
          playForwardToCapability();
          return;
        }

        if (videoStepRef.current === "capability") {
          playForwardToOperations();
          return;
        }

        playForwardToFinal();
        return;
      }

      if (videoStepRef.current === "final") {
        playReverseToOperations();
        return;
      }

      if (videoStepRef.current === "operations") {
        playReverseToCapability();
        return;
      }

      playReverseToStart();
    };

    function handleWindowScroll() {
      if (isPageScrollLocked) {
        keepLockedScrollPosition();
        return;
      }

      const nextScrollY = window.scrollY;
      const deltaY = nextScrollY - lastScrollY;
      const wasHeroAligned =
        lastScrollY <= HERO_INPUT_ALIGNMENT_TOLERANCE_PX;

      lastScrollY = nextScrollY;

      if (isExternalHashNavigation()) {
        return;
      }

      if (
        !wasHeroAligned ||
        nextScrollY > HERO_INPUT_ALIGNMENT_TOLERANCE_PX
      ) {
        return;
      }

      if (!isHeroSceneActive()) {
        return;
      }

      if (Math.abs(deltaY) < SCROLL_DIRECTION_THRESHOLD) {
        return;
      }

      handleDirection(deltaY > 0 ? "down" : "up");
    }

    function handleWheel(event: WheelEvent) {
      if (isPageScrollLocked) {
        event.preventDefault();
        return;
      }

      if (event.deltaY === 0) {
        clearWheelAccumulator();
        return;
      }

      if (!isHeroSceneActive()) {
        clearWheelAccumulator();
        return;
      }

      const direction = event.deltaY > 0 ? "down" : "up";

      if (!canStartDirection(direction)) {
        clearWheelAccumulator();
        return;
      }

      event.preventDefault();
      const accumulatedDirection = getAccumulatedWheelDirection(event.deltaY);

      if (accumulatedDirection === null) {
        return;
      }

      handleDirection(accumulatedDirection);
    }

    function handleTouchStart(event: TouchEvent) {
      lastTouchY = event.touches[0]?.clientY ?? null;
    }

    function handleTouchMove(event: TouchEvent) {
      const nextTouchY = event.touches[0]?.clientY;

      if (lastTouchY === null || nextTouchY === undefined) {
        lastTouchY = nextTouchY ?? null;
        return;
      }

      const deltaY = lastTouchY - nextTouchY;
      lastTouchY = nextTouchY;

      if (isPageScrollLocked) {
        event.preventDefault();
        return;
      }

      if (Math.abs(deltaY) < SCROLL_DIRECTION_THRESHOLD) {
        return;
      }

      if (!isHeroSceneActive()) {
        return;
      }

      const direction = deltaY > 0 ? "down" : "up";

      if (!canStartDirection(direction)) {
        return;
      }

      event.preventDefault();
      handleDirection(direction);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const direction =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === "End" ||
        (event.key === " " && !event.shiftKey)
          ? "down"
          : event.key === "ArrowUp" ||
              event.key === "PageUp" ||
              event.key === "Home" ||
              (event.key === " " && event.shiftKey)
            ? "up"
            : null;

      if (direction === null) {
        return;
      }

      if (!isHeroSceneActive()) {
        return;
      }

      if (isPageScrollLocked) {
        event.preventDefault();
        return;
      }

      if (!canStartDirection(direction)) {
        return;
      }

      event.preventDefault();
      handleDirection(direction);
    }

    videoStepRef.current = "start";

    if (forwardVideo.readyState >= forwardVideo.HAVE_METADATA) {
      switchToStartFrame();
    } else {
      forwardVideo.addEventListener("loadedmetadata", switchToStartFrame, {
        once: true,
      });
    }

    const handleAnchoredTraceLayout = () => {
      scheduleAnchoredTraceLayout();
    };

    window.addEventListener("resize", handleAnchoredTraceLayout);
    window.addEventListener("orientationchange", handleAnchoredTraceLayout);
    videoLayers.forEach((video) => {
      video.addEventListener("loadedmetadata", handleAnchoredTraceLayout);
    });
    scheduleAnchoredTraceLayout();

    addScrollListeners();

    return () => {
      isDisposed = true;
      cancelTransitionWatchdog();
      cancelForwardStopMonitor();
      cancelReverseStopMonitor();
      cancelAnchoredTraceLayout();
      clearWheelAccumulator();
      killAllDetailOverlayTweens();
      unlockPageScroll();
      removeScrollListeners();
      cancelInitialForwardWarmup();
      window.removeEventListener("resize", handleAnchoredTraceLayout);
      window.removeEventListener("orientationchange", handleAnchoredTraceLayout);
      videoLayers.forEach((video) => {
        video.removeEventListener("loadedmetadata", handleAnchoredTraceLayout);
      });
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
    };
  }, []);

  useGSAP(
    () => {
      const root = document.querySelector<HTMLElement>("[data-hero-scene]");
      const visualFrame = root?.querySelector<HTMLDivElement>(
        "[data-hero-visual-frame]",
      );

      if (!root || !visualFrame) {
        return;
      }

      const select = gsap.utils.selector(root);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(
          select(
            "[data-hud-root], [data-hud-item], [data-headline-line], [data-status-row], [data-telemetry-item], [data-interface-line]",
          ),
          {
            clearProps: "all",
          },
        );
        gsap.set(select("[data-hud-root]"), {
          autoAlpha: 1,
          clearProps: "filter,transform",
        });
        gsap.set(
          select(
            "[data-pulse-dot], [data-scan-line], [data-cta-sheen], [data-status-sweep], [data-capability-root], [data-operations-root], [data-final-root]",
          ),
          {
            opacity: 0,
          },
        );
        gsap.set(visualFrame, {
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set(select("[data-cta-sheen]"), {
        "--action-sheen-opacity": 0,
        "--action-sheen-x": "-240%",
      });
      gsap.set(
        select("[data-capability-root], [data-operations-root], [data-final-root]"),
        {
          autoAlpha: 0,
        },
      );
      gsap.set(
        select("[data-capability-panel], [data-operations-panel], [data-final-panel]"),
        {
          autoAlpha: 0,
          filter: "blur(14px)",
          scale: 0.96,
          y: 24,
        },
      );
      gsap.set(
        select("[data-capability-trace], [data-operations-trace], [data-final-trace]"),
        {
          opacity: 0,
          scaleX: 0,
          transformOrigin: "left center",
        },
      );
      gsap.set(
        select("[data-capability-marker], [data-operations-marker], [data-final-marker]"),
        {
          opacity: 0,
          scale: 0.42,
        },
      );
      gsap.set(
        select("[data-capability-sweep], [data-operations-sweep], [data-final-sweep]"),
        {
          autoAlpha: 0,
          xPercent: -120,
        },
      );

      gsap.to(select("[data-pulse-dot]"), {
        duration: 1.45,
        ease: "sine.inOut",
        opacity: 1,
        repeat: -1,
        scale: 1.38,
        stagger: 0.16,
        yoyo: true,
      });
    },
  );

  return null;
}
