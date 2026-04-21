import type { ReactNode } from 'react';
import styles from './InlineRow.module.css';

interface Props {
  label: ReactNode;
  children: ReactNode;
}

export const InlineRow = ({ label, children }: Props) => (
  <div className={styles.inlineRow}>
    <span className={styles.inlineLabel}>{label}</span>
    {children}
  </div>
);
