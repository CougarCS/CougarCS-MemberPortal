import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import styles from './FormInput.module.css';

export const FormInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input {...props} ref={ref} className={[styles.input, className].filter(Boolean).join(' ')} />
  ),
);
FormInput.displayName = 'FormInput';

export const FormSelect = forwardRef<HTMLSelectElement, ComponentProps<'select'>>(
  ({ children, className, ...props }, ref) => (
    <select {...props} ref={ref} className={[styles.input, className].filter(Boolean).join(' ')}>
      {children}
    </select>
  ),
);
FormSelect.displayName = 'FormSelect';
