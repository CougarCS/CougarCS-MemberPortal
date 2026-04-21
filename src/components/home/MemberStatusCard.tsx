import styles from './MemberStatusCard.module.css';

interface Props {
  ptsThisSemester: number;
  memberSince: string;
  memberUntil?: string;
}

export const MemberStatusCard = ({
  ptsThisSemester,
  memberSince,
  memberUntil = 'June 2026',
}: Props) => (
  <section className={styles.section}>
    <div className={styles.head}>
      <h2 className={styles.label}>Member Status</h2>
      <span className={styles.activePill}>
        <span className={styles.dot} />
        Active
      </span>
    </div>

    <div className={styles.ptsBlock}>
      <span className={styles.ptsValue}>{ptsThisSemester}</span>
      <span className={styles.ptsMeta}>pts this semester</span>
    </div>

    <div className={styles.footer}>
      <div className={styles.footerItem}>
        <span className={styles.footerLabel}>Member since</span>
        <span className={styles.footerValue}>{memberSince}</span>
      </div>
      <div className={styles.footerItem}>
        <span className={styles.footerLabel}>Member until</span>
        <span className={styles.footerValue}>{memberUntil}</span>
      </div>
    </div>
  </section>
);
