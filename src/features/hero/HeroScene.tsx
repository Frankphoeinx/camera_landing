import { HeroCapabilityInterface } from "./HeroCapabilityInterface";
import { HeroFinalInterface } from "./HeroFinalInterface";
import { HeroIntroInterface } from "./HeroIntroInterface";
import { HeroOperationsInterface } from "./HeroOperationsInterface";
import { HeroSceneController } from "./HeroSceneController";
import styles from "./HeroScene.module.css";

type HeroSceneProps = {
  src: string;
  srcWebm?: string;
  reverseSrc: string;
  reverseSrcWebm?: string;
  reverseToCapabilitySrc: string;
  reverseToCapabilitySrcWebm?: string;
  reverseToOperationsSrc: string;
  reverseToOperationsSrcWebm?: string;
  poster?: string;
  label?: string;
};

export function HeroScene({
  src,
  srcWebm,
  reverseSrc,
  reverseSrcWebm,
  reverseToCapabilitySrc,
  reverseToCapabilitySrcWebm,
  reverseToOperationsSrc,
  reverseToOperationsSrcWebm,
  poster,
  label = "Solar outdoor security camera hero",
}: HeroSceneProps) {
  return (
    <section
      className={styles.section}
      aria-label={label}
      data-hero-scene
      data-scroll-cue-mode="down"
    >
      <div className={styles.visualLayer} aria-hidden="true">
        <div className={styles.visualFrame} data-hero-visual-frame>
          <video
            className={styles.video}
            src={src}
            poster={poster}
            muted
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            data-hero-video
          >
            {srcWebm ? <source src={srcWebm} type="video/webm" /> : null}
            <source src={src} type="video/mp4" />
          </video>
          <video
            className={`${styles.video} ${styles.reverseVideo}`}
            muted
            playsInline
            preload="none"
            crossOrigin="anonymous"
            data-hero-video-reverse
          >
            {reverseSrcWebm ? (
              <source src={reverseSrcWebm} type="video/webm" />
            ) : null}
            <source src={reverseSrc} type="video/mp4" />
          </video>
          <video
            className={`${styles.video} ${styles.reverseVideo}`}
            muted
            playsInline
            preload="none"
            crossOrigin="anonymous"
            data-hero-video-reverse-operations
          >
            {reverseToCapabilitySrcWebm ? (
              <source
                src={reverseToCapabilitySrcWebm}
                type="video/webm"
              />
            ) : null}
            <source src={reverseToCapabilitySrc} type="video/mp4" />
          </video>
          <video
            className={`${styles.video} ${styles.reverseVideo}`}
            muted
            playsInline
            preload="none"
            crossOrigin="anonymous"
            data-hero-video-reverse-final
          >
            {reverseToOperationsSrcWebm ? (
              <source
                src={reverseToOperationsSrcWebm}
                type="video/webm"
              />
            ) : null}
            <source src={reverseToOperationsSrc} type="video/mp4" />
          </video>
        </div>
        <div className={styles.cinematicScrim} data-hero-cinematic-scrim />
      </div>

      <div className={styles.contentShell}>
        <HeroIntroInterface />
        <HeroCapabilityInterface />
        <HeroOperationsInterface />
        <HeroFinalInterface />
      </div>

      <div
        className={styles.scrollCue}
        aria-label="Scroll down to continue"
        data-scroll-cue
      >
        <span className={styles.scrollCueGlyph} aria-hidden="true">
          <span className={styles.scrollCueArrow} />
        </span>
        <span className={styles.scrollCueText}>
          <span>Scroll</span>
          <strong data-scroll-cue-direction>Down</strong>
        </span>
      </div>

      <HeroSceneController
        reverseSrc={reverseSrc}
        reverseToCapabilitySrc={reverseToCapabilitySrc}
        reverseToOperationsSrc={reverseToOperationsSrc}
      />
    </section>
  );
}
