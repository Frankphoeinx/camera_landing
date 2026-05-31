import { HeroTypewriterHeadline } from "./HeroTypewriterHeadline";
import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./HeroScene.module.css";

type FinalSection = Dictionary["hero"]["final"]["sections"][number];

function FinalStatusSection({
  detail,
  eyebrow,
  facts,
  title,
  value,
}: FinalSection) {
  return (
    <section className={styles.finalCommandPanel} data-final-panel>
      <span className={styles.finalPanelSweep} data-final-sweep />
      <span className={styles.finalSectionEyebrow}>{eyebrow}</span>
      <strong className={styles.finalSectionTitle}>{title}</strong>
      <span className={styles.finalSectionValue}>{value}</span>
      <span className={styles.finalSectionCopy}>{detail}</span>
      <span className={styles.finalSectionFacts} aria-hidden="true">
        {facts.map((fact, index) => (
          <span className={styles.finalSectionFact} key={index}>
            {fact}
          </span>
        ))}
      </span>
    </section>
  );
}

type HeroFinalInterfaceProps = {
  content: Dictionary["hero"]["final"];
  onOrderOpen?: () => void;
};

export function HeroFinalInterface({
  content,
  onOrderOpen,
}: HeroFinalInterfaceProps) {
  return (
    <aside
      className={`${styles.capabilityOverlay} ${styles.finalOverlay}`}
      aria-label={content.ariaLabel}
      data-final-root
    >
      <section className={styles.finalInterface}>
        <div className={styles.finalInterfaceFrame} aria-hidden="true">
          <span className={styles.finalLeftRail} />
          <span className={styles.finalCornerTop} />
          <span className={styles.finalCornerBottom} />
          <span className={styles.finalScanLine} data-final-sweep />
        </div>

        <div className={styles.finalSystemBar} data-final-panel>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <span className={styles.finalSystemBadge}>
            <span className={styles.recordingDot} />
            {content.badge}
          </span>
        </div>

        <div className={styles.finalHeroBlock} data-final-panel>
          <HeroTypewriterHeadline
            as="h2"
            className={styles.finalHeadline}
            phrases={content.headlinePhrases}
            rootDataAttribute="data-final-root"
            startDelayMs={280}
          />
          <p className={styles.finalCopy}>{content.copy}</p>
        </div>

        <div className={styles.finalCommandGrid}>
          {content.sections.map((section, index) => (
            <FinalStatusSection key={index} {...section} />
          ))}
        </div>

        <ul className={styles.finalStatusStrip} data-final-panel>
          {content.statusItems.map((item, index) => (
            <li className={styles.finalStatusChip} key={index}>
              <span className={styles.telemetryDot} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.finalActionRow} data-final-panel>
          <button
            className={`${styles.action} ${styles.primaryAction}`}
            onClick={onOrderOpen}
            type="button"
          >
            <span>{content.primaryAction}</span>
            <span className={styles.actionSheen} aria-hidden="true" />
          </button>
          <a className={`${styles.action} ${styles.secondaryAction}`} href="#system">
            {content.secondaryAction}
          </a>
        </div>
      </section>
    </aside>
  );
}
