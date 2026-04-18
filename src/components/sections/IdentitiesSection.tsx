import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { ETHNICITIES } from './constants';
import type { SaveState } from './types';

interface Props {
  gender: string;
  ethnicities: string[];
  saveState?: SaveState;
  onGender: (v: string) => void;
  onEthnicities: (v: string[]) => void;
  onSave?: () => void;
}

export const IdentitiesSection = ({
  gender,
  ethnicities,
  saveState,
  onGender,
  onEthnicities,
  onSave,
}: Props) => {
  const toggle = (v: string) =>
    onEthnicities(
      ethnicities.includes(v) ? ethnicities.filter((e) => e !== v) : [...ethnicities, v],
    );

  return (
    <SectionShell
      id="personal-identities"
      title="Personal Identities"
      desc="Optional info that helps companies find the right fit."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.fieldGroup}>
        <label className={styles.label}>What is your gender?</label>
        <div className={styles.pillGroup}>
          {['Male', 'Female', 'Non-Binary'].map((g) => (
            <button
              key={g}
              type="button"
              className={`${styles.pill} ${gender === g ? styles.pillActive : ''}`}
              onClick={() => onGender(gender === g ? '' : g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          What is your racial/ethnic identity? (Select all that apply)
        </label>
        <div className={styles.pillGroup}>
          {ETHNICITIES.map((e) => (
            <button
              key={e}
              type="button"
              className={`${styles.pill} ${ethnicities.includes(e) ? styles.pillActive : ''}`}
              onClick={() => toggle(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};
