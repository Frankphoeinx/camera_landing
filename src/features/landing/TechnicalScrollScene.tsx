import Image from "next/image";

import { TechnicalScrollController } from "./TechnicalScrollController";
import {
  outdoorCameraModels,
  technicalSteps,
} from "./TechnicalScrollScene.data";
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
      data-active-model="1"
      data-active-model-step="1"
      data-technical-mode="steps"
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
        <div className={styles.cameraModelMediaStack} data-camera-model-media>
          {outdoorCameraModels.map((model, index) => (
            <Image
              className={styles.cameraModelMedia}
              src={model.imageSrc}
              alt=""
              fill
              loading="eager"
              sizes="100vw"
              unoptimized
              data-active="false"
              data-camera-model-image
              data-camera-model-image-index={index}
              key={model.code}
            />
          ))}
        </div>
        <div className={styles.technicalScrim} />
      </div>

      <div className={styles.technicalShell}>
        <div className={styles.technicalStepperGroup} data-technical-stepper>
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

        <div
          className={styles.cameraModelInterface}
          aria-hidden="true"
          aria-label="Outdoor camera model details"
          aria-live="polite"
          data-camera-model-interface
        >
          {outdoorCameraModels.map((model, modelIndex) => (
            <div
              className={styles.cameraModelWalkthrough}
              data-active={modelIndex === 0}
              data-camera-model-group
              aria-hidden={modelIndex !== 0}
              key={model.code}
            >
              <h2 className={styles.cameraModelSectionLabel}>
                {model.name} / {model.fit}
              </h2>
              <div
                className={styles.cameraModelTimeline}
                aria-label={`${model.name} technical steps`}
              >
                <div className={styles.cameraModelCounter}>
                  <span data-camera-model-step-current>01</span>
                  <strong>/</strong>
                  <span data-camera-model-step-total>
                    {String(model.steps.length).padStart(2, "0")}
                  </span>
                </div>
                <div className={styles.cameraModelProgressTrack}>
                  <span
                    className={styles.cameraModelProgressFill}
                    data-camera-model-progress-fill
                  />
                </div>
                <ol className={styles.cameraModelList}>
                  {model.steps.map((step, stepIndex) => (
                    <li
                      data-active={stepIndex === 0}
                      data-complete="false"
                      data-camera-model-step-indicator
                      key={`${model.code}-${step.eyebrow}`}
                    >
                      <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                      <strong>{step.eyebrow}</strong>
                      <small>{step.metric}</small>
                      <p>{step.body}</p>
                      <dl className={styles.cameraModelStepFacts}>
                        {step.facts.map((fact) => (
                          <div
                            key={`${model.code}-${step.eyebrow}-${fact.label}`}
                          >
                            <dt>{fact.label}</dt>
                            <dd>{fact.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TechnicalScrollController />
    </section>
  );
}
