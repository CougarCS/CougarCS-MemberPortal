import { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import { ProfileNav, NAV_SECTIONS } from './ProfileNav';
import type { SectionId } from './ProfileNav';
import { BasicInfoSection } from '../../components/sections/BasicInfoSection';
import { EducationSection } from '../../components/sections/EducationSection';
import { ExperienceSection } from '../../components/sections/ExperienceSection';
import type { Experience, SaveState } from '../../components/sections/types';
import { SkillsSection } from '../../components/sections/SkillsSection';
import { ResumeSection } from '../../components/sections/ResumeSection';
import { WorkPrefsSection } from '../../components/sections/WorkPrefsSection';
import { LocationSection } from '../../components/sections/LocationSection';
import { IdentitiesSection } from '../../components/sections/IdentitiesSection';
import { loadProfile } from '../../lib/profile';
import {
  uploadHeadshot,
  getHeadshotUrl,
  uploadResume,
  getResumeSignedUrl,
} from '../../lib/storage';
import {
  saveBasicInfo,
  saveHeadshotPath,
  saveEducation,
  saveSkills,
  saveExperiences,
  saveResume,
  saveWorkPrefs,
  saveLocation,
  saveIdentities,
} from '../../lib/save';

export const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('basic-information');
  const [profileLoading, setProfileLoading] = useState(true);
  const [contactId, setContactId] = useState('');

  // Per-section save state
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({
    'basic-information': 'idle',
    education: 'idle',
    'professional-experience': 'idle',
    skills: 'idle',
    resume: 'idle',
    'work-preferences': 'idle',
    location: 'idle',
    'personal-identities': 'idle',
  });

  const setSaveState = useCallback(
    (section: string, state: SaveState) => setSaveStates((prev) => ({ ...prev, [section]: state })),
    [],
  );

  // Helper: run a save operation and transition the section state accordingly
  const doSave = useCallback(
    async (section: string, fn: () => Promise<boolean>) => {
      setSaveState(section, 'saving');
      const ok = await fn();
      if (ok) {
        setSaveState(section, 'saved');
        setTimeout(() => setSaveState(section, 'idle'), 3000);
      } else {
        setSaveState(section, 'unsaved');
      }
    },
    [setSaveState],
  );

  // Helper: mark a section unsaved whenever a field changes
  // Returns a wrapped setter that also fires the unsaved flag
  const f = useCallback(
    <T,>(setter: (v: T) => void, section: string) =>
      (v: T) => {
        setter(v);
        setSaveState(section, 'unsaved');
      },
    [setSaveState],
  );

  // Upload state
  const [headshotUrl, setHeadshotUrl] = useState('');
  const [uploadingHeadshot, setUploadingHeadshot] = useState(false);

  // Section fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [graduationMonth, setGraduationMonth] = useState('');
  const [gpa, setGpa] = useState('');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [resumePath, setResumePath] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [githubHandle, setGithubHandle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [openToRelocate, setOpenToRelocate] = useState(false);
  const [workEnvironments, setWorkEnvironments] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [authorizedToWork, setAuthorizedToWork] = useState(false);
  const [gender, setGender] = useState('');
  const [ethnicities, setEthnicities] = useState<string[]>([]);

  // Load profile data on mount
  useEffect(() => {
    loadProfile().then((data) => {
      if (!data) return;
      setContactId(data.contactId);
      if (data.headshotPath) setHeadshotUrl(getHeadshotUrl(data.headshotPath));
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setAboutMe(data.aboutMe);
      setMajor(data.major);
      setGraduationYear(data.graduationYear);
      setGraduationMonth(data.graduationMonth);
      setGpa(data.gpa);
      setExperiences(data.experiences);
      setSkills(data.skills);
      setLinkedinHandle(data.linkedinUrl);
      setResumePath(data.resumePath);
      setGithubHandle(data.githubUrl);
      setPortfolioUrl(data.portfolioUrl);
      setOpportunities(data.opportunities);
      setOpenToRelocate(data.openToRelocate);
      setWorkEnvironments(data.workEnvironments);
      setCity(data.city);
      setState(data.state);
      setZip(data.zip);
      setAuthorizedToWork(data.authorizedToWork);
      setGender(data.gender);
      setEthnicities(data.ethnicities);
      setProfileLoading(false);
    });
  }, []);

  // Scroll spy
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

  // File upload handlers
  const handleHeadshotFile = async (file: File) => {
    if (!contactId) return;
    setUploadingHeadshot(true);
    const path = await uploadHeadshot(contactId, file);
    if (path) {
      setHeadshotUrl(getHeadshotUrl(path));
      await saveHeadshotPath(contactId, path);
    }
    setUploadingHeadshot(false);
  };

  const handleResumeFile = async (file: File) => {
    if (!contactId) return;
    setUploadingResume(true);
    const path = await uploadResume(contactId, file);
    if (path) {
      setResumePath(path);
      setSaveState('resume', 'unsaved');
    }
    setUploadingResume(false);
  };

  const handleResumeDownload = async () => {
    if (!resumePath) return;
    const url = await getResumeSignedUrl(resumePath);
    if (url) window.open(url, '_blank');
  };

  // Section save handlers
  const handleSaveBasicInfo = () =>
    doSave('basic-information', () => saveBasicInfo(contactId, { firstName, lastName, aboutMe }));

  const handleSaveEducation = () =>
    doSave('education', () =>
      saveEducation(contactId, { major, graduationYear, graduationMonth, gpa }),
    );

  const handleSaveExperiences = () =>
    doSave('professional-experience', () => saveExperiences(contactId, experiences));

  const handleSaveSkills = () => doSave('skills', () => saveSkills(contactId, skills));

  const handleSaveResume = () =>
    doSave('resume', () =>
      saveResume(contactId, {
        linkedinUrl: linkedinHandle,
        githubUrl: githubHandle,
        portfolioUrl,
        resumePath,
      }),
    );

  const handleSaveWorkPrefs = () =>
    doSave('work-preferences', () =>
      saveWorkPrefs(contactId, { opportunities, openToRelocate, workEnvironments }),
    );

  const handleSaveLocation = () =>
    doSave('location', () => saveLocation(contactId, { city, state, zip, authorizedToWork }));

  const handleSaveIdentities = () =>
    doSave('personal-identities', () => saveIdentities(contactId, { gender, ethnicities }));

  if (profileLoading) return null;

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
            headshotUrl={headshotUrl}
            uploadingHeadshot={uploadingHeadshot}
            saveState={saveStates['basic-information']}
            onFirstName={f(setFirstName, 'basic-information')}
            onLastName={f(setLastName, 'basic-information')}
            onEmail={f(setEmail, 'basic-information')}
            onAboutMe={f(setAboutMe, 'basic-information')}
            onHeadshotFile={handleHeadshotFile}
            onSave={handleSaveBasicInfo}
          />
          <EducationSection
            major={major}
            graduationYear={graduationYear}
            graduationMonth={graduationMonth}
            gpa={gpa}
            saveState={saveStates['education']}
            onMajor={f(setMajor, 'education')}
            onGraduationYear={f(setGraduationYear, 'education')}
            onGraduationMonth={f(setGraduationMonth, 'education')}
            onGpa={f(setGpa, 'education')}
            onSave={handleSaveEducation}
          />
          <ExperienceSection
            experiences={experiences}
            saveState={saveStates['professional-experience']}
            onChange={f(setExperiences, 'professional-experience')}
            onSave={handleSaveExperiences}
          />
          <SkillsSection
            skills={skills}
            saveState={saveStates['skills']}
            onChange={f(setSkills, 'skills')}
            onSave={handleSaveSkills}
          />
          <ResumeSection
            linkedinHandle={linkedinHandle}
            githubHandle={githubHandle}
            portfolioUrl={portfolioUrl}
            resumePath={resumePath}
            uploadingResume={uploadingResume}
            saveState={saveStates['resume']}
            onLinkedin={f(setLinkedinHandle, 'resume')}
            onGithub={f(setGithubHandle, 'resume')}
            onPortfolio={f(setPortfolioUrl, 'resume')}
            onResumeFile={handleResumeFile}
            onResumeDownload={handleResumeDownload}
            onSave={handleSaveResume}
          />
          <WorkPrefsSection
            opportunities={opportunities}
            openToRelocate={openToRelocate}
            workEnvironments={workEnvironments}
            saveState={saveStates['work-preferences']}
            onOpportunities={f(setOpportunities, 'work-preferences')}
            onOpenToRelocate={f(setOpenToRelocate, 'work-preferences')}
            onWorkEnvironments={f(setWorkEnvironments, 'work-preferences')}
            onSave={handleSaveWorkPrefs}
          />
          <LocationSection
            city={city}
            state={state}
            zip={zip}
            authorizedToWork={authorizedToWork}
            saveState={saveStates['location']}
            onCity={f(setCity, 'location')}
            onState={f(setState, 'location')}
            onZip={f(setZip, 'location')}
            onAuthorizedToWork={f(setAuthorizedToWork, 'location')}
            onSave={handleSaveLocation}
          />
          <IdentitiesSection
            gender={gender}
            ethnicities={ethnicities}
            saveState={saveStates['personal-identities']}
            onGender={f(setGender, 'personal-identities')}
            onEthnicities={f(setEthnicities, 'personal-identities')}
            onSave={handleSaveIdentities}
          />
        </main>
      </div>
    </div>
  );
};
