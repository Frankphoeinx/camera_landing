import styles from "./LandingSections.module.css";

const installationMetrics = [
  { label: "Zones", value: "4 active zones" },
  { label: "Power", value: "72h reserve" },
  { label: "Memory", value: "30 day event trail" },
  { label: "Seal", value: "IP66 shell" },
];

const installationPhases = [
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
];

const installationSignals = [
  { label: "Mount side", value: "Shade-aware" },
  { label: "Cable route", value: "Wall-protected" },
  { label: "Service access", value: "Reachable" },
];

const installationChecklist = [
  {
    detail:
      "Gate approach, driveway turn, garden edge, and blind spots are reviewed from the wall position.",
    label: "Site survey",
    value: "Sightlines verified",
  },
  {
    detail:
      "The bracket angle is checked against shade movement, roof spill, and night lighting.",
    label: "Solar placement",
    value: "Panel arc cleared",
  },
  {
    detail:
      "Motion, light trigger, and after-hours alert paths each get a named receiver.",
    label: "Response routing",
    value: "Escalation owner set",
  },
];

export function InstallationSection() {
  return (
    <section
      className={styles.installationSection}
      id="installation"
      aria-labelledby="installation-title"
    >
      <div className={styles.installationBackground} aria-hidden="true">
        <span className={styles.installationGrid} />
        <span className={styles.installationSweep} />
      </div>

      <div className={styles.installationShell}>
        <div className={styles.installationHeader}>
          <p className={styles.sectionEyebrow}>INSTALLATION INTELLIGENCE</p>
          <h2 className={styles.installationTitle} id="installation-title">
            Plan the sightlines before the first drill mark.
          </h2>
          <p className={styles.installationCopy}>
            The install plan turns wall position, solar access, lens reach, and
            response ownership into one field-ready setup.
          </p>
        </div>

        <aside
          className={styles.installationChecklist}
          aria-label="Site readiness brief"
        >
          <div className={styles.installationChecklistHeader}>
            <span>SITE READINESS BRIEF</span>
            <strong>FIELD LOCK</strong>
          </div>
          <div className={styles.installationSignalGrid}>
            {installationSignals.map((signal) => (
              <div className={styles.installationSignal} key={signal.label}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            ))}
          </div>
          <ol className={styles.installationChecklistList}>
            {installationChecklist.map((item, index) => (
              <li className={styles.installationChecklistItem} key={item.label}>
                <span className={styles.installationChecklistIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <div className={styles.installationMetrics}>
          {installationMetrics.map((metric) => (
            <div className={styles.installationMetric} key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        <div className={styles.installationPhases}>
          {installationPhases.map((phase) => (
            <article className={styles.installationPhase} key={phase.eyebrow}>
              <span>{phase.eyebrow}</span>
              <strong>{phase.title}</strong>
              <p>{phase.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
