import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./HeroScene.module.css";

const SLIDE_VALUE_DURATION_MS = 420;

const statusDefinitions = [
  {
    label: "Perimeter",
    values: ["Armed", "Guard", "Armed", "Clear"],
  },
  {
    label: "Solar charge",
    values: ["96%", "97%", "96%", "96%"],
  },
  {
    label: "Night vision",
    values: ["Active", "IR on", "Active", "Clear"],
  },
  {
    label: "PTZ sweep",
    values: ["Ready", "S-12", "S-27", "Home"],
  },
];

const telemetryDefinitions = [
  {
    id: "gate",
    values: ["West gate", "Gate scan 02", "West gate"],
  },
  {
    id: "motion",
    values: ["Motion clear", "Scan clear", "Path clear"],
  },
  {
    id: "seal",
    values: ["IP66 sealed", "Rain ok", "IP66 sealed"],
  },
  {
    id: "preview",
    values: ["24 fps live", "25 fps live", "24 fps live"],
  },
];

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

export function HeroIntroInterface() {
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
      statusDefinitions.map((status, index) => ({
        label: status.label,
        value: status.values[(statusPhase + index) % status.values.length],
      })),
    [statusPhase],
  );

  const liveTelemetry = useMemo(
    () =>
      telemetryDefinitions.map((item, index) => ({
        id: item.id,
        value: item.values[(telemetryPhase + index) % item.values.length],
      })),
    [telemetryPhase],
  );

  return (
    <div className={styles.interface} data-hud-root>
      <div className={styles.interfaceFrame} aria-hidden="true">
        <span className={styles.leftRail} data-interface-line />
        <span className={styles.cornerTop} />
        <span className={styles.cornerBottom} />
        <span className={styles.scanLine} data-scan-line />
      </div>

      <div className={styles.systemBar} data-hud-item>
        <p className={styles.eyebrow}>SOLAR SENTINEL / VILLA PERIMETER</p>
        <span className={styles.onlineBadge}>
          <span className={styles.recordingDot} aria-hidden="true" />
          Online
        </span>
      </div>

      <h1 className={styles.headline} data-headline>
        <span className={styles.headlineMask}>
          <span data-headline-line>Perimeter</span>
        </span>
        <span className={styles.headlineMask}>
          <span data-headline-line>awareness</span>
        </span>
        <span className={styles.headlineMask}>
          <span data-headline-line>without wiring.</span>
        </span>
      </h1>

      <p className={styles.copy} data-hud-item>
        Solar outdoor surveillance for private estates: night-ready,
        weather-sealed, and positioned for complete perimeter confidence.
      </p>

      <nav
        className={styles.actions}
        aria-label="Hero actions"
        data-hud-item
      >
        <a className={`${styles.action} ${styles.primaryAction}`} href="#installation">
          <span>Book installation</span>
          <span className={styles.actionSheen} data-cta-sheen aria-hidden="true" />
        </a>
        <a className={`${styles.action} ${styles.secondaryAction}`} href="#system">
          Explore system
        </a>
      </nav>

      <div className={styles.statusDock} data-hud-item>
        <div className={styles.statusHeader} aria-hidden="true">
          <span>Live security state</span>
          <SlidingValue
            className={styles.statusClock}
            slideByCharacter
            value={elapsedTime}
          />
        </div>

        <div className={styles.statusStack} aria-label="Live system status">
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
                slideByCharacter={status.label === "Solar charge"}
                value={status.value}
              />
            </div>
          ))}
        </div>
      </div>

      <ul className={styles.telemetryList} aria-label="Compact telemetry">
        {liveTelemetry.map((item, index) => (
          <li className={styles.telemetryItem} key={item.id} data-telemetry-item>
            <span
              className={styles.telemetryDot}
              data-pulse-dot
              aria-hidden="true"
              style={{ animationDelay: `${index * 140}ms` }}
            />
            <SlidingValue
              className={styles.telemetryText}
              value={item.value}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
