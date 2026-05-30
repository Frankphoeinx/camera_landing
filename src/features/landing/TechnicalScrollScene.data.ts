export type TechnicalStep = {
  body: string;
  eyebrow: string;
  metric: string;
  time: number;
  title: string;
};

export const TECHNICAL_VIDEO_END_TIME_SECONDS = 15.04;

export const technicalSteps: TechnicalStep[] = [
  {
    body: "Panel angle, wall bracket, and camera body are aligned before the estate handoff.",
    eyebrow: "SOLAR ARRAY",
    metric: "0.00s clip start",
    time: 0,
    title: "Panel angle and wall bracket",
  },
  {
    body: "Warm LEDs and IR emitters support color night mode without flooding the approach.",
    eyebrow: "DUAL ILLUMINATION",
    metric: "IR + warm LED",
    time: 4.34,
    title: "Balanced night lighting",
  },
  {
    body: "The PTZ lens head handles patrol routes, motion lock, and return-home positioning.",
    eyebrow: "PTZ OPTICS",
    metric: "355 deg patrol",
    time: 6.84,
    title: "Optical patrol module",
  },
  {
    body: "Sealed joints and the lower drive body stay exposed while protecting moving hardware.",
    eyebrow: "SEALED DRIVE BODY",
    metric: "IP66 exterior",
    time: 9.16,
    title: "Weather-sealed movement",
  },
  {
    body: "The rear wall mount keeps the cable route protected without trenching the perimeter.",
    eyebrow: "WALL-MOUNTED POWER ROUTE",
    metric: "15.04s clip end",
    time: TECHNICAL_VIDEO_END_TIME_SECONDS,
    title: "Protected cable path",
  },
];
