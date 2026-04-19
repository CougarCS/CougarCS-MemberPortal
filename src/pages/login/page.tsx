import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout, authStyles } from '../../components/AuthLayout';
import type { AuthMode } from '../../components/AuthLayout';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

export const LoginPage = () => {
  const [mode, setMode] = useState<AuthMode>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'company') {
      setError('Company login is not yet available.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    navigate('/profile');
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
          } ${mode === 'company' ? styles.toggleCompany : ''}`}
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

        {error && <p className={authStyles.error}>{error}</p>}

        <button
          type="submit"
          className={`${authStyles.submitBtn} ${mode === 'company' ? authStyles.submitBtnCompany : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Continue'}
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
