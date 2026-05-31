import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./HeroScene.module.css";

const operationPanelChrome = [
  {
    className: styles.operationsPanelPatrol,
    traceClassName: styles.operationsTracePatrol,
    markerClassName: styles.operationsMarkerPatrol,
    videoAnchor: { x: 0.314, y: 0.307 },
  },
  {
    className: styles.operationsPanelAlerts,
    traceClassName: styles.operationsTraceAlerts,
    markerClassName: styles.operationsMarkerAlerts,
    videoAnchor: { x: 0.23, y: 0.536 },
  },
  {
    className: styles.operationsPanelArchive,
    traceClassName: styles.operationsTraceArchive,
    markerClassName: styles.operationsMarkerArchive,
    videoAnchor: { x: 0.298, y: 0.589 },
  },
];

type HeroOperationsInterfaceProps = {
  content: Dictionary["hero"]["operations"];
};

export function HeroOperationsInterface({ content }: HeroOperationsInterfaceProps) {
  return (
    <aside
      className={`${styles.capabilityOverlay} ${styles.operationsOverlay}`}
      aria-label={content.ariaLabel}
      data-operations-root
    >
      {content.panels.map((panel, index) => {
        const chrome = operationPanelChrome[index] ?? operationPanelChrome[0];

        return (
          <section
            className={`${styles.capabilityPanel} ${styles.operationsPanel} ${chrome.className}`}
            data-operations-panel
            key={panel.id}
          >
            <span
              className={`${styles.capabilityTraceGroup} ${chrome.traceClassName}`}
              data-video-anchor-x={chrome.videoAnchor.x}
              data-video-anchor-y={chrome.videoAnchor.y}
              aria-hidden="true"
            >
              <span className={styles.capabilityTrace} data-operations-trace />
              <span
                className={`${styles.capabilityMarker} ${chrome.markerClassName}`}
                data-operations-marker
              />
            </span>
            <span className={styles.capabilitySweep} data-operations-sweep />
            <span className={styles.capabilityEyebrow}>{panel.eyebrow}</span>
            <strong className={styles.capabilityTitle}>{panel.title}</strong>
            <span className={styles.capabilityCopy}>{panel.copy}</span>

            <div className={styles.operationsStats} aria-hidden="true">
              {panel.stats.map((stat, statIndex) => (
                <span className={styles.operationsStat} key={statIndex}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </span>
              ))}
            </div>

            <div className={styles.operationsMeter} aria-hidden="true">
              <span className={styles.operationsMeterLabel}>
                {content.meterLabel}
              </span>
              <strong>{panel.confidence}</strong>
              <span className={styles.operationsMeterTrack}>
                <span className={styles.operationsMeterFill} />
              </span>
            </div>

            <div className={styles.operationsTags} aria-hidden="true">
              {panel.tags.map((tag, tagIndex) => (
                <span key={tagIndex}>{tag}</span>
              ))}
            </div>

            <span className={styles.capabilityMetric}>{panel.metric}</span>
          </section>
        );
      })}
    </aside>
  );
}
