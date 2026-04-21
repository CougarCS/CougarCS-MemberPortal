import type { ComponentProps } from 'react';
import styles from './OutlineButton.module.css';

export const OutlineButton = ({ children, ...props }: ComponentProps<'button'>) => (
  <button {...props} className={styles.outlineBtn}>
    {children}
  </button>
);
