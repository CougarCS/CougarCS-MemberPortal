import { useState, useEffect } from 'react';
import { loadAllSkills } from './profile';
import type { Skill } from '../components/profile/types';

let cache: Skill[] | null = null;

export const useSkills = (): Skill[] => {
  const [skills, setSkills] = useState<Skill[]>(cache ?? []);

  useEffect(() => {
    if (cache) {
      setSkills(cache);
      return;
    }
    const fetchSkills = async () => {
      const data = await loadAllSkills();
      cache = data;
      setSkills(data);
    };
    fetchSkills();
  }, []);

  return skills;
};
