import { HeroTypewriterHeadline } from "./HeroTypewriterHeadline";
import styles from "./HeroScene.module.css";

type FinalSection = {
  detail: string;
  eyebrow: string;
  facts: string[];
  title: string;
  value: string;
};

const finalSections: FinalSection[] = [
  {
    eyebrow: "ESTATE COVERAGE",
    title: "Villa perimeter watch",
    detail: "Gate, driveway, garden, and terrace coverage.",
    facts: ["4 active zones", "25 fps live"],
    value: "360 deg",
  },
  {
    eyebrow: "AUTONOMOUS READINESS",
    title: "Solar patrol reserve",
    detail: "Night optics and IP66 sealing stay online.",
    facts: ["96% charge", "IR + LED"],
    value: "72h",
  },
  {
    eyebrow: "RESPONSE PROTOCOL",
    title: "Alert handoff ready",
    detail: "Owner alert, guard handoff, and evidence sync.",
    facts: ["30 day archive", "Encrypted clips"],
    value: "Ready",
  },
];

const finalStatusItems = ["AI event filter", "No wiring required", "Survey ready"];

const finalHeadlinePhrases = [
  ["Estate", "command", "ready."],
  ["Coverage", "plan", "verified."],
  ["Alert", "handoff", "secured."],
  ["Install", "survey", "ready."],
];

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
        {facts.map((fact) => (
          <span className={styles.finalSectionFact} key={fact}>
            {fact}
          </span>
        ))}
      </span>
    </section>
  );
}

export function HeroFinalInterface() {
  return (
    <aside
      className={`${styles.capabilityOverlay} ${styles.finalOverlay}`}
      aria-label="Estate command overview"
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
          <p className={styles.eyebrow}>SOLAR SENTINEL / ESTATE COMMAND</p>
          <span className={styles.finalSystemBadge}>
            <span className={styles.recordingDot} />
            Protected
          </span>
        </div>

        <div className={styles.finalHeroBlock} data-final-panel>
          <HeroTypewriterHeadline
            as="h2"
            className={styles.finalHeadline}
            phrases={finalHeadlinePhrases}
            rootDataAttribute="data-final-root"
            startDelayMs={280}
          />
          <p className={styles.finalCopy}>
            Coverage, solar reserve, and alert handoff are verified for a
            premium outdoor install.
          </p>
        </div>

        <div className={styles.finalCommandGrid}>
          {finalSections.map((section) => (
            <FinalStatusSection key={section.eyebrow} {...section} />
          ))}
        </div>

        <ul className={styles.finalStatusStrip} data-final-panel>
          {finalStatusItems.map((item) => (
            <li className={styles.finalStatusChip} key={item}>
              <span className={styles.telemetryDot} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.finalActionRow} data-final-panel>
          <a className={`${styles.action} ${styles.primaryAction}`} href="#installation">
            <span>Book installation</span>
            <span className={styles.actionSheen} aria-hidden="true" />
          </a>
          <a className={`${styles.action} ${styles.secondaryAction}`} href="#system">
            View coverage plan
          </a>
        </div>
      </section>
    </aside>
  );
}
