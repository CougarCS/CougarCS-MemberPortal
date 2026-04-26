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
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormValues>();

  return (
    <SectionShell
      id="education"
      title="Education"
      desc="Your degree, major, and expected graduation."
      saveState={saveState}
      onSave={onSave}
    >
      <FieldGroup label="Major" error={errors.major?.message}>
        <FormInput
          {...register('major')}
          aria-invalid={Boolean(errors.major)}
          placeholder="e.g. Computer Science"
        />
      </FieldGroup>

      <FieldRow>
        <FieldGroup label="Graduation Year" error={errors.graduationYear?.message}>
          <FormInput
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="2026"
            aria-invalid={Boolean(errors.graduationYear)}
            {...register('graduationYear')}
          />
        </FieldGroup>
        <FieldGroup label="Graduation Month" error={errors.graduationMonth?.message}>
          <FormSelect
            {...register('graduationMonth')}
            aria-invalid={Boolean(errors.graduationMonth)}
          >
            <option value="">Select month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FormSelect>
        </FieldGroup>
      </FieldRow>

      <FieldGroup label="GPA" error={errors.gpa?.message}>
        <FormInput
          type="number"
          min={0}
          max={4}
          step={0.01}
          placeholder="e.g. 3.5"
          aria-invalid={Boolean(errors.gpa)}
          {...register('gpa')}
        />
      </FieldGroup>
    </SectionShell>
  );
};
