import { supabase } from './supabase';
import { MONTHS } from '../components/sections/constants';
import type { Experience } from '../components/sections/types';

// Converts DB int month (1-12) to month name string
const monthIntToName = (m: number | null): string => (m != null ? (MONTHS[m - 1] ?? '') : '');

// Maps DB opportunity_type values → frontend display strings
export const OPPORTUNITY_TYPE_DB_TO_DISPLAY: Record<string, string> = {
  full_time: 'Full-time/New Grad',
  summer_internship: 'Summer Internship',
  semester_internship: 'Fall/Spring Internship/Co-op',
};

// Maps frontend display strings → DB values (inverse of above)
export const OPPORTUNITY_TYPE_DISPLAY_TO_DB: Record<string, string> = Object.fromEntries(
  Object.entries(OPPORTUNITY_TYPE_DB_TO_DISPLAY).map(([k, v]) => [v, k]),
);

export interface ProfileData {
  // Identity
  contactId: string;
  // Basic info
  firstName: string;
  lastName: string;
  email: string;
  aboutMe: string;
  headshotPath: string;
  // Education
  major: string;
  graduationYear: string;
  graduationMonth: string;
  gpa: string;
  // Skills
  skills: string[];
  // Links
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  resumePath: string;
  // Location
  city: string;
  state: string;
  zip: string;
  authorizedToWork: boolean;
  // Work prefs
  opportunities: string[];
  openToRelocate: boolean;
  workEnvironments: string[];
  // Identities
  gender: string;
  ethnicities: string[];
  // Experiences
  experiences: Experience[];
}

export async function loadProfile(): Promise<ProfileData | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch contact + talent_profile + profile skills in one query
  const { data: contact, error } = await supabase
    .from('contacts')
    .select(
      `
      contact_id,
      first_name,
      last_name,
      email,
      talent_profile (
        talent_profile_id,
        headshot_path,
        about_me,
        major,
        grad_year,
        grad_month,
        gpa,
        linkedin_url,
        github_url,
        portfolio_url,
        resume_path,
        city,
        state,
        zip,
        us_work_auth,
        opportunity_types,
        willing_to_relocate,
        work_environments,
        gender,
        ethnicities,
        talent_profile_skill (
          skill ( name )
        )
      )
    `,
    )
    .eq('user_id', user.id)
    .single();

  if (error || !contact) return null;

  // talent_profile is a reverse FK so Supabase returns it as an array
  const tp = Array.isArray(contact.talent_profile)
    ? contact.talent_profile[0]
    : contact.talent_profile;

  // Fetch experiences + their skills if a talent profile exists
  let experiences: Experience[] = [];

  if (tp?.talent_profile_id) {
    const { data: expRows } = await supabase
      .from('member_experience')
      .select(
        `
        experience_id,
        title,
        company,
        start_month,
        start_year,
        end_month,
        end_year,
        current,
        location,
        description,
        experience_skill (
          skill ( name )
        )
      `,
      )
      .eq('talent_profile_id', tp.talent_profile_id)
      .order('created_at', { ascending: true });

    if (expRows) {
      experiences = expRows.map((row) => ({
        id: row.experience_id,
        title: row.title ?? '',
        company: row.company ?? '',
        startMonth: monthIntToName(row.start_month),
        startYear: row.start_year?.toString() ?? '',
        endMonth: monthIntToName(row.end_month),
        endYear: row.end_year?.toString() ?? '',
        current: row.current ?? false,
        location: row.location ?? '',
        description: row.description ?? '',
        skills:
          row.experience_skill
            ?.map((es: { skill: { name: string }[] }) => es.skill[0]?.name ?? '')
            .filter(Boolean)
            .join(', ') ?? '',
      }));
    }
  }

  // Extract skill names from junction table
  const skillNames: string[] =
    tp?.talent_profile_skill
      ?.map((ts: { skill: { name: string }[] }) => ts.skill[0]?.name ?? '')
      .filter(Boolean) ?? [];

  return {
    contactId: contact.contact_id,
    firstName: contact.first_name ?? '',
    lastName: contact.last_name ?? '',
    email: contact.email ?? '',
    aboutMe: tp?.about_me ?? '',
    headshotPath: tp?.headshot_path ?? '',
    major: tp?.major ?? '',
    graduationYear: tp?.grad_year?.toString() ?? '',
    graduationMonth: monthIntToName(tp?.grad_month),
    gpa: tp?.gpa?.toString() ?? '',
    skills: skillNames,
    linkedinUrl: tp?.linkedin_url ?? '',
    githubUrl: tp?.github_url ?? '',
    portfolioUrl: tp?.portfolio_url ?? '',
    resumePath: tp?.resume_path ?? '',
    city: tp?.city ?? '',
    state: tp?.state ?? '',
    zip: tp?.zip ?? '',
    authorizedToWork: tp?.us_work_auth ?? false,
    opportunities: (tp?.opportunity_types ?? []).map(
      (v: string) => OPPORTUNITY_TYPE_DB_TO_DISPLAY[v] ?? v,
    ),
    openToRelocate: tp?.willing_to_relocate ?? false,
    workEnvironments: tp?.work_environments ?? [],
    gender: tp?.gender ?? '',
    ethnicities: tp?.ethnicities ?? [],
    experiences,
  };
}
