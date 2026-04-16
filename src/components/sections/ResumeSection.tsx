import styles from './section.module.css';
import { SectionShell } from './SectionShell';

interface Props {
  linkedinHandle: string;
  resumeFile: File | null;
  onLinkedin: (v: string) => void;
  onResume: (f: File | null) => void;
}

export const ResumeSection = ({ linkedinHandle, resumeFile, onLinkedin, onResume }: Props) => (
  <SectionShell id="resume" title="Resume" desc="Choose a source to power your profile">
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

    <div className={styles.orDivider}>
      <span>Or</span>
    </div>

    <div className={styles.uploadZone}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      {resumeFile ? (
        <p className={styles.uploadFileName}>{resumeFile.name}</p>
      ) : (
        <>
          <p className={styles.uploadPrompt}>Upload your resume</p>
          <p className={styles.uploadHint}>PDF, DOC, DOCX — up to 10 MB</p>
        </>
      )}
      <label className={styles.outlineBtn} style={{ cursor: 'pointer' }}>
        {resumeFile ? 'Replace File' : 'Choose File'}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={(e) => onResume(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  </SectionShell>
);
