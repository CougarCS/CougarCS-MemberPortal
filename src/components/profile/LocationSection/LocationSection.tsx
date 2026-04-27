import { useController, useFormContext } from 'react-hook-form';
import styles from './LocationSection.module.css';
import { SectionShell } from '../SectionShell/SectionShell';
import { YesNo } from '../YesNo/YesNo';
import { FieldGroup } from '../components/FieldGroup/FieldGroup';
import { FormInput } from '../components/FormInput/FormInput';
import { InlineRow } from '../components/InlineRow/InlineRow';
import type { SaveState, ProfileFormValues } from '../../../utils/types';

interface Props {
  saveState?: SaveState;
  onSave?: () => void;
}

export const LocationSection = ({ saveState, onSave }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProfileFormValues>();
  const { field: authField } = useController({ name: 'authorizedToWork', control });

  return (
    <SectionShell
      id="location"
      title="Location"
      desc="Where you live and your work authorization status."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.threeCol}>
        <FieldGroup label="City" error={errors.city?.message}>
          <FormInput
            {...register('city')}
            aria-invalid={Boolean(errors.city)}
            placeholder="Houston"
            maxLength={100}
          />
        </FieldGroup>

        <FieldGroup label="State" error={errors.state?.message}>
          <FormInput
            {...register('state')}
            aria-invalid={Boolean(errors.state)}
            placeholder="TX"
            maxLength={2}
          />
        </FieldGroup>

        <FieldGroup label="Zip Code" error={errors.zip?.message}>
          <FormInput
            {...register('zip')}
            aria-invalid={Boolean(errors.zip)}
            placeholder="77004"
            maxLength={10}
          />
        </FieldGroup>
      </div>

      <InlineRow label="Are you authorized to work in the US without sponsorship?">
        <YesNo value={authField.value} onChange={authField.onChange} />
      </InlineRow>
    </SectionShell>
  );
};
