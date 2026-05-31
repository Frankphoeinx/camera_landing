import type { Dictionary } from "@/i18n/dictionaries";
import { HeroLiveStatus } from "./HeroLiveStatus";
import styles from "./HeroScene.module.css";

type HeroIntroInterfaceProps = {
  content: Dictionary["hero"]["intro"];
};

export function HeroIntroInterface({ content }: HeroIntroInterfaceProps) {
  return (
    <div className={styles.interface} data-hud-root>
      <div className={styles.interfaceFrame} aria-hidden="true">
        <span className={styles.leftRail} data-interface-line />
        <span className={styles.cornerTop} />
        <span className={styles.cornerBottom} />
        <span className={styles.scanLine} data-scan-line />
      </div>

      <div className={styles.systemBar} data-hud-item>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <span className={styles.onlineBadge}>
          <span className={styles.recordingDot} aria-hidden="true" />
          {content.onlineBadge}
        </span>
      </div>

      <h1 className={styles.headline} data-headline>
        {content.headlineLines.map((line, index) => (
          <span className={styles.headlineMask} key={index}>
            <span data-headline-line>{line}</span>
          </span>
        ))}
      </h1>

      <p className={styles.copy} data-hud-item>
        {content.copy}
      </p>

      <nav className={styles.actions} aria-label={content.actionsLabel} data-hud-item>
        <a className={`${styles.action} ${styles.primaryAction}`} href="#installation">
          <span>{content.primaryAction}</span>
          <span className={styles.actionSheen} data-cta-sheen aria-hidden="true" />
        </a>
        <a className={`${styles.action} ${styles.secondaryAction}`} href="#system">
          {content.secondaryAction}
        </a>
      </nav>

      <HeroLiveStatus content={content.liveStatus} />
    </div>
  );
}
