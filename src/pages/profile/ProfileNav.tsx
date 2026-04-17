import styles from './page.module.css';

export const NAV_SECTIONS = [
  { id: 'basic-information', label: 'Basic Information' },
  { id: 'education', label: 'Education' },
  { id: 'professional-experience', label: 'Professional Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume / Links' },
  { id: 'work-preferences', label: 'Work Preferences' },
  { id: 'location', label: 'Location' },
  { id: 'personal-identities', label: 'Personal Identities' },
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number]['id'];

interface Props {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export const ProfileNav = ({ activeSection, onNavigate }: Props) => (
  <aside className={styles.sidebar}>
    <nav className={styles.nav}>
      {NAV_SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`${styles.navItem} ${activeSection === id ? styles.navItemActive : ''}`}
          onClick={() => onNavigate(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  </aside>
);
