import { z } from 'zod';
import { MONTHS } from '../utils/constants';
import {
  OPPORTUNITY_TYPE_DB_TO_DISPLAY,
  OPPORTUNITY_TYPE_DISPLAY_TO_DB,
  WORK_ENV_DB_TO_DISPLAY,
  WORK_ENV_DISPLAY_TO_DB,
} from '../utils/profileMappings';
import type { Experience, ProfileFormValues } from '../utils/types';
import type { ValidationResult } from '../utils/formValidation';

type ProfileField = keyof ProfileFormValues;
type ExperienceField = keyof Omit<Experience, 'id'>;

const monthSchema = z
  .number()
  .int()
  .min(1, 'Select a valid month.')
  .max(12, 'Select a valid month.');
const uuidSchema = z.string().uuid('Invalid skill selected.');
const uniqueUuidArraySchema = z
  .array(uuidSchema)
  .refine((ids) => new Set(ids).size === ids.length, 'Remove duplicate skills.');
const nullableStringSchema = z.string().nullable();
const optionalNullableStringSchema = z.string().nullable().optional();
const fourDigitYearSchema = z
  .number()
  .int('Year must be a whole number.')
  .min(1000, 'Year must be 4 digits.')
  .max(9999, 'Year must be 4 digits.');
const opportunityTypeSchema = z
  .string()
  .refine((value) => value in OPPORTUNITY_TYPE_DB_TO_DISPLAY, {
    message: 'Select a valid opportunity type.',
  });
const workEnvironmentSchema = z.string().refine((value) => value in WORK_ENV_DB_TO_DISPLAY, {
  message: 'Select a valid work environment.',
});

export const experienceSchema = z
  .object({
    title: nullableStringSchema,
    company: nullableStringSchema,
    startMonth: monthSchema.nullable().optional(),
    startYear: fourDigitYearSchema.nullable().optional(),
    endMonth: monthSchema.nullable().optional(),
    endYear: fourDigitYearSchema.nullable().optional(),
    current: z.boolean().optional(),
    location: nullableStringSchema.optional(),
    description: nullableStringSchema.optional(),
    skillIds: uniqueUuidArraySchema.optional(),
  })
  .strict();

export const saveProfileBodySchema = z
  .object({
    about_me: z.string().optional(),
    major: z.string().optional(),
    grad_year: z.number().int().optional(),
    grad_month: monthSchema.optional(),
    gpa: z.number().optional(),
    linkedin_url: z.string().optional(),
    github_url: z.string().optional(),
    portfolio_url: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    us_work_auth: z.boolean().optional(),
    opportunity_types: z.array(opportunityTypeSchema).optional(),
    willing_to_relocate: z.boolean().optional(),
    work_environments: z.array(workEnvironmentSchema).optional(),
    gender: z.string().optional(),
    ethnicities: z.array(z.string()).optional(),
    skill_ids: z.array(uuidSchema).optional(),
  })
  .strict();

export const basicInfoBodySchema = z
  .object({
    firstName: z.string().max(100, 'First name must be 100 characters or less.'),
    lastName: z.string().max(100, 'Last name must be 100 characters or less.'),
    aboutMe: z.string().max(1000, 'About me must be 1000 characters or less.'),
  })
  .strict();

export const educationBodySchema = z
  .object({
    major: optionalNullableStringSchema,
    gradYear: fourDigitYearSchema.nullable(),
    gradMonth: monthSchema.nullable(),
    gpa: z
      .number()
      .min(0, 'GPA must be between 0 and 4.')
      .max(4, 'GPA must be between 0 and 4.')
      .nullable(),
  })
  .strict();

export const resumeBodySchema = z
  .object({
    linkedInUrl: z.string(),
    githubUrl: z.string(),
    portfolioUrl: z
      .string()
      .refine(
        (value) => !value.trim() || value.trim().startsWith('https://'),
        'Portfolio URL must start with https://.',
      ),
  })
  .strict();

export const workPreferencesBodySchema = z
  .object({
    opportunityTypes: z.array(opportunityTypeSchema),
    willingToRelocate: z.boolean(),
    workEnvironments: z.array(workEnvironmentSchema),
  })
  .strict();

export const locationBodySchema = z
  .object({
    city: optionalNullableStringSchema,
    state: optionalNullableStringSchema.refine(
      (value) => value == null || /^[A-Za-z]{2}$/.test(value),
      'State must be two letters.',
    ),
    zip: optionalNullableStringSchema.refine(
      (value) => value == null || /^\d{5}(-?\d{4})?$/.test(value),
      'Zip code must be 5 digits or 9 digits for ZIP+4.',
    ),
    usWorkAuth: z.boolean(),
  })
  .strict();

export const identitiesBodySchema = z
  .object({
    gender: optionalNullableStringSchema,
    ethnicities: z.array(z.string()),
  })
  .strict();

export const skillsBodySchema = z
  .object({
    skillIds: uniqueUuidArraySchema,
  })
  .strict();

const emptyToNull = (value: string) => {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
};

const numberOrNull = (value: string) => {
  const trimmed = value.trim();

  return trimmed ? Number(trimmed) : null;
};

const monthNameToInt = (name: string): number | null => {
  const index = MONTHS.indexOf(name);

  return index >= 0 ? index + 1 : null;
};

const resultFromZod = <TField extends string>(
  result: z.ZodSafeParseResult<unknown>,
  fieldMap: Record<string, TField>,
): ValidationResult<TField> => {
  if (result.success) {
    return { isValid: true, errors: {} };
  }

  const errors: Partial<Record<TField, string>> = {};

  for (const issue of result.error.issues) {
    const field = fieldMap[String(issue.path[0])];
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { isValid: false, errors };
};

const withFriendlyNumberErrors = <TField extends string>(
  validation: ValidationResult<TField>,
  checks: Array<{ field: TField; raw: string; label: string }>,
) => {
  for (const check of checks) {
    if (check.raw.trim() && !Number.isFinite(Number(check.raw))) {
      validation.errors[check.field] = `${check.label} must be a number.`;
    }
  }

  return {
    isValid: Object.keys(validation.errors).length === 0,
    errors: validation.errors,
  };
};

const addError = <TField extends string>(
  validation: ValidationResult<TField>,
  field: TField,
  message: string,
) => {
  if (!validation.errors[field]) {
    validation.errors[field] = message;
  }
};

const refreshValidity = <TField extends string>(validation: ValidationResult<TField>) => {
  return {
    isValid: Object.keys(validation.errors).length === 0,
    errors: validation.errors,
  };
};

const monthYearValue = (year: number, month: number) => year * 12 + month;

const isValidFourDigitYear = (year: number | null): year is number => {
  return year != null && Number.isInteger(year) && year >= 1000 && year <= 9999;
};

export const validateBasicInfo = (
  values: Pick<ProfileFormValues, 'firstName' | 'lastName' | 'aboutMe'>,
): ValidationResult<ProfileField> => {
  return resultFromZod(basicInfoBodySchema.safeParse(values), {
    firstName: 'firstName',
    lastName: 'lastName',
    aboutMe: 'aboutMe',
  });
};

export const validateEducation = (
  values: Pick<ProfileFormValues, 'major' | 'graduationYear' | 'graduationMonth' | 'gpa'>,
): ValidationResult<ProfileField> => {
  const validation = resultFromZod(
    educationBodySchema.safeParse({
      major: emptyToNull(values.major),
      gradYear: numberOrNull(values.graduationYear),
      gradMonth: monthNameToInt(values.graduationMonth),
      gpa: numberOrNull(values.gpa),
    }),
    {
      major: 'major',
      gradYear: 'graduationYear',
      gradMonth: 'graduationMonth',
      gpa: 'gpa',
    },
  );

  return withFriendlyNumberErrors(validation, [
    { field: 'graduationYear', raw: values.graduationYear, label: 'Graduation year' },
    { field: 'gpa', raw: values.gpa, label: 'GPA' },
  ]);
};

export const validateResume = (
  values: Pick<ProfileFormValues, 'linkedinHandle' | 'githubHandle' | 'portfolioUrl'>,
): ValidationResult<ProfileField> => {
  return resultFromZod(
    resumeBodySchema.safeParse({
      linkedInUrl: values.linkedinHandle,
      githubUrl: values.githubHandle,
      portfolioUrl: values.portfolioUrl,
    }),
    {
      linkedInUrl: 'linkedinHandle',
      githubUrl: 'githubHandle',
      portfolioUrl: 'portfolioUrl',
    },
  );
};

export const validateWorkPreferences = (
  values: Pick<ProfileFormValues, 'opportunities' | 'openToRelocate' | 'workEnvironments'>,
): ValidationResult<ProfileField> => {
  return resultFromZod(
    workPreferencesBodySchema.safeParse({
      opportunityTypes: values.opportunities.map((o) => OPPORTUNITY_TYPE_DISPLAY_TO_DB[o] ?? o),
      willingToRelocate: values.openToRelocate,
      workEnvironments: values.workEnvironments.map((e) => WORK_ENV_DISPLAY_TO_DB[e] ?? e),
    }),
    {
      opportunityTypes: 'opportunities',
      willingToRelocate: 'openToRelocate',
      workEnvironments: 'workEnvironments',
    },
  );
};

export const validateLocation = (
  values: Pick<ProfileFormValues, 'city' | 'state' | 'zip' | 'authorizedToWork'>,
): ValidationResult<ProfileField> => {
  return resultFromZod(
    locationBodySchema.safeParse({
      city: emptyToNull(values.city),
      state: emptyToNull(values.state),
      zip: emptyToNull(values.zip),
      usWorkAuth: values.authorizedToWork,
    }),
    {
      city: 'city',
      state: 'state',
      zip: 'zip',
      usWorkAuth: 'authorizedToWork',
    },
  );
};

export const validateIdentities = (
  values: Pick<ProfileFormValues, 'gender' | 'ethnicities'>,
): ValidationResult<ProfileField> => {
  return resultFromZod(
    identitiesBodySchema.safeParse({
      gender: emptyToNull(values.gender),
      ethnicities: values.ethnicities,
    }),
    {
      gender: 'gender',
      ethnicities: 'ethnicities',
    },
  );
};

export const validateSkills = (
  values: Pick<ProfileFormValues, 'skills'>,
): ValidationResult<ProfileField> => {
  return resultFromZod(
    skillsBodySchema.safeParse({
      skillIds: values.skills.map((skill) => skill.id),
    }),
    {
      skillIds: 'skills',
    },
  );
};

export const validateExperienceDraft = (
  values: Omit<Experience, 'id'>,
): ValidationResult<ExperienceField> => {
  const startMonth = monthNameToInt(values.startMonth);
  const startYear = numberOrNull(values.startYear);
  const endMonth = values.current ? null : monthNameToInt(values.endMonth);
  const endYear = values.current ? null : numberOrNull(values.endYear);

  const validation = resultFromZod(
    experienceSchema.safeParse({
      title: emptyToNull(values.title),
      company: emptyToNull(values.company),
      startMonth,
      startYear,
      endMonth,
      endYear,
      current: values.current,
      location: emptyToNull(values.location),
      description: emptyToNull(values.description),
      skillIds: values.skills.map((skill) => skill.id),
    }),
    {
      title: 'title',
      company: 'company',
      startMonth: 'startMonth',
      startYear: 'startYear',
      endMonth: 'endMonth',
      endYear: 'endYear',
      current: 'current',
      location: 'location',
      description: 'description',
      skillIds: 'skills',
    },
  );

  const validationWithNumberErrors: ValidationResult<ExperienceField> =
    withFriendlyNumberErrors<ExperienceField>(validation, [
      { field: 'startYear', raw: values.startYear, label: 'Start year' },
      { field: 'endYear', raw: values.endYear, label: 'End year' },
    ]);

  if ((startMonth != null || startYear != null) && startMonth == null) {
    addError(validationWithNumberErrors, 'startMonth', 'Select a start month.');
  }

  if ((startMonth != null || startYear != null) && startYear == null) {
    addError(validationWithNumberErrors, 'startYear', 'Enter a start year.');
  }

  if (startMonth != null && isValidFourDigitYear(startYear)) {
    const now = new Date();
    const currentMonthValue = monthYearValue(now.getFullYear(), now.getMonth() + 1);

    if (monthYearValue(startYear, startMonth) > currentMonthValue) {
      addError(validationWithNumberErrors, 'startYear', 'Start date cannot be in the future.');
    }
  }

  if (!values.current && (endMonth != null || endYear != null) && endMonth == null) {
    addError(validationWithNumberErrors, 'endMonth', 'Select an end month.');
  }

  if (!values.current && (endMonth != null || endYear != null) && endYear == null) {
    addError(validationWithNumberErrors, 'endYear', 'Enter an end year.');
  }

  if (
    !values.current &&
    startMonth != null &&
    endMonth != null &&
    isValidFourDigitYear(startYear) &&
    isValidFourDigitYear(endYear) &&
    monthYearValue(endYear, endMonth) < monthYearValue(startYear, startMonth)
  ) {
    addError(validationWithNumberErrors, 'endYear', 'End date must be on or after start date.');
  }

  return refreshValidity(validationWithNumberErrors);
};
