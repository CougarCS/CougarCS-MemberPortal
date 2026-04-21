import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import styles from './page.module.css';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ProfileNav, NAV_SECTIONS } from '../../components/profile/ProfileNav/ProfileNav';
import type { SectionId } from '../../components/profile/ProfileNav/ProfileNav';
import { FIELD_TO_SECTION, DEFAULT_VALUES } from '../../lib/profileConfig';
import { BasicInfoSection } from '../../components/profile/BasicInfoSection/BasicInfoSection';
import { EducationSection } from '../../components/profile/EducationSection/EducationSection';
import { ExperienceSection } from '../../components/profile/ExperienceSection/ExperienceSection';
import { ResumeSection } from '../../components/profile/ResumeSection/ResumeSection';
import { WorkPrefsSection } from '../../components/profile/WorkPrefsSection/WorkPrefsSection';
import type { SaveState, ProfileFormValues } from '../../utils/types';
import { loadProfile } from '../../lib/profile';
import {
  saveBasicInfo,
  saveEducation,
  saveResumeLinks,
  uploadHeadshot,
  uploadResumeFile,
  saveWorkPrefs,
  saveLocation,
  saveIdentities,
  saveSkills,
} from '../../lib/save';
import { LocationSection } from '../../components/profile/LocationSection/LocationSection';
import { IdentitiesSection } from '../../components/profile/IdentitiesSection/IdentitiesSection';
import { SkillsSection } from '../../components/profile/SkillsSection/SkillsSection';

export const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('basic-information');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [headshotUrl, setHeadshotUrl] = useState('');
  const [uploadingHeadshot, setUploadingHeadshot] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({
    'basic-information': 'idle',
    education: 'idle',
    skills: 'idle',
    resume: 'idle',
    'work-preferences': 'idle',
    location: 'idle',
    'personal-identities': 'idle',
  });

  const setSaveState = useCallback((section: string, state: SaveState) => {
    setSaveStates((prev) => {
      return { ...prev, [section]: state };
    });
  }, []);

  const doSave = useCallback(
    async (section: string, fn: () => Promise<boolean>) => {
      setSaveState(section, 'saving');
      const ok = await fn();
      setSaveState(section, ok ? 'saved' : 'unsaved');

      if (ok) {
        setTimeout(() => {
          setSaveState(section, 'idle');
        }, 3000);
      }
    },
    [setSaveState],
  );

  const form = useForm<ProfileFormValues>({ defaultValues: DEFAULT_VALUES });
  const { watch, getValues, setValue, reset } = form;
  const initializedRef = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await loadProfile();

      if (!data) {
        setProfileError(false);
        setProfileLoading(false);
        return;
      }

      setHeadshotUrl(data.headshotUrl);
      reset(data);
      initializedRef.current = true;
      setProfileLoading(false);
    };

    fetchProfile();
  }, [reset]);

  useEffect(() => {
    const sub = watch((_, { name }) => {
      if (!initializedRef.current) {
        return;
      }
      const section = name && FIELD_TO_SECTION[name.split('.')[0]];
      if (section) {
        setSaveState(section, 'unsaved');
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch, setSaveState]);

  useEffect(() => {
    // this was causing the sidebar bug dont remove
    if (profileLoading) return;

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
      setActiveSection(current);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateActive);
    };
  }, [profileLoading]);

  const scrollToSection = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHeadshotFile = async (file: File) => {
    setUploadingHeadshot(true);
    const url = await uploadHeadshot(file);
    if (url) {
      setHeadshotUrl(url);
    }
    setUploadingHeadshot(false);
  };

  const handleResumeFile = async (file: File) => {
    setUploadingResume(true);
    const url = await uploadResumeFile(file);
    if (url) {
      setValue('resumeUrl', url);
    }
    setUploadingResume(false);
  };

  const handleResumeDownload = () => {
    const url = getValues('resumeUrl');
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleSaveBasicInfo = () => {
    return doSave('basic-information', () => {
      const { firstName, lastName, aboutMe } = getValues();
      return saveBasicInfo({ firstName, lastName, aboutMe });
    });
  };

  const handleSaveEducation = () => {
    return doSave('education', () => {
      const { major, graduationYear, graduationMonth, gpa } = getValues();
      return saveEducation({ major, graduationYear, graduationMonth, gpa });
    });
  };

  const handleSaveResumeLinks = () => {
    return doSave('resume', () => {
      const { linkedinHandle, githubHandle, portfolioUrl } = getValues();
      return saveResumeLinks({
        linkedinUrl: linkedinHandle,
        githubUrl: githubHandle,
        portfolioUrl,
      });
    });
  };

  const handleSaveSkills = () => {
    return doSave('skills', () => {
      return saveSkills(getValues('skills'));
    });
  };

  const handleSaveWorkPrefs = () => {
    return doSave('work-preferences', () => {
      const { opportunities, openToRelocate, workEnvironments } = getValues();
      return saveWorkPrefs({ opportunities, openToRelocate, workEnvironments });
    });
  };

  const handleSaveLocation = () => {
    return doSave('location', () => {
      const { city, state, zip, authorizedToWork } = getValues();
      return saveLocation({ city, state, zip, authorizedToWork });
    });
  };

  const handleSaveIdentities = () => {
    return doSave('personal-identities', () => {
      const { gender, ethnicities } = getValues();
      return saveIdentities({ gender, ethnicities });
    });
  };

  const mainComponent = profileError ? (
    <p style={{ padding: '2rem' }}>Failed to load profile. Please refresh the page.</p>
  ) : profileLoading ? (
    <p style={{ padding: '2rem' }}>Loading...</p>
  ) : (
    <div className={styles.body}>
      <ProfileNav activeSection={activeSection} onNavigate={scrollToSection} />
      <main className={styles.content}>
        <BasicInfoSection
          headshotUrl={headshotUrl}
          uploadingHeadshot={uploadingHeadshot}
          saveState={saveStates['basic-information']}
          onHeadshotFile={handleHeadshotFile}
          onSave={handleSaveBasicInfo}
        />
        <EducationSection saveState={saveStates['education']} onSave={handleSaveEducation} />
        <ExperienceSection />
        <SkillsSection saveState={saveStates['skills']} onSave={handleSaveSkills} />
        <ResumeSection
          uploadingResume={uploadingResume}
          saveState={saveStates['resume']}
          onResumeFile={handleResumeFile}
          onResumeDownload={handleResumeDownload}
          onSave={handleSaveResumeLinks}
        />
        <WorkPrefsSection saveState={saveStates['work-preferences']} onSave={handleSaveWorkPrefs} />
        <LocationSection saveState={saveStates['location']} onSave={handleSaveLocation} />
        <IdentitiesSection
          saveState={saveStates['personal-identities']}
          onSave={handleSaveIdentities}
        />
      </main>
    </div>
  );

  return (
    <FormProvider {...form}>
      <PageLayout>
        <PageHeader
          title="Your Profile"
          subtitle={<p className={styles.pageSubtitle}>Manage your CougarCS profile</p>}
        />
        {mainComponent}
      </PageLayout>
    </FormProvider>
  );
};
