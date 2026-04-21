import type { ReactNode } from 'react';
import styles from './FieldGroup.module.css';

interface Props {
  label: ReactNode;
  children: ReactNode;
}

export const FieldGroup = ({ label, children }: Props) => (
  <div className={styles.fieldGroup}>
    <label className={styles.label}>{label}</label>
    {children}
  </div>
);
