import styles from './section.module.css';
import { SectionShell } from './SectionShell';

interface Props {
  skills: string;
  onChange: (v: string) => void;
}

export const SkillsSection = ({ skills, onChange }: Props) => (
  <SectionShell id="skills" title="Skills" desc="List what you know and what you're good at.">
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Skills</label>
      <p className={styles.fieldHint}>Enter your skills, separated by commas</p>
      <input
        className={styles.input}
        value={skills}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. React, TypeScript, Python, SQL..."
      />
    </div>
  </SectionShell>
);
