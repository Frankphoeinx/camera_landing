import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./HeroScene.module.css";

const capabilityPanelChrome = [
  {
    className: styles.capabilityPanelAi,
    traceClassName: styles.capabilityTraceAi,
    markerClassName: styles.capabilityMarkerAi,
    videoAnchor: { x: 0.536, y: 0.149 },
  },
  {
    className: styles.capabilityPanelNight,
    traceClassName: styles.capabilityTraceNight,
    markerClassName: styles.capabilityMarkerNight,
    videoAnchor: { x: 0.512, y: 0.634 },
  },
  {
    className: styles.capabilityPanelPtz,
    traceClassName: styles.capabilityTracePtz,
    markerClassName: styles.capabilityMarkerPtz,
    videoAnchor: { x: 0.662, y: 0.563 },
  },
];

type HeroCapabilityInterfaceProps = {
  content: Dictionary["hero"]["capability"];
};

export function HeroCapabilityInterface({
  content,
}: HeroCapabilityInterfaceProps) {
  return (
    <aside
      className={styles.capabilityOverlay}
      aria-label={content.ariaLabel}
      data-capability-root
    >
      {content.panels.map((panel, index) => {
        const chrome = capabilityPanelChrome[index] ?? capabilityPanelChrome[0];

        return (
          <section
            className={`${styles.capabilityPanel} ${chrome.className}`}
            data-capability-panel
            key={panel.id}
          >
            <span
              className={`${styles.capabilityTraceGroup} ${chrome.traceClassName}`}
              data-video-anchor-x={chrome.videoAnchor.x}
              data-video-anchor-y={chrome.videoAnchor.y}
              aria-hidden="true"
            >
              <span className={styles.capabilityTrace} data-capability-trace />
              <span
                className={`${styles.capabilityMarker} ${chrome.markerClassName}`}
                data-capability-marker
              />
            </span>
            <span className={styles.capabilitySweep} data-capability-sweep />
            <span className={styles.capabilityEyebrow}>{panel.eyebrow}</span>
            <strong className={styles.capabilityTitle}>{panel.title}</strong>
            <span className={styles.capabilityCopy}>{panel.copy}</span>
            <span className={styles.capabilityMetric}>{panel.metric}</span>
          </section>
        );
      })}
    </aside>
  );
}
