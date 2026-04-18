import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { YesNo } from './YesNo';
import type { SaveState } from './types';

interface Props {
  city: string;
  state: string;
  zip: string;
  authorizedToWork: boolean;
  saveState?: SaveState;
  onCity: (v: string) => void;
  onState: (v: string) => void;
  onZip: (v: string) => void;
  onAuthorizedToWork: (v: boolean) => void;
  onSave?: () => void;
}

export const LocationSection = ({
  city,
  state,
  zip,
  authorizedToWork,
  saveState,
  onCity,
  onState,
  onZip,
  onAuthorizedToWork,
  onSave,
}: Props) => (
  <SectionShell
    id="location"
    title="Location"
    desc="Where you live and your work authorization status."
    saveState={saveState}
    onSave={onSave}
  >
    <div className={styles.threeCol}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>City</label>
        <input
          className={styles.input}
          value={city}
          onChange={(e) => onCity(e.target.value)}
          placeholder="Houston"
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>State</label>
        <input
          className={styles.input}
          value={state}
          onChange={(e) => onState(e.target.value)}
          placeholder="TX"
          maxLength={2}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Zip Code</label>
        <input
          className={styles.input}
          value={zip}
          onChange={(e) => onZip(e.target.value)}
          placeholder="77004"
          maxLength={10}
        />
      </div>
    </div>

    <div className={styles.inlineRow}>
      <span className={styles.inlineLabel}>
        Are you authorized to work in the US without sponsorship?
      </span>
      <YesNo value={authorizedToWork} onChange={onAuthorizedToWork} />
    </div>
  </SectionShell>
);
