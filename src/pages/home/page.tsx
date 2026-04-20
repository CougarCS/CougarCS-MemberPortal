import styles from './page.module.css';
import { useGreeting } from '../../components/home/useGreeting';
import { MembershipStrip } from '../../components/home/MembershipStrip';
import { ProfilePreview } from '../../components/home/ProfilePreview';
import { ResourcesList } from '../../components/home/ResourcesList';
import type { Resource } from '../../components/home/ResourcesList';
import type { MemberPreview } from '../../components/home/ProfilePreview';

// temp fake data to populate this page
const MEMBER: MemberPreview & { memberSince: string; ptsThisSemester: number } = {
  firstName: 'Saul',
  lastName: 'Goodman',
  major: 'Computer Science',
  gradYear: '2026',
  skills: ['React', 'TypeScript', 'Python', 'Node.js'],
  memberSince: 'Spring 2025',
  ptsThisSemester: 24,
};

const RESOURCES: Resource[] = [
  {
    label: 'Resume & Interview Help',
    description: 'Write-ups, templates, and guides for recruiting season.',
  },
  {
    label: 'Event Slides & Recordings',
    description: 'Past workshop decks and session recordings.',
  },
  {
    label: 'Job Postings',
    description: 'Internship and full-time roles sent directly to CougarCS.',
  },
];

export const HomePage = () => {
  const greeting = useGreeting();

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.greeting}>{greeting},</p>
        <h1 className={styles.pageTitle}>
          {MEMBER.firstName} {MEMBER.lastName}
        </h1>
      </header>

      <div className={styles.body}>
        <main className={styles.content}>
          <MembershipStrip pts={MEMBER.ptsThisSemester} memberSince={MEMBER.memberSince} />
          <div className={styles.divider} />
          <ProfilePreview member={MEMBER} />
          <div className={styles.divider} />
          <ResourcesList resources={RESOURCES} />
        </main>
      </div>
    </div>
  );
};
