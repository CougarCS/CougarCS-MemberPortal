export const OPPORTUNITY_TYPE_DB_TO_DISPLAY: Record<string, string> = {
  full_time: 'Full-time/New Grad',
  summer_internship: 'Summer Internship',
  semester_internship: 'Fall/Spring Internship/Co-op',
};

export const OPPORTUNITY_TYPE_DISPLAY_TO_DB: Record<string, string> = Object.fromEntries(
  Object.entries(OPPORTUNITY_TYPE_DB_TO_DISPLAY).map(([k, v]) => {
    return [v, k];
  }),
);

export const WORK_ENV_DB_TO_DISPLAY: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  in_person: 'In-Person',
};

export const WORK_ENV_DISPLAY_TO_DB: Record<string, string> = Object.fromEntries(
  Object.entries(WORK_ENV_DB_TO_DISPLAY).map(([k, v]) => {
    return [v, k];
  }),
);
