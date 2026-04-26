import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

export type AuthMode = 'company' | 'member';

interface Props {
  mode?: AuthMode;
  children: ReactNode;
}

export const AuthLayout = ({ mode = 'member', children }: Props) => (
  <div className={styles.container}>
    <div className={styles.imagePanel}>
      <div
        className={`${styles.placeholder} ${
          mode === 'company' ? styles.placeholderCompany : styles.placeholderMember
        }`}
      >
        {/* Drop an <img> here when ready */}
      </div>
    </div>

    <div className={styles.formPanel}>
      <div className={styles.formCard}>
        <div className={styles.logo}>
          <span className={styles.logoText}>
            Cougar<strong>CS</strong>
          </span>
        </div>
        {children}
      </div>
    </div>
  </div>
);
