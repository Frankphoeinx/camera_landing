import styles from "./HeroScene.module.css";

const capabilityPanels = [
  {
    id: "ai",
    className: styles.capabilityPanelAi,
    eyebrow: "AI PERIMETER",
    title: "Human and vehicle recognition",
    copy: "Filters animals, rain, branches, and passing shadows before an alert reaches the estate.",
    metric: "98% scene confidence",
  },
  {
    id: "night",
    className: styles.capabilityPanelNight,
    eyebrow: "NIGHT WATCH",
    title: "IR flood and color low-light",
    copy: "Dual illuminators keep the driveway, gate, and garden edges visible without police-style glare.",
    metric: "40 m night coverage",
  },
  {
    id: "ptz",
    className: styles.capabilityPanelPtz,
    eyebrow: "PTZ COVERAGE",
    title: "Auto patrol with manual override",
    copy: "The lens sweeps blind spots, locks on motion, and returns to the guard route automatically.",
    metric: "355 deg pan / 90 deg tilt",
  },
];

const traces = [
  {
    className: styles.capabilityTraceAi,
    markerClassName: styles.capabilityMarkerAi,
  },
  {
    className: styles.capabilityTraceNight,
    markerClassName: styles.capabilityMarkerNight,
  },
  {
    className: styles.capabilityTracePtz,
    markerClassName: styles.capabilityMarkerPtz,
  },
];

export function HeroCapabilityInterface() {
  return (
    <aside
      className={styles.capabilityOverlay}
      aria-label="Camera capability overview"
      data-capability-root
    >
      {capabilityPanels.map((panel) => (
        <section
          className={`${styles.capabilityPanel} ${panel.className}`}
          data-capability-panel
          key={panel.id}
        >
          <span className={styles.capabilitySweep} data-capability-sweep />
          <span className={styles.capabilityEyebrow}>{panel.eyebrow}</span>
          <strong className={styles.capabilityTitle}>{panel.title}</strong>
          <span className={styles.capabilityCopy}>{panel.copy}</span>
          <span className={styles.capabilityMetric}>{panel.metric}</span>
        </section>
      ))}

      {traces.map((trace) => (
        <span
          className={`${styles.capabilityTraceGroup} ${trace.className}`}
          aria-hidden="true"
          key={trace.className}
        >
          <span className={styles.capabilityTrace} data-capability-trace />
          <span
            className={`${styles.capabilityMarker} ${trace.markerClassName}`}
            data-capability-marker
          />
        </span>
      ))}
    </aside>
  );
}
