import { useState } from 'react';
import { SkillCombobox } from './SkillCombobox';
import { MONTHS } from './constants';
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
  const [draft, setDraft] = useState<Omit<Experience, 'id'>>(initial);
  const set = (patch: Partial<Omit<Experience, 'id'>>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <div className={styles.expForm}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Job Title</label>
          <input
            className={styles.input}
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Company</label>
          <input
            className={styles.input}
            value={draft.company}
            onChange={(e) => set({ company: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Start Month</label>
          <select
            className={styles.input}
            value={draft.startMonth}
            onChange={(e) => set({ startMonth: e.target.value })}
          >
            <option value="">Month</option>
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Start Year</label>
          <input
            className={styles.input}
            placeholder="YYYY"
            value={draft.startYear}
            onChange={(e) => set({ startYear: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>End Month</label>
          <select
            className={styles.input}
            value={draft.endMonth}
            onChange={(e) => set({ endMonth: e.target.value })}
            disabled={draft.current}
          >
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
            value={draft.endYear}
            onChange={(e) => set({ endYear: e.target.value })}
            disabled={draft.current}
          />
        </div>
      </div>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={draft.current}
          onChange={(e) => set({ current: e.target.checked })}
        />
        I currently work here
      </label>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Location</label>
        <input
          className={styles.input}
          placeholder="City, State, Country"
          value={draft.location}
          onChange={(e) => set({ location: e.target.value })}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          rows={4}
          value={draft.description}
          onChange={(e) => set({ description: e.target.value })}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Skills Used</label>
        <SkillCombobox selected={draft.skills} onChange={(skills: Skill[]) => set({ skills })} />
      </div>

      {opState === 'error' && <p className={styles.errorText}>Failed to save. Please try again.</p>}

      <div className={styles.formActions}>
        <button type="button" className={styles.outlineBtn} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => onSave(draft)}
          disabled={opState === 'saving'}
        >
          {opState === 'saving' ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};
