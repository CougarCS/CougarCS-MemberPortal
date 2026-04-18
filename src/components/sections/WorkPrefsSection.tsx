import { useController, useFormContext } from 'react-hook-form';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { YesNo } from './YesNo';
import { OPPORTUNITY_TYPES, WORK_ENVIRONMENTS } from './constants';
import type { SaveState, ProfileFormValues } from './types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const WorkPrefsSection = ({ saveState, onSave }: Props) => {
  const { control } = useFormContext<ProfileFormValues>();
  const { field: oppField } = useController({ name: 'opportunities', control });
  const { field: relocateField } = useController({ name: 'openToRelocate', control });
  const { field: envField } = useController({ name: 'workEnvironments', control });

  const opportunities: string[] = oppField.value ?? [];
  const workEnvironments: string[] = envField.value ?? [];

  const toggleOpp = (v: string) =>
    oppField.onChange(
      opportunities.includes(v) ? opportunities.filter((o) => o !== v) : [...opportunities, v],
    );

  const toggleEnv = (v: string) =>
    envField.onChange(
      workEnvironments.includes(v)
        ? workEnvironments.filter((e) => e !== v)
        : [...workEnvironments, v],
    );

  return (
    <SectionShell
      id="work-preferences"
      title="Work Preferences"
      desc="The types of roles and environments you're looking for."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          What kind of opportunities are you seeking? (Select all that apply)
        </label>
        <div className={styles.pillGroup}>
          {OPPORTUNITY_TYPES.map((o) => (
            <button
              key={o}
              type="button"
              className={`${styles.pill} ${opportunities.includes(o) ? styles.pillActive : ''}`}
              onClick={() => toggleOpp(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inlineRow}>
        <span className={styles.inlineLabel}>Are you open to relocating for an opportunity?</span>
        <YesNo value={relocateField.value} onChange={relocateField.onChange} />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          What work environment(s) are you interested in? (Select all that apply)
        </label>
        <div className={styles.pillGroup}>
          {WORK_ENVIRONMENTS.map((env) => (
            <button
              key={env}
              type="button"
              className={`${styles.pill} ${workEnvironments.includes(env) ? styles.pillActive : ''}`}
              onClick={() => toggleEnv(env)}
            >
              {env}
            </button>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};
