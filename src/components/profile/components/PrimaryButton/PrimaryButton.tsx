import type { ComponentProps } from 'react';
import styles from './PrimaryButton.module.css';

export const PrimaryButton = ({ children, ...props }: ComponentProps<'button'>) => (
  <button {...props} className={styles.primaryBtn}>
    {children}
  </button>
);
