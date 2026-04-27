import { useController, useFormContext } from 'react-hook-form';
import { SectionShell } from '../SectionShell/SectionShell';
import { YesNo } from '../YesNo/YesNo';
import { FieldGroup } from '../components/FieldGroup/FieldGroup';
import { PillGroup, Pill } from '../components/PillGroup/PillGroup';
import { InlineRow } from '../components/InlineRow/InlineRow';
import { OPPORTUNITY_TYPES, WORK_ENVIRONMENTS } from '../../../utils/constants';
import type { SaveState, ProfileFormValues } from '../../../utils/types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const WorkPrefsSection = ({ saveState, onSave }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProfileFormValues>();
  const { field: oppField } = useController({ name: 'opportunities', control });
  const { field: relocateField } = useController({ name: 'openToRelocate', control });
  const { field: envField } = useController({ name: 'workEnvironments', control });

  const opportunities: string[] = oppField.value ?? [];
  const workEnvironments: string[] = envField.value ?? [];

  const toggleOpp = (v: string) => {
    oppField.onChange(
      opportunities.includes(v) ? opportunities.filter((o) => o !== v) : [...opportunities, v],
    );
  };

  const toggleEnv = (v: string) => {
    envField.onChange(
      workEnvironments.includes(v)
        ? workEnvironments.filter((e) => e !== v)
        : [...workEnvironments, v],
    );
  };

  return (
    <SectionShell
      id="work-preferences"
      title="Work Preferences"
      desc="The types of roles and environments you're looking for."
      saveState={saveState}
      onSave={onSave}
    >
      <FieldGroup
        label="What kind of opportunities are you seeking? (Select all that apply)"
        error={errors.opportunities?.message}
      >
        <PillGroup>
          {OPPORTUNITY_TYPES.map((o) => (
            <Pill
              key={o}
              type="button"
              active={opportunities.includes(o)}
              onClick={() => toggleOpp(o)}
            >
              {o}
            </Pill>
          ))}
        </PillGroup>
      </FieldGroup>

      <InlineRow label="Are you open to relocating for an opportunity?">
        <YesNo value={relocateField.value} onChange={relocateField.onChange} />
      </InlineRow>

      <FieldGroup
        label="What work environment(s) are you interested in? (Select all that apply)"
        error={errors.workEnvironments?.message}
      >
        <PillGroup>
          {WORK_ENVIRONMENTS.map((env) => (
            <Pill
              key={env}
              type="button"
              active={workEnvironments.includes(env)}
              onClick={() => toggleEnv(env)}
            >
              {env}
            </Pill>
          ))}
        </PillGroup>
      </FieldGroup>
    </SectionShell>
  );
};
