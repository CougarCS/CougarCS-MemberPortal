import type { FieldPath, FieldValues, UseFormClearErrors, UseFormSetError } from 'react-hook-form';

export interface ValidationResult<TField extends string> {
  isValid: boolean;
  errors: Partial<Record<TField, string>>;
}

interface ApplyValidationResultArgs<TFieldValues extends FieldValues> {
  fields?: FieldPath<TFieldValues>[];
  validation: ValidationResult<FieldPath<TFieldValues>>;
  clearErrors: UseFormClearErrors<TFieldValues>;
  setError: UseFormSetError<TFieldValues>;
}

export const applyValidationResult = <TFieldValues extends FieldValues>({
  fields,
  validation,
  clearErrors,
  setError,
}: ApplyValidationResultArgs<TFieldValues>) => {
  clearErrors(fields);

  if (validation.isValid) {
    return true;
  }

  (
    Object.entries(validation.errors) as Array<[FieldPath<TFieldValues>, string | undefined]>
  ).forEach(([field, message]) => {
    if (message) {
      setError(field, {
        type: 'validate',
        message,
      });
    }
  });

  return false;
};
