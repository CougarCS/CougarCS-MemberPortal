import { useFormContext } from 'react-hook-form';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { MONTHS } from '../../utils/constants';
import type { SaveState, ProfileFormValues } from './types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const EducationSection = ({ saveState, onSave }: Props) => {
  const { register } = useFormContext<ProfileFormValues>();

  return (
    <SectionShell
      id="education"
      title="Education"
      desc="Your degree, major, and expected graduation."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Major</label>
        <input
          className={styles.input}
          {...register('major')}
          placeholder="e.g. Computer Science"
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Graduation Year</label>
          <input
            className={styles.input}
            type="number"
            min={2000}
            max={2040}
            placeholder="2026"
            {...register('graduationYear')}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Graduation Month</label>
          <select className={styles.input} {...register('graduationMonth')}>
            <option value="">Select month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>GPA</label>
        <input
          className={styles.input}
          type="number"
          min={0}
          max={4}
          step={0.01}
          placeholder="e.g. 3.5"
          {...register('gpa')}
        />
      </div>
    </SectionShell>
  );
};
