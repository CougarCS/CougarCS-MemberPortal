import { useRef } from 'react';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import type { SaveState } from './types';
import iconUpload from '../../assets/icon-upload.svg';

interface Props {
  linkedinHandle: string;
  githubHandle: string;
  portfolioUrl: string;
  resumePath: string;
  uploadingResume: boolean;
  saveState?: SaveState;
  onLinkedin: (v: string) => void;
  onGithub: (v: string) => void;
  onPortfolio: (v: string) => void;
  onResumeFile: (file: File) => void;
  onResumeDownload: () => void;
  onSave?: () => void;
}

export const ResumeSection = ({
  linkedinHandle,
  githubHandle,
  portfolioUrl,
  resumePath,
  uploadingResume,
  saveState,
  onLinkedin,
  onGithub,
  onPortfolio,
  onResumeFile,
  onResumeDownload,
  onSave,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        {uploadingResume ? (
          <p className={styles.uploadPrompt}>Uploading...</p>
        ) : resumePath ? (
          <>
            <p className={styles.uploadFileName}>Resume on file</p>
            <button type="button" className={styles.outlineBtn} onClick={onResumeDownload}>
              View Resume
            </button>
          </>
        ) : (
          <>
            <p className={styles.uploadPrompt}>Upload your resume</p>
            <p className={styles.uploadHint}>PDF, DOC, DOCX — up to 10 MB</p>
          </>
        )}
        <button
          type="button"
          className={styles.outlineBtn}
          disabled={uploadingResume}
          onClick={() => fileInputRef.current?.click()}
        >
          {resumePath ? 'Replace File' : 'Choose File'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onResumeFile(file);
            e.target.value = '';
          }}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>LinkedIn Profile</label>
        <div className={styles.prefixInput}>
          <span className={styles.prefix}>linkedin.com/in/</span>
          <input
            className={styles.inputAffix}
            value={linkedinHandle}
            onChange={(e) => onLinkedin(e.target.value)}
            placeholder="your-handle"
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          GitHub <span className={styles.optionalTag}>Optional</span>
        </label>
        <div className={styles.prefixInput}>
          <span className={styles.prefix}>github.com/</span>
          <input
            className={styles.inputAffix}
            value={githubHandle}
            onChange={(e) => onGithub(e.target.value)}
            placeholder="your-username"
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Portfolio <span className={styles.optionalTag}>Optional</span>
        </label>
        <input
          className={styles.input}
          type="url"
          value={portfolioUrl}
          onChange={(e) => onPortfolio(e.target.value)}
          placeholder="https://yourportfolio.com"
        />
      </div>
    </SectionShell>
  );
};
