import { useFormContext } from 'react-hook-form';
import { SectionShell } from '../SectionShell/SectionShell';
import { FieldGroup } from '../components/FieldGroup/FieldGroup';
import { FieldRow } from '../components/FieldRow/FieldRow';
import { FormInput, FormSelect } from '../components/FormInput/FormInput';
import { MONTHS } from '../../../utils/constants';
import type { SaveState, ProfileFormValues } from '../../../utils/types';

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
      <FieldGroup label="Major">
        <FormInput {...register('major')} placeholder="e.g. Computer Science" />
      </FieldGroup>

      <FieldRow>
        <FieldGroup label="Graduation Year">
          <FormInput
            type="number"
            min={2000}
            max={2040}
            placeholder="2026"
            {...register('graduationYear')}
          />
        </FieldGroup>
        <FieldGroup label="Graduation Month">
          <FormSelect {...register('graduationMonth')}>
            <option value="">Select month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FormSelect>
        </FieldGroup>
      </FieldRow>

      <FieldGroup label="GPA">
        <FormInput
          type="number"
          min={0}
          max={4}
          step={0.01}
          placeholder="e.g. 3.5"
          {...register('gpa')}
        />
      </FieldGroup>
    </SectionShell>
  );
};
