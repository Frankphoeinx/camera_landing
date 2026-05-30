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
      aria-labelledby="technical-title"
      data-active-step="1"
      data-technical-scene
    >
      <div className={styles.technicalMedia} aria-hidden="true">
        <video
          className={styles.technicalVideo}
          poster={poster}
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
        <div className={styles.technicalHeader}>
          <p className={styles.sectionEyebrow}>TECHNICAL WALKTHROUGH</p>
          <h2 className={styles.technicalTitle} id="technical-title">
            Scroll through the hardware stack.
          </h2>
          <p className={styles.technicalCopy}>
            Each stop locks to a clear frame, pairing the visible component with
            the install detail that matters on site.
          </p>
        </div>

        <div className={styles.technicalPanelStack}>
          {technicalSteps.map((step, index) => (
            <article
              className={styles.technicalPanel}
              data-active={index === 0}
              data-technical-panel
              aria-hidden={index !== 0}
              key={step.eyebrow}
            >
              <span className={styles.technicalPanelEyebrow}>
                {step.eyebrow}
              </span>
              <strong className={styles.technicalPanelTitle}>
                {step.title}
              </strong>
              <p>{step.body}</p>
              <span className={styles.technicalPanelMetric}>
                {step.metric}
              </span>
            </article>
          ))}
        </div>

        <div className={styles.technicalTimeline} aria-hidden="true">
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
              </li>
            ))}
          </ol>
        </div>
      </div>

      <TechnicalScrollController />
    </section>
  );
}
