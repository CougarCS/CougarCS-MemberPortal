import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { ProfileNav, NAV_SECTIONS } from './ProfileNav';
import type { SectionId } from './ProfileNav';
import { BasicInfoSection } from '../../components/sections/BasicInfoSection';
import { EducationSection } from '../../components/sections/EducationSection';
import { ExperienceSection } from '../../components/sections/ExperienceSection';
import type { Experience } from '../../components/sections/types';
import { SkillsSection } from '../../components/sections/SkillsSection';
import { ResumeSection } from '../../components/sections/ResumeSection';
import { WorkPrefsSection } from '../../components/sections/WorkPrefsSection';
import { LocationSection } from '../../components/sections/LocationSection';
import { IdentitiesSection } from '../../components/sections/IdentitiesSection';

export const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('basic-information');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [graduationMonth, setGraduationMonth] = useState('');
  const [gpa, setGpa] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [githubHandle, setGithubHandle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [openToRelocate, setOpenToRelocate] = useState(false);
  const [workEnvironments, setWorkEnvironments] = useState<string[]>([]);
  const [cityStateZip, setCityStateZip] = useState('');
  const [authorizedToWork, setAuthorizedToWork] = useState(false);
  const [gender, setGender] = useState('');
  const [ethnicities, setEthnicities] = useState<string[]>([]);

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
        if (el && el.offsetTop <= threshold) current = id;
      }
      setActiveSection(current);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  const scrollToSection = (id: SectionId) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Your Profile</h1>
        <p className={styles.pageSubtitle}>Manage your CougarCS profile</p>
      </header>

      <div className={styles.body}>
        <ProfileNav activeSection={activeSection} onNavigate={scrollToSection} />

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
          <EducationSection
            major={major}
            graduationYear={graduationYear}
            graduationMonth={graduationMonth}
            gpa={gpa}
            onMajor={setMajor}
            onGraduationYear={setGraduationYear}
            onGraduationMonth={setGraduationMonth}
            onGpa={setGpa}
          />
          <ExperienceSection experiences={experiences} onChange={setExperiences} />
          <SkillsSection skills={skills} onChange={setSkills} />
          <ResumeSection
            linkedinHandle={linkedinHandle}
            resumeFile={resumeFile}
            githubHandle={githubHandle}
            portfolioUrl={portfolioUrl}
            onLinkedin={setLinkedinHandle}
            onResume={setResumeFile}
            onGithub={setGithubHandle}
            onPortfolio={setPortfolioUrl}
          />
          <WorkPrefsSection
            opportunities={opportunities}
            openToRelocate={openToRelocate}
            workEnvironments={workEnvironments}
            onOpportunities={setOpportunities}
            onOpenToRelocate={setOpenToRelocate}
            onWorkEnvironments={setWorkEnvironments}
          />
          <LocationSection
            cityStateZip={cityStateZip}
            authorizedToWork={authorizedToWork}
            onCityStateZip={setCityStateZip}
            onAuthorizedToWork={setAuthorizedToWork}
          />
          <IdentitiesSection
            gender={gender}
            ethnicities={ethnicities}
            onGender={setGender}
            onEthnicities={setEthnicities}
          />
        </main>
      </div>
    </div>
  );
};
