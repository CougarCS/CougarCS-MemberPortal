import styles from './section.module.css';
import { SectionShell } from './SectionShell';

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  aboutMe: string;
  onFirstName: (v: string) => void;
  onLastName: (v: string) => void;
  onEmail: (v: string) => void;
  onAboutMe: (v: string) => void;
}

export const BasicInfoSection = ({
  firstName,
  lastName,
  email,
  aboutMe,
  onFirstName,
  onLastName,
  onEmail,
  onAboutMe,
}: Props) => (
  <SectionShell
    id="basic-information"
    title="Basic Information"
    desc="This will be displayed on your profile"
  >
    <div className={styles.photoRow}>
      <div className={styles.avatar}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
      <div>
        <p className={styles.photoHint}>
          Upload a professional photo
          <br />
          (max file size 50 MB)
        </p>
        <button type="button" className={styles.outlineBtn}>
          Upload Photo
        </button>
      </div>
    </div>

    <div className={styles.fieldRow}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>First Name</label>
        <input
          className={styles.input}
          value={firstName}
          onChange={(e) => onFirstName(e.target.value)}
        />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Last Name</label>
        <input
          className={styles.input}
          value={lastName}
          onChange={(e) => onLastName(e.target.value)}
        />
      </div>
    </div>

    <div className={styles.fieldGroup}>
      <label className={styles.label}>Email Address</label>
      <input
        className={styles.input}
        type="email"
        value={email}
        onChange={(e) => onEmail(e.target.value)}
      />
    </div>

    <div className={styles.fieldGroup}>
      <label className={styles.label}>About me</label>
      <p className={styles.fieldHint}>Nobody is quite like you. Tell us why!</p>
      <textarea
        className={styles.textarea}
        rows={5}
        value={aboutMe}
        onChange={(e) => onAboutMe(e.target.value.slice(0, 1000))}
      />
      <span className={styles.charCount}>{aboutMe.length}/1000</span>
    </div>
  </SectionShell>
);
