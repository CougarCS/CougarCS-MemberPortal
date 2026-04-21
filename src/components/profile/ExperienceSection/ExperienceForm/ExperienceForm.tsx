import { useForm, useController } from 'react-hook-form';
import { MONTHS } from '../../../../utils/constants';
import styles from './ExperienceForm.module.css';
import type { Experience, Skill } from '../../../../utils/types';
import { SkillCombobox } from '../../SkillsSection/SkillsComboBox/SkillsComboBox';
import { FieldGroup } from '../../components/FieldGroup/FieldGroup';
import { FieldRow } from '../../components/FieldRow/FieldRow';
import { FormInput, FormSelect } from '../../components/FormInput/FormInput';
import { OutlineButton } from '../../components/OutlineButton/OutlineButton';
import { PrimaryButton } from '../../components/PrimaryButton/PrimaryButton';

const BLANK: Omit<Experience, 'id'> = {
  title: '',
  company: '',
  startMonth: '',
  startYear: '',
  endMonth: '',
  endYear: '',
  current: false,
  location: '',
  description: '',
  skills: [],
};

interface Props {
  initial?: Omit<Experience, 'id'>;
  opState: 'idle' | 'saving' | 'error';
  onSave: (draft: Omit<Experience, 'id'>) => void;
  onCancel: () => void;
}

export const ExperienceForm = ({ initial = BLANK, opState, onSave, onCancel }: Props) => {
  const { register, handleSubmit, watch, control } = useForm<Omit<Experience, 'id'>>({
    defaultValues: initial,
  });

  const { field: skillsField } = useController({ name: 'skills', control });

  const isCurrent = watch('current');

  return (
    <div className={styles.expForm}>
      <FieldRow>
        <FieldGroup label="Job Title">
          <FormInput {...register('title')} />
        </FieldGroup>
        <FieldGroup label="Company">
          <FormInput {...register('company')} />
        </FieldGroup>
      </FieldRow>

      <FieldRow>
        <FieldGroup label="Start Month">
          <FormSelect {...register('startMonth')}>
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </FormSelect>
        </FieldGroup>
        <FieldGroup label="Start Year">
          <FormInput placeholder="YYYY" {...register('startYear')} />
        </FieldGroup>
      </FieldRow>

      <FieldRow>
        <FieldGroup label="End Month">
          <FormSelect disabled={isCurrent} {...register('endMonth')}>
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </FormSelect>
        </FieldGroup>
        <FieldGroup label="End Year">
          <FormInput placeholder="YYYY" disabled={isCurrent} {...register('endYear')} />
        </FieldGroup>
      </FieldRow>

      <label className={styles.checkboxLabel}>
        <input type="checkbox" {...register('current')} />I currently work here
      </label>

      <FieldGroup label="Location">
        <FormInput placeholder="City, State, Country" {...register('location')} />
      </FieldGroup>

      <FieldGroup label="Description">
        <textarea className={styles.textarea} rows={4} {...register('description')} />
      </FieldGroup>

      <FieldGroup label="Skills Used">
        <SkillCombobox
          selected={skillsField.value ?? []}
          onChange={(skills: Skill[]) => {
            skillsField.onChange(skills);
          }}
        />
      </FieldGroup>

      {opState === 'error' && <p className={styles.errorText}>Failed to save. Please try again.</p>}

      <div className={styles.formActions}>
        <OutlineButton type="button" onClick={onCancel}>
          Cancel
        </OutlineButton>
        <PrimaryButton
          type="button"
          onClick={() => {
            handleSubmit(onSave)();
          }}
          disabled={opState === 'saving'}
        >
          {opState === 'saving' ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </div>
  );
};
