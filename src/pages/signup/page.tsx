import { useState } from 'react';
import { AuthLayout, authStyles } from '../../components/AuthLayout';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement registration
    console.log('Sign up attempt', { email, password });
  };

  return (
    <AuthLayout mode="member">
      <h1 className={authStyles.heading}>Create Account</h1>
      <p className={authStyles.subheading}>Prepare to propel your career</p>

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
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className={authStyles.submitBtn}>
          Create Account
        </button>
      </form>

      <div className={authStyles.switchPrompt}>
        Already have an account?{' '}
        <a href="/login" className={authStyles.switchLink}>
          Sign In
        </a>
      </div>
    </AuthLayout>
  );
};
