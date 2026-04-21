import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { createExperience, updateExperience, deleteExperience } from '../../../lib/save';
import styles from './section.module.css';
import { SectionShell } from '../SectionShell/SectionShell';
import { ExperienceForm } from './ExperienceForm/ExperienceForm';
import { ExperienceCard } from './ExperienceCard/ExperienceCard';
import type { Experience, ProfileFormValues } from '../../../utils/types';

export const ExperienceSection = () => {
  const { control } = useFormContext<ProfileFormValues>();
  const { field } = useController({ name: 'experiences', control });
  const experiences: Experience[] = field.value ?? [];

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInitial, setFormInitial] = useState<Omit<Experience, 'id'> | undefined>();
  const [opState, setOpState] = useState<'idle' | 'saving' | 'error'>('idle');

  const openAdd = () => {
    setFormInitial(undefined);
    setEditingId(null);
    setOpState('idle');
    setShowForm(true);
  };

  const openEdit = (exp: Experience) => {
    const { id: _id, ...rest } = exp;
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
    if (editingId) {
      const ok = await updateExperience(editingId, draft);
      if (!ok) {
        setOpState('error');
        return;
      }
      field.onChange(
        experiences.map((e) => (e.id === editingId ? { ...draft, id: editingId } : e)),
      );
    } else {
      const created = await createExperience(draft);
      if (!created) {
        setOpState('error');
        return;
      }
      field.onChange([...experiences, created]);
    }
    setShowForm(false);
    setEditingId(null);
    setOpState('idle');
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteExperience(id);
    if (ok) {
      field.onChange(experiences.filter((e) => e.id !== id));
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
        <button type="button" className={styles.outlineBtn} onClick={openAdd}>
          + Add new experience
        </button>
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
