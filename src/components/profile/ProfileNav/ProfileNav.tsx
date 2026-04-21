import { useEffect, useState } from 'react';
import styles from './ProfileNav.module.css';

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
  onNavigate: (id: SectionId) => void;
}

export const ProfileNav = ({ onNavigate }: Props) => {
  const [activeSection, setActiveSection] = useState<SectionId>('basic-information');

  useEffect(() => {
    const updateActive = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      if (scrollY + windowH >= docH - 50) {
        setActiveSection(NAV_SECTIONS[NAV_SECTIONS.length - 1].id);
        return;
      }

      const threshold = scrollY + windowH * 0.25;
      let current: SectionId = NAV_SECTIONS[0].id;

      for (const { id } of NAV_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= threshold) {
          current = id;
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActive);
    };
  }, []);

  return (
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
};
