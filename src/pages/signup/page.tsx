import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthLayout, authStyles } from '../../components/AuthLayout';
import { supabase } from '../../lib/supabase';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    // Check for active membership before creating an account
    const { data: eligible, error: checkError } = await supabase.rpc(
      'check_membership_eligibility',
      { p_email: email },
    );

    if (checkError || !eligible) {
      setError('No active CougarCS membership found for this email.');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('An account already exists for this email.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
      return;
    }

    navigate('/check-email');
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

        <div className={authStyles.fieldGroup}>
          <label htmlFor="confirmPassword" className={authStyles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={authStyles.input}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className={authStyles.error}>{error}</p>}

        <button type="submit" className={authStyles.submitBtn} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
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
