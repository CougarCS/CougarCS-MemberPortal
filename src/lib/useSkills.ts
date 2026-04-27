import { useQuery } from '@tanstack/react-query';
import { loadAllSkills } from './profile';
import { queryKeys, queryStaleTimes } from './queryClient';
import type { Skill } from '../utils/types';

export const useSkills = (): Skill[] => {
  const { data = [] } = useQuery({
    queryKey: queryKeys.skills,
    queryFn: loadAllSkills,
    staleTime: queryStaleTimes.skills,
  });

  return data;
};
