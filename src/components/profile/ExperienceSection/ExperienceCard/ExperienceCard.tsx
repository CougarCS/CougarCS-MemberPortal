import styles from './section.module.css';
import type { Experience } from '../../../../utils/types';
import iconEdit from '../../assets/icon-edit.svg';
import iconTrash from '../../assets/icon-trash.svg';

interface Props {
  exp: Experience;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export const ExperienceCard = ({ exp, onEdit, onDelete }: Props) => (
  <div className={styles.expCard}>
    <div className={styles.expCardHeader}>
      <div>
        <h3 className={styles.expTitle}>{exp.title}</h3>
        <p className={styles.expCompany}>{exp.company}</p>
        <p className={styles.expMeta}>
          {exp.startMonth} {exp.startYear} –{' '}
          {exp.current ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
        </p>
        {exp.location && <p className={styles.expMeta}>{exp.location}</p>}
      </div>
      <div className={styles.expCardActions}>
        <button type="button" className={styles.iconBtn} onClick={onEdit} aria-label="Edit">
          <img src={iconEdit} alt="Edit" width={15} height={15} />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => onDelete(exp.id)}
          aria-label="Delete"
        >
          <img src={iconTrash} alt="Delete" width={15} height={15} />
        </button>
      </div>
    </div>
    {exp.description && <p className={styles.expDesc}>{exp.description}</p>}
    {exp.skills.length > 0 && (
      <div className={styles.tagRow}>
        {exp.skills.map((s) => (
          <span key={s.id} className={styles.tag}>
            {s.name}
          </span>
        ))}
      </div>
    )}
  </div>
);
