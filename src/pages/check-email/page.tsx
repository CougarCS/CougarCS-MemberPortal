import { AuthLayout, authStyles } from '../../components/AuthLayout/AuthLayout';
import emailIcon from '../../assets/email.svg';
import styles from './page.module.css';

export const CheckEmailPage = () => {
  return (
    <AuthLayout mode="member">
      <div className={styles.iconWrapper}>
        <img src={emailIcon} alt="" className={styles.icon} />
      </div>

      <h1 className={authStyles.heading}>Check your email</h1>
      <p className={authStyles.subheading}>
        We sent a confirmation link to your email address. Click it to activate your account.
      </p>

      <div className={styles.note}>
        Didn&apos;t receive it? Check your spam folder or{' '}
        <a href="/signup" className={styles.noteLink}>
          try again
        </a>
        .
      </div>

      <div className={authStyles.switchPrompt}>
        Already confirmed?{' '}
        <a href="/login" className={authStyles.switchLink}>
          Sign In
        </a>
      </div>
    </AuthLayout>
  );
};
