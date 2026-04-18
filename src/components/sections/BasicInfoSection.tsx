import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import type { SaveState, ProfileFormValues } from './types';
import iconUser from '../../assets/icon-user.svg';

interface Props {
  headshotUrl: string;
  uploadingHeadshot: boolean;
  saveState?: SaveState;
  onHeadshotFile: (file: File) => void;
  onSave?: () => void;
}

export const BasicInfoSection = ({
  headshotUrl,
  uploadingHeadshot,
  saveState,
  onHeadshotFile,
  onSave,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, watch } = useFormContext<ProfileFormValues>();
  const aboutMe = watch('aboutMe') ?? '';

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
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>First Name</label>
          <input className={styles.input} {...register('firstName')} />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Last Name</label>
          <input className={styles.input} {...register('lastName')} />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Email Address</label>
        <input className={styles.input} type="email" {...register('email')} />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>About me</label>
        <p className={styles.fieldHint}>Nobody is quite like you. Tell us why!</p>
        <textarea className={styles.textarea} rows={5} maxLength={1000} {...register('aboutMe')} />
        <span className={styles.charCount}>{aboutMe.length}/1000</span>
      </div>
    </SectionShell>
  );
};
