import type { ReactNode } from 'react';
import styles from './PageHeader.module.css';

interface Props {
  title: string;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
}

export const PageHeader = ({ title, eyebrow, subtitle }: Props) => (
  <header className={styles.pageHeader}>
    {eyebrow}
    <h1 className={styles.pageTitle}>{title}</h1>
    {subtitle}
  </header>
);
