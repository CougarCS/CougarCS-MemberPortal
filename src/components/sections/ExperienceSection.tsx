import { useState } from 'react';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import type { Experience } from './types';
import { MONTHS } from './constants';

interface Props {
  experiences: Experience[];
  onChange: (v: Experience[]) => void;
}
import iconEdit from '../../assets/icon-edit.svg';
import iconTrash from '../../assets/icon-trash.svg';

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
  skills: '',
};

export const ExperienceSection = ({ experiences, onChange }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Experience, 'id'>>(BLANK);

  const openAdd = () => {
    setDraft(BLANK);
    setEditingId(null);
    setShowForm(true);
  };
  const openEdit = (exp: Experience) => {
    const { id, ...rest } = exp;
    setDraft(rest);
    setEditingId(id);
    setShowForm(true);
  };
  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
  };
  const save = () => {
    if (editingId) {
      onChange(experiences.map((e) => (e.id === editingId ? { ...draft, id: editingId } : e)));
    } else {
      onChange([...experiences, { ...draft, id: crypto.randomUUID() }]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <SectionShell
      id="professional-experience"
      title="Professional Experience"
      desc="Add your internships and jobs here, if any."
    >
      <div className={styles.listHeader}>
        <span className={styles.listHeaderLabel}>Experience</span>
        <button type="button" className={styles.outlineBtn} onClick={openAdd}>
          + Add new experience
        </button>
      </div>

      {showForm && (
        <div className={styles.expForm}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Job Title</label>
              <input
                className={styles.input}
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Company</label>
              <input
                className={styles.input}
                value={draft.company}
                onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Start Month</label>
              <select
                className={styles.input}
                value={draft.startMonth}
                onChange={(e) => setDraft((d) => ({ ...d, startMonth: e.target.value }))}
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
                onChange={(e) => setDraft((d) => ({ ...d, startYear: e.target.value }))}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>End Month</label>
              <select
                className={styles.input}
                value={draft.endMonth}
                onChange={(e) => setDraft((d) => ({ ...d, endMonth: e.target.value }))}
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
                onChange={(e) => setDraft((d) => ({ ...d, endYear: e.target.value }))}
                disabled={draft.current}
              />
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={draft.current}
              onChange={(e) => setDraft((d) => ({ ...d, current: e.target.checked }))}
            />
            I currently work here
          </label>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Location</label>
            <input
              className={styles.input}
              placeholder="City, State, Country"
              value={draft.location}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              rows={4}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Skills Used</label>
            <input
              className={styles.input}
              placeholder="e.g. React, Python, SQL"
              value={draft.skills}
              onChange={(e) => setDraft((d) => ({ ...d, skills: e.target.value }))}
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.outlineBtn} onClick={cancel}>
              Cancel
            </button>
            <button type="button" className={styles.primaryBtn} onClick={save}>
              Save
            </button>
          </div>
        </div>
      )}

      {experiences.length === 0 && !showForm && (
        <p className={styles.emptyState}>No experience added yet.</p>
      )}

      {experiences.map((exp) => (
        <div key={exp.id} className={styles.expCard}>
          <div className={styles.expCardHeader}>
            <div>
              <h3 className={styles.expTitle}>{exp.title}</h3>
              <p className={styles.expCompany}>{exp.company}</p>
              <p className={styles.expMeta}>
                {exp.startMonth} {exp.startYear} –{' '}
                {exp.current ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
              </p>
              {exp.location && <p className={styles.expMeta}>{exp.location}</p>}
            </div>
            <div className={styles.expCardActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => openEdit(exp)}
                aria-label="Edit"
              >
                <img src={iconEdit} alt="Edit" width={15} height={15} />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => onChange(experiences.filter((e) => e.id !== exp.id))}
                aria-label="Delete"
              >
                <img src={iconTrash} alt="Delete" width={15} height={15} />
              </button>
            </div>
          </div>
          {exp.description && <p className={styles.expDesc}>{exp.description}</p>}
          {exp.skills && (
            <div className={styles.tagRow}>
              {exp.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span key={skill} className={styles.tag}>
                    {skill}
                  </span>
                ))}
            </div>
          )}
        </div>
      ))}
    </SectionShell>
  );
};
