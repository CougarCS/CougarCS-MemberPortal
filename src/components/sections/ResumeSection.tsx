import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import iconUpload from '../../assets/icon-upload.svg';

interface Props {
  linkedinHandle: string;
  resumeFile: File | null;
  githubHandle: string;
  portfolioUrl: string;
  onLinkedin: (v: string) => void;
  onResume: (f: File | null) => void;
  onGithub: (v: string) => void;
  onPortfolio: (v: string) => void;
}

export const ResumeSection = ({
  linkedinHandle,
  resumeFile,
  githubHandle,
  portfolioUrl,
  onLinkedin,
  onResume,
  onGithub,
  onPortfolio,
}: Props) => (
  <SectionShell id="resume" title="Resume / Links" desc="Upload your resume and add your links.">
    <div className={styles.uploadZone}>
      <img src={iconUpload} alt="" width={24} height={24} />
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
