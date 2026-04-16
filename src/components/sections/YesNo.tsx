import styles from './section.module.css';

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export const YesNo = ({ value, onChange }: Props) => (
  <div className={styles.yesNo}>
    <button
      type="button"
      className={`${styles.yesNoBtn} ${value ? styles.yesNoActive : ''}`}
      onClick={() => onChange(true)}
    >
      Yes
    </button>
    <button
      type="button"
      className={`${styles.yesNoBtn} ${!value ? styles.yesNoActive : ''}`}
      onClick={() => onChange(false)}
    >
      No
    </button>
  </div>
);
