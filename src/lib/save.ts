import { apiDelete, apiPatch, apiPatchForm, apiPost } from './api';
import { OPPORTUNITY_TYPE_DISPLAY_TO_DB } from './profile';
import { MONTHS } from '../components/sections/constants';
import type { Experience, Skill } from '../components/sections/types';

const monthNameToInt = (name: string): number | null => {
  const idx = MONTHS.indexOf(name);
  return idx >= 0 ? idx + 1 : null;
};

export async function saveBasicInfo(data: {
  firstName: string;
  lastName: string;
  aboutMe: string;
}): Promise<boolean> {
  return (
    (await apiPatch('/api/profile/basic-info', {
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      aboutMe: data.aboutMe || null,
    })) !== null
  );
}

export async function saveEducation(data: {
  major: string;
  graduationYear: string;
  graduationMonth: string;
  gpa: string;
}): Promise<boolean> {
  return (
    (await apiPatch('/api/profile/education', {
      major: data.major || null,
      gradYear: data.graduationYear ? parseInt(data.graduationYear, 10) : null,
      gradMonth: monthNameToInt(data.graduationMonth),
      gpa: data.gpa ? parseFloat(data.gpa) : null,
    })) !== null
  );
}

export async function saveResumeLinks(data: {
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}): Promise<boolean> {
  return (
    (await apiPatch('/api/profile/resume', {
      linkedInUrl: data.linkedinUrl || null,
      githubUrl: data.githubUrl || null,
      portfolioUrl: data.portfolioUrl || null,
    })) !== null
  );
}

export async function uploadHeadshot(file: File): Promise<string | null> {
  const form = new FormData();
  form.append('headshot', file);
  const res = await apiPatchForm<{ headshotUrl: string }>('/api/profile/headshot', form);
  return res?.headshotUrl ?? null;
}

export async function uploadResumeFile(file: File): Promise<string | null> {
  const form = new FormData();
  form.append('resume', file);
  const res = await apiPatchForm<{ resumeUrl: string }>('/api/profile/resume', form);
  return res?.resumeUrl ?? null;
}

export async function saveWorkPrefs(data: {
  opportunities: string[];
  openToRelocate: boolean;
  workEnvironments: string[];
}): Promise<boolean> {
  return (
    (await apiPatch('/api/profile/work-preferences', {
      opportunityTypes: data.opportunities.map((o) => OPPORTUNITY_TYPE_DISPLAY_TO_DB[o] ?? o),
      willingToRelocate: data.openToRelocate,
      workEnvironments: data.workEnvironments,
    })) !== null
  );
}

export async function saveLocation(data: {
  city: string;
  state: string;
  zip: string;
  authorizedToWork: boolean;
}): Promise<boolean> {
  return (
    (await apiPatch('/api/profile/location', {
      city: data.city || null,
      state: data.state || null,
      zip: data.zip || null,
      usWorkAuth: data.authorizedToWork,
    })) !== null
  );
}

export async function saveIdentities(data: {
  gender: string;
  ethnicities: string[];
}): Promise<boolean> {
  return (
    (await apiPatch('/api/profile/identities', {
      gender: data.gender || null,
      ethnicities: data.ethnicities,
    })) !== null
  );
}

export async function saveSkills(skills: Skill[]): Promise<boolean> {
  return (await apiPatch('/api/profile/skills', { skillIds: skills.map((s) => s.id) })) !== null;
}

function experienceToApi(data: Omit<Experience, 'id'>) {
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
    skillIds: data.skills.map((s) => s.id),
  };
}

export async function createExperience(data: Omit<Experience, 'id'>): Promise<Experience | null> {
  return apiPost<Experience>('/api/profile/experience', experienceToApi(data));
}

export async function updateExperience(id: string, data: Omit<Experience, 'id'>): Promise<boolean> {
  return (await apiPatch(`/api/profile/experience/${id}`, experienceToApi(data))) !== null;
}

export async function deleteExperience(id: string): Promise<boolean> {
  return apiDelete(`/api/profile/experience/${id}`);
}
