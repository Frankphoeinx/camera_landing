export type TechnicalStep = {
  body: string;
  eyebrow: string;
  metric: string;
  time: number;
  title: string;
};

export type OutdoorCameraModel = {
  code: string;
  fit: string;
  imageSrc: string;
  name: string;
  steps: {
    body: string;
    eyebrow: string;
    facts: {
      label: string;
      value: string;
    }[];
    metric: string;
  }[];
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

export const outdoorCameraModels: OutdoorCameraModel[] = [
  {
    code: "SS-PTZ",
    fit: "Villa perimeter / wall mount",
    imageSrc: "/media/images/outdoor-model-ss-ptz-last-frame.png",
    name: "Solar Sentinel PTZ",
    steps: [
      {
        body: "A solar-assisted PTZ body keeps the wall patrol point powered without trenching across the estate perimeter.",
        eyebrow: "POWER ROUTE",
        facts: [
          { label: "Power", value: "Solar + backup" },
          { label: "Run", value: "No trench line" },
          { label: "Mount", value: "Rear wall bracket" },
          { label: "Use", value: "Perimeter wall" },
        ],
        metric: "Solar + backup",
      },
      {
        body: "The lower PTZ head and side optics cover a wide patrol arc while keeping recognition detail centered.",
        eyebrow: "OPTICAL COVERAGE",
        facts: [
          { label: "Motion", value: "355 deg PTZ" },
          { label: "View", value: "Wide patrol arc" },
          { label: "Target", value: "Wall approach" },
          { label: "Return", value: "Home position" },
        ],
        metric: "355 deg patrol",
      },
      {
        body: "Warm LEDs and IR emitters support night color detail without washing the garden or driveway with harsh spill.",
        eyebrow: "NIGHT DETAIL",
        facts: [
          { label: "Light", value: "IR + warm LED" },
          { label: "Mode", value: "Color night" },
          { label: "Spill", value: "Low glare" },
          { label: "Range", value: "Entry approach" },
        ],
        metric: "IR + warm LED",
      },
      {
        body: "Sealed joints, protected cable entry, and the exposed lower drive body keep the patrol unit serviceable outdoors.",
        eyebrow: "INSTALL PROFILE",
        facts: [
          { label: "Ingress", value: "IP66 exterior" },
          { label: "Cable", value: "Hidden wall route" },
          { label: "Body", value: "Sealed drive" },
          { label: "Service", value: "Wall access" },
        ],
        metric: "IP66 exterior",
      },
    ],
  },
  {
    code: "4G-TRI",
    fit: "Remote wall / SIM fallback",
    imageSrc: "/media/images/outdoor-model-4g-triview.3c7a57ef.png",
    name: "4G Tri-View Sentinel",
    steps: [
      {
        body: "The wall-mounted solar panel keeps a remote perimeter point online where wired power would be visible or costly.",
        eyebrow: "REMOTE POWER",
        facts: [
          { label: "Power", value: "Solar + battery" },
          { label: "Route", value: "Wall-contained" },
          { label: "Use", value: "Remote gate line" },
          { label: "Fallback", value: "Independent point" },
        ],
        metric: "Self-powered wall point",
      },
      {
        body: "Three forward optics hold overview, mid-range detail, and recognition framing in one visible housing.",
        eyebrow: "TRI-VIEW OPTICS",
        facts: [
          { label: "View", value: "Triple lens" },
          { label: "Context", value: "Wide overview" },
          { label: "Detail", value: "Mid-range face" },
          { label: "PTZ", value: "Lower pod" },
        ],
        metric: "Wide + detail + PTZ",
      },
      {
        body: "A cellular path keeps the camera reachable when the gate, garden wall, or service run sits beyond wired network reach.",
        eyebrow: "4G BACKUP",
        facts: [
          { label: "Network", value: "4G + Wi-Fi" },
          { label: "Fallback", value: "SIM route" },
          { label: "Alert", value: "Remote event" },
          { label: "Install", value: "No data conduit" },
        ],
        metric: "SIM fallback",
      },
      {
        body: "The sealed side mount protects battery storage, cable entry, and electronics against rain on exposed boundary walls.",
        eyebrow: "SEALED MOUNT",
        facts: [
          { label: "Ingress", value: "IP66 exterior" },
          { label: "Storage", value: "Side battery box" },
          { label: "Body", value: "Rain-shed shell" },
          { label: "Service", value: "Wall-side access" },
        ],
        metric: "IP66 exterior",
      },
    ],
  },
  {
    code: "BR-PTZ",
    fit: "Courtyard / side wall",
    imageSrc: "/media/images/outdoor-model-bronze-ptz.20cf7991.png",
    name: "Bronze Solar PTZ",
    steps: [
      {
        body: "The bronze upper shell picks up warm landscape light so the camera reads as part of stucco, stone, or timber facades.",
        eyebrow: "FACADE FIT",
        facts: [
          { label: "Finish", value: "Warm bronze" },
          { label: "Profile", value: "Compact vertical" },
          { label: "Use", value: "Courtyard wall" },
          { label: "Blend", value: "Warm exterior" },
        ],
        metric: "Warm facade match",
      },
      {
        body: "The elevated solar plane feeds the patrol head while leaving the bracket compact and visually tidy on the wall.",
        eyebrow: "SOLAR CANOPY",
        facts: [
          { label: "Power", value: "Solar-fed PTZ" },
          { label: "Panel", value: "Raised plane" },
          { label: "Bracket", value: "Wall compact" },
          { label: "Cable", value: "Hidden rear" },
        ],
        metric: "Wall-fed power",
      },
      {
        body: "The upper lens cluster watches the approach while the lower PTZ lens follows movement through the courtyard.",
        eyebrow: "STACKED OPTICS",
        facts: [
          { label: "Optics", value: "Fixed + PTZ" },
          { label: "Track", value: "Lower patrol" },
          { label: "Context", value: "Upper lens" },
          { label: "Zone", value: "Side entry" },
        ],
        metric: "Fixed + PTZ detail",
      },
      {
        body: "Warm LED points and a sealed vertical body keep night recognition useful without flooding the residence facade.",
        eyebrow: "NIGHT BUILD",
        facts: [
          { label: "Light", value: "Warm LED" },
          { label: "Ingress", value: "Outdoor shell" },
          { label: "Service", value: "Vertical access" },
          { label: "Glare", value: "Low spill" },
        ],
        metric: "Outdoor serviceable",
      },
    ],
  },
  {
    code: "SD-PTZ",
    fit: "Gate / active deterrence",
    imageSrc: "/media/images/outdoor-model-strobe-ptz.a544f652.png",
    name: "Strobe Deterrent PTZ",
    steps: [
      {
        body: "The red-blue alert face makes the camera visibly active before a vehicle or person reaches the wall line.",
        eyebrow: "VISIBLE DETERRENCE",
        facts: [
          { label: "Alert", value: "Red / blue" },
          { label: "Role", value: "Gate warning" },
          { label: "Trigger", value: "Motion event" },
          { label: "Signal", value: "Visible active" },
        ],
        metric: "Red / blue alert",
      },
      {
        body: "The raised solar bracket powers warning lights and patrol movement from one wall-mounted position.",
        eyebrow: "SOLAR ALERT POWER",
        facts: [
          { label: "Power", value: "Solar alert" },
          { label: "Route", value: "No trench" },
          { label: "Mount", value: "Raised bracket" },
          { label: "Load", value: "Light + PTZ" },
        ],
        metric: "No trench route",
      },
      {
        body: "The lower PTZ head tracks movement while the alert panel keeps the deterrent signal aimed at the approach.",
        eyebrow: "PTZ TRACKING",
        facts: [
          { label: "Track", value: "Motion lock" },
          { label: "Lens", value: "Lower PTZ" },
          { label: "Coverage", value: "Gate approach" },
          { label: "Context", value: "Alert panel" },
        ],
        metric: "Motion lock",
      },
      {
        body: "White recognition LEDs and the sealed stacked body keep deterrence, identification, and weather protection in one unit.",
        eyebrow: "RECOGNITION BODY",
        facts: [
          { label: "Light", value: "White LED row" },
          { label: "Ingress", value: "Rain-ready" },
          { label: "Body", value: "Stacked shell" },
          { label: "Use", value: "Active gate" },
        ],
        metric: "Rain-ready install",
      },
    ],
  },
  {
    code: "TP-POD",
    fit: "Wide facade / corner mount",
    imageSrc: "/media/images/outdoor-model-twin-pod.7f30c2ad.png",
    name: "Twin-Pod Patrol",
    steps: [
      {
        body: "Two side pods watch the left and right approach lines while the central head handles recognition detail.",
        eyebrow: "TWIN SIDE PODS",
        facts: [
          { label: "Coverage", value: "Left + right" },
          { label: "Lens", value: "Side pods" },
          { label: "Detail", value: "Central head" },
          { label: "Use", value: "Wide facade" },
        ],
        metric: "Left + right coverage",
      },
      {
        body: "The white central housing reduces visual mass on lighter architecture while black optics stay clearly defined.",
        eyebrow: "TWO-TONE BODY",
        facts: [
          { label: "Body", value: "White + black" },
          { label: "Profile", value: "Architectural" },
          { label: "Blend", value: "Light facade" },
          { label: "Lens", value: "Dark optics" },
        ],
        metric: "Facade friendly",
      },
      {
        body: "The raised solar frame gives the larger body clean clearance from the wall and keeps the panel angle usable.",
        eyebrow: "RAISED SOLAR FRAME",
        facts: [
          { label: "Panel", value: "Raised frame" },
          { label: "Power", value: "Solar-fed" },
          { label: "Mount", value: "Offset wall" },
          { label: "Clearance", value: "Large body" },
        ],
        metric: "Offset wall mount",
      },
      {
        body: "Dedicated pod LEDs and the lower patrol module keep side paths, entries, and patio edges visible at night.",
        eyebrow: "ENTRY DETAIL",
        facts: [
          { label: "Light", value: "Dual LED pods" },
          { label: "Patrol", value: "Lower module" },
          { label: "Zone", value: "Patio edges" },
          { label: "Blind spot", value: "Corner-ready" },
        ],
        metric: "Corner-ready detail",
      },
    ],
  },
  {
    code: "ML-WALL",
    fit: "Estate wall / blind spots",
    imageSrc: "/media/images/outdoor-model-multilens-wall.9bd57cc4.png",
    name: "Multi-Lens Wall Guard",
    steps: [
      {
        body: "Three lens zones overlap to reduce blind spots along long walls, garden edges, and driveway returns.",
        eyebrow: "MULTI-LENS ARRAY",
        facts: [
          { label: "View", value: "Three zones" },
          { label: "Coverage", value: "Long wall" },
          { label: "Overlap", value: "Blind spot cut" },
          { label: "Use", value: "Estate edge" },
        ],
        metric: "Three view zones",
      },
      {
        body: "A central light block gives close-range recognition while side turrets keep wider context available.",
        eyebrow: "CENTRAL LIGHT BLOCK",
        facts: [
          { label: "Light", value: "Warm LED" },
          { label: "Detail", value: "Close range" },
          { label: "Context", value: "Side turrets" },
          { label: "Target", value: "Drive return" },
        ],
        metric: "Warm LED detail",
      },
      {
        body: "The side turrets add angled coverage without adding separate devices across the same exterior wall.",
        eyebrow: "SIDE TURRETS",
        facts: [
          { label: "Angles", value: "Left + right" },
          { label: "Install", value: "One device" },
          { label: "Body", value: "Wide tray" },
          { label: "Route", value: "Single mount" },
        ],
        metric: "Angled patrol",
      },
      {
        body: "The broad solar bracket and sealed upper tray support the larger optics package from one protected wall point.",
        eyebrow: "SOLAR WALL BODY",
        facts: [
          { label: "Power", value: "High-cap solar" },
          { label: "Ingress", value: "Sealed tray" },
          { label: "Mount", value: "One wall point" },
          { label: "Service", value: "Front modules" },
        ],
        metric: "Estate exterior",
      },
    ],
  },
];
