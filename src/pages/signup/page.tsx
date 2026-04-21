import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { AuthLayout, authStyles } from '../../components/AuthLayout/AuthLayout';
import { supabase } from '../../lib/supabase';

type SignupFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>();

  const onSubmit = async (data: SignupFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError('root', { message: 'Passwords do not match.' });
      return;
    }

    if (data.password.length < 8) {
      setError('root', { message: 'Password must be at least 8 characters.' });
      return;
    }

    const { data: eligible, error: checkError } = await supabase.rpc(
      'check_membership_eligibility',
      { p_email: data.email },
    );

    const SIGNUP_ERROR =
      'Sign-up failed. If you have an active membership and this problem persists, reach out in our Discord.';

    if (checkError || !eligible) {
      setError('root', { message: SIGNUP_ERROR });
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (signUpError) {
      setError('root', { message: SIGNUP_ERROR });
      return;
    }

    navigate('/check-email');
  };

  return (
    <AuthLayout mode="member">
      <h1 className={authStyles.heading}>Create Account</h1>
      <p className={authStyles.subheading}>Prepare to propel your career</p>

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
            placeholder="Enter your password"
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
            {...register('confirmPassword')}
            className={authStyles.input}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
          />
        </div>

        {errors.root && <p className={authStyles.error}>{errors.root.message}</p>}

        <button type="submit" className={authStyles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
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
