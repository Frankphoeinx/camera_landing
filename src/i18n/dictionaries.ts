import type { Locale } from "./config";

const en = {
  metadata: {
    title: "Camera Landing",
    description: "Premium landing foundation for solar outdoor security cameras.",
  },
  mainAriaLabel: "Camera landing",
  hero: {
    label: "Solar outdoor security camera hero",
    languageSwitcherAriaLabel: "Select language",
    scrollCue: {
      ariaLabel: "Scroll down to continue",
      label: "Scroll",
      direction: "Down",
      upAriaLabel: "Scroll up to review",
      upDirection: "Up",
    },
    intro: {
      eyebrow: "SOLAR SENTINEL / VILLA PERIMETER",
      onlineBadge: "Online",
      headlineLines: ["Perimeter", "awareness", "without", "wiring."],
      copy: "Solar outdoor surveillance for private estates: night-ready, weather-sealed, and positioned for complete perimeter confidence.",
      actionsLabel: "Hero actions",
      primaryAction: "Book installation",
      secondaryAction: "Explore system",
      liveStatus: {
        header: "Live security state",
        statusAriaLabel: "Live system status",
        telemetryAriaLabel: "Compact telemetry",
        statuses: [
          {
            label: "Perimeter",
            values: ["Armed", "Guard", "Armed", "Clear"],
            slideByCharacter: false,
          },
          {
            label: "Solar charge",
            values: ["96%", "97%", "96%", "96%"],
            slideByCharacter: true,
          },
          {
            label: "Night vision",
            values: ["Active", "IR on", "Active", "Clear"],
            slideByCharacter: false,
          },
          {
            label: "PTZ sweep",
            values: ["Ready", "S-12", "S-27", "Home"],
            slideByCharacter: false,
          },
        ],
        telemetry: [
          {
            id: "gate",
            values: ["West gate", "Gate scan 02", "West gate"],
          },
          {
            id: "motion",
            values: ["Motion clear", "Scan clear", "Path clear"],
          },
          {
            id: "seal",
            values: ["IP66 sealed", "Rain ok", "IP66 sealed"],
          },
          {
            id: "preview",
            values: ["24 fps live", "25 fps live", "24 fps live"],
          },
        ],
      },
    },
    capability: {
      ariaLabel: "Camera capability overview",
      panels: [
        {
          id: "ai",
          eyebrow: "AI PERIMETER",
          title: "Human and vehicle recognition",
          copy: "Filters animals, rain, branches, and passing shadows before an alert reaches the estate.",
          metric: "98% scene confidence",
        },
        {
          id: "night",
          eyebrow: "NIGHT WATCH",
          title: "IR flood and color low-light",
          copy: "Dual illuminators keep the driveway, gate, and garden edges visible without police-style glare.",
          metric: "40 m night coverage",
        },
        {
          id: "ptz",
          eyebrow: "PTZ COVERAGE",
          title: "Auto patrol with manual override",
          copy: "The lens sweeps blind spots, locks on motion, and returns to the guard route automatically.",
          metric: "355 deg pan / 90 deg tilt",
        },
      ],
    },
    operations: {
      ariaLabel: "Camera operations overview",
      meterLabel: "Signal confidence",
      panels: [
        {
          id: "patrol",
          eyebrow: "AUTO PATROL",
          title: "Preset routes across blind zones",
          copy: "Cycles gate, driveway, garden edge, and terrace views without waiting for manual control.",
          metric: "12 patrol points",
          confidence: "94%",
          stats: [
            { label: "Route", value: "A-04" },
            { label: "Sweep", value: "355 deg" },
            { label: "Return", value: "8 sec" },
          ],
          tags: ["Solar hold", "Edge scan", "Auto home"],
        },
        {
          id: "alerts",
          eyebrow: "SMART ALERTS",
          title: "Zone-based event escalation",
          copy: "Separates driveway approach, perimeter crossing, and loitering before sending a priority alert.",
          metric: "3 alert tiers",
          confidence: "91%",
          stats: [
            { label: "Zones", value: "06" },
            { label: "Filter", value: "AI" },
            { label: "Delay", value: "0.4s" },
          ],
          tags: ["Human", "Vehicle", "Loiter"],
        },
        {
          id: "archive",
          eyebrow: "EVENT MEMORY",
          title: "Encrypted local and cloud history",
          copy: "Stores verified clips with timestamp, zone, subject type, and patrol state for fast review.",
          metric: "30 day archive",
          confidence: "100%",
          stats: [
            { label: "Clips", value: "128" },
            { label: "Sync", value: "Live" },
            { label: "Mode", value: "Dual" },
          ],
          tags: ["Local SD", "Cloud copy", "Timecode"],
        },
      ],
    },
    final: {
      ariaLabel: "Estate command overview",
      eyebrow: "SOLAR SENTINEL / ESTATE COMMAND",
      badge: "Protected",
      copy: "Coverage, solar reserve, and alert handoff are verified for a premium outdoor install.",
      primaryAction: "Book installation",
      secondaryAction: "View coverage plan",
      sections: [
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
      ],
      statusItems: ["AI event filter", "No wiring required", "Survey ready"],
      headlinePhrases: [
        ["Estate", "command", "ready."],
        ["Coverage", "plan", "verified."],
        ["Alert", "handoff", "secured."],
        ["Install", "survey", "ready."],
      ],
    },
  },
  installation: {
    eyebrow: "INSTALLATION INTELLIGENCE",
    title: "Plan the sightlines before the first drill mark.",
    copy: "The install plan turns wall position, solar access, lens reach, and response ownership into one field-ready setup.",
    checklistAriaLabel: "Site readiness brief",
    checklistHeader: "SITE READINESS BRIEF",
    checklistStatus: "FIELD LOCK",
    metrics: [
      { label: "Zones", value: "4 active zones" },
      { label: "Power", value: "72h reserve" },
      { label: "Memory", value: "30 day event trail" },
      { label: "Seal", value: "IP66 shell" },
    ],
    phases: [
      {
        body: "The installer checks wall strength, service reach, and tamper height before drilling.",
        eyebrow: "01 / MOUNT LINE",
        title: "Anchor point is chosen on site",
      },
      {
        body: "Panel exposure is checked against shade movement, roof spill, and approach glare.",
        eyebrow: "02 / LIGHT PATH",
        title: "Solar and night lighting are balanced",
      },
      {
        body: "The final pass confirms framing, push routing, and the owner handoff.",
        eyebrow: "03 / LIVE TEST",
        title: "Patrol and alerts are tested together",
      },
    ],
    signals: [
      { label: "Mount side", value: "Shade-aware" },
      { label: "Cable route", value: "Wall-protected" },
      { label: "Service access", value: "Reachable" },
    ],
    checklist: [
      {
        detail: "Gate approach, driveway turn, garden edge, and blind spots are reviewed from the wall position.",
        label: "Site survey",
        value: "Sightlines verified",
      },
      {
        detail: "The bracket angle is checked against shade movement, roof spill, and night lighting.",
        label: "Solar placement",
        value: "Panel arc cleared",
      },
      {
        detail: "Motion, light trigger, and after-hours alert paths each get a named receiver.",
        label: "Response routing",
        value: "Escalation owner set",
      },
    ],
  },
  technical: {
    ariaLabel: "Technical walkthrough",
    sectionLabel: "SOLAR SENTINEL / VILLA PERIMETER",
    timelineAriaLabel: "Technical walkthrough steps",
    modelsAriaLabel: "Outdoor camera model details",
    modelStepsLabel: "technical steps",
    steps: [
      {
        body: "Panel angle, wall bracket, and camera body are aligned before the estate handoff.",
        eyebrow: "SOLAR ARRAY",
        metric: "0.00s clip start",
        title: "Panel angle and wall bracket",
      },
      {
        body: "Warm LEDs and IR emitters support color night mode without flooding the approach.",
        eyebrow: "DUAL ILLUMINATION",
        metric: "IR + warm LED",
        title: "Balanced night lighting",
      },
      {
        body: "The PTZ lens head handles patrol routes, motion lock, and return-home positioning.",
        eyebrow: "PTZ OPTICS",
        metric: "355 deg patrol",
        title: "Optical patrol module",
      },
      {
        body: "Sealed joints and the lower drive body stay exposed while protecting moving hardware.",
        eyebrow: "SEALED DRIVE BODY",
        metric: "IP66 exterior",
        title: "Weather-sealed movement",
      },
      {
        body: "The rear wall mount keeps the cable route protected without trenching the perimeter.",
        eyebrow: "WALL-MOUNTED POWER ROUTE",
        metric: "15.04s clip end",
        title: "Protected cable path",
      },
    ],
    models: [
      {
        fit: "Villa perimeter / wall mount",
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
        fit: "Remote wall / SIM fallback",
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
        fit: "Courtyard / side wall",
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
        fit: "Gate / active deterrence",
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
        fit: "Wide facade / corner mount",
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
        fit: "Estate wall / blind spots",
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
    ],
  },
};

export type Dictionary = typeof en;

const ru: Dictionary = {
  metadata: {
    title: "Camera Landing",
    description: "Премиальный лендинг для солнечных уличных камер безопасности.",
  },
  mainAriaLabel: "Лендинг камеры",
  hero: {
    label: "Главный экран солнечной уличной камеры безопасности",
    languageSwitcherAriaLabel: "Выбор языка",
    scrollCue: {
      ariaLabel: "Прокрутите вниз, чтобы продолжить",
      label: "Листайте",
      direction: "Вниз",
      upAriaLabel: "Прокрутите вверх, чтобы вернуться",
      upDirection: "Вверх",
    },
    intro: {
      eyebrow: "SOLAR SENTINEL / ПЕРИМЕТР ВИЛЛЫ",
      onlineBadge: "Онлайн",
      headlineLines: ["Контроль", "периметра", "без", "проводов."],
      copy: "Солнечное наружное видеонаблюдение для частных резиденций: ночная готовность, защита от погоды и уверенный обзор периметра.",
      actionsLabel: "Действия главного экрана",
      primaryAction: "Заказать установку",
      secondaryAction: "Изучить систему",
      liveStatus: {
        header: "Текущее состояние охраны",
        statusAriaLabel: "Текущий статус системы",
        telemetryAriaLabel: "Краткая телеметрия",
        statuses: [
          {
            label: "Периметр",
            values: ["Охрана", "Пост", "Охрана", "Чисто"],
            slideByCharacter: false,
          },
          {
            label: "Заряд",
            values: ["96%", "97%", "96%", "96%"],
            slideByCharacter: true,
          },
          {
            label: "Ночь",
            values: ["Активно", "IR вкл", "Активно", "Чисто"],
            slideByCharacter: false,
          },
          {
            label: "PTZ обзор",
            values: ["Готово", "S-12", "S-27", "Домой"],
            slideByCharacter: false,
          },
        ],
        telemetry: [
          {
            id: "gate",
            values: ["Западные ворота", "Скан 02", "Западные ворота"],
          },
          {
            id: "motion",
            values: ["Движения нет", "Скан чист", "Путь чист"],
          },
          {
            id: "seal",
            values: ["IP66 защита", "Дождь ок", "IP66 защита"],
          },
          {
            id: "preview",
            values: ["24 fps live", "25 fps live", "24 fps live"],
          },
        ],
      },
    },
    capability: {
      ariaLabel: "Обзор возможностей камеры",
      panels: [
        {
          id: "ai",
          eyebrow: "AI ПЕРИМЕТР",
          title: "Распознавание людей и авто",
          copy: "Отсекает животных, дождь, ветки и тени до отправки тревоги владельцу.",
          metric: "98% уверенность сцены",
        },
        {
          id: "night",
          eyebrow: "НОЧНОЙ ДОЗОР",
          title: "IR и цветной слабый свет",
          copy: "Двойная подсветка держит подъезд, ворота и сад видимыми без резкой засветки.",
          metric: "40 м ночного обзора",
        },
        {
          id: "ptz",
          eyebrow: "PTZ ПОКРЫТИЕ",
          title: "Автопатруль с ручным контролем",
          copy: "Объектив проходит слепые зоны, фиксирует движение и возвращается на маршрут.",
          metric: "355 deg пан / 90 deg наклон",
        },
      ],
    },
    operations: {
      ariaLabel: "Обзор операций камеры",
      meterLabel: "Уверенность сигнала",
      panels: [
        {
          id: "patrol",
          eyebrow: "АВТОПАТРУЛЬ",
          title: "Маршруты по слепым зонам",
          copy: "Проверяет ворота, подъезд, сад и террасу без ожидания ручного управления.",
          metric: "12 точек патруля",
          confidence: "94%",
          stats: [
            { label: "Маршрут", value: "A-04" },
            { label: "Обзор", value: "355 deg" },
            { label: "Возврат", value: "8 сек" },
          ],
          tags: ["Солнце", "Край", "Автодом"],
        },
        {
          id: "alerts",
          eyebrow: "УМНЫЕ ТРЕВОГИ",
          title: "Эскалация событий по зонам",
          copy: "Разделяет подъезд, пересечение периметра и ожидание до приоритетной тревоги.",
          metric: "3 уровня тревог",
          confidence: "91%",
          stats: [
            { label: "Зоны", value: "06" },
            { label: "Фильтр", value: "AI" },
            { label: "Задержка", value: "0.4s" },
          ],
          tags: ["Человек", "Авто", "Ожидание"],
        },
        {
          id: "archive",
          eyebrow: "ПАМЯТЬ СОБЫТИЙ",
          title: "Локальная и облачная история",
          copy: "Хранит проверенные клипы с временем, зоной, типом объекта и статусом патруля.",
          metric: "30 дней архива",
          confidence: "100%",
          stats: [
            { label: "Клипы", value: "128" },
            { label: "Синк", value: "Live" },
            { label: "Режим", value: "Dual" },
          ],
          tags: ["Local SD", "Cloud", "Таймкод"],
        },
      ],
    },
    final: {
      ariaLabel: "Обзор командного режима резиденции",
      eyebrow: "SOLAR SENTINEL / КОМАНДНЫЙ ЦЕНТР",
      badge: "Защищено",
      copy: "Покрытие, солнечный резерв и передача тревог проверены для премиальной наружной установки.",
      primaryAction: "Заказать установку",
      secondaryAction: "Посмотреть план",
      sections: [
        {
          eyebrow: "ПОКРЫТИЕ УЧАСТКА",
          title: "Охрана периметра виллы",
          detail: "Ворота, подъезд, сад и терраса под обзором.",
          facts: ["4 активные зоны", "25 fps live"],
          value: "360 deg",
        },
        {
          eyebrow: "АВТОНОМНАЯ ГОТОВНОСТЬ",
          title: "Солнечный резерв патруля",
          detail: "Ночная оптика и IP66 остаются онлайн.",
          facts: ["96% заряд", "IR + LED"],
          value: "72 ч",
        },
        {
          eyebrow: "ПРОТОКОЛ РЕАКЦИИ",
          title: "Передача тревоги готова",
          detail: "Оповещение владельца, охраны и синхронизация доказательств.",
          facts: ["30 дней архива", "Шифрованные клипы"],
          value: "Готово",
        },
      ],
      statusItems: ["AI фильтр событий", "Проводка не нужна", "Готово к осмотру"],
      headlinePhrases: [
        ["Командный", "центр", "готов."],
        ["План", "покрытия", "проверен."],
        ["Передача", "тревог", "защищена."],
        ["Осмотр", "для монтажа", "готов."],
      ],
    },
  },
  installation: {
    eyebrow: "ИНТЕЛЛЕКТ УСТАНОВКИ",
    title: "Спланируйте обзор до первой точки сверления.",
    copy: "План установки соединяет позицию на стене, доступ к солнцу, охват объектива и ответственность за реакцию в готовую схему.",
    checklistAriaLabel: "Сводка готовности площадки",
    checklistHeader: "ГОТОВНОСТЬ ПЛОЩАДКИ",
    checklistStatus: "FIELD LOCK",
    metrics: [
      { label: "Зоны", value: "4 активные зоны" },
      { label: "Питание", value: "72 ч резерва" },
      { label: "Память", value: "30 дней событий" },
      { label: "Защита", value: "IP66 корпус" },
    ],
    phases: [
      {
        body: "Монтажник проверяет прочность стены, доступ для обслуживания и высоту защиты до сверления.",
        eyebrow: "01 / ЛИНИЯ МОНТАЖА",
        title: "Точка крепления выбирается на месте",
      },
      {
        body: "Экспозиция панели сверяется с движением тени, краем крыши и бликами на подходе.",
        eyebrow: "02 / СВЕТОВОЙ ПУТЬ",
        title: "Солнце и ночная подсветка балансируются",
      },
      {
        body: "Финальный проход подтверждает кадрирование, маршруты push-уведомлений и передачу владельцу.",
        eyebrow: "03 / LIVE ТЕСТ",
        title: "Патруль и тревоги тестируются вместе",
      },
    ],
    signals: [
      { label: "Сторона", value: "С учетом тени" },
      { label: "Кабель", value: "Защищен стеной" },
      { label: "Сервис", value: "Доступен" },
    ],
    checklist: [
      {
        detail: "Подход к воротам, поворот на подъезд, край сада и слепые зоны проверяются с позиции на стене.",
        label: "Осмотр участка",
        value: "Линии обзора проверены",
      },
      {
        detail: "Угол кронштейна сверяется с движением тени, краем крыши и ночной подсветкой.",
        label: "Позиция панели",
        value: "Дуга панели свободна",
      },
      {
        detail: "Движение, световой триггер и ночные тревоги получают назначенного получателя.",
        label: "Маршрут реакции",
        value: "Ответственный назначен",
      },
    ],
  },
  technical: {
    ariaLabel: "Технический walkthrough",
    sectionLabel: "SOLAR SENTINEL / ПЕРИМЕТР ВИЛЛЫ",
    timelineAriaLabel: "Шаги технического walkthrough",
    modelsAriaLabel: "Детали моделей уличных камер",
    modelStepsLabel: "технические шаги",
    steps: [
      {
        body: "Угол панели, настенный кронштейн и корпус камеры выравниваются до передачи владельцу.",
        eyebrow: "СОЛНЕЧНАЯ ПАНЕЛЬ",
        metric: "0.00s старт клипа",
        title: "Угол панели и настенный кронштейн",
      },
      {
        body: "Теплые LED и IR-излучатели поддерживают цветной ночной режим без заливки подхода.",
        eyebrow: "ДВОЙНАЯ ПОДСВЕТКА",
        metric: "IR + warm LED",
        title: "Сбалансированный ночной свет",
      },
      {
        body: "PTZ-голова отвечает за маршруты патруля, фиксацию движения и возврат домой.",
        eyebrow: "PTZ ОПТИКА",
        metric: "355 deg патруль",
        title: "Оптический модуль патруля",
      },
      {
        body: "Герметичные стыки и нижний привод остаются открытыми для движения, защищая механику.",
        eyebrow: "ГЕРМЕТИЧНЫЙ ПРИВОД",
        metric: "IP66 наружный",
        title: "Движение с защитой от погоды",
      },
      {
        body: "Заднее настенное крепление защищает кабельный маршрут без траншей по периметру.",
        eyebrow: "НАСТЕННЫЙ МАРШРУТ ПИТАНИЯ",
        metric: "15.04s конец клипа",
        title: "Защищенный путь кабеля",
      },
    ],
    models: [
      {
        fit: "Периметр виллы / стена",
        name: "Solar Sentinel PTZ",
        steps: [
          {
            body: "PTZ-корпус с солнечной поддержкой питает точку патруля на стене без траншей по периметру.",
            eyebrow: "МАРШРУТ ПИТАНИЯ",
            facts: [
              { label: "Питание", value: "Солнце + резерв" },
              { label: "Трасса", value: "Без траншеи" },
              { label: "Монтаж", value: "Задний кронштейн" },
              { label: "Зона", value: "Стена периметра" },
            ],
            metric: "Солнце + резерв",
          },
          {
            body: "Нижняя PTZ-голова и боковая оптика покрывают широкую дугу, сохраняя детализацию цели.",
            eyebrow: "ОПТИЧЕСКОЕ ПОКРЫТИЕ",
            facts: [
              { label: "Движение", value: "355 deg PTZ" },
              { label: "Обзор", value: "Широкая дуга" },
              { label: "Цель", value: "Подход к стене" },
              { label: "Возврат", value: "Домашняя точка" },
            ],
            metric: "355 deg патруль",
          },
          {
            body: "Теплые LED и IR дают ночную цветную детализацию без жесткой засветки сада или подъезда.",
            eyebrow: "НОЧНАЯ ДЕТАЛЬ",
            facts: [
              { label: "Свет", value: "IR + warm LED" },
              { label: "Режим", value: "Цветная ночь" },
              { label: "Блик", value: "Мягкий" },
              { label: "Дальность", value: "Подход" },
            ],
            metric: "IR + warm LED",
          },
          {
            body: "Герметичные стыки, защищенный ввод кабеля и открытый нижний привод упрощают обслуживание снаружи.",
            eyebrow: "ПРОФИЛЬ МОНТАЖА",
            facts: [
              { label: "Защита", value: "IP66 наружный" },
              { label: "Кабель", value: "Скрыт в стене" },
              { label: "Корпус", value: "Герметичный привод" },
              { label: "Сервис", value: "Доступ со стены" },
            ],
            metric: "IP66 наружный",
          },
        ],
      },
      {
        fit: "Удаленная стена / SIM-резерв",
        name: "4G Tri-View Sentinel",
        steps: [
          {
            body: "Настенная солнечная панель держит удаленную точку периметра онлайн там, где проводка видна или дорога.",
            eyebrow: "УДАЛЕННОЕ ПИТАНИЕ",
            facts: [
              { label: "Питание", value: "Солнце + батарея" },
              { label: "Маршрут", value: "Внутри стены" },
              { label: "Зона", value: "Удаленные ворота" },
              { label: "Резерв", value: "Независимая точка" },
            ],
            metric: "Автономная точка",
          },
          {
            body: "Три передние линзы держат общий план, среднюю детализацию и распознавание в одном корпусе.",
            eyebrow: "TRI-VIEW ОПТИКА",
            facts: [
              { label: "Обзор", value: "Три линзы" },
              { label: "Контекст", value: "Широкий план" },
              { label: "Деталь", value: "Средняя дистанция" },
              { label: "PTZ", value: "Нижний модуль" },
            ],
            metric: "Широко + детально",
          },
          {
            body: "Сотовый канал сохраняет доступность камеры за пределами проводной сети у ворот или садовой стены.",
            eyebrow: "4G РЕЗЕРВ",
            facts: [
              { label: "Сеть", value: "4G + Wi-Fi" },
              { label: "Резерв", value: "SIM маршрут" },
              { label: "Тревога", value: "Удаленное событие" },
              { label: "Монтаж", value: "Без data conduit" },
            ],
            metric: "SIM резерв",
          },
          {
            body: "Герметичное боковое крепление защищает батарею, ввод кабеля и электронику от дождя.",
            eyebrow: "ГЕРМЕТИЧНЫЙ МОНТАЖ",
            facts: [
              { label: "Защита", value: "IP66 наружный" },
              { label: "Хранение", value: "Боковой батарейный бокс" },
              { label: "Корпус", value: "Дождевой кожух" },
              { label: "Сервис", value: "Доступ сбоку" },
            ],
            metric: "IP66 наружный",
          },
        ],
      },
      {
        fit: "Двор / боковая стена",
        name: "Bronze Solar PTZ",
        steps: [
          {
            body: "Бронзовая верхняя оболочка подхватывает теплый свет ландшафта и лучше вписывается в фасад.",
            eyebrow: "ВПИСАНИЕ В ФАСАД",
            facts: [
              { label: "Отделка", value: "Теплая бронза" },
              { label: "Профиль", value: "Компактный" },
              { label: "Зона", value: "Стена двора" },
              { label: "Сочетание", value: "Теплый фасад" },
            ],
            metric: "Под теплый фасад",
          },
          {
            body: "Поднятая солнечная плоскость питает патрульную голову и сохраняет аккуратный кронштейн.",
            eyebrow: "СОЛНЕЧНЫЙ НАВЕС",
            facts: [
              { label: "Питание", value: "Solar-fed PTZ" },
              { label: "Панель", value: "Поднятая плоскость" },
              { label: "Кронштейн", value: "Компактный" },
              { label: "Кабель", value: "Скрыт сзади" },
            ],
            metric: "Питание от стены",
          },
          {
            body: "Верхний блок линз смотрит на подход, а нижняя PTZ-линза ведет движение по двору.",
            eyebrow: "СЛОЖЕННАЯ ОПТИКА",
            facts: [
              { label: "Оптика", value: "Fixed + PTZ" },
              { label: "Трекинг", value: "Нижний патруль" },
              { label: "Контекст", value: "Верхняя линза" },
              { label: "Зона", value: "Боковой вход" },
            ],
            metric: "Fixed + PTZ деталь",
          },
          {
            body: "Теплые LED-точки и герметичный вертикальный корпус дают ночное распознавание без засветки фасада.",
            eyebrow: "НОЧНАЯ СБОРКА",
            facts: [
              { label: "Свет", value: "Warm LED" },
              { label: "Защита", value: "Наружный корпус" },
              { label: "Сервис", value: "Вертикальный доступ" },
              { label: "Блик", value: "Низкий" },
            ],
            metric: "Для наружного сервиса",
          },
        ],
      },
      {
        fit: "Ворота / активное сдерживание",
        name: "Strobe Deterrent PTZ",
        steps: [
          {
            body: "Красно-синяя тревожная панель делает камеру заметно активной до подхода к линии стены.",
            eyebrow: "ВИДИМОЕ СДЕРЖИВАНИЕ",
            facts: [
              { label: "Тревога", value: "Red / blue" },
              { label: "Роль", value: "Предупреждение у ворот" },
              { label: "Триггер", value: "Движение" },
              { label: "Сигнал", value: "Видимо активен" },
            ],
            metric: "Red / blue alert",
          },
          {
            body: "Поднятый солнечный кронштейн питает предупредительные огни и PTZ-движение из одной точки.",
            eyebrow: "ПИТАНИЕ ТРЕВОГИ",
            facts: [
              { label: "Питание", value: "Solar alert" },
              { label: "Маршрут", value: "Без траншеи" },
              { label: "Монтаж", value: "Поднятый кронштейн" },
              { label: "Нагрузка", value: "Свет + PTZ" },
            ],
            metric: "Без траншеи",
          },
          {
            body: "Нижняя PTZ-голова ведет движение, а тревожная панель держит сигнал на подходе.",
            eyebrow: "PTZ ТРЕКИНГ",
            facts: [
              { label: "Трекинг", value: "Фиксация движения" },
              { label: "Линза", value: "Нижняя PTZ" },
              { label: "Покрытие", value: "Подход к воротам" },
              { label: "Контекст", value: "Панель тревоги" },
            ],
            metric: "Фиксация движения",
          },
          {
            body: "Белые LED распознавания и герметичный корпус объединяют сдерживание, идентификацию и защиту от погоды.",
            eyebrow: "КОРПУС РАСПОЗНАВАНИЯ",
            facts: [
              { label: "Свет", value: "White LED row" },
              { label: "Защита", value: "К дождю готов" },
              { label: "Корпус", value: "Сложенный shell" },
              { label: "Зона", value: "Активные ворота" },
            ],
            metric: "Монтаж под дождь",
          },
        ],
      },
      {
        fit: "Широкий фасад / угол",
        name: "Twin-Pod Patrol",
        steps: [
          {
            body: "Два боковых модуля смотрят на левый и правый подходы, а центральная голова держит детали.",
            eyebrow: "ДВА БОКОВЫХ МОДУЛЯ",
            facts: [
              { label: "Покрытие", value: "Лево + право" },
              { label: "Линзы", value: "Боковые модули" },
              { label: "Деталь", value: "Центральная голова" },
              { label: "Зона", value: "Широкий фасад" },
            ],
            metric: "Левое + правое покрытие",
          },
          {
            body: "Белый центральный корпус уменьшает визуальную массу на светлой архитектуре, черная оптика остается четкой.",
            eyebrow: "ДВУХТОННЫЙ КОРПУС",
            facts: [
              { label: "Корпус", value: "Белый + черный" },
              { label: "Профиль", value: "Архитектурный" },
              { label: "Фасад", value: "Светлый" },
              { label: "Линза", value: "Темная оптика" },
            ],
            metric: "Дружелюбно к фасаду",
          },
          {
            body: "Поднятая солнечная рама дает крупному корпусу отступ от стены и рабочий угол панели.",
            eyebrow: "ПОДНЯТАЯ СОЛНЕЧНАЯ РАМА",
            facts: [
              { label: "Панель", value: "Поднятая рама" },
              { label: "Питание", value: "Solar-fed" },
              { label: "Монтаж", value: "С отступом" },
              { label: "Клиренс", value: "Крупный корпус" },
            ],
            metric: "Настенный отступ",
          },
          {
            body: "LED в модулях и нижний патрульный блок держат боковые дорожки, входы и края патио видимыми ночью.",
            eyebrow: "ДЕТАЛЬ ВХОДА",
            facts: [
              { label: "Свет", value: "Dual LED pods" },
              { label: "Патруль", value: "Нижний модуль" },
              { label: "Зона", value: "Края патио" },
              { label: "Слепая зона", value: "Угловой монтаж" },
            ],
            metric: "Деталь для угла",
          },
        ],
      },
      {
        fit: "Стена участка / слепые зоны",
        name: "Multi-Lens Wall Guard",
        steps: [
          {
            body: "Три зоны линз перекрываются, уменьшая слепые места вдоль длинных стен, сада и подъездов.",
            eyebrow: "МУЛЬТИЛИНЗОВЫЙ МАССИВ",
            facts: [
              { label: "Обзор", value: "Три зоны" },
              { label: "Покрытие", value: "Длинная стена" },
              { label: "Перекрытие", value: "Меньше слепых зон" },
              { label: "Зона", value: "Край участка" },
            ],
            metric: "Три зоны обзора",
          },
          {
            body: "Центральный световой блок дает ближнее распознавание, боковые турели сохраняют широкий контекст.",
            eyebrow: "ЦЕНТРАЛЬНЫЙ СВЕТ",
            facts: [
              { label: "Свет", value: "Warm LED" },
              { label: "Деталь", value: "Близкая дистанция" },
              { label: "Контекст", value: "Боковые турели" },
              { label: "Цель", value: "Возврат подъезда" },
            ],
            metric: "Warm LED деталь",
          },
          {
            body: "Боковые турели добавляют угловой обзор без отдельных устройств на той же наружной стене.",
            eyebrow: "БОКОВЫЕ ТУРЕЛИ",
            facts: [
              { label: "Углы", value: "Лево + право" },
              { label: "Монтаж", value: "Одно устройство" },
              { label: "Корпус", value: "Широкая платформа" },
              { label: "Маршрут", value: "Одна точка" },
            ],
            metric: "Угловой патруль",
          },
          {
            body: "Широкий солнечный кронштейн и герметичный верхний лоток держат крупный пакет оптики на одной точке.",
            eyebrow: "СОЛНЕЧНЫЙ КОРПУС",
            facts: [
              { label: "Питание", value: "High-cap solar" },
              { label: "Защита", value: "Герметичный лоток" },
              { label: "Монтаж", value: "Одна точка стены" },
              { label: "Сервис", value: "Передние модули" },
            ],
            metric: "Наружный периметр",
          },
        ],
      },
    ],
  },
};

const uz: Dictionary = {
  metadata: {
    title: "Camera Landing",
    description: "Quyosh paneli bilan ishlaydigan tashqi xavfsizlik kamerasi uchun premium landing.",
  },
  mainAriaLabel: "Kamera landing sahifasi",
  hero: {
    label: "Quyoshli tashqi xavfsizlik kamerasi bosh ekrani",
    languageSwitcherAriaLabel: "Tilni tanlash",
    scrollCue: {
      ariaLabel: "Davom etish uchun pastga aylantiring",
      label: "Aylantiring",
      direction: "Pastga",
      upAriaLabel: "Qaytish uchun yuqoriga aylantiring",
      upDirection: "Yuqoriga",
    },
    intro: {
      eyebrow: "SOLAR SENTINEL / VILLA PERIMETRI",
      onlineBadge: "Onlayn",
      headlineLines: ["Perimetr", "nazorati", "simlarsiz", "ishlaydi."],
      copy: "Xususiy uylar uchun quyoshli tashqi videokuzatuv: tunda tayyor, ob-havodan himoyalangan va perimetrni ishonchli qoplaydi.",
      actionsLabel: "Bosh ekran amallari",
      primaryAction: "O'rnatishni buyurtma qilish",
      secondaryAction: "Tizimni ko'rish",
      liveStatus: {
        header: "Jonli xavfsizlik holati",
        statusAriaLabel: "Tizimning jonli holati",
        telemetryAriaLabel: "Qisqa telemetriya",
        statuses: [
          {
            label: "Perimetr",
            values: ["Qo'riqda", "Post", "Qo'riqda", "Toza"],
            slideByCharacter: false,
          },
          {
            label: "Zaryad",
            values: ["96%", "97%", "96%", "96%"],
            slideByCharacter: true,
          },
          {
            label: "Tungi ko'rish",
            values: ["Faol", "IR yoq", "Faol", "Toza"],
            slideByCharacter: false,
          },
          {
            label: "PTZ aylanish",
            values: ["Tayyor", "S-12", "S-27", "Uyga"],
            slideByCharacter: false,
          },
        ],
        telemetry: [
          {
            id: "gate",
            values: ["G'arb darvoza", "Darvoza skan 02", "G'arb darvoza"],
          },
          {
            id: "motion",
            values: ["Harakat yo'q", "Skan toza", "Yo'l toza"],
          },
          {
            id: "seal",
            values: ["IP66 himoya", "Yomg'ir ok", "IP66 himoya"],
          },
          {
            id: "preview",
            values: ["24 fps live", "25 fps live", "24 fps live"],
          },
        ],
      },
    },
    capability: {
      ariaLabel: "Kamera imkoniyatlari sharhi",
      panels: [
        {
          id: "ai",
          eyebrow: "AI PERIMETR",
          title: "Odam va avtomobilni tanish",
          copy: "Hayvonlar, yomg'ir, shoxlar va soyalarni signal egasiga yetib borishidan oldin ajratadi.",
          metric: "98% sahna ishonchi",
        },
        {
          id: "night",
          eyebrow: "TUNGI NAZORAT",
          title: "IR va rangli past yorug'lik",
          copy: "Ikki yoritgich kirish yo'li, darvoza va bog' chetlarini keskin chaqnashsiz ko'rinarli qiladi.",
          metric: "40 m tungi qamrov",
        },
        {
          id: "ptz",
          eyebrow: "PTZ QAMROV",
          title: "Qo'lda boshqariladigan avtopatrul",
          copy: "Obyektiv ko'r nuqtalarni aylanadi, harakatni ushlaydi va avtomatik marshrutga qaytadi.",
          metric: "355 deg pan / 90 deg tilt",
        },
      ],
    },
    operations: {
      ariaLabel: "Kamera operatsiyalari sharhi",
      meterLabel: "Signal ishonchi",
      panels: [
        {
          id: "patrol",
          eyebrow: "AVTOPATRUL",
          title: "Ko'r zonalar bo'ylab marshrutlar",
          copy: "Darvoza, kirish yo'li, bog' cheti va terrasani qo'lda boshqaruvsiz tekshiradi.",
          metric: "12 patrul nuqtasi",
          confidence: "94%",
          stats: [
            { label: "Marshrut", value: "A-04" },
            { label: "Aylanish", value: "355 deg" },
            { label: "Qaytish", value: "8 sek" },
          ],
          tags: ["Quyosh", "Chekka", "Avto uy"],
        },
        {
          id: "alerts",
          eyebrow: "AQLLI SIGNAL",
          title: "Zonalar bo'yicha eskalatsiya",
          copy: "Kirish, perimetr kesilishi va kutib turishni ajratib, ustuvor signal yuboradi.",
          metric: "3 signal darajasi",
          confidence: "91%",
          stats: [
            { label: "Zonalar", value: "06" },
            { label: "Filtr", value: "AI" },
            { label: "Kechikish", value: "0.4s" },
          ],
          tags: ["Odam", "Avto", "Kutish"],
        },
        {
          id: "archive",
          eyebrow: "VOQEA XOTIRASI",
          title: "Lokal va bulutli tarix",
          copy: "Tasdiqlangan kliplarni vaqt, zona, obyekt turi va patrul holati bilan saqlaydi.",
          metric: "30 kun arxiv",
          confidence: "100%",
          stats: [
            { label: "Kliplar", value: "128" },
            { label: "Sync", value: "Live" },
            { label: "Rejim", value: "Dual" },
          ],
          tags: ["Local SD", "Cloud", "Timecode"],
        },
      ],
    },
    final: {
      ariaLabel: "Uy qo'mondonlik holati sharhi",
      eyebrow: "SOLAR SENTINEL / UY QO'MONDONLIGI",
      badge: "Himoyada",
      copy: "Qamrov, quyosh zaxirasi va signal topshirish premium tashqi o'rnatish uchun tekshirildi.",
      primaryAction: "O'rnatishni buyurtma qilish",
      secondaryAction: "Qamrov rejasini ko'rish",
      sections: [
        {
          eyebrow: "HUDUD QAMROVI",
          title: "Villa perimetri nazorati",
          detail: "Darvoza, kirish yo'li, bog' va terrasa qamrovi.",
          facts: ["4 faol zona", "25 fps live"],
          value: "360 deg",
        },
        {
          eyebrow: "AVTONOM TAYYORLIK",
          title: "Quyosh patrul zaxirasi",
          detail: "Tungi optika va IP66 himoya onlayn qoladi.",
          facts: ["96% zaryad", "IR + LED"],
          value: "72 soat",
        },
        {
          eyebrow: "JAVOB PROTOKOLI",
          title: "Signal topshirish tayyor",
          detail: "Ega signali, qo'riqchi topshiruvi va dalil sinxroni.",
          facts: ["30 kun arxiv", "Shifrlangan kliplar"],
          value: "Tayyor",
        },
      ],
      statusItems: ["AI voqea filtri", "Sim kerak emas", "Ko'rikka tayyor"],
      headlinePhrases: [
        ["Uy", "markazi", "tayyor."],
        ["Qamrov", "rejasi", "tasdiq."],
        ["Signal", "topshirish", "himoyada."],
        ["Montaj", "ko'rigi", "tayyor."],
      ],
    },
  },
  installation: {
    eyebrow: "O'RNATISH INTELLEKTI",
    title: "Birinchi burg'ulashdan oldin ko'rish chiziqlarini rejalang.",
    copy: "O'rnatish rejasi devor pozitsiyasi, quyoshga chiqish, linza yetishi va javob egasini bitta dala tayyor sxemaga birlashtiradi.",
    checklistAriaLabel: "Maydon tayyorligi qisqacha ma'lumoti",
    checklistHeader: "MAYDON TAYYORLIGI",
    checklistStatus: "FIELD LOCK",
    metrics: [
      { label: "Zonalar", value: "4 faol zona" },
      { label: "Quvvat", value: "72 soat zaxira" },
      { label: "Xotira", value: "30 kun voqea izi" },
      { label: "Himoya", value: "IP66 korpus" },
    ],
    phases: [
      {
        body: "Usta burg'ulashdan oldin devor mustahkamligi, servis yetishi va buzishga qarshi balandlikni tekshiradi.",
        eyebrow: "01 / MONTAJ CHIZIG'I",
        title: "Mahkamlash nuqtasi joyida tanlanadi",
      },
      {
        body: "Panel quyosh olishi soyalar harakati, tom cheti va kirishdagi chaqnashga qarab tekshiriladi.",
        eyebrow: "02 / YORUG'LIK YO'LI",
        title: "Quyosh va tungi yoritish muvozanatlanadi",
      },
      {
        body: "Yakuniy tekshiruv kadr, push marshruti va egaga topshirishni tasdiqlaydi.",
        eyebrow: "03 / LIVE TEST",
        title: "Patrul va signallar birga sinovdan o'tadi",
      },
    ],
    signals: [
      { label: "Tomon", value: "Soyaga mos" },
      { label: "Kabel", value: "Devor himoyasida" },
      { label: "Servis", value: "Yetish mumkin" },
    ],
    checklist: [
      {
        detail: "Darvoza yondashuvi, kirish burilishi, bog' cheti va ko'r nuqtalar devor pozitsiyasidan ko'rib chiqiladi.",
        label: "Joy ko'rigi",
        value: "Ko'rish chiziqlari tasdiq",
      },
      {
        detail: "Kronshteyn burchagi soya harakati, tom cheti va tungi yoritish bilan solishtiriladi.",
        label: "Quyosh paneli joyi",
        value: "Panel yoyi ochiq",
      },
      {
        detail: "Harakat, yorug'lik triggeri va tungi signal yo'llarining har biri uchun qabul qiluvchi belgilanadi.",
        label: "Javob marshruti",
        value: "Eskalatsiya egasi bor",
      },
    ],
  },
  technical: {
    ariaLabel: "Texnik walkthrough",
    sectionLabel: "SOLAR SENTINEL / VILLA PERIMETRI",
    timelineAriaLabel: "Texnik walkthrough bosqichlari",
    modelsAriaLabel: "Tashqi kamera modellari tafsilotlari",
    modelStepsLabel: "texnik bosqichlar",
    steps: [
      {
        body: "Panel burchagi, devor kronshteyni va kamera korpusi egaga topshirishdan oldin tekislanadi.",
        eyebrow: "QUYOSH PANELI",
        metric: "0.00s klip start",
        title: "Panel burchagi va devor kronshteyni",
      },
      {
        body: "Iliq LED va IR yoritgichlar kirish yo'lini ortiqcha yoritmasdan rangli tun rejimini qo'llaydi.",
        eyebrow: "IKKI YORITISH",
        metric: "IR + warm LED",
        title: "Muvozanatli tungi yoritish",
      },
      {
        body: "PTZ linza boshi patrul marshrutlari, harakatni ushlash va uy pozitsiyasiga qaytishni bajaradi.",
        eyebrow: "PTZ OPTIKA",
        metric: "355 deg patrul",
        title: "Optik patrul moduli",
      },
      {
        body: "Germetik bo'g'inlar va pastki yuritma harakat qismlarini himoyalagan holda ochiq turadi.",
        eyebrow: "GERMETIK YURITMA",
        metric: "IP66 tashqi",
        title: "Ob-havoga chidamli harakat",
      },
      {
        body: "Orqa devor kronshteyni kabel yo'lini perimetr bo'ylab transheyasiz himoya qiladi.",
        eyebrow: "DEVORDAGI QUVVAT YO'LI",
        metric: "15.04s klip yakun",
        title: "Himoyalangan kabel yo'li",
      },
    ],
    models: [
      {
        fit: "Villa perimetri / devor montaji",
        name: "Solar Sentinel PTZ",
        steps: [
          {
            body: "Quyosh yordamli PTZ korpus devordagi patrul nuqtasini perimetr bo'ylab transheyasiz quvvatlaydi.",
            eyebrow: "QUVVAT YO'LI",
            facts: [
              { label: "Quvvat", value: "Quyosh + zaxira" },
              { label: "Yo'l", value: "Transheyasiz" },
              { label: "Montaj", value: "Orqa kronshteyn" },
              { label: "Zona", value: "Perimetr devori" },
            ],
            metric: "Quyosh + zaxira",
          },
          {
            body: "Pastki PTZ bosh va yon optika keng patrul yoyini qoplaydi, tanish detallari markazda qoladi.",
            eyebrow: "OPTIK QAMROV",
            facts: [
              { label: "Harakat", value: "355 deg PTZ" },
              { label: "Ko'rish", value: "Keng patrul yoyi" },
              { label: "Maqsad", value: "Devor yondashuvi" },
              { label: "Qaytish", value: "Uy pozitsiyasi" },
            ],
            metric: "355 deg patrul",
          },
          {
            body: "Iliq LED va IR yoritgichlar bog' yoki kirish yo'lini yuvmasdan tungi rangli detal beradi.",
            eyebrow: "TUNGI DETAL",
            facts: [
              { label: "Yorug'lik", value: "IR + warm LED" },
              { label: "Rejim", value: "Rangli tun" },
              { label: "Chaqnash", value: "Past" },
              { label: "Masofa", value: "Kirish" },
            ],
            metric: "IR + warm LED",
          },
          {
            body: "Germetik bo'g'inlar, himoyalangan kabel kirishi va ochiq pastki yuritma tashqi servisni osonlashtiradi.",
            eyebrow: "MONTAJ PROFILI",
            facts: [
              { label: "Himoya", value: "IP66 tashqi" },
              { label: "Kabel", value: "Devorda yashirin" },
              { label: "Korpus", value: "Germetik yuritma" },
              { label: "Servis", value: "Devordan kirish" },
            ],
            metric: "IP66 tashqi",
          },
        ],
      },
      {
        fit: "Uzoq devor / SIM zaxira",
        name: "4G Tri-View Sentinel",
        steps: [
          {
            body: "Devorga o'rnatilgan quyosh paneli simli quvvat ko'rinadigan yoki qimmat bo'lgan nuqtani onlayn ushlab turadi.",
            eyebrow: "UZOQ QUVVAT",
            facts: [
              { label: "Quvvat", value: "Quyosh + batareya" },
              { label: "Yo'l", value: "Devor ichida" },
              { label: "Zona", value: "Uzoq darvoza" },
              { label: "Zaxira", value: "Mustaqil nuqta" },
            ],
            metric: "Avtonom devor nuqtasi",
          },
          {
            body: "Uch old optika umumiy ko'rinish, o'rta masofa detali va tanish kadrini bitta korpusda ushlab turadi.",
            eyebrow: "TRI-VIEW OPTIKA",
            facts: [
              { label: "Ko'rish", value: "Uch linza" },
              { label: "Kontekst", value: "Keng ko'rinish" },
              { label: "Detal", value: "O'rta masofa" },
              { label: "PTZ", value: "Pastki modul" },
            ],
            metric: "Keng + detal + PTZ",
          },
          {
            body: "Uyali aloqa yo'li kamera simli tarmoqdan uzoqda bo'lsa ham darvoza yoki bog' devorida ulanishni saqlaydi.",
            eyebrow: "4G ZAXIRA",
            facts: [
              { label: "Tarmoq", value: "4G + Wi-Fi" },
              { label: "Zaxira", value: "SIM yo'l" },
              { label: "Signal", value: "Uzoq voqea" },
              { label: "Montaj", value: "Data conduit yo'q" },
            ],
            metric: "SIM zaxira",
          },
          {
            body: "Germetik yon montaj batareya, kabel kirishi va elektronikani ochiq devordagi yomg'irdan himoya qiladi.",
            eyebrow: "GERMETIK MONTAJ",
            facts: [
              { label: "Himoya", value: "IP66 tashqi" },
              { label: "Saqlash", value: "Yon batareya qutisi" },
              { label: "Korpus", value: "Yomg'ir qobig'i" },
              { label: "Servis", value: "Yon kirish" },
            ],
            metric: "IP66 tashqi",
          },
        ],
      },
      {
        fit: "Ichki hovli / yon devor",
        name: "Bronze Solar PTZ",
        steps: [
          {
            body: "Bronza yuqori qobiq iliq landshaft yorug'ligini qabul qilib, fasadga tabiiyroq qo'shiladi.",
            eyebrow: "FASADGA MOSLIK",
            facts: [
              { label: "Qoplama", value: "Iliq bronza" },
              { label: "Profil", value: "Ixcham vertikal" },
              { label: "Zona", value: "Hovli devori" },
              { label: "Uyg'unlik", value: "Iliq fasad" },
            ],
            metric: "Iliq fasad mosligi",
          },
          {
            body: "Ko'tarilgan quyosh tekisligi patrul boshini quvvatlaydi va devorda ixcham kronshteyn qoldiradi.",
            eyebrow: "QUYOSH SOYABONI",
            facts: [
              { label: "Quvvat", value: "Solar-fed PTZ" },
              { label: "Panel", value: "Ko'tarilgan tekislik" },
              { label: "Kronshteyn", value: "Ixcham devor" },
              { label: "Kabel", value: "Orqada yashirin" },
            ],
            metric: "Devordan quvvat",
          },
          {
            body: "Yuqori linza klasteri yondashuvni kuzatadi, pastki PTZ linza esa hovlidagi harakatni olib boradi.",
            eyebrow: "QATLAMLI OPTIKA",
            facts: [
              { label: "Optika", value: "Fixed + PTZ" },
              { label: "Kuzatish", value: "Pastki patrul" },
              { label: "Kontekst", value: "Yuqori linza" },
              { label: "Zona", value: "Yon kirish" },
            ],
            metric: "Fixed + PTZ detal",
          },
          {
            body: "Iliq LED nuqtalar va germetik vertikal korpus fasadni yoritib yubormasdan tungi tanishni foydali qiladi.",
            eyebrow: "TUNGI TUZILMA",
            facts: [
              { label: "Yorug'lik", value: "Warm LED" },
              { label: "Himoya", value: "Tashqi korpus" },
              { label: "Servis", value: "Vertikal kirish" },
              { label: "Chaqnash", value: "Past" },
            ],
            metric: "Tashqi servisga mos",
          },
        ],
      },
      {
        fit: "Darvoza / faol to'xtatish",
        name: "Strobe Deterrent PTZ",
        steps: [
          {
            body: "Qizil-ko'k signal yuzi odam yoki avtomobil devor chizig'iga yetmasdan kamerani faol ko'rsatadi.",
            eyebrow: "KO'RINARLI TO'XTATISH",
            facts: [
              { label: "Signal", value: "Red / blue" },
              { label: "Rol", value: "Darvoza ogohlantirish" },
              { label: "Trigger", value: "Harakat voqeasi" },
              { label: "Belgi", value: "Faol ko'rinadi" },
            ],
            metric: "Red / blue alert",
          },
          {
            body: "Ko'tarilgan quyosh kronshteyni ogohlantirish chiroqlari va patrul harakatini bitta devor nuqtasidan quvvatlaydi.",
            eyebrow: "SIGNAL QUVVATI",
            facts: [
              { label: "Quvvat", value: "Solar alert" },
              { label: "Yo'l", value: "Transheyasiz" },
              { label: "Montaj", value: "Ko'tarilgan kronshteyn" },
              { label: "Yuk", value: "Chiroq + PTZ" },
            ],
            metric: "Transheyasiz yo'l",
          },
          {
            body: "Pastki PTZ bosh harakatni kuzatadi, signal paneli esa to'xtatuvchi belgini yondashuvga qaratadi.",
            eyebrow: "PTZ KUZATISH",
            facts: [
              { label: "Kuzatish", value: "Harakatni ushlash" },
              { label: "Linza", value: "Pastki PTZ" },
              { label: "Qamrov", value: "Darvoza yondashuvi" },
              { label: "Kontekst", value: "Signal paneli" },
            ],
            metric: "Harakatni ushlash",
          },
          {
            body: "Oq tanish LEDlari va germetik qatlamli korpus to'xtatish, identifikatsiya va ob-havo himoyasini birlashtiradi.",
            eyebrow: "TANISH KORPUSI",
            facts: [
              { label: "Yorug'lik", value: "White LED row" },
              { label: "Himoya", value: "Yomg'irga tayyor" },
              { label: "Korpus", value: "Qatlamli shell" },
              { label: "Zona", value: "Faol darvoza" },
            ],
            metric: "Yomg'irga tayyor montaj",
          },
        ],
      },
      {
        fit: "Keng fasad / burchak montaji",
        name: "Twin-Pod Patrol",
        steps: [
          {
            body: "Ikki yon modul chap va o'ng yondashuvlarni kuzatadi, markaziy bosh esa tanish detalini bajaradi.",
            eyebrow: "IKKI YON MODUL",
            facts: [
              { label: "Qamrov", value: "Chap + o'ng" },
              { label: "Linza", value: "Yon modullar" },
              { label: "Detal", value: "Markaziy bosh" },
              { label: "Zona", value: "Keng fasad" },
            ],
            metric: "Chap + o'ng qamrov",
          },
          {
            body: "Oq markaziy korpus yengil arxitekturada vizual massani kamaytiradi, qora optika esa aniq ko'rinadi.",
            eyebrow: "IKKI RANGLI KORPUS",
            facts: [
              { label: "Korpus", value: "Oq + qora" },
              { label: "Profil", value: "Arxitekturaviy" },
              { label: "Uyg'unlik", value: "Yorqin fasad" },
              { label: "Linza", value: "Qora optika" },
            ],
            metric: "Fasadga mos",
          },
          {
            body: "Ko'tarilgan quyosh ramkasi kattaroq korpusga devordan toza masofa beradi va panel burchagini ishlatadi.",
            eyebrow: "KO'TARILGAN QUYOSH RAMKASI",
            facts: [
              { label: "Panel", value: "Ko'tarilgan ramka" },
              { label: "Quvvat", value: "Solar-fed" },
              { label: "Montaj", value: "Devor offset" },
              { label: "Masofa", value: "Katta korpus" },
            ],
            metric: "Offset devor montaji",
          },
          {
            body: "Alohida modul LEDlari va pastki patrul moduli yon yo'llar, kirishlar va patio chetlarini tunda ko'rsatadi.",
            eyebrow: "KIRISH DETALI",
            facts: [
              { label: "Yorug'lik", value: "Dual LED pods" },
              { label: "Patrul", value: "Pastki modul" },
              { label: "Zona", value: "Patio chetlari" },
              { label: "Ko'r nuqta", value: "Burchakka tayyor" },
            ],
            metric: "Burchak detali",
          },
        ],
      },
      {
        fit: "Hudud devori / ko'r zonalar",
        name: "Multi-Lens Wall Guard",
        steps: [
          {
            body: "Uch linza zonasi uzun devor, bog' chetlari va kirish qaytishlaridagi ko'r nuqtalarni kamaytirish uchun kesishadi.",
            eyebrow: "KO'P LINZALI MASSIV",
            facts: [
              { label: "Ko'rish", value: "Uch zona" },
              { label: "Qamrov", value: "Uzun devor" },
              { label: "Kesishuv", value: "Ko'r nuqta kam" },
              { label: "Zona", value: "Hudud cheti" },
            ],
            metric: "Uch ko'rish zonasi",
          },
          {
            body: "Markaziy yorug'lik bloki yaqin masofa tanishini beradi, yon turrelar keng kontekstni saqlaydi.",
            eyebrow: "MARKAZIY YORUG'LIK",
            facts: [
              { label: "Yorug'lik", value: "Warm LED" },
              { label: "Detal", value: "Yaqin masofa" },
              { label: "Kontekst", value: "Yon turrelar" },
              { label: "Maqsad", value: "Kirish qaytishi" },
            ],
            metric: "Warm LED detal",
          },
          {
            body: "Yon turrelar bitta tashqi devorda alohida qurilmalarsiz burchakli qamrov qo'shadi.",
            eyebrow: "YON TURRELAR",
            facts: [
              { label: "Burchak", value: "Chap + o'ng" },
              { label: "Montaj", value: "Bitta qurilma" },
              { label: "Korpus", value: "Keng tray" },
              { label: "Yo'l", value: "Bitta montaj" },
            ],
            metric: "Burchak patruli",
          },
          {
            body: "Keng quyosh kronshteyni va germetik yuqori tray katta optika paketini bitta devor nuqtasidan ushlab turadi.",
            eyebrow: "QUYOSHLI DEVOR KORPUSI",
            facts: [
              { label: "Quvvat", value: "High-cap solar" },
              { label: "Himoya", value: "Germetik tray" },
              { label: "Montaj", value: "Bitta devor nuqtasi" },
              { label: "Servis", value: "Old modullar" },
            ],
            metric: "Hudud tashqi qismi",
          },
        ],
      },
    ],
  },
};

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ru,
  uz,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
