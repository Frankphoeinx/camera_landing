import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./LandingSections.module.css";

type InstallationSectionProps = {
  content: Dictionary["installation"];
};

export function InstallationSection({ content }: InstallationSectionProps) {
  return (
    <section
      className={styles.installationSection}
      id="installation"
      aria-labelledby="installation-title"
    >
      <div className={styles.installationBackground} aria-hidden="true">
        <span className={styles.installationGrid} />
        <span className={styles.installationSweep} />
      </div>

      <div className={styles.installationShell}>
        <div className={styles.installationHeader}>
          <p className={styles.sectionEyebrow}>{content.eyebrow}</p>
          <h2 className={styles.installationTitle} id="installation-title">
            {content.title}
          </h2>
          <p className={styles.installationCopy}>{content.copy}</p>
        </div>

        <aside
          className={styles.installationChecklist}
          aria-label={content.checklistAriaLabel}
        >
          <div className={styles.installationChecklistHeader}>
            <span>{content.checklistHeader}</span>
            <strong>{content.checklistStatus}</strong>
          </div>
          <div className={styles.installationSignalGrid}>
            {content.signals.map((signal) => (
              <div className={styles.installationSignal} key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
          <ol className={styles.installationChecklistList}>
            {content.checklist.map((item, index) => (
              <li className={styles.installationChecklistItem} key={item.label}>
                <span className={styles.installationChecklistIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <div className={styles.installationMetrics}>
          {content.metrics.map((metric) => (
            <div className={styles.installationMetric} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        <div className={styles.installationPhases}>
          {content.phases.map((phase) => (
            <article className={styles.installationPhase} key={phase.eyebrow}>
              <span>{phase.eyebrow}</span>
              <strong>{phase.title}</strong>
              <p>{phase.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
