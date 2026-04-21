import styles from './LeaderboardCard.module.css';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  pts: number;
  isCurrentUser?: boolean;
}

interface Props {
  entries: LeaderboardEntry[];
}

const Row = ({ entry, isLast }: { entry: LeaderboardEntry; isLast: boolean }) => (
  <div
    className={[
      styles.row,
      entry.isCurrentUser ? styles.rowCurrent : '',
      isLast ? styles.rowLast : '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <span className={styles.rank}>{entry.rank}</span>
    <span className={styles.name}>
      {entry.name}
      {entry.isCurrentUser && <span className={styles.youBadge}>you</span>}
    </span>
    <span className={styles.pts}>{entry.pts} pts</span>
  </div>
);

export const LeaderboardCard = ({ entries }: Props) => {
  const top3 = entries.slice(0, 3);
  const currentUser = entries.find((e) => e.isCurrentUser);
  const currentUserInTop3 = top3.some((e) => e.isCurrentUser);
  const showTail = Boolean(currentUser && !currentUserInTop3);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.label}>Leaderboard</h2>
      </div>

      <div className={styles.list}>
        {top3.map((entry, i) => (
          <Row key={entry.rank} entry={entry} isLast={!showTail && i === top3.length - 1} />
        ))}

        {showTail && currentUser && (
          <>
            <div className={styles.separator}>
              <span className={styles.separatorDots}>···</span>
            </div>
            <Row entry={currentUser} isLast />
          </>
        )}
      </div>
    </section>
  );
};
