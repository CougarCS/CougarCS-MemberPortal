import { useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styles from './BasicInfoSection.module.css';
import { SectionShell } from '../SectionShell/SectionShell';
import { FieldGroup } from '../components/FieldGroup/FieldGroup';
import { FieldRow } from '../components/FieldRow/FieldRow';
import { FormInput } from '../components/FormInput/FormInput';
import { OutlineButton } from '../../OutlineButton/OutlineButton';
import type { SaveState, ProfileFormValues } from '../../../utils/types';
import iconUser from '../../../assets/icon-user.svg';

interface Props {
  headshotUrl: string;
  uploadingHeadshot: boolean;
  saveState?: SaveState;
  onHeadshotFile: (file: File) => void;
  onSave?: () => void;
}

const AboutMeCharCount = () => {
  const { control } = useFormContext<ProfileFormValues>();
  const aboutMe = useWatch({ control, name: 'aboutMe' }) ?? '';

  return <span className={styles.charCount}>{aboutMe.length}/1000</span>;
};

export const BasicInfoSection = ({
  headshotUrl,
  uploadingHeadshot,
  saveState,
  onHeadshotFile,
  onSave,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register } = useFormContext<ProfileFormValues>();

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
              className={styles.avatarImg}
            />
          ) : (
            <img src={iconUser} alt="" width={32} height={32} />
          )}
        </div>
        <div>
          <p className={styles.photoHint}>
            Upload a professional photo
            <br />
            (max file size 2 MB)
          </p>
          <OutlineButton
            type="button"
            disabled={uploadingHeadshot}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadingHeadshot ? 'Uploading...' : headshotUrl ? 'Replace Photo' : 'Upload Photo'}
          </OutlineButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={styles.hiddenInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onHeadshotFile(file);
              }
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <FieldRow>
        <FieldGroup label="First Name">
          <FormInput {...register('firstName')} />
        </FieldGroup>
        <FieldGroup label="Last Name">
          <FormInput {...register('lastName')} />
        </FieldGroup>
      </FieldRow>

      <FieldGroup label="Email Address">
        <FormInput type="email" {...register('email')} disabled />
      </FieldGroup>

      <FieldGroup label="About me">
        <textarea className={styles.textarea} rows={5} maxLength={1000} {...register('aboutMe')} />
        <AboutMeCharCount />
      </FieldGroup>
    </SectionShell>
  );
};
