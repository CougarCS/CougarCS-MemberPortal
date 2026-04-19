import { useState, useEffect } from 'react';
import { loadAllSkills } from './profile';
import type { Skill } from '../components/profile/types';

let cache: Skill[] | null = null;

export function useSkills(): Skill[] {
  const [skills, setSkills] = useState<Skill[]>(cache ?? []);

  useEffect(() => {
    if (cache) {
      setSkills(cache);
      return;
    }
    loadAllSkills().then((data) => {
      cache = data;
      setSkills(data);
    });
  }, []);

  return skills;
}
