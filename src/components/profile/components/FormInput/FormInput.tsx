import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import styles from './FormInput.module.css';

export const FormInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>((props, ref) => (
  <input {...props} ref={ref} className={styles.input} />
));
FormInput.displayName = 'FormInput';

export const FormSelect = forwardRef<HTMLSelectElement, ComponentProps<'select'>>(
  ({ children, ...props }, ref) => (
    <select {...props} ref={ref} className={styles.input}>
      {children}
    </select>
  ),
);
FormSelect.displayName = 'FormSelect';
