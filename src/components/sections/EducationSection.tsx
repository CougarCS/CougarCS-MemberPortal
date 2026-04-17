import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { MONTHS } from './constants';

interface Props {
  major: string;
  graduationYear: string;
  graduationMonth: string;
  gpa: string;
  onMajor: (v: string) => void;
  onGraduationYear: (v: string) => void;
  onGraduationMonth: (v: string) => void;
  onGpa: (v: string) => void;
}

export const EducationSection = ({
  major,
  graduationYear,
  graduationMonth,
  gpa,
  onMajor,
  onGraduationYear,
  onGraduationMonth,
  onGpa,
}: Props) => (
  <SectionShell
    id="education"
    title="Education"
    desc="Your degree, major, and expected graduation."
  >
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Major</label>
      <input
        className={styles.input}
        value={major}
        onChange={(e) => onMajor(e.target.value)}
        placeholder="e.g. Computer Science"
      />
    </div>

    <div className={styles.fieldRow}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Graduation Year</label>
        <input
          className={styles.input}
          type="number"
          min={2000}
          max={2040}
          placeholder="2026"
          value={graduationYear}
          onChange={(e) => onGraduationYear(e.target.value)}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Graduation Month</label>
        <select
          className={styles.input}
          value={graduationMonth}
          onChange={(e) => onGraduationMonth(e.target.value)}
        >
          <option value="">Select month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className={styles.fieldGroup}>
      <label className={styles.label}>GPA</label>
      <input
        className={styles.input}
        type="number"
        min={0}
        max={4}
        step={0.01}
        placeholder="e.g. 3.5"
        value={gpa}
        onChange={(e) => onGpa(e.target.value)}
      />
    </div>
  </SectionShell>
);
