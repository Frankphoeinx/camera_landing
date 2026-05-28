import styles from "./HeroScene.module.css";

const operationPanels = [
  {
    id: "patrol",
    className: styles.operationsPanelPatrol,
    eyebrow: "AUTO PATROL",
    title: "Preset routes across blind zones",
    copy: "Cycles gate, driveway, garden edge, and terrace views without waiting for manual control.",
    metric: "12 patrol points",
    confidence: "94%",
    stats: [
      { label: "Route", value: "A-04" },
      { label: "Sweep", value: "355 deg" },
      { label: "Return", value: "8 sec" },
    ],
    tags: ["Solar hold", "Edge scan", "Auto home"],
  },
  {
    id: "alerts",
    className: styles.operationsPanelAlerts,
    eyebrow: "SMART ALERTS",
    title: "Zone-based event escalation",
    copy: "Separates driveway approach, perimeter crossing, and loitering before sending a priority alert.",
    metric: "3 alert tiers",
    confidence: "91%",
    stats: [
      { label: "Zones", value: "06" },
      { label: "Filter", value: "AI" },
      { label: "Delay", value: "0.4s" },
    ],
    tags: ["Human", "Vehicle", "Loiter"],
  },
  {
    id: "archive",
    className: styles.operationsPanelArchive,
    eyebrow: "EVENT MEMORY",
    title: "Encrypted local and cloud history",
    copy: "Stores verified clips with timestamp, zone, subject type, and patrol state for fast review.",
    metric: "30 day archive",
    confidence: "100%",
    stats: [
      { label: "Clips", value: "128" },
      { label: "Sync", value: "Live" },
      { label: "Mode", value: "Dual" },
    ],
    tags: ["Local SD", "Cloud copy", "Timecode"],
  },
];

const operationTraces = [
  {
    className: styles.operationsTracePatrol,
    markerClassName: styles.operationsMarkerPatrol,
  },
  {
    className: styles.operationsTraceAlerts,
    markerClassName: styles.operationsMarkerAlerts,
  },
  {
    className: styles.operationsTraceArchive,
    markerClassName: styles.operationsMarkerArchive,
  },
];

export function HeroOperationsInterface() {
  return (
    <aside
      className={`${styles.capabilityOverlay} ${styles.operationsOverlay}`}
      aria-label="Camera operations overview"
      data-operations-root
    >
      {operationPanels.map((panel) => (
        <section
          className={`${styles.capabilityPanel} ${styles.operationsPanel} ${panel.className}`}
          data-operations-panel
          key={panel.id}
        >
          <span className={styles.capabilitySweep} data-operations-sweep />
          <span className={styles.capabilityEyebrow}>{panel.eyebrow}</span>
          <strong className={styles.capabilityTitle}>{panel.title}</strong>
          <span className={styles.capabilityCopy}>{panel.copy}</span>

          <div className={styles.operationsStats} aria-hidden="true">
            {panel.stats.map((stat) => (
              <span className={styles.operationsStat} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </span>
            ))}
          </div>

          <div className={styles.operationsMeter} aria-hidden="true">
            <span className={styles.operationsMeterLabel}>
              Signal confidence
            </span>
            <strong>{panel.confidence}</strong>
            <span className={styles.operationsMeterTrack}>
              <span className={styles.operationsMeterFill} />
            </span>
          </div>

          <div className={styles.operationsTags} aria-hidden="true">
            {panel.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <span className={styles.capabilityMetric}>{panel.metric}</span>
        </section>
      ))}

      {operationTraces.map((trace) => (
        <span
          className={`${styles.capabilityTraceGroup} ${trace.className}`}
          aria-hidden="true"
          key={trace.className}
        >
          <span className={styles.capabilityTrace} data-operations-trace />
          <span
            className={`${styles.capabilityMarker} ${trace.markerClassName}`}
            data-operations-marker
          />
        </span>
      ))}
    </aside>
  );
}
