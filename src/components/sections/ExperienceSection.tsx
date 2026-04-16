import { useState } from 'react';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';

export interface Experience {
  id: string;
  title: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  location: string;
  description: string;
  skills: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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

interface Props {
  experiences: Experience[];
  onChange: (v: Experience[]) => void;
}

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
      desc="Your work is valuable. Provide accurate details to showcase your employment experiences."
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
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => onChange(experiences.filter((e) => e.id !== exp.id))}
                aria-label="Delete"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
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
