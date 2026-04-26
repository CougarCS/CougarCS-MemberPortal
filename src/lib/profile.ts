import { apiGet } from './api';
import { MONTHS } from '../utils/constants';
import { OPPORTUNITY_TYPE_DB_TO_DISPLAY, WORK_ENV_DB_TO_DISPLAY } from '../utils/profileMappings';
import type { Skill, Experience, ProfileFormValues } from '../utils/types';

const monthIntToName = (m: number | null | undefined): string => {
  return m != null ? (MONTHS[m - 1] ?? '') : '';
};

interface ApiExperience {
  id: string;
  title: string | null;
  company: string | null;
  startMonth: number | null;
  startYear: number | null;
  endMonth: number | null;
  endYear: number | null;
  current: boolean;
  location: string | null;
  description: string | null;
  skills: Skill[];
}

interface ApiProfile {
  firstName: string;
  lastName: string;
  email: string;
  aboutMe: string | null;
  headshotUrl: string | null;
  major: string | null;
  graduationYear: number | null;
  graduationMonth: number | null;
  gpa: number | null;
  skills: Skill[];
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  usWorkAuth: boolean;
  opportunityTypes: string[];
  willingToRelocate: boolean;
  workEnvironments: string[];
  gender: string | null;
  ethnicities: string[];
  experiences: ApiExperience[];
}

const uniqueSkills = (skills: Skill[]): Skill[] => {
  return Array.from(new Map(skills.map((skill) => [skill.id, skill])).values());
};

export const loadProfile = async (): Promise<ProfileFormValues | null> => {
  const raw = await apiGet<ApiProfile>('/api/profile');
  if (!raw) {
    return null;
  }

  const experienceSkills = (raw.experiences ?? []).flatMap((e) => e.skills ?? []);
  const allSkills = uniqueSkills([...(raw.skills ?? []), ...experienceSkills]);

  return {
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    email: raw.email ?? '',
    aboutMe: raw.aboutMe ?? '',
    headshotUrl: raw.headshotUrl ?? '',
    headshotFile: null,
    major: raw.major ?? '',
    graduationYear: raw.graduationYear?.toString() ?? '',
    graduationMonth: monthIntToName(raw.graduationMonth),
    gpa: raw.gpa?.toString() ?? '',
    skills: allSkills,
    linkedinHandle: raw.linkedinUrl ?? '',
    githubHandle: raw.githubUrl ?? '',
    portfolioUrl: raw.portfolioUrl ?? '',
    resumeUrl: raw.resumeUrl ?? '',
    resumeFile: null,
    city: raw.city ?? '',
    state: raw.state ?? '',
    zip: raw.zip ?? '',
    authorizedToWork: raw.usWorkAuth ?? false,
    opportunities: (raw.opportunityTypes ?? []).map((v) => {
      return OPPORTUNITY_TYPE_DB_TO_DISPLAY[v] ?? v;
    }),
    openToRelocate: raw.willingToRelocate ?? false,
    workEnvironments: (raw.workEnvironments ?? []).map((v) => {
      return WORK_ENV_DB_TO_DISPLAY[v] ?? v;
    }),
    gender: raw.gender ?? '',
    ethnicities: raw.ethnicities ?? [],
    experiences: (raw.experiences ?? []).map(
      (e): Experience => ({
        id: e.id,
        title: e.title ?? '',
        company: e.company ?? '',
        startMonth: monthIntToName(e.startMonth),
        startYear: e.startYear?.toString() ?? '',
        endMonth: monthIntToName(e.endMonth),
        endYear: e.endYear?.toString() ?? '',
        current: e.current ?? false,
        location: e.location ?? '',
        description: e.description ?? '',
        skills: e.skills ?? [],
      }),
    ),
  };
};

export const loadAllSkills = async (): Promise<Skill[]> => {
  const data = await apiGet<Skill[]>('/api/skills');
  return data ?? [];
};

export interface ApiMe {
  firstName: string;
  lastName: string;
  email: string;
  headshotUrl: string | null;
}

export const loadMe = async (): Promise<ApiMe | null> => {
  return apiGet<ApiMe>('/api/me');
};
