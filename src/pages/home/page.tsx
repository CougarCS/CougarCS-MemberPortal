import styles from './page.module.css';
import { useGreeting } from '../../components/home/useGreeting';
import { MemberStatusCard } from '../../components/home/MemberStatusCard';
import { LeaderboardCard } from '../../components/home/LeaderboardCard';
import type { LeaderboardEntry } from '../../components/home/LeaderboardCard';
import { EventsRow } from '../../components/home/EventsRow';
import type { Event } from '../../components/home/EventsRow';
import { ResourcesList } from '../../components/home/ResourcesList';
import type { Resource } from '../../components/home/ResourcesList';

// temp fake data to populate this page
const MEMBER = {
  firstName: 'Saul',
  lastName: 'Goodman',
  memberSince: 'Spring 2025',
  ptsThisSemester: 24,
};

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Vultorz C.', pts: 142 },
  { rank: 2, name: 'Justmango H.', pts: 118 },
  { rank: 3, name: 'John D.', pts: 97 },
  { rank: 5, name: 'Saul G.', pts: 24, isCurrentUser: true },
];

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Intro to React',
    date: 'Saturday, Apr 25',
    time: '5:30pm–7:00pm',
    description: 'Beginner workshop on React fundamentals.',
    flyerUrl:
      'https://plus.unsplash.com/premium_photo-1719297388945-76b5b5a42d43?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '2',
    title: 'Resume Review',
    date: 'Tuesday, Apr 28',
    time: '4:00pm–6:00pm',
    description: 'Get your resume reviewed by industry professionals.',
    flyerUrl:
      'https://plus.unsplash.com/premium_photo-1719297388945-76b5b5a42d43?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '3',
    title: 'LeetCode Night',
    date: 'Saturday, May 2',
    time: '6:00pm–8:00pm',
    description: 'Weekly competitive programming session.',
    flyerUrl:
      'https://plus.unsplash.com/premium_photo-1719297388945-76b5b5a42d43?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '4',
    title: 'Industry Panel',
    date: 'Thursday, May 7',
    time: '5:00pm–6:30pm',
    description: 'Hear from engineers at top tech companies.',
    flyerUrl:
      'https://plus.unsplash.com/premium_photo-1719297388945-76b5b5a42d43?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '5',
    title: 'Hackathon Kickoff',
    date: 'Sunday, May 10',
    time: '10:00am–11:00pm',
    description: '24-hour hackathon presented by CougarCS.',
    flyerUrl:
      'https://plus.unsplash.com/premium_photo-1719297388945-76b5b5a42d43?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '5',
    title: 'Hackathon Kickoff',
    date: 'Sunday, May 10',
    time: '10:00am–11:00pm',
    description: '24-hour hackathon presented by CougarCS.',
    flyerUrl:
      'https://plus.unsplash.com/premium_photo-1719297388945-76b5b5a42d43?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

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
        <div className={styles.row1}>
          <MemberStatusCard
            ptsThisSemester={MEMBER.ptsThisSemester}
            memberSince={MEMBER.memberSince}
          />
          <LeaderboardCard entries={LEADERBOARD} />
        </div>

        <div className={styles.row2}>
          <EventsRow events={EVENTS} />
        </div>

        <div className={styles.row3}>
          <div className={styles.resourcesCard}>
            <ResourcesList resources={RESOURCES} />
          </div>
        </div>
      </div>
    </div>
  );
};
