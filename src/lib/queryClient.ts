import { QueryClient } from '@tanstack/react-query';

export const queryKeys = {
  profile: ['profile'] as const,
  skills: ['skills'] as const,
  me: ['me'] as const,
};

export const queryStaleTimes = {
  profile: 5 * 60 * 1000,
  skills: 60 * 60 * 1000,
  me: 10 * 60 * 1000,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
