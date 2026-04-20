import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { AuthLayout, authStyles } from '../../components/AuthLayout';
import type { AuthMode } from '../../components/AuthLayout';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  // mode is UI state (not a form field), so it stays as useState
  const [mode, setMode] = useState<AuthMode>('member');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    if (mode === 'company') {
      setError('root', { message: 'Company login is not yet available.' });
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError('root', { message: 'Invalid email or password.' });
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
          onClick={() => {
            setMode(mode === 'company' ? 'member' : 'company');
          }}
        >
          <span className={styles.toggleThumb} />
        </button>
        <span
          className={`${styles.toggleLabel} ${mode === 'member' ? styles.toggleLabelActive : ''}`}
        >
          Member
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={authStyles.form}>
        <div className={authStyles.fieldGroup}>
          <label htmlFor="email" className={authStyles.label}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
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
            {...register('password')}
            className={authStyles.input}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        {errors.root && <p className={authStyles.error}>{errors.root.message}</p>}

        <button
          type="submit"
          className={`${authStyles.submitBtn} ${mode === 'company' ? authStyles.submitBtnCompany : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Continue'}
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
