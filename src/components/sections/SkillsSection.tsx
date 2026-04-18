import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './section.module.css';
import { SectionShell } from './SectionShell';
import type { SaveState } from './types';

interface Props {
  skills: string[];
  saveState?: SaveState;
  onChange: (v: string[]) => void;
  onSave?: () => void;
}

export const SkillsSection = ({ skills, saveState, onChange, onSave }: Props) => {
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch predefined skills once on mount
  useEffect(() => {
    supabase
      .from('skill')
      .select('name')
      .order('name')
      .then(({ data }) => {
        if (data) setAllSkills(data.map((s: { name: string }) => s.name));
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = allSkills.filter(
    (s) => !skills.includes(s) && s.toLowerCase().includes(query.toLowerCase()),
  );

  const add = (skill: string) => {
    onChange([...skills, skill]);
    setQuery('');
    inputRef.current?.focus();
  };

  const remove = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  return (
    <SectionShell
      id="skills"
      title="Skills"
      desc="Select the skills you know."
      saveState={saveState}
      onSave={onSave}
    >
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Skills</label>

        {skills.length > 0 && (
          <div className={styles.skillTagList}>
            {skills.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
                <button
                  type="button"
                  className={styles.skillTagRemove}
                  onClick={() => remove(skill)}
                  aria-label={`Remove ${skill}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className={styles.skillsCombobox} ref={containerRef}>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search skills..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          {open && filtered.length > 0 && (
            <ul className={styles.skillsDropdown}>
              {filtered.map((skill) => (
                <li key={skill}>
                  {/* onMouseDown + preventDefault so blur doesn't fire before click */}
                  <button
                    type="button"
                    className={styles.skillsDropdownItem}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      add(skill);
                    }}
                  >
                    {skill}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {open && query.length > 0 && filtered.length === 0 && (
            <div className={styles.skillsDropdownEmpty}>No matching skills found</div>
          )}
        </div>
      </div>
    </SectionShell>
  );
};
