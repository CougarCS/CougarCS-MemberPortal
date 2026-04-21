import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import styles from './page.module.css';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { ProfileNav } from '../../components/profile/ProfileNav/ProfileNav';
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
  saveWorkPrefs,
  saveLocation,
  saveIdentities,
  saveSkills,
} from '../../lib/save';
import { LocationSection } from '../../components/profile/LocationSection/LocationSection';
import { IdentitiesSection } from '../../components/profile/IdentitiesSection/IdentitiesSection';
import { SkillsSection } from '../../components/profile/SkillsSection/SkillsSection';

export const ProfilePage = () => {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

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
      if (prev[section] === state) {
        return prev;
      }

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
  const { subscribe, getValues, setValue, reset } = form;
  const initializedRef = useRef(false);
  const suppressSaveTrackingRef = useRef(false);

  const runWithoutSaveTracking = useCallback((fn: () => void) => {
    suppressSaveTrackingRef.current = true;

    try {
      fn();
    } finally {
      suppressSaveTrackingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await loadProfile();

      if (!data) {
        setProfileError(false);
        setProfileLoading(false);
        return;
      }

      reset(data);
      initializedRef.current = true;
      setProfileLoading(false);
    };

    fetchProfile();
  }, [reset]);

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ name }) => {
        if (!initializedRef.current || !name || suppressSaveTrackingRef.current) {
          return;
        }

        const section = FIELD_TO_SECTION[name.split('.')[0]];
        if (section) {
          setSaveState(section, 'unsaved');
        }
      },
    });

    return unsubscribe;
  }, [subscribe, setSaveState]);

  const scrollToSection = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHeadshotFile = (file: File) => {
    setValue('headshotFile', file);
  };

  const handleResumeFile = (file: File) => {
    setValue('resumeFile', file);
  };

  const handleResumeDownload = () => {
    const url = getValues('resumeUrl');
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleSaveBasicInfo = () => {
    return doSave('basic-information', async () => {
      const { firstName, lastName, aboutMe, headshotFile } = getValues();
      const result = await saveBasicInfo({ firstName, lastName, aboutMe, headshotFile });

      if (!result) {
        return false;
      }

      runWithoutSaveTracking(() => {
        if (result.headshotUrl) {
          setValue('headshotUrl', result.headshotUrl);
        }

        setValue('headshotFile', null);
      });

      return true;
    });
  };

  const handleSaveEducation = () => {
    return doSave('education', () => {
      const { major, graduationYear, graduationMonth, gpa } = getValues();
      return saveEducation({ major, graduationYear, graduationMonth, gpa });
    });
  };

  const handleSaveResumeLinks = () => {
    return doSave('resume', async () => {
      const { linkedinHandle, githubHandle, portfolioUrl, resumeFile } = getValues();
      const result = await saveResumeLinks({
        linkedinUrl: linkedinHandle,
        githubUrl: githubHandle,
        portfolioUrl,
        resumeFile,
      });

      if (!result) {
        return false;
      }

      runWithoutSaveTracking(() => {
        if (result.resumeUrl) {
          setValue('resumeUrl', result.resumeUrl);
        }

        setValue('resumeFile', null);
      });

      return true;
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
      <ProfileNav onNavigate={scrollToSection} />
      <main className={styles.content}>
        <BasicInfoSection
          isSaving={saveStates['basic-information'] === 'saving'}
          saveState={saveStates['basic-information']}
          onHeadshotFile={handleHeadshotFile}
          onSave={handleSaveBasicInfo}
        />
        <EducationSection saveState={saveStates['education']} onSave={handleSaveEducation} />
        <ExperienceSection />
        <SkillsSection saveState={saveStates['skills']} onSave={handleSaveSkills} />
        <ResumeSection
          isSaving={saveStates['resume'] === 'saving'}
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
