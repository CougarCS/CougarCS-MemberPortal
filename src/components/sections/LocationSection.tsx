import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import { YesNo } from './YesNo';

interface Props {
  residesInUS: boolean;
  cityStateZip: string;
  authorizedToWork: boolean;
  onResidesInUS: (v: boolean) => void;
  onCityStateZip: (v: string) => void;
  onAuthorizedToWork: (v: boolean) => void;
}

export const LocationSection = ({
  residesInUS,
  cityStateZip,
  authorizedToWork,
  onResidesInUS,
  onCityStateZip,
  onAuthorizedToWork,
}: Props) => (
  <SectionShell
    id="location"
    title="Location"
    desc="Location matters. Tell us where you currently live."
  >
    <div className={styles.inlineRow}>
      <span className={styles.inlineLabel}>Do you currently reside in the United States?</span>
      <YesNo value={residesInUS} onChange={onResidesInUS} />
    </div>

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
