import { useState } from 'react';
import styles from './page.module.css';

type LoginMode = 'company' | 'member';

export const LoginPage = () => {
  const [mode, setMode] = useState<LoginMode>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement auth
    console.log('Login attempt', { mode, email, password });
  };

  return (
    <div className={styles.container}>
      <div className={styles.imagePannel}>
        <div className={styles.imagePlaceholder}>{/* Image will go here */}</div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          {/* Logo */}
          <div className={styles.logo}>
            <span className={styles.logoText}>
              Cougar<strong>CS</strong>
            </span>
          </div>

          <h1 className={styles.heading}>Sign In</h1>
          <p className={styles.subheading}>
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
              className={`${styles.toggle} ${mode === 'member' ? styles.toggleRight : styles.toggleLeft}`}
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

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Continue
            </button>
          </form>

          <div className={styles.footer}>
            <a href="/forgot-password" className={styles.forgotLink}>
              Forgot your password?
            </a>
          </div>

          <div className={styles.signupPrompt}>
            Don&apos;t have an account?{' '}
            <a href="/signup" className={styles.signupLink}>
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
