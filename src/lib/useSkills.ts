import { useState, useEffect } from 'react';
import { loadAllSkills } from './profile';
import type { Skill } from '../utils/types';

let cache: Skill[] | null = null;
let inFlight: Promise<Skill[]> | null = null;

export const useSkills = (): Skill[] => {
  const [skills, setSkills] = useState<Skill[]>(cache ?? []);

  useEffect(() => {
    let active = true;

    if (cache) {
      setSkills(cache);
      return;
    }

    const fetchSkills = async () => {
      try {
        inFlight ??= loadAllSkills().finally(() => {
          inFlight = null;
        });
        const data = await inFlight;
        cache = data;

        if (active) {
          setSkills(data);
        }
      } catch {
        if (active) {
          setSkills([]);
        }
      }
    };

    fetchSkills();

    return () => {
      active = false;
    };
  }, []);

  return skills;
};
