"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HeroCapabilityInterface } from "./HeroCapabilityInterface";
import { HeroFinalInterface } from "./HeroFinalInterface";
import { HeroIntroInterface } from "./HeroIntroInterface";
import { HeroOperationsInterface } from "./HeroOperationsInterface";
import styles from "./HeroScene.module.css";

gsap.registerPlugin(useGSAP);

const HERO_CAPABILITY_TIME_SECONDS = 4;
const HERO_OPERATIONS_TIME_SECONDS = 10.5;
const HERO_FINAL_TIME_SECONDS = 14;
const REVERSE_TO_START_FALLBACK_SECONDS = 4.05;
const REVERSE_TO_CAPABILITY_FALLBACK_SECONDS = 6.55;
const REVERSE_TO_OPERATIONS_FALLBACK_SECONDS = 3.55;
const SCROLL_DIRECTION_THRESHOLD = 4;
const START_FRAME_EPSILON_SECONDS = 0.05;
const VIDEO_LAYER_CROSSFADE_SECONDS = 0.22;
const DEFERRED_VIDEO_READY_TIMEOUT_MS = 2600;

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
type DetailOverlayKind = "capability" | "operations" | "final";
type ScrollCueMode = "down" | "up" | "hidden";

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

type HeroSceneProps = {
  src: string;
  reverseSrc: string;
  reverseToCapabilitySrc: string;
  reverseToOperationsSrc: string;
  poster?: string;
  label?: string;
};

export function HeroScene({
  src,
  reverseSrc,
  reverseToCapabilitySrc,
  reverseToOperationsSrc,
  poster,
  label = "Solar outdoor security camera hero",
}: HeroSceneProps) {
  const [scrollCueMode, setScrollCueMode] = useState<ScrollCueMode>("hidden");
  const rootRef = useRef<HTMLElement>(null);
  const visualFrameRef = useRef<HTMLDivElement>(null);
  const cinematicScrimRef = useRef<HTMLDivElement>(null);
  const forwardVideoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);
  const reverseToCapabilityVideoRef = useRef<HTMLVideoElement>(null);
  const reverseToOperationsVideoRef = useRef<HTMLVideoElement>(null);
  const videoStepRef = useRef<HeroVideoStep>("start");
  const scrollCue =
    scrollCueMode === "hidden" ? null : scrollCueCopy[scrollCueMode];

  useEffect(() => {
    const forwardVideoElement = forwardVideoRef.current;
    const reverseVideoElement = reverseVideoRef.current;
    const reverseToCapabilityVideoElement =
      reverseToCapabilityVideoRef.current;
    const reverseToOperationsVideoElement =
      reverseToOperationsVideoRef.current;

    if (
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
    const cinematicScrim = cinematicScrimRef.current;
    const root = rootRef.current;
    const select = root ? gsap.utils.selector(root) : null;
    const capabilityRoot = root?.querySelector<HTMLElement>(
      "[data-capability-root]",
    );
    const operationsRoot = root?.querySelector<HTMLElement>(
      "[data-operations-root]",
    );
    const finalRoot = root?.querySelector<HTMLElement>("[data-final-root]");
    const hudRoot = rootRef.current?.querySelector<HTMLElement>(
      "[data-hud-root]",
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
    let forwardStopFrameId: number | null = null;
    let reverseStopFrameId: number | null = null;
    let isPageScrollLocked = false;
    let areDeferredVideosWarmed = false;
    let deferredWarmupFrameId: number | null = null;
    let removeDeferredPreloadLinks: () => void = () => undefined;
    let lockedScrollX = window.scrollX;
    let lockedScrollY = window.scrollY;
    let originalRootOverflow = "";
    let originalBodyOverflow = "";

    const showScrollCue = (mode: Exclude<ScrollCueMode, "hidden">) => {
      setScrollCueMode(mode);
    };

    const hideScrollCue = () => {
      setScrollCueMode("hidden");
    };

    const cancelForwardStopMonitor = () => {
      if (forwardStopFrameId === null) {
        return;
      }

      window.cancelAnimationFrame(forwardStopFrameId);
      forwardStopFrameId = null;
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

    const lockPageScroll = () => {
      hideScrollCue();

      if (isPageScrollLocked) {
        return;
      }

      isPageScrollLocked = true;
      lockedScrollX = window.scrollX;
      lockedScrollY = window.scrollY;
      originalRootOverflow = document.documentElement.style.overflow;
      originalBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    const unlockPageScroll = () => {
      if (!isPageScrollLocked) {
        return;
      }

      isPageScrollLocked = false;
      document.documentElement.style.overflow = originalRootOverflow;
      document.body.style.overflow = originalBodyOverflow;
      lastScrollY = window.scrollY;
    };

    const keepLockedScrollPosition = () => {
      if (!isPageScrollLocked) {
        return;
      }

      window.scrollTo(lockedScrollX, lockedScrollY);
      lastScrollY = lockedScrollY;
    };

    const showVideoLayer = (activeVideo: HTMLVideoElement) => {
      gsap.killTweensOf(videoLayers);
      gsap.set(videoLayers, { opacity: 0 });
      gsap.set(activeVideo, { opacity: 1 });
    };

    const showForwardVideo = () => showVideoLayer(forwardVideo);

    const preloadVideoSource = (
      href: string,
      fetchPriority: "high" | "low" = "high",
    ) => {
      const absoluteHref = new URL(href, window.location.href).href;
      const existingPreloadLink = Array.from(
        document.head.querySelectorAll<HTMLLinkElement>(
          'link[rel="preload"][as="video"]',
        ),
      ).find((link) => link.href === absoluteHref);

      if (existingPreloadLink) {
        return () => undefined;
      }

      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "video";
      preloadLink.href = href;
      preloadLink.type = "video/mp4";
      preloadLink.crossOrigin = "anonymous";
      preloadLink.setAttribute("fetchpriority", fetchPriority);
      document.head.append(preloadLink);

      return () => preloadLink.remove();
    };

    const warmVideoElement = (video: HTMLVideoElement) => {
      video.preload = "auto";

      if (video.networkState === video.NETWORK_EMPTY) {
        video.load();
      }
    };

    const warmDeferredVideos = () => {
      if (areDeferredVideosWarmed) {
        return;
      }

      areDeferredVideosWarmed = true;

      const removePreloadLinks = [
        preloadVideoSource(reverseSrc, "low"),
        preloadVideoSource(reverseToCapabilitySrc, "low"),
        preloadVideoSource(reverseToOperationsSrc, "low"),
      ];

      removeDeferredPreloadLinks = () => {
        removePreloadLinks.forEach((removePreloadLink) => {
          removePreloadLink();
        });
      };

      warmVideoElement(reverseToStartVideo);
      warmVideoElement(reverseToCapabilityVideo);
      warmVideoElement(reverseToOperationsVideo);
    };

    const cancelDeferredVideoWarmup = () => {
      if (deferredWarmupFrameId === null) {
        return;
      }

      window.cancelAnimationFrame(deferredWarmupFrameId);
      deferredWarmupFrameId = null;
    };

    const scheduleDeferredVideoWarmup = () => {
      if (areDeferredVideosWarmed || deferredWarmupFrameId !== null) {
        return;
      }

      deferredWarmupFrameId = window.requestAnimationFrame(() => {
        deferredWarmupFrameId = window.requestAnimationFrame(() => {
          deferredWarmupFrameId = null;
          warmDeferredVideos();
        });
      });
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
      warmDeferredVideos();

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

      if (reducedMotion) {
        gsap.set([overlayRoot, ...panels, ...traces, ...markers], {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
        gsap.set(sweeps, { autoAlpha: 0 });
        return;
      }

      gsap.set(overlayRoot, { autoAlpha: 1 });
      gsap.set(panels, {
        autoAlpha: 0,
        filter: "blur(14px)",
        scale: 0.96,
        y: 24,
      });
      gsap.set(traces, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(markers, {
        opacity: 0,
        scale: 0.42,
      });
      gsap.set(sweeps, {
        autoAlpha: 0,
        xPercent: -120,
      });

      const detailTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      detailTimeline
        .to(
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
        )
        .to(
          traces,
          {
            duration: 0.68,
            opacity: 0.86,
            scaleX: 1,
            stagger: 0.16,
          },
          0.22,
        )
        .to(
          markers,
          {
            duration: 0.52,
            ease: "back.out(1.8)",
            opacity: 1,
            scale: 1,
            stagger: 0.14,
          },
          0.34,
        )
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
      scheduleDeferredVideoWarmup();
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

      prepareForwardFrame(0);
      showForwardVideo();

      void forwardVideo
        .play()
        .then(() => {
          if (!isDisposed) {
            startForwardStopMonitor("capability");
          }
        })
        .catch((error: unknown) => {
          if (isDisposed) {
            return;
          }

          videoStepRef.current = "start";
          unlockPageScroll();
          showHud();
          showScrollCue("down");
          console.warn("Hero video playback could not start.", error);
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

      prepareForwardFrame(HERO_CAPABILITY_TIME_SECONDS);

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
              if (!isDisposed) {
                startForwardStopMonitor("operations");
              }
            })
            .catch((error: unknown) => {
              if (isDisposed) {
                return;
              }

              videoStepRef.current = "capability";
              unlockPageScroll();
              showVideoLayer(reverseToStartVideo);
              showDetailOverlay("capability");
              showScrollCue("down");
              console.warn("Hero video playback could not continue.", error);
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

      prepareForwardFrame(HERO_OPERATIONS_TIME_SECONDS);

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
                if (!isDisposed) {
                  startForwardStopMonitor("final");
                }
              })
              .catch((error: unknown) => {
                if (isDisposed) {
                  return;
                }

                videoStepRef.current = "operations";
                unlockPageScroll();
                showVideoLayer(reverseToCapabilityVideo);
                showDetailOverlay("operations");
                showScrollCue("down");
                console.warn(
                  "Hero video playback could not reach final frame.",
                  error,
                );
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

      void waitForDeferredVideoFrameReady(reverseToStartVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "reversingToStart") {
          return;
        }

        showVideoLayer(reverseToStartVideo);

        void reverseToStartVideo
          .play()
          .then(() => {
            if (!isDisposed) {
              startReverseStopMonitor("start");
            }
          })
          .catch((error: unknown) => {
            if (isDisposed) {
              return;
            }

            videoStepRef.current = "capability";
            unlockPageScroll();
            showVideoLayer(reverseToStartVideo);
            showDetailOverlay("capability");
            showScrollCue("down");
            console.warn("Hero reverse video playback could not start.", error);
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

      void waitForDeferredVideoFrameReady(reverseToCapabilityVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "reversingToCapability") {
          return;
        }

        showVideoLayer(reverseToCapabilityVideo);

        void reverseToCapabilityVideo
          .play()
          .then(() => {
            if (!isDisposed) {
              startReverseStopMonitor("capability");
            }
          })
          .catch((error: unknown) => {
            if (isDisposed) {
              return;
            }

            videoStepRef.current = "operations";
            unlockPageScroll();
            showVideoLayer(reverseToCapabilityVideo);
            showDetailOverlay("operations");
            showScrollCue("down");
            console.warn(
              "Hero reverse video playback could not continue.",
              error,
            );
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

      void waitForDeferredVideoFrameReady(reverseToOperationsVideo).then(() => {
        if (isDisposed || videoStepRef.current !== "reversingToOperations") {
          return;
        }

        showVideoLayer(reverseToOperationsVideo);

        void reverseToOperationsVideo
          .play()
          .then(() => {
            if (!isDisposed) {
              startReverseStopMonitor("operations");
            }
          })
          .catch((error: unknown) => {
            if (isDisposed) {
              return;
            }

            videoStepRef.current = "final";
            unlockPageScroll();
            showVideoLayer(reverseToOperationsVideo);
            showDetailOverlay("final");
            showScrollCue("up");
            console.warn(
              "Hero reverse video playback could not return to operations.",
              error,
            );
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

      warmDeferredVideos();

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

      lastScrollY = nextScrollY;

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

      if (Math.abs(event.deltaY) < SCROLL_DIRECTION_THRESHOLD) {
        return;
      }

      const direction = event.deltaY > 0 ? "down" : "up";

      if (!canStartDirection(direction)) {
        return;
      }

      event.preventDefault();
      handleDirection(direction);
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
    const removeForwardPreloadLink = preloadVideoSource(src);

    warmVideoElement(forwardVideo);

    if (forwardVideo.readyState >= forwardVideo.HAVE_METADATA) {
      switchToStartFrame();
    } else {
      forwardVideo.addEventListener("loadedmetadata", switchToStartFrame, {
        once: true,
      });
    }

    addScrollListeners();

    return () => {
      isDisposed = true;
      cancelForwardStopMonitor();
      cancelReverseStopMonitor();
      killAllDetailOverlayTweens();
      unlockPageScroll();
      removeScrollListeners();
      removeForwardPreloadLink();
      removeDeferredPreloadLinks();
      cancelDeferredVideoWarmup();
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
    };
  }, [reverseSrc, reverseToCapabilitySrc, reverseToOperationsSrc, src]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const visualFrame = visualFrameRef.current;

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

      gsap.set(visualFrame, {
        filter: "brightness(0.78) contrast(1.12) saturate(0.9)",
        scale: 1.035,
        transformOrigin: "62% 48%",
      });
      gsap.set(select("[data-hud-root]"), {
        autoAlpha: 0,
        filter: "blur(18px)",
        y: 28,
      });
      gsap.set(select("[data-hud-item]"), {
        autoAlpha: 0,
        filter: "blur(8px)",
        y: 18,
      });
      gsap.set(select("[data-headline-line]"), {
        yPercent: 112,
      });
      gsap.set(select("[data-status-row], [data-telemetry-item]"), {
        autoAlpha: 0,
        x: -18,
      });
      gsap.set(select("[data-status-sweep]"), {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(select("[data-cta-sheen]"), {
        "--action-sheen-opacity": 0,
        "--action-sheen-x": "-240%",
      });
      gsap.set(select("[data-scan-line]"), {
        autoAlpha: 0,
        yPercent: -120,
      });
      gsap.set(select("[data-interface-line]"), {
        scaleY: 0,
      });
      gsap.set(select("[data-capability-root], [data-operations-root], [data-final-root]"), {
        autoAlpha: 0,
      });
      gsap.set(select("[data-capability-panel], [data-operations-panel], [data-final-panel]"), {
        autoAlpha: 0,
        filter: "blur(14px)",
        scale: 0.96,
        y: 24,
      });
      gsap.set(select("[data-capability-trace], [data-operations-trace], [data-final-trace]"), {
        opacity: 0,
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(select("[data-capability-marker], [data-operations-marker], [data-final-marker]"), {
        opacity: 0,
        scale: 0.42,
      });
      gsap.set(select("[data-capability-sweep], [data-operations-sweep], [data-final-sweep]"), {
        autoAlpha: 0,
        xPercent: -120,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(
          visualFrame,
          {
            duration: 1.8,
            ease: "expo.out",
            filter: "brightness(1) contrast(1.04) saturate(0.96)",
            scale: 1,
          },
          0,
        )
        .to(
          select("[data-hud-root]"),
          {
            autoAlpha: 1,
            duration: 0.8,
            filter: "blur(0px)",
            y: 0,
          },
          0.18,
        )
        .to(
          select("[data-interface-line]"),
          {
            duration: 0.84,
            ease: "power3.out",
            scaleY: 1,
          },
          0.24,
        )
        .to(
          select("[data-hud-item]"),
          {
            autoAlpha: 1,
            duration: 0.72,
            filter: "blur(0px)",
            stagger: 0.1,
            y: 0,
          },
          0.42,
        )
        .to(
          select("[data-headline-line]"),
          {
            duration: 0.92,
            ease: "expo.out",
            stagger: 0.08,
            yPercent: 0,
          },
          0.56,
        )
        .to(
          select("[data-status-row]"),
          {
            autoAlpha: 1,
            duration: 0.58,
            stagger: 0.08,
            x: 0,
          },
          1.05,
        )
        .to(
          select("[data-status-sweep]"),
          {
            duration: 0.72,
            ease: "power2.out",
            stagger: 0.08,
            scaleX: 1,
          },
          1.08,
        )
        .to(
          select("[data-telemetry-item]"),
          {
            autoAlpha: 1,
            duration: 0.54,
            stagger: 0.06,
            x: 0,
          },
          1.32,
        )
        .to(
          select("[data-scan-line]"),
          {
            autoAlpha: 0.72,
            duration: 0.9,
            ease: "power2.inOut",
            yPercent: 120,
          },
          1.18,
        )
        .to(
          select("[data-cta-sheen]"),
          {
            duration: 1.05,
            ease: "power2.inOut",
            "--action-sheen-opacity": 0.88,
            "--action-sheen-x": "420%",
          },
          1.52,
        )
        .set(select("[data-cta-sheen]"), {
          "--action-sheen-opacity": 0,
          "--action-sheen-x": "-240%",
        });

      gsap.to(select("[data-pulse-dot]"), {
        delay: 1.65,
        duration: 1.45,
        ease: "sine.inOut",
        opacity: 1,
        repeat: -1,
        scale: 1.38,
        stagger: 0.16,
        yoyo: true,
      });
    },
    { scope: rootRef },
  );

  return (
    <section className={styles.section} aria-label={label} ref={rootRef}>
      <div className={styles.visualLayer} aria-hidden="true">
        <div className={styles.visualFrame} ref={visualFrameRef}>
          <video
            ref={forwardVideoRef}
            className={styles.video}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            data-hero-video
          />
          <video
            ref={reverseVideoRef}
            className={`${styles.video} ${styles.reverseVideo}`}
            src={reverseSrc}
            muted
            playsInline
            preload="none"
            crossOrigin="anonymous"
            data-hero-video-reverse
          />
          <video
            ref={reverseToCapabilityVideoRef}
            className={`${styles.video} ${styles.reverseVideo}`}
            src={reverseToCapabilitySrc}
            muted
            playsInline
            preload="none"
            crossOrigin="anonymous"
            data-hero-video-reverse-operations
          />
          <video
            ref={reverseToOperationsVideoRef}
            className={`${styles.video} ${styles.reverseVideo}`}
            src={reverseToOperationsSrc}
            muted
            playsInline
            preload="none"
            crossOrigin="anonymous"
            data-hero-video-reverse-final
          />
        </div>
        <div className={styles.cinematicScrim} ref={cinematicScrimRef} />
      </div>

      <div className={styles.contentShell}>
        <HeroIntroInterface />
        <HeroCapabilityInterface />
        <HeroOperationsInterface />
        <HeroFinalInterface />
      </div>

      {scrollCue ? (
        <div
          className={`${styles.scrollCue} ${
            scrollCueMode === "up" ? styles.scrollCueUp : styles.scrollCueDown
          }`}
          aria-label={scrollCue.ariaLabel}
          data-scroll-cue
        >
          <span className={styles.scrollCueGlyph} aria-hidden="true">
            <span className={styles.scrollCueArrow} />
          </span>
          <span className={styles.scrollCueText}>
            <span>Scroll</span>
            <strong>{scrollCue.direction}</strong>
          </span>
        </div>
      ) : null}
    </section>
  );
}
