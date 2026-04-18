import { useRef } from 'react';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import type { SaveState } from './types';
import iconUser from '../../assets/icon-user.svg';

interface Props {
  firstName: string;
  lastName: string;
  email: string;
  aboutMe: string;
  headshotUrl: string;
  uploadingHeadshot: boolean;
  saveState?: SaveState;
  onFirstName: (v: string) => void;
  onLastName: (v: string) => void;
  onEmail: (v: string) => void;
  onAboutMe: (v: string) => void;
  onHeadshotFile: (file: File) => void;
  onSave?: () => void;
}

export const BasicInfoSection = ({
  firstName,
  lastName,
  email,
  aboutMe,
  headshotUrl,
  uploadingHeadshot,
  saveState,
  onFirstName,
  onLastName,
  onEmail,
  onAboutMe,
  onHeadshotFile,
  onSave,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <SectionShell
      id="basic-information"
      title="Basic Information"
      desc="The basics shown on your profile."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.photoRow}>
        <div className={styles.avatar}>
          {headshotUrl ? (
            <img
              src={headshotUrl}
              alt="Profile headshot"
              width={68}
              height={68}
              style={{ borderRadius: '50%', objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <img src={iconUser} alt="" width={32} height={32} />
          )}
        </div>
        <div>
          <p className={styles.photoHint}>
            Upload a professional photo
            <br />
            (max file size 5 MB)
          </p>
          <button
            type="button"
            className={styles.outlineBtn}
            disabled={uploadingHeadshot}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadingHeadshot ? 'Uploading...' : headshotUrl ? 'Replace Photo' : 'Upload Photo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onHeadshotFile(file);
              // Reset input so same file can be re-selected
              e.target.value = '';
            }}
          />
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
};
