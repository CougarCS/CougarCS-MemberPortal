import styles from './section.module.css';
import { SectionShell } from './SectionShell';

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

interface Props {
  graduationYear: string;
  graduationMonth: string;
  onGraduationYear: (v: string) => void;
  onGraduationMonth: (v: string) => void;
}

export const QualificationsSection = ({
  graduationYear,
  graduationMonth,
  onGraduationYear,
  onGraduationMonth,
}: Props) => (
  <SectionShell
    id="qualifications"
    title="Qualifications"
    desc="Share your qualifications for better job matching."
  >
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
  </SectionShell>
);
