import type { ReactNode } from 'react';
import styles from './section.module.css';

interface Props {
  id: string;
  title: string;
  desc: string;
  children: ReactNode;
}

export const SectionShell = ({ id, title, desc, children }: Props) => (
  <section id={id} className={styles.section}>
    <div className={styles.sectionMeta}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionDesc}>{desc}</p>
    </div>
    <div className={styles.sectionFields}>{children}</div>
  </section>
);
