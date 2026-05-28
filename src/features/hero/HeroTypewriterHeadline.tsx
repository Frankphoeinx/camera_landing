"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeroScene.module.css";

type HeroTypewriterHeadlineProps = {
  as: "h1" | "h2";
  className: string;
  lineDataAttribute?: string;
  phrases: string[][];
  rootDataAttribute: string;
  startDelayMs?: number;
};

type TypewriterPhase = "typing" | "deleting";

const TYPE_DELAY_MS = 48;
const DELETE_DELAY_MS = 24;
const HOLD_DELAY_MS = 2600;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function getTypedLines(phraseLines: string[], visibleCharacters: number) {
  const phraseText = phraseLines.join("\n");
  const visibleText = phraseText.slice(0, visibleCharacters);
  const visibleLines = visibleText.split("\n");

  return phraseLines.map((_, index) => visibleLines[index] ?? "");
}

function getCursorLineIndex(phraseLines: string[], visibleCharacters: number) {
  const phraseText = phraseLines.join("\n");
  const visibleText = phraseText.slice(0, visibleCharacters);

  return Math.min(
    Math.max(visibleText.split("\n").length - 1, 0),
    phraseLines.length - 1,
  );
}

export function HeroTypewriterHeadline({
  as,
  className,
  lineDataAttribute,
  phrases,
  rootDataAttribute,
  startDelayMs = 0,
}: HeroTypewriterHeadlineProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isRootVisible, setIsRootVisible] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>("typing");
  const [isStartDelayComplete, setIsStartDelayComplete] = useState(
    startDelayMs <= 0,
  );

  const phraseTexts = useMemo(
    () => phrases.map((phraseLines) => phraseLines.join("\n")),
    [phrases],
  );
  const maxLineCount = useMemo(
    () => Math.max(...phrases.map((phraseLines) => phraseLines.length)),
    [phrases],
  );

  const currentPhraseLines = phrases[phraseIndex] ?? phrases[0] ?? [""];
  const currentPhraseText = phraseTexts[phraseIndex] ?? phraseTexts[0] ?? "";
  const isTypewriterActive = isRootVisible && !prefersReducedMotion;
  const canType = isTypewriterActive && isStartDelayComplete;
  const displayedCharacters = prefersReducedMotion
    ? currentPhraseText.length
    : visibleCharacters;
  const typedLines = getTypedLines(currentPhraseLines, displayedCharacters);
  const cursorLineIndex = getCursorLineIndex(
    currentPhraseLines,
    displayedCharacters,
  );
  const lineAttributes = lineDataAttribute
    ? ({ [lineDataAttribute]: "" } as Record<string, string>)
    : {};

  useEffect(() => {
    const headline = headlineRef.current;

    if (!headline) {
      return;
    }

    const visibilityRoot =
      headline.closest<HTMLElement>(`[${rootDataAttribute}]`) ?? headline;

    const syncVisibility = () => {
      const rootStyle = window.getComputedStyle(visibilityRoot);
      const nextIsVisible =
        rootStyle.visibility !== "hidden" &&
        Number.parseFloat(rootStyle.opacity || "1") > 0.02;

      setIsRootVisible((currentValue) =>
        currentValue === nextIsVisible ? currentValue : nextIsVisible,
      );
    };

    const observer = new MutationObserver(syncVisibility);

    observer.observe(visibilityRoot, {
      attributeFilter: ["aria-hidden", "class", "hidden", "style"],
      attributes: true,
    });

    syncVisibility();
    const intervalId = window.setInterval(syncVisibility, 260);

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
    };
  }, [rootDataAttribute]);

  useEffect(() => {
    if (!isTypewriterActive) {
      return;
    }

    const resetTimeoutId = window.setTimeout(() => {
      setPhraseIndex(0);
      setVisibleCharacters(0);
      setPhase("typing");
      setIsStartDelayComplete(startDelayMs <= 0);
    }, 0);

    if (startDelayMs <= 0) {
      return () => window.clearTimeout(resetTimeoutId);
    }

    const startDelayTimeoutId = window.setTimeout(() => {
      setIsStartDelayComplete(true);
    }, startDelayMs);

    return () => {
      window.clearTimeout(resetTimeoutId);
      window.clearTimeout(startDelayTimeoutId);
    };
  }, [isTypewriterActive, startDelayMs]);

  useEffect(() => {
    if (!canType || phraseTexts.length === 0) {
      return;
    }

    const phraseLength = currentPhraseText.length;
    const hasRotatingPhrases = phraseTexts.length > 1;
    let timeoutDelay = TYPE_DELAY_MS;

    if (phase === "typing") {
      if (visibleCharacters < phraseLength) {
        const timeoutId = window.setTimeout(() => {
          setVisibleCharacters((currentValue) => currentValue + 1);
        }, timeoutDelay);

        return () => window.clearTimeout(timeoutId);
      }

      timeoutDelay = hasRotatingPhrases ? HOLD_DELAY_MS : 0;
      const timeoutId = window.setTimeout(() => {
        if (hasRotatingPhrases) {
          setPhase("deleting");
        }
      }, timeoutDelay);

      return () => window.clearTimeout(timeoutId);
    }

    if (phase === "deleting") {
      if (visibleCharacters > 0) {
        const timeoutId = window.setTimeout(() => {
          setVisibleCharacters((currentValue) => Math.max(currentValue - 1, 0));
        }, DELETE_DELAY_MS);

        return () => window.clearTimeout(timeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        setPhraseIndex((currentIndex) => (currentIndex + 1) % phraseTexts.length);
        setPhase("typing");
      }, 180);

      return () => window.clearTimeout(timeoutId);
    }

  }, [canType, currentPhraseText, phase, phraseTexts.length, visibleCharacters]);

  const content = Array.from({ length: maxLineCount }).map((_, lineIndex) => {
    const line = typedLines[lineIndex] ?? "";
    const shouldShowCursor = canType && lineIndex === cursorLineIndex;

    return (
      <span className={styles.headlineMask} key={lineIndex}>
        <span {...lineAttributes} aria-hidden="true">
          <span className={styles.typewriterLineText}>
            {line || "\u00a0"}
            {shouldShowCursor ? (
              <span className={styles.typewriterCursor} />
            ) : null}
          </span>
        </span>
      </span>
    );
  });

  const accessibleLabel = currentPhraseLines.join(" ");

  if (as === "h1") {
    return (
      <h1
        className={className}
        ref={headlineRef}
        aria-label={accessibleLabel}
        aria-live="off"
      >
        {content}
      </h1>
    );
  }

  return (
    <h2
      className={className}
      ref={headlineRef}
      aria-label={accessibleLabel}
      aria-live="off"
    >
      {content}
    </h2>
  );
}
