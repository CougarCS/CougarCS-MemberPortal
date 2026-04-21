import { useController, useFormContext } from 'react-hook-form';
import styles from './section.module.css';
import { SectionShell } from '../SectionShell/SectionShell';
import { ETHNICITIES } from '../../../utils/constants';
import type { SaveState, ProfileFormValues } from '../../../utils/types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const IdentitiesSection = ({ saveState, onSave }: Props) => {
  const { control } = useFormContext<ProfileFormValues>();
  const { field: genderField } = useController({ name: 'gender', control });
  const { field: ethnicitiesField } = useController({ name: 'ethnicities', control });

  const ethnicities: string[] = ethnicitiesField.value ?? [];

  const toggle = (v: string) => {
    ethnicitiesField.onChange(
      ethnicities.includes(v) ? ethnicities.filter((e) => e !== v) : [...ethnicities, v],
    );
  };

  return (
    <SectionShell
      id="personal-identities"
      title="Personal Identities"
      desc="Optional info that we use to internally collect demographic data. Your individual data is NOT shared with companies or any 3rd party organizations."
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
              className={`${styles.pill} ${genderField.value === g ? styles.pillActive : ''}`}
              onClick={() => genderField.onChange(genderField.value === g ? '' : g)}
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
