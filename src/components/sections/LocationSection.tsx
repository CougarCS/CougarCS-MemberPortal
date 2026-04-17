import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { YesNo } from './YesNo';

interface Props {
  cityStateZip: string;
  authorizedToWork: boolean;
  onCityStateZip: (v: string) => void;
  onAuthorizedToWork: (v: boolean) => void;
}

export const LocationSection = ({
  cityStateZip,
  authorizedToWork,
  onCityStateZip,
  onAuthorizedToWork,
}: Props) => (
  <SectionShell
    id="location"
    title="Location"
    desc="Where you live and your work authorization status."
  >
    <div className={styles.fieldGroup}>
      <label className={styles.label}>City, State, Zip Code</label>
      <input
        className={styles.input}
        value={cityStateZip}
        onChange={(e) => onCityStateZip(e.target.value)}
        placeholder="Houston, TX 77004"
      />
    </div>

    <div className={styles.inlineRow}>
      <span className={styles.inlineLabel}>
        Are you authorized to work in the US without sponsorship?
      </span>
      <YesNo value={authorizedToWork} onChange={onAuthorizedToWork} />
    </div>
  </SectionShell>
);
