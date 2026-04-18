import { supabase } from './supabase';
import { OPPORTUNITY_TYPE_DISPLAY_TO_DB } from './profile';
import type { Experience } from '../components/sections/types';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const monthNameToInt = (name: string): number | null => {
  const idx = MONTH_NAMES.indexOf(name);
  return idx >= 0 ? idx + 1 : null;
};

// Upsert talent_profile by contact_id and return the talent_profile_id.
// Only the explicitly provided fields are written; other columns are untouched.
async function upsertTalentProfile(
  contactId: string,
  fields: Record<string, unknown>,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('talent_profile')
    .upsert({ contact_id: contactId, ...fields }, { onConflict: 'contact_id' })
    .select('talent_profile_id')
    .single();

  if (error) {
    console.error('talent_profile upsert error', error);
    return null;
  }
  return data?.talent_profile_id ?? null;
}

// Look up the talent_profile_id for a given contactId (returns null if no row yet).
async function getTalentProfileId(contactId: string): Promise<string | null> {
  const { data } = await supabase
    .from('talent_profile')
    .select('talent_profile_id')
    .eq('contact_id', contactId)
    .single();
  return data?.talent_profile_id ?? null;
}

// ---------------------------------------------------------------------------
// Section save functions — all return true on success, false on failure
// ---------------------------------------------------------------------------

export async function saveBasicInfo(
  contactId: string,
  data: { firstName: string; lastName: string; aboutMe: string },
): Promise<boolean> {
  const { error: contactError } = await supabase
    .from('contacts')
    .update({ first_name: data.firstName, last_name: data.lastName })
    .eq('contact_id', contactId);

  if (contactError) {
    console.error('contacts update error', contactError);
    return false;
  }

  const tpId = await upsertTalentProfile(contactId, { about_me: data.aboutMe });
  return tpId !== null;
}

export async function saveHeadshotPath(contactId: string, headshotPath: string): Promise<void> {
  await upsertTalentProfile(contactId, { headshot_path: headshotPath });
}

export async function saveEducation(
  contactId: string,
  data: {
    major: string;
    graduationYear: string;
    graduationMonth: string;
    gpa: string;
  },
): Promise<boolean> {
  const tpId = await upsertTalentProfile(contactId, {
    major: data.major || null,
    grad_year: data.graduationYear ? parseInt(data.graduationYear, 10) : null,
    grad_month: monthNameToInt(data.graduationMonth),
    gpa: data.gpa ? parseFloat(data.gpa) : null,
  });
  return tpId !== null;
}

export async function saveSkills(contactId: string, skillNames: string[]): Promise<boolean> {
  const tpId = await getTalentProfileId(contactId);
  if (!tpId) {
    // No talent_profile yet — create a minimal one, then retry
    const newId = await upsertTalentProfile(contactId, {});
    if (!newId) return false;
    return saveSkillsById(newId, skillNames);
  }
  return saveSkillsById(tpId, skillNames);
}

async function saveSkillsById(talentProfileId: string, skillNames: string[]): Promise<boolean> {
  const { error: delError } = await supabase
    .from('talent_profile_skill')
    .delete()
    .eq('talent_profile_id', talentProfileId);

  if (delError) {
    console.error('talent_profile_skill delete error', delError);
    return false;
  }

  if (skillNames.length === 0) return true;

  const { data: skillRows, error: fetchError } = await supabase
    .from('skill')
    .select('skill_id, name')
    .in('name', skillNames);

  if (fetchError || !skillRows) return false;

  const rows = skillRows.map((s: { skill_id: string; name: string }) => ({
    talent_profile_id: talentProfileId,
    skill_id: s.skill_id,
  }));

  const { error } = await supabase.from('talent_profile_skill').insert(rows);
  if (error) {
    console.error('talent_profile_skill insert error', error);
    return false;
  }
  return true;
}

export async function saveExperiences(
  contactId: string,
  experiences: Experience[],
): Promise<boolean> {
  const tpId = await getTalentProfileId(contactId);
  if (!tpId) {
    const newId = await upsertTalentProfile(contactId, {});
    if (!newId) return false;
    return saveExperiencesById(newId, experiences);
  }
  return saveExperiencesById(tpId, experiences);
}

async function saveExperiencesById(
  talentProfileId: string,
  experiences: Experience[],
): Promise<boolean> {
  // Delete all existing experiences (cascade deletes experience_skill rows too)
  const { error: delError } = await supabase
    .from('member_experience')
    .delete()
    .eq('talent_profile_id', talentProfileId);

  if (delError) {
    console.error('member_experience delete error', delError);
    return false;
  }

  if (experiences.length === 0) return true;

  const expRows = experiences.map((exp) => ({
    experience_id: exp.id,
    talent_profile_id: talentProfileId,
    title: exp.title || null,
    company: exp.company || null,
    start_month: monthNameToInt(exp.startMonth),
    start_year: exp.startYear ? parseInt(exp.startYear, 10) : null,
    end_month: exp.current ? null : monthNameToInt(exp.endMonth),
    end_year: exp.current || !exp.endYear ? null : parseInt(exp.endYear, 10),
    current: exp.current,
    location: exp.location || null,
    description: exp.description || null,
  }));

  const { error: insertError } = await supabase.from('member_experience').insert(expRows);

  if (insertError) {
    console.error('member_experience insert error', insertError);
    return false;
  }

  // Collect all unique skill names across experiences
  const allSkillNames = [
    ...new Set(
      experiences.flatMap((exp) =>
        exp.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    ),
  ];

  if (allSkillNames.length === 0) return true;

  const { data: skillRows } = await supabase
    .from('skill')
    .select('skill_id, name')
    .in('name', allSkillNames);

  if (!skillRows || skillRows.length === 0) return true;

  const skillMap = Object.fromEntries(
    (skillRows as { skill_id: string; name: string }[]).map((s) => [s.name, s.skill_id]),
  );

  const expSkillRows: { experience_id: string; skill_id: string }[] = [];
  for (const exp of experiences) {
    const names = exp.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const name of names) {
      const id = skillMap[name];
      if (id) expSkillRows.push({ experience_id: exp.id, skill_id: id });
    }
  }

  if (expSkillRows.length > 0) {
    const { error } = await supabase.from('experience_skill').insert(expSkillRows);
    if (error) console.error('experience_skill insert error', error);
  }

  return true;
}

export async function saveResume(
  contactId: string,
  data: {
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    resumePath: string;
  },
): Promise<boolean> {
  const tpId = await upsertTalentProfile(contactId, {
    linkedin_url: data.linkedinUrl || null,
    github_url: data.githubUrl || null,
    portfolio_url: data.portfolioUrl || null,
    resume_path: data.resumePath || null,
  });
  return tpId !== null;
}

export async function saveWorkPrefs(
  contactId: string,
  data: {
    opportunities: string[];
    openToRelocate: boolean;
    workEnvironments: string[];
  },
): Promise<boolean> {
  const tpId = await upsertTalentProfile(contactId, {
    opportunity_types: data.opportunities.map((o) => OPPORTUNITY_TYPE_DISPLAY_TO_DB[o] ?? o),
    willing_to_relocate: data.openToRelocate,
    work_environments: data.workEnvironments,
  });
  return tpId !== null;
}

export async function saveLocation(
  contactId: string,
  data: {
    city: string;
    state: string;
    zip: string;
    authorizedToWork: boolean;
  },
): Promise<boolean> {
  const tpId = await upsertTalentProfile(contactId, {
    city: data.city || null,
    state: data.state || null,
    zip: data.zip || null,
    us_work_auth: data.authorizedToWork,
  });
  return tpId !== null;
}

export async function saveIdentities(
  contactId: string,
  data: { gender: string; ethnicities: string[] },
): Promise<boolean> {
  const tpId = await upsertTalentProfile(contactId, {
    gender: data.gender || null,
    ethnicities: data.ethnicities,
  });
  return tpId !== null;
}
