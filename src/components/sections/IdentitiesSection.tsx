import styles from './section.module.css';
import { SectionShell } from './SectionShell';

const ETHNICITIES = [
  'Asian/Asian-American',
  'South Asian/South Asian-American',
  'Black/African-American',
  'Indigenous/Native American',
  'Latinx/Hispanic',
  'Middle Eastern/North African',
  'Native Hawaiian/Pacific Islander',
  'White/Caucasian',
  "I'm not certain of my ancestry",
  "I don't wish to identify",
];

interface Props {
  gender: string;
  ethnicities: string[];
  onGender: (v: string) => void;
  onEthnicities: (v: string[]) => void;
}

export const IdentitiesSection = ({ gender, ethnicities, onGender, onEthnicities }: Props) => {
  const toggle = (v: string) =>
    onEthnicities(
      ethnicities.includes(v) ? ethnicities.filter((e) => e !== v) : [...ethnicities, v],
    );

  return (
    <SectionShell
      id="personal-identities"
      title="Personal Identities"
      desc="You are more than what's on your resume and our companies are looking for people just like you."
    >
      <div className={styles.fieldGroup}>
        <label className={styles.label}>What is your gender?</label>
        <div className={styles.pillGroup}>
          {['Male', 'Female', 'Non-Binary'].map((g) => (
            <button
              key={g}
              type="button"
              className={`${styles.pill} ${gender === g ? styles.pillActive : ''}`}
              onClick={() => onGender(gender === g ? '' : g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          What is your racial/ethnic identity? (Select all that apply)
        </label>
        <div className={styles.pillGroup}>
          {ETHNICITIES.map((e) => (
            <button
              key={e}
              type="button"
              className={`${styles.pill} ${ethnicities.includes(e) ? styles.pillActive : ''}`}
              onClick={() => toggle(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};
