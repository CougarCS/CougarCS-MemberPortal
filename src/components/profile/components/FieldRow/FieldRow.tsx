import type { ReactNode } from 'react';
import styles from './FieldRow.module.css';

export const FieldRow = ({ children }: { children: ReactNode }) => (
  <div className={styles.fieldRow}>{children}</div>
);
