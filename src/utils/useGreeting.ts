import { useEffect, useState } from 'react';

const compute = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

export const useGreeting = (): string => {
  const [greeting, setGreeting] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => {
      setGreeting(compute());
    }, 60_000);
    return () => {
      clearInterval(id);
    };
  }, []);
  return greeting;
};
