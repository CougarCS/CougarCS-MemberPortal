import { useController, useFormContext } from 'react-hook-form';
import { SkillCombobox } from './SkillsComboBox/SkillsComboBox';
import { SectionShell } from '../SectionShell/SectionShell';
import { FieldGroup } from '../components/FieldGroup/FieldGroup';
import type { SaveState, ProfileFormValues, Skill } from '../../../utils/types';

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
      <FieldGroup label="Skills">
        <SkillCombobox
          selected={field.value ?? []}
          onChange={(skills: Skill[]) => field.onChange(skills)}
        />
      </FieldGroup>
    </SectionShell>
  );
};
