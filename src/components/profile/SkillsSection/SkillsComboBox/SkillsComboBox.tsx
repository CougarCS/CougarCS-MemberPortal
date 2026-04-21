import { useState, useEffect, useRef } from 'react';
import styles from './section.module.css';
import { useSkills } from '../../../../lib/useSkills';
import type { Skill } from '../../../../utils/types';

interface Props {
  selected: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillCombobox = ({ selected, onChange }: Props) => {
  const allSkills = useSkills();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const selectedIds = new Set(selected.map((s) => s.id));
  const filtered = allSkills.filter(
    (s) => !selectedIds.has(s.id) && s.name.toLowerCase().includes(query.toLowerCase()),
  );

  const add = (skill: Skill) => {
    onChange([...selected, skill]);
    setQuery('');
    inputRef.current?.focus();
  };

  const remove = (id: string) => {
    onChange(selected.filter((s) => s.id !== id));
  };

  return (
    <>
      {selected.length > 0 && (
        <div className={styles.skillTagList}>
          {selected.map((s) => (
            <span key={s.id} className={styles.skillTag}>
              {s.name}
              <button
                type="button"
                className={styles.skillTagRemove}
                onClick={() => remove(s.id)}
                aria-label={`Remove ${s.name}`}
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
              <li key={skill.id}>
                <button
                  type="button"
                  className={styles.skillsDropdownItem}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    add(skill);
                  }}
                >
                  {skill.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {open && query.length > 0 && filtered.length === 0 && (
          <div className={styles.skillsDropdownEmpty}>No matching skills found</div>
        )}
      </div>
    </>
  );
};
