import { useCallback, useEffect } from 'react';
import { useForm, useController, useWatch } from 'react-hook-form';
import { MONTHS } from '../../../../utils/constants';
import styles from './ExperienceForm.module.css';
import type { Experience, Skill } from '../../../../utils/types';
import { validateExperienceDraft } from '../../../../lib/profileValidation';
import { applyValidationResult } from '../../../../utils/formValidation';
import { SkillCombobox } from '../../SkillsSection/SkillsComboBox/SkillsComboBox';
import { FieldGroup } from '../../components/FieldGroup/FieldGroup';
import { FieldRow } from '../../components/FieldRow/FieldRow';
import { FormInput, FormSelect } from '../../components/FormInput/FormInput';
import { OutlineButton } from '../../../OutlineButton/OutlineButton';
import { PrimaryButton } from '../../../PrimaryButton/PrimaryButton';

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
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    subscribe,
    getValues,
    formState: { errors },
  } = useForm<Omit<Experience, 'id'>>({
    defaultValues: initial,
  });

  const { field: skillsField } = useController({ name: 'skills', control });

  const isCurrent = useWatch({ control, name: 'current' });

  const validateDraft = useCallback(
    (draft: Omit<Experience, 'id'>) => {
      const validation = validateExperienceDraft(draft);

      return applyValidationResult({ validation, clearErrors, setError });
    },
    [clearErrors, setError],
  );

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ name }) => {
        if (name) {
          validateDraft(getValues());
        }
      },
    });

    return unsubscribe;
  }, [getValues, subscribe, validateDraft]);

  const submit = (draft: Omit<Experience, 'id'>) => {
    if (!validateDraft(draft)) {
      return;
    }

    onSave(draft);
  };

  return (
    <div className={styles.expForm}>
      <FieldRow>
        <FieldGroup label="Job Title" error={errors.title?.message}>
          <FormInput {...register('title')} aria-invalid={Boolean(errors.title)} />
        </FieldGroup>
        <FieldGroup label="Company" error={errors.company?.message}>
          <FormInput {...register('company')} aria-invalid={Boolean(errors.company)} />
        </FieldGroup>
      </FieldRow>

      <FieldRow>
        <FieldGroup label="Start Month" error={errors.startMonth?.message}>
          <FormSelect {...register('startMonth')} aria-invalid={Boolean(errors.startMonth)}>
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </FormSelect>
        </FieldGroup>
        <FieldGroup label="Start Year" error={errors.startYear?.message}>
          <FormInput
            placeholder="YYYY"
            inputMode="numeric"
            maxLength={4}
            {...register('startYear')}
            aria-invalid={Boolean(errors.startYear)}
          />
        </FieldGroup>
      </FieldRow>

      <FieldRow>
        <FieldGroup label="End Month" error={errors.endMonth?.message}>
          <FormSelect
            disabled={isCurrent}
            {...register('endMonth')}
            aria-invalid={Boolean(errors.endMonth)}
          >
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </FormSelect>
        </FieldGroup>
        <FieldGroup label="End Year" error={errors.endYear?.message}>
          <FormInput
            placeholder="YYYY"
            disabled={isCurrent}
            inputMode="numeric"
            maxLength={4}
            {...register('endYear')}
            aria-invalid={Boolean(errors.endYear)}
          />
        </FieldGroup>
      </FieldRow>

      <label className={styles.checkboxLabel}>
        <input type="checkbox" {...register('current')} />I currently work here
      </label>

      <FieldGroup label="Location" error={errors.location?.message}>
        <FormInput
          placeholder="City, State, Country"
          {...register('location')}
          aria-invalid={Boolean(errors.location)}
        />
      </FieldGroup>

      <FieldGroup label="Description" error={errors.description?.message}>
        <textarea
          className={styles.textarea}
          rows={4}
          {...register('description')}
          aria-invalid={Boolean(errors.description)}
        />
      </FieldGroup>

      <FieldGroup label="Skills Used" error={errors.skills?.message}>
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
            handleSubmit(submit)();
          }}
          disabled={opState === 'saving'}
        >
          {opState === 'saving' ? 'Saving...' : 'Save'}
        </PrimaryButton>
      </div>
    </div>
  );
};
