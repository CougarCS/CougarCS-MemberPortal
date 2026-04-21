import { useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import styles from './ResumeSection.module.css';
import { SectionShell } from '../SectionShell/SectionShell';
import { FieldGroup } from '../components/FieldGroup/FieldGroup';
import { FormInput } from '../components/FormInput/FormInput';
import { OutlineButton } from '../../OutlineButton/OutlineButton';
import type { SaveState, ProfileFormValues } from '../../../utils/types';
import iconUpload from '../../../assets/icon-upload.svg';

interface Props {
  isSaving: boolean;
  saveState?: SaveState;
  onResumeFile: (file: File) => void;
  onResumeDownload: () => void;
  onSave?: () => void;
}

export const ResumeSection = ({
  isSaving,
  saveState,
  onResumeFile,
  onResumeDownload,
  onSave,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control, register } = useFormContext<ProfileFormValues>();
  const resumePath = useWatch({ control, name: 'resumeUrl' });
  const resumeFile = useWatch({ control, name: 'resumeFile' });
  const hasResume = Boolean(resumeFile || resumePath);

  return (
    <SectionShell
      id="resume"
      title="Resume / Links"
      desc="Upload your resume and add your links."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.uploadZone}>
        <img src={iconUpload} alt="" width={24} height={24} />
        {isSaving ? (
          <p className={styles.uploadPrompt}>Uploading...</p>
        ) : resumeFile ? (
          <>
            <p className={styles.uploadFileName}>{resumeFile.name}</p>
            <p className={styles.uploadHint}>Save to upload this file</p>
          </>
        ) : resumePath ? (
          <>
            <p className={styles.uploadFileName}>Resume on file</p>
            <OutlineButton type="button" onClick={onResumeDownload}>
              View Resume
            </OutlineButton>
          </>
        ) : (
          <>
            <p className={styles.uploadPrompt}>Upload your resume</p>
            <p className={styles.uploadHint}>PDF only; up to 1 MB</p>
          </>
        )}
        <OutlineButton
          type="button"
          disabled={isSaving}
          onClick={() => fileInputRef.current?.click()}
        >
          {hasResume ? 'Replace File' : 'Choose File'}
        </OutlineButton>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className={styles.hiddenInput}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onResumeFile(file);
            }
            e.target.value = '';
          }}
        />
      </div>

      <FieldGroup label="LinkedIn Profile">
        <div className={styles.prefixInput}>
          <span className={styles.prefix}>linkedin.com/in/</span>
          <input
            className={styles.inputAffix}
            {...register('linkedinHandle')}
            placeholder="your-handle"
          />
        </div>
      </FieldGroup>

      <FieldGroup
        label={
          <>
            GitHub <span className={styles.optionalTag}>Optional</span>
          </>
        }
      >
        <div className={styles.prefixInput}>
          <span className={styles.prefix}>github.com/</span>
          <input
            className={styles.inputAffix}
            {...register('githubHandle')}
            placeholder="your-username"
          />
        </div>
      </FieldGroup>

      <FieldGroup
        label={
          <>
            Portfolio <span className={styles.optionalTag}>Optional</span>
          </>
        }
      >
        <FormInput
          type="url"
          {...register('portfolioUrl')}
          placeholder="https://yourportfolio.com"
        />
      </FieldGroup>
    </SectionShell>
  );
};
