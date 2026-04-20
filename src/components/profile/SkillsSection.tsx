import { useController, useFormContext } from 'react-hook-form';
import { SkillCombobox } from './SkillCombobox';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import type { SaveState, ProfileFormValues, Skill } from './types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const SkillsSection = ({ saveState, onSave }: Props) => {
  const { control } = useFormContext<ProfileFormValues>();
  const { field } = useController({ name: 'skills', control });

  return (
    <SectionShell
      id="skills"
      title="Skills"
      desc="Select the skills you know."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Skills</label>
        <SkillCombobox
          selected={field.value ?? []}
          onChange={(skills: Skill[]) => field.onChange(skills)}
        />
      </div>
    </SectionShell>
  );
};
