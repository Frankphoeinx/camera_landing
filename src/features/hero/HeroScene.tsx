"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { HeroCapabilityInterface } from "./HeroCapabilityInterface";
import { HeroIntroInterface } from "./HeroIntroInterface";
import styles from "./HeroScene.module.css";

gsap.registerPlugin(useGSAP);

const HERO_VIDEO_STOP_TIME_SECONDS = 4;
const SCROLL_DIRECTION_THRESHOLD = 4;
const START_FRAME_EPSILON_SECONDS = 0.05;

type HeroSceneProps = {
  src: string;
  reverseSrc: string;
  poster?: string;
  label?: string;
};

export function HeroScene({
  src,
  reverseSrc,
  poster,
  label = "Solar outdoor security camera hero",
}: HeroSceneProps) {
  const rootRef = useRef<HTMLElement>(null);
  const visualFrameRef = useRef<HTMLDivElement>(null);
  const cinematicScrimRef = useRef<HTMLDivElement>(null);
  const forwardVideoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);
  const videoStepRef = useRef<"start" | "forward" | "end" | "reverse">(
    "start",
  );

  useEffect(() => {
    const forwardVideoElement = forwardVideoRef.current;
    const reverseVideoElement = reverseVideoRef.current;

    if (!forwardVideoElement || !reverseVideoElement) {
      return;
    }

    const forwardVideo = forwardVideoElement;
    const reverseVideo = reverseVideoElement;
    const cinematicScrim = cinematicScrimRef.current;
    const root = rootRef.current;
    const select = root ? gsap.utils.selector(root) : null;
    const capabilityRoot = root?.querySelector<HTMLElement>(
      "[data-capability-root]",
    );
    const hudRoot = rootRef.current?.querySelector<HTMLElement>(
      "[data-hud-root]",
    );
    let isDisposed = false;
    let isHudHidden = false;
    let isCapabilityVisible = false;
    let lastScrollY = window.scrollY;
    let lastTouchY: number | null = null;
    let forwardStopFrameId: number | null = null;
    let reverseStopFrameId: number | null = null;
    let isPageScrollLocked = false;
    let lockedScrollX = window.scrollX;
    let lockedScrollY = window.scrollY;
    let originalRootOverflow = "";
    let originalBodyOverflow = "";

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

    const getStopTime = (video: HTMLVideoElement) => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        return Math.min(HERO_VIDEO_STOP_TIME_SECONDS, video.duration);
      }

      return HERO_VIDEO_STOP_TIME_SECONDS;
    };

    const lockPageScroll = () => {
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

    const showForwardVideo = () => {
      gsap.set(forwardVideo, { opacity: 1 });
      gsap.set(reverseVideo, { opacity: 0 });
    };

    const showReverseVideo = () => {
      gsap.set(reverseVideo, { opacity: 1 });
      gsap.set(forwardVideo, { opacity: 0 });
    };

    const prepareForwardStartFrame = () => {
      forwardVideo.pause();

      if (
        forwardVideo.readyState >= forwardVideo.HAVE_METADATA &&
        Math.abs(forwardVideo.currentTime) > START_FRAME_EPSILON_SECONDS
      ) {
        forwardVideo.currentTime = 0;
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

    const getCapabilityTargets = () => {
      if (!select) {
        return [capabilityRoot].filter(Boolean) as Element[];
      }

      return [
        capabilityRoot,
        ...select("[data-capability-panel]"),
        ...select("[data-capability-trace]"),
        ...select("[data-capability-marker]"),
        ...select("[data-capability-sweep]"),
      ].filter(Boolean) as Element[];
    };

    const killCapabilityTweens = () => {
      gsap.killTweensOf(getCapabilityTargets());
    };

    const showCapabilityOverlay = () => {
      if (!capabilityRoot || !select || isCapabilityVisible) {
        return;
      }

      isCapabilityVisible = true;
      killCapabilityTweens();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const panels = select("[data-capability-panel]");
      const traces = select("[data-capability-trace]");
      const markers = select("[data-capability-marker]");
      const sweeps = select("[data-capability-sweep]");

      if (reducedMotion) {
        gsap.set([capabilityRoot, ...panels, ...traces, ...markers], {
          autoAlpha: 1,
          clearProps: "transform,filter",
        });
        gsap.set(sweeps, { autoAlpha: 0 });
        return;
      }

      gsap.set(capabilityRoot, { autoAlpha: 1 });
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

      const capabilityTimeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      capabilityTimeline
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

    const hideCapabilityOverlay = () => {
      if (!capabilityRoot || !isCapabilityVisible) {
        return;
      }

      isCapabilityVisible = false;
      killCapabilityTweens();
      gsap.to(capabilityRoot, {
        autoAlpha: 0,
        duration: 0.34,
        ease: "power2.in",
        y: -10,
        onComplete: () => {
          gsap.set(capabilityRoot, { clearProps: "transform" });
        },
      });
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

    const pauseForwardAtStopTime = () => {
      const stopTime = getStopTime(forwardVideo);

      if (forwardVideo.currentTime >= stopTime) {
        forwardVideo.pause();
        forwardVideo.currentTime = stopTime;
        videoStepRef.current = "end";
        cancelForwardStopMonitor();
        showCapabilityOverlay();
        unlockPageScroll();
        return;
      }

      forwardStopFrameId = window.requestAnimationFrame(pauseForwardAtStopTime);
    };

    const switchToStartFrame = () => {
      if (videoStepRef.current !== "start") {
        return;
      }

      forwardVideo.pause();
      reverseVideo.pause();
      forwardVideo.currentTime = 0;
      reverseVideo.currentTime = 0;
      showForwardVideo();
    };

    const startForwardStopMonitor = () => {
      cancelForwardStopMonitor();
      forwardStopFrameId = window.requestAnimationFrame(
        pauseForwardAtStopTime,
      );
    };

    const pauseReverseAtStopTime = () => {
      const stopTime = getStopTime(reverseVideo);

      if (reverseVideo.currentTime >= stopTime) {
        reverseVideo.pause();
        reverseVideo.currentTime = stopTime;
        prepareForwardStartFrame();

        if (forwardVideo.seeking) {
          forwardVideo.addEventListener(
            "seeked",
            () => {
              if (isDisposed) {
                return;
              }

              showForwardVideo();
              videoStepRef.current = "start";
              cancelReverseStopMonitor();
              showHud();
              unlockPageScroll();
            },
            { once: true },
          );
          return;
        }

        showForwardVideo();
        videoStepRef.current = "start";
        cancelReverseStopMonitor();
        showHud();
        unlockPageScroll();
        return;
      }

      reverseStopFrameId = window.requestAnimationFrame(
        pauseReverseAtStopTime,
      );
    };

    const startReverseStopMonitor = () => {
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

    const playToEnd = () => {
      if (
        videoStepRef.current === "end" ||
        videoStepRef.current === "forward"
      ) {
        return;
      }

      const previousVideoStep = videoStepRef.current;

      videoStepRef.current = "forward";
      lockPageScroll();
      hideCapabilityOverlay();
      cancelReverseStopMonitor();
      reverseVideo.pause();
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
      reverseVideo.removeEventListener("loadedmetadata", switchToStartFrame);

      if (
        reverseVideo.readyState >= reverseVideo.HAVE_METADATA &&
        forwardVideo.readyState >= forwardVideo.HAVE_METADATA
      ) {
        if (previousVideoStep === "reverse") {
          const reverseStopTime = getStopTime(reverseVideo);
          forwardVideo.currentTime = Math.max(
            0,
            reverseStopTime - reverseVideo.currentTime,
          );
        } else {
          forwardVideo.currentTime = 0;
        }
      }

      showForwardVideo();

      void forwardVideo
        .play()
        .then(() => {
          if (!isDisposed) {
            startForwardStopMonitor();
          }
        })
        .catch((error: unknown) => {
          if (isDisposed) {
            return;
          }

          videoStepRef.current = "start";
          unlockPageScroll();
          showHud();
          console.warn("Hero video playback could not start.", error);
        });
    };

    const playReverseToStart = () => {
      if (
        videoStepRef.current === "start" ||
        videoStepRef.current === "reverse"
      ) {
        return;
      }

      videoStepRef.current = "reverse";
      lockPageScroll();
      hideCapabilityOverlay();
      cancelForwardStopMonitor();
      forwardVideo.pause();
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
      reverseVideo.removeEventListener("loadedmetadata", switchToStartFrame);

      if (
        forwardVideo.readyState >= forwardVideo.HAVE_METADATA &&
        reverseVideo.readyState >= reverseVideo.HAVE_METADATA
      ) {
        const forwardStopTime = getStopTime(forwardVideo);
        reverseVideo.currentTime = Math.max(
          0,
          forwardStopTime - forwardVideo.currentTime,
        );
      }

      showReverseVideo();
      prepareForwardStartFrame();

      void reverseVideo
        .play()
        .then(() => {
          if (!isDisposed) {
            startReverseStopMonitor();
          }
        })
        .catch((error: unknown) => {
          if (isDisposed) {
            return;
          }

          videoStepRef.current = "end";
          unlockPageScroll();
          showForwardVideo();
          showCapabilityOverlay();
          console.warn("Hero reverse video playback could not start.", error);
        });
    };

    const canStartDirection = (direction: "down" | "up") => {
      if (isPageScrollLocked) {
        return false;
      }

      if (direction === "down") {
        return (
          videoStepRef.current === "start" ||
          videoStepRef.current === "reverse"
        );
      }

      return (
        videoStepRef.current === "end" || videoStepRef.current === "forward"
      );
    };

    const handleDirection = (direction: "down" | "up") => {
      if (!canStartDirection(direction)) {
        return;
      }

      if (direction === "down") {
        hideHud();
        playToEnd();
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

    if (
      forwardVideo.readyState >= forwardVideo.HAVE_METADATA &&
      reverseVideo.readyState >= reverseVideo.HAVE_METADATA
    ) {
      switchToStartFrame();
    } else {
      forwardVideo.addEventListener("loadedmetadata", switchToStartFrame, {
        once: true,
      });
      reverseVideo.addEventListener("loadedmetadata", switchToStartFrame, {
        once: true,
      });
    }

    addScrollListeners();

    return () => {
      isDisposed = true;
      cancelForwardStopMonitor();
      cancelReverseStopMonitor();
      killCapabilityTweens();
      unlockPageScroll();
      removeScrollListeners();
      forwardVideo.removeEventListener("loadedmetadata", switchToStartFrame);
      reverseVideo.removeEventListener("loadedmetadata", switchToStartFrame);
    };
  }, [reverseSrc, src]);

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
      gsap.set(
        select(
          "[data-pulse-dot], [data-scan-line], [data-cta-sheen], [data-status-sweep], [data-capability-root]",
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
      gsap.set(select("[data-capability-root]"), {
        autoAlpha: 0,
      });
      gsap.set(select("[data-capability-panel]"), {
        autoAlpha: 0,
        filter: "blur(14px)",
        scale: 0.96,
        y: 24,
      });
      gsap.set(select("[data-capability-trace]"), {
        opacity: 0,
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(select("[data-capability-marker]"), {
        opacity: 0,
        scale: 0.42,
      });
      gsap.set(select("[data-capability-sweep]"), {
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
            preload="auto"
            crossOrigin="anonymous"
            data-hero-video-reverse
          />
        </div>
        <div className={styles.cinematicScrim} ref={cinematicScrimRef} />
      </div>

      <div className={styles.contentShell}>
        <HeroIntroInterface />
        <HeroCapabilityInterface />
      </div>
    </section>
  );
}
