export interface Experience {
  id: string;
  title: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  location: string;
  description: string;
  skills: string;
}

export type SaveState = 'idle' | 'unsaved' | 'saving' | 'saved';
