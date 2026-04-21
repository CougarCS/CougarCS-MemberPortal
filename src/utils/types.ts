export interface Skill {
  id: string;
  name: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startMonth: string; // month name e.g. "January"
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  location: string;
  description: string;
  skills: Skill[]; // selected skills (displayed by name, saved as IDs)
}

export type SaveState = 'idle' | 'unsaved' | 'saving' | 'saved';

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  aboutMe: string;
  headshotUrl: string;
  headshotFile: File | null;
  major: string;
  graduationYear: string;
  graduationMonth: string;
  gpa: string;
  experiences: Experience[];
  skills: Skill[]; // profile-level skills
  linkedinHandle: string;
  githubHandle: string;
  portfolioUrl: string;
  resumeUrl: string; // URL returned by the API (used to show/download resume)
  resumeFile: File | null;
  opportunities: string[]; // display strings e.g. "Full-time/New Grad"
  openToRelocate: boolean;
  workEnvironments: string[];
  city: string;
  state: string;
  zip: string;
  authorizedToWork: boolean;
  gender: string;
  ethnicities: string[];
}
