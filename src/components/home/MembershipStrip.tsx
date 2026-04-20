import styles from './MembershipStrip.module.css';

interface Props {
  pts: number;
  memberSince: string;
}

export const MembershipStrip = ({ pts, memberSince }: Props) => (
  <div className={styles.strip}>
    <div className={styles.cell}>
      <span className={styles.dot} />
      <span className={styles.activeLabel}>Active</span>
    </div>
    <div className={`${styles.cell} ${styles.cellBorder}`}>
      <span className={styles.value}>{pts} pts</span>
      <span className={styles.meta}>this semester</span>
    </div>
    <div className={`${styles.cell} ${styles.cellBorder}`}>
      <span className={styles.meta}>Member since</span>
      <span className={styles.value}>{memberSince}</span>
    </div>
    <div className={`${styles.cell} ${styles.cellBorder}`}>
      <span className={styles.meta}>Member until</span>
      <span className={styles.value}>{'June 2026'}</span>
    </div>
  </div>
);
