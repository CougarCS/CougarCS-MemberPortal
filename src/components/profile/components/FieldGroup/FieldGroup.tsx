import type { ReactNode } from 'react';
import styles from './FieldGroup.module.css';

interface Props {
  label: ReactNode;
  children: ReactNode;
  error?: ReactNode;
}

export const FieldGroup = ({ label, children, error }: Props) => (
  <div className={styles.fieldGroup}>
    <label className={styles.label}>{label}</label>
    <div className={styles.control} data-invalid={error ? 'true' : undefined}>
      {children}
    </div>
    {error && <p className={styles.errorText}>{error}</p>}
  </div>
);
