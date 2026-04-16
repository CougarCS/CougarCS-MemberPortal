import { useState } from 'react';
import { AuthLayout, authStyles } from '../../components/AuthLayout';
import type { AuthMode } from '../../components/AuthLayout';
import styles from './page.module.css';

export const LoginPage = () => {
  const [mode, setMode] = useState<AuthMode>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement auth
    console.log('Login attempt', { mode, email, password });
  };

  return (
    <AuthLayout mode={mode}>
      <h1 className={authStyles.heading}>Sign In</h1>
      <p className={authStyles.subheading}>
        {mode === 'company' ? 'Access your company dashboard' : 'Access your member portal'}
      </p>

      <div className={styles.toggleWrapper}>
        <span
          className={`${styles.toggleLabel} ${mode === 'company' ? styles.toggleLabelActive : ''}`}
        >
          Company
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={mode === 'member'}
          className={`${styles.toggle} ${
            mode === 'member' ? styles.toggleRight : styles.toggleLeft
          }`}
          onClick={() => setMode(mode === 'company' ? 'member' : 'company')}
        >
          <span className={styles.toggleThumb} />
        </button>
        <span
          className={`${styles.toggleLabel} ${mode === 'member' ? styles.toggleLabelActive : ''}`}
        >
          Member
        </span>
      </div>

      <form onSubmit={handleSubmit} className={authStyles.form}>
        <div className={authStyles.fieldGroup}>
          <label htmlFor="email" className={authStyles.label}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authStyles.input}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className={authStyles.fieldGroup}>
          <label htmlFor="password" className={authStyles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authStyles.input}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className={authStyles.submitBtn}>
          Continue
        </button>
      </form>

      <div className={authStyles.footer}>
        <a href="/forgot-password" className={authStyles.footerLink}>
          Forgot your password?
        </a>
      </div>

      <div className={authStyles.switchPrompt}>
        Don&apos;t have an account?{' '}
        <a href="/signup" className={authStyles.switchLink}>
          Sign Up
        </a>
      </div>
    </AuthLayout>
  );
};
