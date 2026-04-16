import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { YesNo } from './YesNo';

const OPPORTUNITY_TYPES = [
  'Board Service',
  'Gig/Contract Work',
  'Full-time Employment',
  'Networking',
  'Part-time Employment',
  'Speaking Engagements',
  'Volunteering Opportunities',
];

const WORK_ENVIRONMENTS = ['Remote', 'In-Person', 'Hybrid'];

interface Props {
  opportunities: string[];
  openToRelocate: boolean;
  relocateTo: string;
  workEnvironments: string[];
  onOpportunities: (v: string[]) => void;
  onOpenToRelocate: (v: boolean) => void;
  onRelocateTo: (v: string) => void;
  onWorkEnvironments: (v: string[]) => void;
}

export const WorkPrefsSection = ({
  opportunities,
  openToRelocate,
  relocateTo,
  workEnvironments,
  onOpportunities,
  onOpenToRelocate,
  onRelocateTo,
  onWorkEnvironments,
}: Props) => {
  const toggleOpp = (v: string) =>
    onOpportunities(
      opportunities.includes(v) ? opportunities.filter((o) => o !== v) : [...opportunities, v],
    );
  const toggleEnv = (v: string) =>
    onWorkEnvironments(
      workEnvironments.includes(v)
        ? workEnvironments.filter((e) => e !== v)
        : [...workEnvironments, v],
    );

  return (
    <SectionShell
      id="work-preferences"
      title="Work Preferences"
      desc="Tell us the opportunities and locations you are looking for."
    >
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          What kind of opportunities are you seeking? (Select all that apply)
        </label>
        <div className={styles.pillGroup}>
          {OPPORTUNITY_TYPES.map((o) => (
            <button
              key={o}
              type="button"
              className={`${styles.pill} ${opportunities.includes(o) ? styles.pillActive : ''}`}
              onClick={() => toggleOpp(o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inlineRow}>
        <span className={styles.inlineLabel}>Are you open to relocating for an opportunity?</span>
        <YesNo value={openToRelocate} onChange={onOpenToRelocate} />
      </div>

      {openToRelocate && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Where are you willing to relocate? (Add all that apply)
          </label>
          <input
            className={styles.input}
            value={relocateTo}
            onChange={(e) => onRelocateTo(e.target.value)}
            placeholder="Search for a city / state"
          />
        </div>
      )}

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          What work environment(s) are you interested in? (Select all that apply)
        </label>
        <div className={styles.pillGroup}>
          {WORK_ENVIRONMENTS.map((env) => (
            <button
              key={env}
              type="button"
              className={`${styles.pill} ${workEnvironments.includes(env) ? styles.pillActive : ''}`}
              onClick={() => toggleEnv(env)}
            >
              {env}
            </button>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};
