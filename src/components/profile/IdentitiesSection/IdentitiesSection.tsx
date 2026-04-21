import { useController, useFormContext } from 'react-hook-form';
import { SectionShell } from '../SectionShell/SectionShell';
import { FieldGroup } from '../components/FieldGroup/FieldGroup';
import { PillGroup, Pill } from '../components/PillGroup/PillGroup';
import { ETHNICITIES } from '../../../utils/constants';
import type { SaveState, ProfileFormValues } from '../../../utils/types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const IdentitiesSection = ({ saveState, onSave }: Props) => {
  const { control } = useFormContext<ProfileFormValues>();
  const { field: genderField } = useController({ name: 'gender', control });
  const { field: ethnicitiesField } = useController({ name: 'ethnicities', control });

  const ethnicities: string[] = ethnicitiesField.value ?? [];

  const toggle = (v: string) => {
    ethnicitiesField.onChange(
      ethnicities.includes(v) ? ethnicities.filter((e) => e !== v) : [...ethnicities, v],
    );
  };

  return (
    <SectionShell
      id="personal-identities"
      title="Personal Identities"
      desc="Optional info that we use to internally collect demographic data. Your individual data is NOT shared with companies or any 3rd party organizations."
      saveState={saveState}
      onSave={onSave}
    >
      <FieldGroup label="What is your gender?">
        <PillGroup>
          {['Male', 'Female', 'Non-Binary'].map((g) => (
            <Pill
              key={g}
              type="button"
              active={genderField.value === g}
              onClick={() => genderField.onChange(genderField.value === g ? '' : g)}
            >
              {g}
            </Pill>
          ))}
        </PillGroup>
      </FieldGroup>

      <FieldGroup label="What is your racial/ethnic identity? (Select all that apply)">
        <PillGroup>
          {ETHNICITIES.map((e) => (
            <Pill key={e} type="button" active={ethnicities.includes(e)} onClick={() => toggle(e)}>
              {e}
            </Pill>
          ))}
        </PillGroup>
      </FieldGroup>
    </SectionShell>
  );
};
