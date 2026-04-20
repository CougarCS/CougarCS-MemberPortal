import { useForm, useController } from 'react-hook-form';
import { SkillCombobox } from './SkillCombobox';
import { MONTHS } from '../../utils/constants';
import styles from './section.module.css';
import type { Experience, Skill } from './types';

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

  // skills is an array of objects — useController handles it as a controlled field
  const { field: skillsField } = useController({ name: 'skills', control });

  // watch 'current' so we can disable the end-date fields reactively
  const isCurrent = watch('current');

  return (
    <div className={styles.expForm}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Job Title</label>
          <input className={styles.input} {...register('title')} />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Company</label>
          <input className={styles.input} {...register('company')} />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Start Month</label>
          <select className={styles.input} {...register('startMonth')}>
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Start Year</label>
          <input className={styles.input} placeholder="YYYY" {...register('startYear')} />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>End Month</label>
          <select className={styles.input} disabled={isCurrent} {...register('endMonth')}>
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>End Year</label>
          <input
            className={styles.input}
            placeholder="YYYY"
            disabled={isCurrent}
            {...register('endYear')}
          />
        </div>
      </div>

      <label className={styles.checkboxLabel}>
        <input type="checkbox" {...register('current')} />I currently work here
      </label>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Location</label>
        <input
          className={styles.input}
          placeholder="City, State, Country"
          {...register('location')}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description</label>
        <textarea className={styles.textarea} rows={4} {...register('description')} />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Skills Used</label>
        <SkillCombobox
          selected={skillsField.value ?? []}
          onChange={(skills: Skill[]) => {
            skillsField.onChange(skills);
          }}
        />
      </div>

      {opState === 'error' && <p className={styles.errorText}>Failed to save. Please try again.</p>}

      <div className={styles.formActions}>
        <button type="button" className={styles.outlineBtn} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => {
            handleSubmit(onSave)();
          }}
          disabled={opState === 'saving'}
        >
          {opState === 'saving' ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};
