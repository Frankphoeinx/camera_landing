import { HeroLiveStatus } from "./HeroLiveStatus";
import styles from "./HeroScene.module.css";

export function HeroIntroInterface() {
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
          <span data-headline-line>without</span>
        </span>
        <span className={styles.headlineMask}>
          <span data-headline-line>wiring.</span>
        </span>
      </h1>

      <p className={styles.copy} data-hud-item>
        Solar outdoor surveillance for private estates: night-ready,
        weather-sealed, and positioned for complete perimeter confidence.
      </p>

      <nav className={styles.actions} aria-label="Hero actions" data-hud-item>
        <a className={`${styles.action} ${styles.primaryAction}`} href="#installation">
          <span>Book installation</span>
          <span className={styles.actionSheen} data-cta-sheen aria-hidden="true" />
        </a>
        <a className={`${styles.action} ${styles.secondaryAction}`} href="#system">
          Explore system
        </a>
      </nav>

      <HeroLiveStatus />
    </div>
  );
}
