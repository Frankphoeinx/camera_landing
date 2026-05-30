"use client";

import { gsap } from "gsap";
import { useEffect } from "react";

import {
  outdoorCameraModels,
  TECHNICAL_VIDEO_END_TIME_SECONDS,
  technicalSteps,
} from "./TechnicalScrollScene.data";

const STEP_TIME_TOLERANCE_SECONDS = 0.08;
const TRANSITION_WATCHDOG_BUFFER_MS = 2600;
const TRANSITION_MIN_WATCHDOG_MS = 4200;
const SCROLL_THRESHOLD = 8;
const TOUCH_THRESHOLD = 22;
const SCENE_ALIGNMENT_TOLERANCE_PX = 2;
const PLAYBACK_STOP_EARLY_SECONDS = 0.025;
const VIDEO_LAYER_CROSSFADE_SECONDS = 0.22;
const METADATA_WAIT_TIMEOUT_MS = 1800;
const SEEK_WAIT_TIMEOUT_MS = 1400;

type TechnicalSceneMode = "models" | "steps";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getPlaybackWatchdogMs = (fromTime: number, toTime: number) =>
  Math.max(
    Math.abs(toTime - fromTime) * 1000 + TRANSITION_WATCHDOG_BUFFER_MS,
    TRANSITION_MIN_WATCHDOG_MS,
  );

const isFiniteDuration = (duration: number) =>
  Number.isFinite(duration) && duration > 0;

export function TechnicalScrollController() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-technical-scene]");
    const video = root?.querySelector<HTMLVideoElement>(
      "[data-technical-video]",
    );
    const reverseVideo = root?.querySelector<HTMLVideoElement>(
      "[data-technical-video-reverse]",
    );
    const posterLayer = root?.querySelector<HTMLElement>(
      "[data-technical-poster]",
    );

    if (!root || !video || !reverseVideo) {
      return;
    }

    const videoLayers = [video, reverseVideo];
    const panels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-technical-panel]"),
    );
    const stepperGroup = root.querySelector<HTMLElement>(
      "[data-technical-stepper]",
    );
    const indicators = Array.from(
      root.querySelectorAll<HTMLElement>("[data-technical-indicator]"),
    );
    const modelInterface = root.querySelector<HTMLElement>(
      "[data-camera-model-interface]",
    );
    const modelGroups = Array.from(
      root.querySelectorAll<HTMLElement>("[data-camera-model-group]"),
    );
    const modelImageLayers = Array.from(
      root.querySelectorAll<HTMLImageElement>("[data-camera-model-image]"),
    );
    const progressFill = root.querySelector<HTMLElement>(
      "[data-technical-progress-fill]",
    );
    const stepCurrent = root.querySelector<HTMLElement>(
      "[data-technical-current]",
    );
    const stepTotal = root.querySelector<HTMLElement>(
      "[data-technical-total]",
    );
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let activeStepIndex = 0;
    let activeModelIndex = 0;
    let activeModelStepIndex = 0;
    let activeMode: TechnicalSceneMode = "steps";
    let activeVideoLayer: HTMLVideoElement = video;
    let layerFadeTimeline: ReturnType<typeof gsap.timeline> | null = null;
    let layerFadeId = 0;
    let stopFrameId: number | null = null;
    let watchdogTimeoutId: number | null = null;
    let pendingStepIndex: number | null = null;
    let initialFrameReadyPromise: Promise<boolean> | null = null;
    let initialFrameRevealPromise: Promise<void> | null = null;
    let posterFadeTimeline: ReturnType<typeof gsap.timeline> | null = null;
    let hasRevealedInitialFrame = false;
    let isTransitioning = false;
    let isDisposed = false;
    let lastTouchY: number | null = null;
    let warnedRecovery = false;
    let observer: IntersectionObserver | null = null;

    const clearWatchdog = () => {
      if (watchdogTimeoutId !== null) {
        window.clearTimeout(watchdogTimeoutId);
        watchdogTimeoutId = null;
      }
    };

    const cancelStopMonitor = () => {
      if (stopFrameId !== null) {
        window.cancelAnimationFrame(stopFrameId);
        stopFrameId = null;
      }
    };

    const cancelLayerFade = () => {
      layerFadeId += 1;

      if (layerFadeTimeline) {
        layerFadeTimeline.kill();
        layerFadeTimeline = null;
      }

      gsap.killTweensOf(videoLayers);
    };

    const cancelPosterFade = () => {
      if (posterFadeTimeline) {
        posterFadeTimeline.kill();
        posterFadeTimeline = null;
      }

      if (posterLayer) {
        gsap.killTweensOf([posterLayer, video]);
      }

      initialFrameRevealPromise = null;
    };

    const clearTransitionPlayback = () => {
      cancelStopMonitor();
      clearWatchdog();
      cancelLayerFade();
    };

    const warmVideoElement = (targetVideo: HTMLVideoElement) => {
      targetVideo.preload = "auto";

      if (targetVideo.networkState === targetVideo.NETWORK_EMPTY) {
        targetVideo.load();
      }
    };

    const warmVideos = () => {
      warmVideoElement(video);
      warmVideoElement(reverseVideo);
    };

    const warmModelImages = () => {
      modelImageLayers.forEach((image) => {
        image.loading = "eager";
        image.decoding = "async";

        if (!image.complete) {
          const decodePromise = image.decode?.();

          if (decodePromise) {
            void decodePromise.catch(() => undefined);
          }
        }
      });
    };

    const isMetadataReady = (targetVideo: HTMLVideoElement) =>
      targetVideo.readyState >= targetVideo.HAVE_METADATA &&
      isFiniteDuration(targetVideo.duration);

    const waitForMetadata = (targetVideo: HTMLVideoElement) =>
      new Promise<boolean>((resolve) => {
        if (isMetadataReady(targetVideo)) {
          resolve(true);
          return;
        }

        let timeoutId: number | null = null;

        const cleanup = () => {
          if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
          }

          targetVideo.removeEventListener("loadedmetadata", handleReady);
          targetVideo.removeEventListener("error", handleError);
        };

        const finish = (isReady: boolean) => {
          cleanup();
          resolve(isReady);
        };

        const handleReady = () => finish(isMetadataReady(targetVideo));
        const handleError = () => finish(false);

        targetVideo.addEventListener("loadedmetadata", handleReady);
        targetVideo.addEventListener("error", handleError);
        timeoutId = window.setTimeout(
          () => finish(isMetadataReady(targetVideo)),
          METADATA_WAIT_TIMEOUT_MS,
        );
        warmVideoElement(targetVideo);
      });

    const waitForPaint = () =>
      new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve());
        });
      });

    const waitForSeekFrame = (
      targetVideo: HTMLVideoElement,
      targetTime: number,
    ) =>
      new Promise<boolean>((resolve) => {
        if (!isMetadataReady(targetVideo)) {
          resolve(false);
          return;
        }

        if (
          targetVideo.readyState >= targetVideo.HAVE_CURRENT_DATA &&
          Math.abs(targetVideo.currentTime - targetTime) <=
            STEP_TIME_TOLERANCE_SECONDS
        ) {
          resolve(true);
          return;
        }

        let timeoutId: number | null = null;

        const cleanup = () => {
          if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
          }

          targetVideo.removeEventListener("seeked", handleReady);
          targetVideo.removeEventListener("loadeddata", handleReady);
          targetVideo.removeEventListener("canplay", handleReady);
          targetVideo.removeEventListener("error", handleError);
        };

        const hasTargetFrame = () =>
          targetVideo.readyState >= targetVideo.HAVE_CURRENT_DATA &&
          Math.abs(targetVideo.currentTime - targetTime) <=
            STEP_TIME_TOLERANCE_SECONDS;

        const finish = (isReady: boolean) => {
          cleanup();

          if (!isReady) {
            resolve(false);
            return;
          }

          void waitForPaint().then(() => resolve(true));
        };

        const handleReady = () => {
          if (hasTargetFrame()) {
            finish(true);
          }
        };
        const handleError = () => finish(false);
        const seekTargetTime =
          targetVideo.readyState < targetVideo.HAVE_CURRENT_DATA &&
          Math.abs(targetVideo.currentTime - targetTime) <=
            STEP_TIME_TOLERANCE_SECONDS
            ? clamp(
                targetTime + STEP_TIME_TOLERANCE_SECONDS / 4 <=
                  targetVideo.duration
                  ? targetTime + STEP_TIME_TOLERANCE_SECONDS / 4
                  : targetTime - STEP_TIME_TOLERANCE_SECONDS / 4,
                0,
                targetVideo.duration,
              )
            : targetTime;

        targetVideo.addEventListener("seeked", handleReady);
        targetVideo.addEventListener("loadeddata", handleReady);
        targetVideo.addEventListener("canplay", handleReady);
        targetVideo.addEventListener("error", handleError);

        warmVideoElement(targetVideo);
        targetVideo.currentTime = seekTargetTime;

        if (hasTargetFrame()) {
          finish(true);
          return;
        }

        timeoutId = window.setTimeout(
          () => finish(hasTargetFrame()),
          SEEK_WAIT_TIMEOUT_MS,
        );
      });

    const showVideoLayer = (activeVideo: HTMLVideoElement) => {
      cancelLayerFade();
      videoLayers.forEach((targetVideo) => {
        const isActive = targetVideo === activeVideo;

        if (!isActive) {
          targetVideo.pause();
        }

        targetVideo.style.opacity = isActive ? "1" : "0";
      });
      activeVideoLayer = activeVideo;
    };

    const crossfadeToVideoLayer = (targetVideo: HTMLVideoElement) =>
      new Promise<void>((resolve) => {
        if (activeVideoLayer === targetVideo || mediaQuery.matches) {
          showVideoLayer(targetVideo);
          resolve();
          return;
        }

        const sourceVideo = activeVideoLayer;
        cancelLayerFade();
        const fadeId = ++layerFadeId;

        videoLayers.forEach((layerVideo) => {
          if (layerVideo !== sourceVideo && layerVideo !== targetVideo) {
            layerVideo.pause();
          }
        });

        gsap.set(videoLayers, { opacity: 0 });
        gsap.set([sourceVideo, targetVideo], { opacity: 1 });

        const settle = () => {
          if (fadeId === layerFadeId && !isDisposed) {
            videoLayers.forEach((layerVideo) => {
              const isActive = layerVideo === targetVideo;

              if (!isActive) {
                layerVideo.pause();
              }

              layerVideo.style.opacity = isActive ? "1" : "0";
            });
            activeVideoLayer = targetVideo;
          }

          if (fadeId === layerFadeId) {
            layerFadeTimeline = null;
          }
          resolve();
        };

        layerFadeTimeline = gsap
          .timeline({
            onComplete: settle,
            onInterrupt: settle,
          })
          .to(
            sourceVideo,
            {
              duration: VIDEO_LAYER_CROSSFADE_SECONDS,
              ease: "power2.out",
              opacity: 0,
            },
            0,
          );
      });

    const setVideoFrame = (targetTime: number) => {
      video.pause();

      const clampedTargetTime = clamp(
        targetTime,
        0,
        isFiniteDuration(video.duration)
          ? video.duration
          : TECHNICAL_VIDEO_END_TIME_SECONDS,
      );

      if (
        video.readyState >= video.HAVE_METADATA &&
        Math.abs(video.currentTime - clampedTargetTime) >
          STEP_TIME_TOLERANCE_SECONDS
      ) {
        video.currentTime = clampedTargetTime;
      }
    };

    const prepareVideoFrame = (
      targetVideo: HTMLVideoElement,
      targetTime: number,
    ) => {
      targetVideo.pause();

      if (!isMetadataReady(targetVideo)) {
        return Promise.resolve(false);
      }

      const clampedTargetTime = clamp(targetTime, 0, targetVideo.duration);

      if (
        targetVideo.readyState >= targetVideo.HAVE_CURRENT_DATA &&
        Math.abs(targetVideo.currentTime - clampedTargetTime) <=
        STEP_TIME_TOLERANCE_SECONDS
      ) {
        return Promise.resolve(true);
      }

      return waitForSeekFrame(targetVideo, clampedTargetTime);
    };

    const isInitialFrameReady = () =>
      video.readyState >= video.HAVE_CURRENT_DATA &&
      Math.abs(video.currentTime - technicalSteps[0].time) <=
        STEP_TIME_TOLERANCE_SECONDS;

    const prepareInitialFrame = (): Promise<boolean> => {
      if (!isMetadataReady(video)) {
        warmVideoElement(video);
        return Promise.resolve(false);
      }

      if (isInitialFrameReady()) {
        return Promise.resolve(true);
      }

      if (initialFrameReadyPromise) {
        return initialFrameReadyPromise.then((isReady) => {
          if (isReady && isInitialFrameReady()) {
            return true;
          }

          initialFrameReadyPromise = null;
          return prepareInitialFrame();
        });
      }

      initialFrameReadyPromise = prepareVideoFrame(
        video,
        technicalSteps[0].time,
      ).then((isReady) => {
        if (!isReady || !isInitialFrameReady()) {
          initialFrameReadyPromise = null;
          return false;
        }

        return true;
      });

      return initialFrameReadyPromise;
    };

    const revealInitialFrame = () => {
      if (hasRevealedInitialFrame || !posterLayer || mediaQuery.matches) {
        showVideoLayer(video);

        if (posterLayer) {
          posterLayer.style.opacity = "0";
          posterLayer.style.visibility = "hidden";
        }

        hasRevealedInitialFrame = true;
        return Promise.resolve();
      }

      initialFrameRevealPromise ??= new Promise<void>((resolve) => {
        cancelPosterFade();
        videoLayers.forEach((targetVideo) => {
          if (targetVideo !== video) {
            targetVideo.pause();
            targetVideo.style.opacity = "0";
          }
        });
        activeVideoLayer = video;
        posterLayer.style.opacity = "1";
        posterLayer.style.visibility = "visible";
        gsap.set(video, { opacity: 0 });

        const settle = () => {
          posterLayer.style.opacity = "0";
          posterLayer.style.visibility = "hidden";
          hasRevealedInitialFrame = true;
          initialFrameRevealPromise = null;
          posterFadeTimeline = null;
          resolve();
        };

        posterFadeTimeline = gsap
          .timeline({
            onComplete: settle,
            onInterrupt: settle,
          })
          .to(
            video,
            {
              duration: VIDEO_LAYER_CROSSFADE_SECONDS,
              ease: "power2.out",
              opacity: 1,
            },
            0,
          )
          .to(
            posterLayer,
            {
              duration: VIDEO_LAYER_CROSSFADE_SECONDS,
              ease: "power2.out",
              opacity: 0,
            },
            0,
          );
      });

      return initialFrameRevealPromise;
    };

    const getReverseTime = (forwardTime: number) => {
      if (!isFiniteDuration(reverseVideo.duration)) {
        return 0;
      }

      return clamp(
        reverseVideo.duration - forwardTime,
        0,
        reverseVideo.duration,
      );
    };

    const updateInterface = (stepIndex: number) => {
      activeStepIndex = stepIndex;
      root.dataset.activeStep = String(stepIndex + 1);

      panels.forEach((panel, index) => {
        const isActive = index === stepIndex;

        panel.dataset.active = String(isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
      });

      indicators.forEach((indicator, index) => {
        indicator.dataset.active = String(index === stepIndex);
        indicator.dataset.complete = String(index < stepIndex);
      });

      if (progressFill) {
        progressFill.style.transform = `scaleY(${
          technicalSteps.length === 1
            ? 1
            : stepIndex / (technicalSteps.length - 1)
        })`;
      }

      if (stepCurrent) {
        stepCurrent.textContent = String(stepIndex + 1).padStart(2, "0");
      }

      if (stepTotal) {
        stepTotal.textContent = String(technicalSteps.length).padStart(2, "0");
      }
    };

    const setSceneMode = (mode: TechnicalSceneMode) => {
      activeMode = mode;
      root.dataset.technicalMode = mode;
      stepperGroup?.setAttribute("aria-hidden", String(mode === "models"));
      modelInterface?.setAttribute("aria-hidden", String(mode !== "models"));
    };

    const updateModelInterface = (modelIndex: number, modelStepIndex = 0) => {
      if (outdoorCameraModels.length === 0) {
        return;
      }

      const nextModelIndex = clamp(
        modelIndex,
        0,
        outdoorCameraModels.length - 1,
      );
      const activeModel = outdoorCameraModels[nextModelIndex];
      const stepCount = activeModel.steps.length;
      const nextStepIndex = clamp(modelStepIndex, 0, stepCount - 1);

      activeModelIndex = nextModelIndex;
      activeModelStepIndex = nextStepIndex;
      root.dataset.activeModel = String(nextModelIndex + 1);
      root.dataset.activeModelStep = String(nextStepIndex + 1);

      modelGroups.forEach((group, index) => {
        const isActiveGroup = index === nextModelIndex;
        const indicators = Array.from(
          group.querySelectorAll<HTMLElement>(
            "[data-camera-model-step-indicator]",
          ),
        );
        const progressFill = group.querySelector<HTMLElement>(
          "[data-camera-model-progress-fill]",
        );
        const current = group.querySelector<HTMLElement>(
          "[data-camera-model-step-current]",
        );
        const total = group.querySelector<HTMLElement>(
          "[data-camera-model-step-total]",
        );

        group.dataset.active = String(isActiveGroup);
        group.setAttribute("aria-hidden", String(!isActiveGroup));

        indicators.forEach((indicator, indicatorIndex) => {
          indicator.dataset.active = String(
            isActiveGroup && indicatorIndex === nextStepIndex,
          );
          indicator.dataset.complete = String(
            isActiveGroup && indicatorIndex < nextStepIndex,
          );
        });

        if (progressFill) {
          progressFill.style.transform = `scaleY(${
            indicators.length === 1 || !isActiveGroup
              ? isActiveGroup
                ? 1
                : 0
              : nextStepIndex / (indicators.length - 1)
          })`;
        }

        if (current && isActiveGroup) {
          current.textContent = String(nextStepIndex + 1).padStart(2, "0");
        }

        if (total) {
          total.textContent = String(indicators.length).padStart(2, "0");
        }
      });

      modelImageLayers.forEach((image) => {
        const modelImageIndex = Number(image.dataset.cameraModelImageIndex);
        const isActive = modelImageIndex === nextModelIndex;

        image.dataset.active = String(isActive);
        image.setAttribute("aria-hidden", String(!isActive));
      });
    };

    const showModelInterface = (modelIndex: number) => {
      if (outdoorCameraModels.length === 0) {
        return false;
      }

      clearTransitionPlayback();
      videoLayers.forEach((targetVideo) => targetVideo.pause());
      warmModelImages();
      updateModelInterface(modelIndex, 0);
      setSceneMode("models");
      return true;
    };

    const showStepInterface = () => {
      clearTransitionPlayback();
      videoLayers.forEach((targetVideo) => targetVideo.pause());
      updateInterface(technicalSteps.length - 1);
      setVideoFrame(technicalSteps[technicalSteps.length - 1].time);
      showVideoLayer(video);
      setSceneMode("steps");
      return true;
    };

    const forceCompleteTransition = (stepIndex: number, reason: string) => {
      if (isDisposed) {
        return;
      }

      if (!warnedRecovery) {
        warnedRecovery = true;
        console.warn("Technical video transition recovered.", { reason });
      }

      clearTransitionPlayback();
      videoLayers.forEach((targetVideo) => targetVideo.pause());
      updateInterface(stepIndex);
      setVideoFrame(technicalSteps[stepIndex].time);
      showVideoLayer(video);
      pendingStepIndex = null;
      isTransitioning = false;
    };

    const finishForwardTransition = (stepIndex: number) => {
      if (isDisposed) {
        return;
      }

      clearTransitionPlayback();
      videoLayers.forEach((targetVideo) => targetVideo.pause());
      updateInterface(stepIndex);
      setVideoFrame(technicalSteps[stepIndex].time);
      showVideoLayer(video);
      pendingStepIndex = null;
      isTransitioning = false;
    };

    const finishReverseTransition = (stepIndex: number) => {
      if (isDisposed) {
        return;
      }

      clearTransitionPlayback();
      videoLayers.forEach((targetVideo) => targetVideo.pause());
      updateInterface(stepIndex);
      showVideoLayer(reverseVideo);
      setVideoFrame(technicalSteps[stepIndex].time);
      pendingStepIndex = null;
      isTransitioning = false;
    };

    const playForwardToStep = (
      stepIndex: number,
      targetTime: number,
      sourceStepIndex: number,
    ) => {
      const sourceTime = technicalSteps[sourceStepIndex].time;

      const monitorStopFrame = () => {
        if (isDisposed) {
          return;
        }

        if (video.currentTime >= targetTime - PLAYBACK_STOP_EARLY_SECONDS) {
          finishForwardTransition(stepIndex);
          return;
        }

        stopFrameId = window.requestAnimationFrame(monitorStopFrame);
      };

      const startPlayback = async () => {
        const hasSourceFrame =
          sourceStepIndex === 0
            ? await prepareInitialFrame()
            : await prepareVideoFrame(video, sourceTime);

        if (
          isDisposed ||
          !isTransitioning ||
          pendingStepIndex !== stepIndex
        ) {
          return;
        }

        if (!hasSourceFrame) {
          forceCompleteTransition(stepIndex, "forward-seek-timeout");
          return;
        }

        if (sourceStepIndex === 0) {
          await revealInitialFrame();
        }

        await crossfadeToVideoLayer(video);

        if (
          isDisposed ||
          !isTransitioning ||
          pendingStepIndex !== stepIndex
        ) {
          return;
        }

        video.playbackRate = 1;
        void video
          .play()
          .then(() => {
            if (isDisposed || !isTransitioning) {
              return;
            }

            stopFrameId = window.requestAnimationFrame(monitorStopFrame);
          })
          .catch(() => {
            if (isDisposed || !isTransitioning) {
              return;
            }

            forceCompleteTransition(stepIndex, "play-rejected");
          });
      };

      void startPlayback();

      watchdogTimeoutId = window.setTimeout(
        () => forceCompleteTransition(stepIndex, "timeout"),
        getPlaybackWatchdogMs(sourceTime, targetTime),
      );
    };

    const startReversePlayback = async (
      stepIndex: number,
      sourceTime: number,
      targetTime: number,
    ) => {
      const hasMetadata = await waitForMetadata(reverseVideo);

      if (isDisposed || !isTransitioning) {
        return;
      }

      if (!hasMetadata) {
        forceCompleteTransition(stepIndex, "reverse-metadata-timeout");
        return;
      }

      const sourceReverseTime = getReverseTime(sourceTime);
      const targetReverseTime = getReverseTime(targetTime);

      if (
        targetReverseTime <=
        sourceReverseTime + STEP_TIME_TOLERANCE_SECONDS
      ) {
        forceCompleteTransition(stepIndex, "reverse-target");
        return;
      }

      reverseVideo.pause();
      reverseVideo.playbackRate = 1;

      const hasStartFrame = await waitForSeekFrame(
        reverseVideo,
        sourceReverseTime,
      );

      if (isDisposed || !isTransitioning) {
        return;
      }

      if (!hasStartFrame) {
        forceCompleteTransition(stepIndex, "reverse-seek-timeout");
        return;
      }

      const monitorStopFrame = () => {
        if (isDisposed) {
          return;
        }

        if (
          reverseVideo.currentTime >=
          targetReverseTime - PLAYBACK_STOP_EARLY_SECONDS
        ) {
          finishReverseTransition(stepIndex);
          return;
        }

        stopFrameId = window.requestAnimationFrame(monitorStopFrame);
      };

      await crossfadeToVideoLayer(reverseVideo);

      if (isDisposed || !isTransitioning || pendingStepIndex !== stepIndex) {
        return;
      }

      void reverseVideo
        .play()
        .then(() => {
          if (isDisposed || !isTransitioning) {
            return;
          }

          stopFrameId = window.requestAnimationFrame(monitorStopFrame);
        })
        .catch(() => {
          if (isDisposed || !isTransitioning) {
            return;
          }

          forceCompleteTransition(stepIndex, "reverse-play-rejected");
        });
    };

    const playReverseToStep = (
      stepIndex: number,
      targetTime: number,
      sourceStepIndex: number,
    ) => {
      const sourceTime = technicalSteps[sourceStepIndex].time;

      warmVideoElement(reverseVideo);
      watchdogTimeoutId = window.setTimeout(
        () => forceCompleteTransition(stepIndex, "timeout"),
        getPlaybackWatchdogMs(sourceTime, targetTime) + METADATA_WAIT_TIMEOUT_MS,
      );
      void startReversePlayback(stepIndex, sourceTime, targetTime);
    };

    const animateToStep = (stepIndex: number) => {
      const nextStepIndex = clamp(stepIndex, 0, technicalSteps.length - 1);

      if (nextStepIndex === activeStepIndex || isTransitioning) {
        return;
      }

      const sourceStepIndex = activeStepIndex;
      warmVideos();
      clearTransitionPlayback();

      const targetTime = technicalSteps[nextStepIndex].time;

      if (mediaQuery.matches || video.readyState < video.HAVE_METADATA) {
        updateInterface(nextStepIndex);
        setVideoFrame(targetTime);
        showVideoLayer(video);
        isTransitioning = false;
        return;
      }

      isTransitioning = true;
      pendingStepIndex = nextStepIndex;
      updateInterface(nextStepIndex);

      if (nextStepIndex > sourceStepIndex) {
        playForwardToStep(nextStepIndex, targetTime, sourceStepIndex);
        return;
      }

      playReverseToStep(nextStepIndex, targetTime, sourceStepIndex);
    };

    const isSceneActive = () => {
      const rect = root.getBoundingClientRect();

      return (
        rect.top <= SCENE_ALIGNMENT_TOLERANCE_PX &&
        Math.abs(rect.bottom - window.innerHeight) <=
          SCENE_ALIGNMENT_TOLERANCE_PX
      );
    };

    const handleDirection = (direction: "down" | "up") => {
      if (activeMode === "models") {
        const activeModel = outdoorCameraModels[activeModelIndex];

        if (direction === "down") {
          if (activeModelStepIndex < activeModel.steps.length - 1) {
            updateModelInterface(activeModelIndex, activeModelStepIndex + 1);
            return true;
          }

          if (activeModelIndex < outdoorCameraModels.length - 1) {
            updateModelInterface(activeModelIndex + 1, 0);
            return true;
          }

          return false;
        }

        if (activeModelStepIndex > 0) {
          updateModelInterface(activeModelIndex, activeModelStepIndex - 1);
          return true;
        }

        if (activeModelIndex > 0) {
          const previousModelIndex = activeModelIndex - 1;
          const previousModel = outdoorCameraModels[previousModelIndex];

          updateModelInterface(
            previousModelIndex,
            previousModel.steps.length - 1,
          );
          return true;
        }

        return showStepInterface();
      }

      if (direction === "down") {
        if (activeStepIndex >= technicalSteps.length - 1) {
          return showModelInterface(0);
        }

        animateToStep(activeStepIndex + 1);
        return true;
      }

      if (activeStepIndex <= 0) {
        return false;
      }

      animateToStep(activeStepIndex - 1);
      return true;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isSceneActive() || Math.abs(event.deltaY) < SCROLL_THRESHOLD) {
        return;
      }

      const direction = event.deltaY > 0 ? "down" : "up";

      if (isTransitioning) {
        event.preventDefault();
        return;
      }

      if (handleDirection(direction)) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey)
          ? "down"
          : event.key === "ArrowUp" ||
              event.key === "PageUp" ||
              (event.key === " " && event.shiftKey)
            ? "up"
            : null;

      if (!direction || !isSceneActive()) {
        return;
      }

      if (isTransitioning) {
        event.preventDefault();
        return;
      }

      if (handleDirection(direction)) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const nextTouchY = event.touches[0]?.clientY;

      if (lastTouchY === null || nextTouchY === undefined) {
        lastTouchY = nextTouchY ?? null;
        return;
      }

      const deltaY = lastTouchY - nextTouchY;
      lastTouchY = nextTouchY;

      if (!isSceneActive() || Math.abs(deltaY) < TOUCH_THRESHOLD) {
        return;
      }

      const direction = deltaY > 0 ? "down" : "up";

      if (isTransitioning) {
        event.preventDefault();
        return;
      }

      if (handleDirection(direction)) {
        event.preventDefault();
      }
    };

    const handleVideoRecoveryEvent = (event: Event) => {
      if (event.type !== "error" || !isTransitioning) {
        return;
      }

      forceCompleteTransition(pendingStepIndex ?? activeStepIndex, event.type);
    };

    const handleVideoEnded = (event: Event) => {
      if (!isTransitioning || pendingStepIndex === null) {
        return;
      }

      if (
        event.currentTarget === video &&
        pendingStepIndex === technicalSteps.length - 1
      ) {
        finishForwardTransition(pendingStepIndex);
        return;
      }

      if (event.currentTarget === reverseVideo && pendingStepIndex === 0) {
        finishReverseTransition(pendingStepIndex);
      }
    };

    const initializeFrame = () => {
      setSceneMode("steps");
      updateInterface(0);
      updateModelInterface(0);
      warmVideoElement(video);
      warmModelImages();
      void prepareInitialFrame().then((isReady) => {
        if (!isDisposed && isReady) {
          void revealInitialFrame();
        }
      });
    };

    if (video.readyState >= video.HAVE_METADATA) {
      initializeFrame();
    } else {
      video.addEventListener("loadedmetadata", initializeFrame, { once: true });
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          warmVideos();
          warmModelImages();
          void prepareInitialFrame();
        }
      },
      { rootMargin: "1000px 0px", threshold: 0.15 },
    );
    observer.observe(root);

    videoLayers.forEach((targetVideo) => {
      targetVideo.addEventListener("error", handleVideoRecoveryEvent);
      targetVideo.addEventListener("stalled", handleVideoRecoveryEvent);
      targetVideo.addEventListener("waiting", handleVideoRecoveryEvent);
      targetVideo.addEventListener("ended", handleVideoEnded);
    });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      isDisposed = true;
      clearTransitionPlayback();
      cancelPosterFade();
      observer?.disconnect();
      video.removeEventListener("loadedmetadata", initializeFrame);
      videoLayers.forEach((targetVideo) => {
        targetVideo.pause();
        targetVideo.removeEventListener("error", handleVideoRecoveryEvent);
        targetVideo.removeEventListener("stalled", handleVideoRecoveryEvent);
        targetVideo.removeEventListener("waiting", handleVideoRecoveryEvent);
        targetVideo.removeEventListener("ended", handleVideoEnded);
      });
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
}
