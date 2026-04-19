import { useController, useFormContext } from 'react-hook-form';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { YesNo } from './YesNo';
import type { SaveState, ProfileFormValues } from './types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const LocationSection = ({ saveState, onSave }: Props) => {
  const { register, control } = useFormContext<ProfileFormValues>();
  const { field: authField } = useController({ name: 'authorizedToWork', control });

  return (
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
          <input className={styles.input} {...register('city')} placeholder="Houston" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>State</label>
          <input className={styles.input} {...register('state')} placeholder="TX" maxLength={2} />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Zip Code</label>
          <input className={styles.input} {...register('zip')} placeholder="77004" maxLength={10} />
        </div>
      </div>

      <div className={styles.inlineRow}>
        <span className={styles.inlineLabel}>
          Are you authorized to work in the US without sponsorship?
        </span>
        <YesNo value={authField.value} onChange={authField.onChange} />
      </div>
    </SectionShell>
  );
};
