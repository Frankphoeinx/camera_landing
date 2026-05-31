"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./HeroScene.module.css";

const SLIDE_VALUE_DURATION_MS = 420;

function formatElapsedTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");
}

type SlidingValueProps = {
  value: string;
  className: string;
  slideByCharacter?: boolean;
};

type SlidingValueState = {
  current: string;
  previous: string | null;
  changeId: number;
};

function SlidingValue({
  value,
  className,
  slideByCharacter = false,
}: SlidingValueProps) {
  const activeValueRef = useRef(value);
  const [slideState, setSlideState] = useState<SlidingValueState>({
    current: value,
    previous: null,
    changeId: 0,
  });

  useEffect(() => {
    if (value === activeValueRef.current) {
      return;
    }

    const previous = activeValueRef.current;
    activeValueRef.current = value;

    setSlideState((currentState) => ({
      current: value,
      previous,
      changeId: currentState.changeId + 1,
    }));

    const timeout = window.setTimeout(() => {
      setSlideState((currentState) =>
        currentState.current === value
          ? {
              ...currentState,
              previous: null,
            }
          : currentState,
      );
    }, SLIDE_VALUE_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [value]);

  const isSliding = slideState.previous !== null;
  const shouldRenderCharacters =
    slideByCharacter &&
    (slideState.previous === null ||
      slideState.previous.length === slideState.current.length);

  return (
    <span className={className} aria-live="off">
      <span className={styles.valueSlideViewport}>
        {shouldRenderCharacters ? (
          <span className={styles.valueSlideCharacters}>
            {Array.from(slideState.current).map((character, index) => {
              const previousCharacter = slideState.previous?.[index];
              const didChange =
                slideState.previous !== null && previousCharacter !== character;
              const characterClassName =
                character === "%"
                  ? `${styles.valueSlideCharacter} ${styles.valueSlideCharacterSymbol}`
                  : styles.valueSlideCharacter;

              return (
                <span
                  className={characterClassName}
                  key={`${slideState.changeId}-${index}`}
                >
                  {didChange ? (
                    <>
                      <span
                        className={`${styles.valueSlideItem} ${styles.valueSlideExit}`}
                        aria-hidden="true"
                      >
                        {previousCharacter}
                      </span>
                      <span
                        className={`${styles.valueSlideItem} ${styles.valueSlideEnter}`}
                      >
                        {character}
                      </span>
                    </>
                  ) : (
                    <span className={styles.valueSlideCharacterStatic}>
                      {character}
                    </span>
                  )}
                </span>
              );
            })}
          </span>
        ) : (
          <>
            {slideState.previous !== null ? (
              <span
                className={`${styles.valueSlideItem} ${styles.valueSlideExit}`}
                key={`previous-${slideState.changeId}`}
                aria-hidden="true"
              >
                {slideState.previous}
              </span>
            ) : null}
            <span
              className={`${styles.valueSlideItem} ${
                isSliding ? styles.valueSlideEnter : ""
              }`}
              key={`current-${slideState.changeId}`}
            >
              {slideState.current}
            </span>
          </>
        )}
      </span>
    </span>
  );
}

type HeroLiveStatusProps = {
  content: Dictionary["hero"]["intro"]["liveStatus"];
};

export function HeroLiveStatus({ content }: HeroLiveStatusProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const statusPhase = Math.floor(elapsedSeconds / 3);
  const telemetryPhase = Math.floor(elapsedSeconds / 4);
  const elapsedTime = formatElapsedTime(elapsedSeconds);

  const liveStatuses = useMemo(
    () =>
      content.statuses.map((status, index) => ({
        label: status.label,
        slideByCharacter: status.slideByCharacter,
        value: status.values[(statusPhase + index) % status.values.length],
      })),
    [content.statuses, statusPhase],
  );

  const liveTelemetry = useMemo(
    () =>
      content.telemetry.map((item, index) => ({
        id: item.id,
        value: item.values[(telemetryPhase + index) % item.values.length],
      })),
    [content.telemetry, telemetryPhase],
  );

  return (
    <>
      <div className={styles.statusDock} data-hud-item>
        <div className={styles.statusHeader} aria-hidden="true">
          <span>{content.header}</span>
          <SlidingValue
            className={styles.statusClock}
            slideByCharacter
            value={elapsedTime}
          />
        </div>

        <div className={styles.statusStack} aria-label={content.statusAriaLabel}>
          {liveStatuses.map((status, index) => (
            <div
              className={styles.statusRow}
              key={status.label}
              data-status-row
            >
              <span
                className={styles.statusSweep}
                data-status-sweep
                aria-hidden="true"
              />
              <span
                className={styles.statusPulse}
                data-pulse-dot
                aria-hidden="true"
                style={{ animationDelay: `${index * 160}ms` }}
              />
              <span className={styles.statusLabel}>{status.label}</span>
              <SlidingValue
                className={styles.statusValue}
                slideByCharacter={status.slideByCharacter}
                value={status.value}
              />
            </div>
          ))}
        </div>
      </div>

      <ul className={styles.telemetryList} aria-label={content.telemetryAriaLabel}>
        {liveTelemetry.map((item, index) => (
          <li className={styles.telemetryItem} key={item.id} data-telemetry-item>
            <span
              className={styles.telemetryDot}
              data-pulse-dot
              aria-hidden="true"
              style={{ animationDelay: `${index * 140}ms` }}
            />
            <SlidingValue className={styles.telemetryText} value={item.value} />
          </li>
        ))}
      </ul>
    </>
  );
}
