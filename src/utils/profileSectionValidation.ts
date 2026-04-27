import type { FieldPath } from 'react-hook-form';
import {
  validateBasicInfo,
  validateEducation,
  validateIdentities,
  validateLocation,
  validateResume,
  validateSkills,
  validateWorkPreferences,
} from '../lib/profileValidation';
import type { ValidationResult } from './formValidation';
import type { ProfileFormValues } from './types';

type ProfileSectionValidation = {
  fields: FieldPath<ProfileFormValues>[];
  validation: ValidationResult<FieldPath<ProfileFormValues>>;
};

const BASIC_INFO_FIELDS: FieldPath<ProfileFormValues>[] = [
  'firstName',
  'lastName',
  'aboutMe',
  'headshotFile',
];
const EDUCATION_FIELDS: FieldPath<ProfileFormValues>[] = [
  'major',
  'graduationYear',
  'graduationMonth',
  'gpa',
];
const RESUME_FIELDS: FieldPath<ProfileFormValues>[] = [
  'linkedinHandle',
  'githubHandle',
  'portfolioUrl',
  'resumeFile',
];
const WORK_PREF_FIELDS: FieldPath<ProfileFormValues>[] = [
  'opportunities',
  'openToRelocate',
  'workEnvironments',
];
const LOCATION_FIELDS: FieldPath<ProfileFormValues>[] = [
  'city',
  'state',
  'zip',
  'authorizedToWork',
];
const IDENTITY_FIELDS: FieldPath<ProfileFormValues>[] = ['gender', 'ethnicities'];
const SKILL_FIELDS: FieldPath<ProfileFormValues>[] = ['skills'];

export const getProfileSectionValidation = (
  section: string,
  values: ProfileFormValues,
): ProfileSectionValidation | null => {
  switch (section) {
    case 'basic-information': {
      const { firstName, lastName, aboutMe, headshotFile } = values;

      return {
        fields: BASIC_INFO_FIELDS,
        validation: validateBasicInfo({ firstName, lastName, aboutMe, headshotFile }),
      };
    }
    case 'education': {
      const { major, graduationYear, graduationMonth, gpa } = values;

      return {
        fields: EDUCATION_FIELDS,
        validation: validateEducation({ major, graduationYear, graduationMonth, gpa }),
      };
    }
    case 'resume': {
      const { linkedinHandle, githubHandle, portfolioUrl, resumeFile } = values;

      return {
        fields: RESUME_FIELDS,
        validation: validateResume({ linkedinHandle, githubHandle, portfolioUrl, resumeFile }),
      };
    }
    case 'skills':
      return {
        fields: SKILL_FIELDS,
        validation: validateSkills({ skills: values.skills }),
      };
    case 'work-preferences': {
      const { opportunities, openToRelocate, workEnvironments } = values;

      return {
        fields: WORK_PREF_FIELDS,
        validation: validateWorkPreferences({ opportunities, openToRelocate, workEnvironments }),
      };
    }
    case 'location': {
      const { city, state, zip, authorizedToWork } = values;

      return {
        fields: LOCATION_FIELDS,
        validation: validateLocation({ city, state, zip, authorizedToWork }),
      };
    }
    case 'personal-identities': {
      const { gender, ethnicities } = values;

      return {
        fields: IDENTITY_FIELDS,
        validation: validateIdentities({ gender, ethnicities }),
      };
    }
    default:
      return null;
  }
};
