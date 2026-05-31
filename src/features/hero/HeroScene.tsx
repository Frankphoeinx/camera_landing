import { HeroCapabilityInterface } from "./HeroCapabilityInterface";
import { HeroFinalInterface } from "./HeroFinalInterface";
import { HeroIntroInterface } from "./HeroIntroInterface";
import { HeroOperationsInterface } from "./HeroOperationsInterface";
import { HeroSceneController } from "./HeroSceneController";
import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./HeroScene.module.css";

type HeroSceneProps = {
  content: Dictionary["hero"];
  onOrderOpen?: () => void;
  src: string;
  srcWebm?: string;
  reverseSrc: string;
  reverseSrcWebm?: string;
  reverseToCapabilitySrc: string;
  reverseToCapabilitySrcWebm?: string;
  reverseToOperationsSrc: string;
  reverseToOperationsSrcWebm?: string;
  poster?: string;
};

export function HeroScene({
  content,
  onOrderOpen,
  src,
  srcWebm,
  reverseSrc,
  reverseSrcWebm,
  reverseToCapabilitySrc,
  reverseToCapabilitySrcWebm,
  reverseToOperationsSrc,
  reverseToOperationsSrcWebm,
  poster,
}: HeroSceneProps) {
  return (
    <section
      className={styles.section}
      aria-label={content.label}
      data-hero-scene
      data-scroll-cue-down-aria-label={content.scrollCue.ariaLabel}
      data-scroll-cue-down-direction={content.scrollCue.direction}
      data-scroll-cue-mode="down"
      data-scroll-cue-up-aria-label={content.scrollCue.upAriaLabel}
      data-scroll-cue-up-direction={content.scrollCue.upDirection}
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
        <HeroIntroInterface content={content.intro} onOrderOpen={onOrderOpen} />
        <HeroCapabilityInterface content={content.capability} />
        <HeroOperationsInterface content={content.operations} />
        <HeroFinalInterface content={content.final} onOrderOpen={onOrderOpen} />
      </div>

      <div
        className={styles.scrollCue}
        aria-label={content.scrollCue.ariaLabel}
        data-scroll-cue
      >
        <span className={styles.scrollCueGlyph} aria-hidden="true">
          <span className={styles.scrollCueArrow} />
        </span>
        <span className={styles.scrollCueText}>
          <span>{content.scrollCue.label}</span>
          <strong data-scroll-cue-direction>{content.scrollCue.direction}</strong>
        </span>
      </div>

      <HeroSceneController />
    </section>
  );
}
