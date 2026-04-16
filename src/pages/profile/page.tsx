import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { BasicInfoSection } from '../../components/sections/BasicInfoSection';
import { ExperienceSection } from '../../components/sections/ExperienceSection';
import type { Experience } from '../../components/sections/ExperienceSection';
import { SkillsSection } from '../../components/sections/SkillsSection';
import { ResumeSection } from '../../components/sections/ResumeSection';
import { IdentitiesSection } from '../../components/sections/IdentitiesSection';
import { LocationSection } from '../../components/sections/LocationSection';
import { WorkPrefsSection } from '../../components/sections/WorkPrefsSection';
import { QualificationsSection } from '../../components/sections/QualificationsSection';

const NAV_SECTIONS = [
  { id: 'basic-information', label: 'Basic Information' },
  { id: 'professional-experience', label: 'Professional Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume' },
  { id: 'personal-identities', label: 'Personal Identities' },
  { id: 'location', label: 'Location' },
  { id: 'work-preferences', label: 'Work Preferences' },
  { id: 'qualifications', label: 'Qualifications' },
] as const;

export const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('basic-information');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [gender, setGender] = useState('');
  const [ethnicities, setEthnicities] = useState<string[]>([]);
  const [residesInUS, setResidesInUS] = useState(false);
  const [cityStateZip, setCityStateZip] = useState('');
  const [authorizedToWork, setAuthorizedToWork] = useState(false);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [openToRelocate, setOpenToRelocate] = useState(false);
  const [relocateTo, setRelocateTo] = useState('');
  const [workEnvironments, setWorkEnvironments] = useState<string[]>([]);
  const [graduationYear, setGraduationYear] = useState('');
  const [graduationMonth, setGraduationMonth] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 },
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Your Profile</h1>
        <p className={styles.pageSubtitle}>Manage your CougarCS profile</p>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {NAV_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={`${styles.navItem} ${activeSection === id ? styles.navItemActive : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.content}>
          <BasicInfoSection
            firstName={firstName}
            lastName={lastName}
            email={email}
            aboutMe={aboutMe}
            onFirstName={setFirstName}
            onLastName={setLastName}
            onEmail={setEmail}
            onAboutMe={setAboutMe}
          />
          <ExperienceSection experiences={experiences} onChange={setExperiences} />
          <SkillsSection skills={skills} onChange={setSkills} />
          <ResumeSection
            linkedinHandle={linkedinHandle}
            resumeFile={resumeFile}
            onLinkedin={setLinkedinHandle}
            onResume={setResumeFile}
          />
          <IdentitiesSection
            gender={gender}
            ethnicities={ethnicities}
            onGender={setGender}
            onEthnicities={setEthnicities}
          />
          <LocationSection
            residesInUS={residesInUS}
            cityStateZip={cityStateZip}
            authorizedToWork={authorizedToWork}
            onResidesInUS={setResidesInUS}
            onCityStateZip={setCityStateZip}
            onAuthorizedToWork={setAuthorizedToWork}
          />
          <WorkPrefsSection
            opportunities={opportunities}
            openToRelocate={openToRelocate}
            relocateTo={relocateTo}
            workEnvironments={workEnvironments}
            onOpportunities={setOpportunities}
            onOpenToRelocate={setOpenToRelocate}
            onRelocateTo={setRelocateTo}
            onWorkEnvironments={setWorkEnvironments}
          />
          <QualificationsSection
            graduationYear={graduationYear}
            graduationMonth={graduationMonth}
            onGraduationYear={setGraduationYear}
            onGraduationMonth={setGraduationMonth}
          />
        </main>
      </div>
    </div>
  );
};
