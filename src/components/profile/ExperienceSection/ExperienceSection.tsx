import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExperience, updateExperience, deleteExperience } from '../../../lib/save';
import { queryKeys } from '../../../lib/queryClient';
import styles from './ExperienceSection.module.css';
import { SectionShell } from '../SectionShell/SectionShell';
import { ExperienceForm } from './ExperienceForm/ExperienceForm';
import { ExperienceCard } from './ExperienceCard/ExperienceCard';
import { OutlineButton } from '../../OutlineButton/OutlineButton';
import type { Experience, ProfileFormValues, Skill } from '../../../utils/types';

const mergeSkillsById = (current: Skill[], incoming: Skill[]): Skill[] => {
  return Array.from(new Map([...current, ...incoming].map((skill) => [skill.id, skill])).values());
};

export const ExperienceSection = () => {
  const { control, getValues, setValue } = useFormContext<ProfileFormValues>();
  const { field } = useController({ name: 'experiences', control });
  const experiences: Experience[] = field.value ?? [];
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInitial, setFormInitial] = useState<Omit<Experience, 'id'> | undefined>();
  const [opState, setOpState] = useState<'idle' | 'saving' | 'error'>('idle');

  const createExperienceMutation = useMutation({
    mutationFn: createExperience,
  });
  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: Omit<Experience, 'id'> }) => {
      return updateExperience(id, draft);
    },
  });
  const deleteExperienceMutation = useMutation({
    mutationFn: deleteExperience,
  });

  const openAdd = () => {
    setFormInitial(undefined);
    setEditingId(null);
    setOpState('idle');
    setShowForm(true);
  };

  const openEdit = (exp: Experience) => {
    const rest: Omit<Experience, 'id'> = {
      title: exp.title,
      company: exp.company,
      startMonth: exp.startMonth,
      startYear: exp.startYear,
      endMonth: exp.endMonth,
      endYear: exp.endYear,
      current: exp.current,
      location: exp.location,
      description: exp.description,
      skills: exp.skills,
    };
    setFormInitial(rest);
    setEditingId(exp.id);
    setOpState('idle');
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setOpState('idle');
  };

  const handleSave = async (draft: Omit<Experience, 'id'>) => {
    setOpState('saving');

    const mergeDraftSkillsIntoProfile = () => {
      if (draft.skills.length === 0) {
        return;
      }

      const currentSkills = getValues('skills') ?? [];
      const mergedSkills = mergeSkillsById(currentSkills, draft.skills);

      if (mergedSkills.length !== currentSkills.length) {
        setValue('skills', mergedSkills, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
      }
    };

    if (editingId) {
      const ok = await updateExperienceMutation.mutateAsync({ id: editingId, draft });
      if (!ok) {
        setOpState('error');
        return;
      }
      const updatedExperiences = experiences.map((e) =>
        e.id === editingId ? { ...draft, id: editingId } : e,
      );
      field.onChange(updatedExperiences);
      mergeDraftSkillsIntoProfile();
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    } else {
      const created = await createExperienceMutation.mutateAsync(draft);
      if (!created) {
        setOpState('error');
        return;
      }
      const updatedExperiences = [...experiences, created];
      field.onChange(updatedExperiences);
      mergeDraftSkillsIntoProfile();
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    }
    setShowForm(false);
    setEditingId(null);
    setOpState('idle');
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteExperienceMutation.mutateAsync(id);
    if (ok) {
      const updatedExperiences = experiences.filter((e) => e.id !== id);
      field.onChange(updatedExperiences);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    }
  };

  return (
    <SectionShell
      id="professional-experience"
      title="Professional Experience"
      desc="Add your internships and jobs here, if any."
    >
      <div className={styles.listHeader}>
        <span className={styles.listHeaderLabel}>Experience</span>
        <OutlineButton type="button" onClick={openAdd}>
          + Add new experience
        </OutlineButton>
      </div>

      {showForm && (
        <ExperienceForm
          key={editingId ?? 'new'}
          initial={formInitial}
          opState={opState}
          onSave={handleSave}
          onCancel={cancel}
        />
      )}

      {experiences.length === 0 && !showForm && (
        <p className={styles.emptyState}>No experience added yet.</p>
      )}

      {experiences.map((exp) => (
        <ExperienceCard
          key={exp.id}
          exp={exp}
          onEdit={() => openEdit(exp)}
          onDelete={handleDelete}
        />
      ))}
    </SectionShell>
  );
};
