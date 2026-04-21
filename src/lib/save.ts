import { apiDelete, apiPatch, apiPatchForm, apiPost } from './api';
import { OPPORTUNITY_TYPE_DISPLAY_TO_DB, WORK_ENV_DISPLAY_TO_DB } from '../utils/profileMappings';
import { MONTHS } from '../utils/constants';
import type { Experience, Skill } from '../utils/types';

const monthNameToInt = (name: string): number | null => {
  const idx = MONTHS.indexOf(name);
  return idx >= 0 ? idx + 1 : null;
};

export const saveBasicInfo = async (data: {
  firstName: string;
  lastName: string;
  aboutMe: string;
}): Promise<boolean> => {
  return (
    (await apiPatch('/api/profile/basic-info', {
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      aboutMe: data.aboutMe || null,
    })) !== null
  );
};

export const saveEducation = async (data: {
  major: string;
  graduationYear: string;
  graduationMonth: string;
  gpa: string;
}): Promise<boolean> => {
  return (
    (await apiPatch('/api/profile/education', {
      major: data.major || null,
      gradYear: data.graduationYear ? parseInt(data.graduationYear, 10) : null,
      gradMonth: monthNameToInt(data.graduationMonth),
      gpa: data.gpa ? parseFloat(data.gpa) : null,
    })) !== null
  );
};

export const saveResumeLinks = async (data: {
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}): Promise<boolean> => {
  return (
    (await apiPatch('/api/profile/resume', {
      linkedInUrl: data.linkedinUrl || null,
      githubUrl: data.githubUrl || null,
      portfolioUrl: data.portfolioUrl || null,
    })) !== null
  );
};

export const uploadHeadshot = async (file: File): Promise<string | null> => {
  const form = new FormData();
  form.append('headshot', file);
  const res = await apiPatchForm<{ headshotUrl: string }>('/api/profile/headshot', form);
  return res?.headshotUrl ?? null;
};

export const uploadResumeFile = async (file: File): Promise<string | null> => {
  const form = new FormData();
  form.append('resume', file);
  const res = await apiPatchForm<{ resumeUrl: string }>('/api/profile/resume', form);
  return res?.resumeUrl ?? null;
};

export const saveWorkPrefs = async (data: {
  opportunities: string[];
  openToRelocate: boolean;
  workEnvironments: string[];
}): Promise<boolean> => {
  return (
    (await apiPatch('/api/profile/work-preferences', {
      opportunityTypes: data.opportunities.map((o) => {
        return OPPORTUNITY_TYPE_DISPLAY_TO_DB[o] ?? o;
      }),
      willingToRelocate: data.openToRelocate,
      workEnvironments: data.workEnvironments.map((e) => {
        return WORK_ENV_DISPLAY_TO_DB[e] ?? e;
      }),
    })) !== null
  );
};

export const saveLocation = async (data: {
  city: string;
  state: string;
  zip: string;
  authorizedToWork: boolean;
}): Promise<boolean> => {
  return (
    (await apiPatch('/api/profile/location', {
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      usWorkAuth: data.authorizedToWork,
    })) !== null
  );
};

export const saveIdentities = async (data: {
  gender: string;
  ethnicities: string[];
}): Promise<boolean> => {
  return (
    (await apiPatch('/api/profile/identities', {
      gender: data.gender || null,
      ethnicities: data.ethnicities,
    })) !== null
  );
};

export const saveSkills = async (skills: Skill[]): Promise<boolean> => {
  return (
    (await apiPatch('/api/profile/skills', {
      skillIds: skills.map((s) => {
        return s.id;
      }),
    })) !== null
  );
};

const experienceToApi = (data: Omit<Experience, 'id'>) => {
  return {
    title: data.title || null,
    company: data.company || null,
    startMonth: monthNameToInt(data.startMonth),
    startYear: data.startYear ? parseInt(data.startYear, 10) : null,
    endMonth: data.current ? null : monthNameToInt(data.endMonth),
    endYear: data.current ? null : data.endYear ? parseInt(data.endYear, 10) : null,
    current: data.current,
    location: data.location || null,
    description: data.description || null,
    skillIds: data.skills.map((s) => {
      return s.id;
    }),
  };
};

export const createExperience = async (
  data: Omit<Experience, 'id'>,
): Promise<Experience | null> => {
  return apiPost<Experience>('/api/profile/experience', experienceToApi(data));
};

export const updateExperience = async (
  id: string,
  data: Omit<Experience, 'id'>,
): Promise<boolean> => {
  return (await apiPatch(`/api/profile/experience/${id}`, experienceToApi(data))) !== null;
};

export const deleteExperience = async (id: string): Promise<boolean> => {
  return apiDelete(`/api/profile/experience/${id}`);
};
