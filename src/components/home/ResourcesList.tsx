import { Link } from 'react-router';
import styles from './ResourcesList.module.css';

export interface Resource {
  label: string;
  description: string;
}

interface Props {
  resources: Resource[];
}

export const ResourcesList = ({ resources }: Props) => (
  <section className={styles.section}>
    <div className={styles.header}>
      <h2 className={styles.label}>Member Resources</h2>
      <Link to="/resources" className={styles.browseLink}>
        Browse all →
      </Link>
    </div>

    <div className={styles.list}>
      {resources.map((r, i) => (
        <Link
          to="/resources"
          key={r.label}
          className={`${styles.row} ${i === resources.length - 1 ? styles.rowLast : ''}`}
        >
          <div className={styles.text}>
            <p className={styles.resourceLabel}>{r.label}</p>
            <p className={styles.desc}>{r.description}</p>
          </div>
          <span className={styles.arrow}>→</span>
        </Link>
      ))}
    </div>
  </section>
);
