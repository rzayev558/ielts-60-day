import listening from './listening.json';
import reading from './reading.json';
import speaking from './speaking.json';
import writing from './writing.json';
import vocab from './vocab.json';
import quotes from './quotes.json';
import type { ListeningItem, ReadingItem, SpeakingItem, Word, WritingItem } from '../types';

export const TOTAL_DAYS = 60;
export const WORDS_PER_DAY = 25;

// Each content file is sorted by day (1..60); the vocab list is pre-shuffled, 25 per day.
export const allWords = vocab as Word[];

export function getDay(day: number) {
  const i = day - 1;
  return {
    listening: (listening as ListeningItem[])[i],
    reading: (reading as ReadingItem[])[i],
    speaking: (speaking as SpeakingItem[])[i],
    writing: (writing as WritingItem[])[i],
    words: allWords.slice(i * WORDS_PER_DAY, day * WORDS_PER_DAY),
    quote: quotes[i] as { text: string; author: string },
  };
}
