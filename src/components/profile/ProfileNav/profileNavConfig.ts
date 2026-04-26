export const NAV_SECTIONS = [
  { id: 'basic-information', label: 'Basic Information' },
  { id: 'education', label: 'Education' },
  { id: 'professional-experience', label: 'Professional Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume / Links' },
  { id: 'work-preferences', label: 'Work Preferences' },
  { id: 'location', label: 'Location' },
  { id: 'personal-identities', label: 'Personal Identities' },
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number]['id'];
