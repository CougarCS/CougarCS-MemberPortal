import type { ReactNode, ComponentProps } from 'react';
import styles from './PillGroup.module.css';

export const PillGroup = ({ children }: { children: ReactNode }) => (
  <div className={styles.pillGroup}>{children}</div>
);

interface PillProps extends ComponentProps<'button'> {
  active?: boolean;
}

export const Pill = ({ active = false, children, ...props }: PillProps) => (
  <button {...props} className={`${styles.pill}${active ? ` ${styles.pillActive}` : ''}`}>
    {children}
  </button>
);
