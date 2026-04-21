import type { ReactNode } from 'react';
import styles from './PageLayout.module.css';

export const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className={styles.page}>{children}</div>
);
