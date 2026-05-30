import Image from "next/image";

import { TechnicalScrollController } from "./TechnicalScrollController";
import { technicalSteps } from "./TechnicalScrollScene.data";
import styles from "./LandingSections.module.css";

type TechnicalScrollSceneProps = {
  mp4Src: string;
  poster: string;
  reverseMp4Src: string;
  reverseWebmSrc: string;
  webmSrc: string;
};

export function TechnicalScrollScene({
  mp4Src,
  poster,
  reverseMp4Src,
  reverseWebmSrc,
  webmSrc,
}: TechnicalScrollSceneProps) {
  return (
    <section
      className={styles.technicalSection}
      id="system"
      aria-label="Technical walkthrough"
      data-active-step="1"
      data-technical-scene
    >
      <div className={styles.technicalMedia} aria-hidden="true">
        <Image
          className={styles.technicalPoster}
          src={poster}
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          unoptimized
          data-technical-poster
        />
        <video
          className={styles.technicalVideo}
          muted
          playsInline
          preload="metadata"
          data-technical-video
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
        <video
          className={`${styles.technicalVideo} ${styles.technicalReverseVideo}`}
          muted
          playsInline
          preload="none"
          data-technical-video-reverse
        >
          <source src={reverseWebmSrc} type="video/webm" />
          <source src={reverseMp4Src} type="video/mp4" />
        </video>
        <div className={styles.technicalScrim} />
      </div>

      <div className={styles.technicalShell}>
        <h2 className={styles.technicalSectionLabel}>
          SOLAR SENTINEL / VILLA PERIMETER
        </h2>
        <div
          className={styles.technicalTimeline}
          aria-label="Technical walkthrough steps"
        >
          <div className={styles.technicalCounter}>
            <span data-technical-current>01</span>
            <strong>/</strong>
            <span data-technical-total>
              {String(technicalSteps.length).padStart(2, "0")}
            </span>
          </div>
          <div className={styles.technicalProgressTrack}>
            <span
              className={styles.technicalProgressFill}
              data-technical-progress-fill
            />
          </div>
          <ol className={styles.technicalStepList}>
            {technicalSteps.map((step, index) => (
              <li
                data-active={index === 0}
                data-complete="false"
                data-technical-indicator
                key={step.eyebrow}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.eyebrow}</strong>
                <small>{step.metric}</small>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <TechnicalScrollController />
    </section>
  );
}
