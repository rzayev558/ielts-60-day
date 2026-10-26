export type SectionKey = 'listening' | 'reading' | 'speaking' | 'writing' | 'vocab';

export const SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'listening', label: 'Listening', icon: '🎧' },
  { key: 'reading', label: 'Reading', icon: '📰' },
  { key: 'speaking', label: 'Speaking', icon: '🗣️' },
  { key: 'writing', label: 'Writing', icon: '✍️' },
  { key: 'vocab', label: 'Vocabulary', icon: '🃏' },
];

export interface ListeningItem {
  day: number;
  title: string;
  channel: string;
  url: string;
  durationMin: number;
  topic: string;
  tip: string;
}

export interface ReadingItem {
  day: number;
  title: string;
  source: string;
  url: string;
  minutes: number;
  topic: string;
  task: string;
}

export interface SpeakingItem {
  day: number;
  theme: string;
  part1: string[];
  cueCard: { prompt: string; points: string[] };
  part3: string[];
  usefulPhrases: string[];
}

export type WritingType = 'opinion' | 'discussion' | 'advantages' | 'problem-solution' | 'two-part';

export interface WritingItem {
  day: number;
  type: WritingType;
  topic: string;
  prompt: string;
  ideas: string[];
}

export interface Word {
  w: string;
  pos: string;
  lvl: string;
  def: string;
  ex: string;
  az: string;
}
