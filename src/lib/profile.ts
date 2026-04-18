import { apiGet } from './api';
import { MONTHS } from '../components/sections/constants';
import type { Skill, Experience, ProfileFormValues } from '../components/sections/types';

export const OPPORTUNITY_TYPE_DB_TO_DISPLAY: Record<string, string> = {
  full_time: 'Full-time/New Grad',
  summer_internship: 'Summer Internship',
  semester_internship: 'Fall/Spring Internship/Co-op',
};

export const OPPORTUNITY_TYPE_DISPLAY_TO_DB: Record<string, string> = Object.fromEntries(
  Object.entries(OPPORTUNITY_TYPE_DB_TO_DISPLAY).map(([k, v]) => [v, k]),
);

const monthIntToName = (m: number | null | undefined): string =>
  m != null ? (MONTHS[m - 1] ?? '') : '';

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

export interface ProfileData extends ProfileFormValues {
  headshotUrl: string;
}

export async function loadProfile(): Promise<ProfileData | null> {
  const raw = await apiGet<ApiProfile>('/api/profile');
  if (!raw) return null;

  return {
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    email: raw.email ?? '',
    aboutMe: raw.aboutMe ?? '',
    headshotUrl: raw.headshotUrl ?? '',
    major: raw.major ?? '',
    graduationYear: raw.graduationYear?.toString() ?? '',
    graduationMonth: monthIntToName(raw.graduationMonth),
    gpa: raw.gpa?.toString() ?? '',
    skills: raw.skills ?? [],
    linkedinHandle: raw.linkedinUrl ?? '',
    githubHandle: raw.githubUrl ?? '',
    portfolioUrl: raw.portfolioUrl ?? '',
    resumeUrl: raw.resumeUrl ?? '',
    city: raw.city ?? '',
    state: raw.state ?? '',
    zip: raw.zip ?? '',
    authorizedToWork: raw.usWorkAuth ?? false,
    opportunities: (raw.opportunityTypes ?? []).map((v) => OPPORTUNITY_TYPE_DB_TO_DISPLAY[v] ?? v),
    openToRelocate: raw.willingToRelocate ?? false,
    workEnvironments: raw.workEnvironments ?? [],
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
}

export async function loadAllSkills(): Promise<Skill[]> {
  const data = await apiGet<Skill[]>('/api/skills');
  return data ?? [];
}
