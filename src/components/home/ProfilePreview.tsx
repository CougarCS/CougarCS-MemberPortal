import { Link } from 'react-router';
import userIcon from '../../assets/icon-user.svg';
import styles from './ProfilePreview.module.css';

export interface MemberPreview {
  firstName: string;
  lastName: string;
  major: string;
  gradYear: string;
  skills: string[];
}

interface Props {
  member: MemberPreview;
}

export const ProfilePreview = ({ member }: Props) => (
  <section className={styles.section}>
    <div className={styles.header}>
      <h2 className={styles.label}>Your Profile</h2>
      <Link to="/profile" className={styles.editBtn}>
        Edit profile
      </Link>
    </div>

    <div className={styles.card}>
      <div className={styles.avatar}>
        <img src={userIcon} width="28" height="28" alt="" />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>
          {member.firstName} {member.lastName}
        </p>
        <p className={styles.meta}>
          {member.major} · Class of {member.gradYear}
        </p>
        <div className={styles.skills}>
          {member.skills.map((skill) => (
            <span key={skill} className={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
