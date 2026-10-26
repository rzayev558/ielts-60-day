import { useSyncExternalStore } from 'react';
import { SECTIONS, type SectionKey } from './types';
import { TOTAL_DAYS } from './data';

export type Accent = 'en-GB' | 'en-US';
export type CardResult = 'known' | 'missed';
export type DayProgress = Partial<Record<SectionKey, boolean>>;

export interface State {
  days: Record<string, DayProgress>;
  cards: Record<string, CardResult>;
  activity: string[]; // local dates (YYYY-MM-DD) with any study activity
  accent: Accent;
}

const KEY = 'ielts60:v1';
const essayKey = (day: number) => `ielts60:essay:${day}`;
const empty: State = { days: {}, cards: {}, activity: [], accent: 'en-GB' };

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...empty, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable or corrupt: start fresh */
  }
  return empty;
}

let state = load();
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore() {
  return useSyncExternalStore(subscribe, () => state);
}

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => toKey(new Date());

function withActivity(s: State): string[] {
  const t = today();
  return s.activity.includes(t) ? s.activity : [...s.activity, t];
}

export function setSection(day: number, key: SectionKey, done: boolean) {
  set({
    ...state,
    days: { ...state.days, [day]: { ...state.days[day], [key]: done } },
    activity: done ? withActivity(state) : state.activity,
  });
}

export function markCard(word: string, result: CardResult) {
  set({ ...state, cards: { ...state.cards, [word]: result }, activity: withActivity(state) });
}

export function setAccent(accent: Accent) {
  set({ ...state, accent });
}

export const getAccent = () => state.accent;

export function isDayComplete(p: DayProgress | undefined) {
  return SECTIONS.every((s) => p?.[s.key]);
}

export function streaks(activity: string[]) {
  const days = new Set(activity);
  const sorted = [...days].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of sorted) {
    const d = new Date(`${k}T12:00:00`);
    run = prev && Math.round((d.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  // Current streak counts back from today, or from yesterday if today isn't done yet.
  const cursor = new Date();
  if (!days.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (days.has(toKey(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, best };
}

export function loadEssay(day: number): string {
  try {
    return localStorage.getItem(essayKey(day)) ?? '';
  } catch {
    return '';
  }
}

export function saveEssay(day: number, text: string) {
  try {
    if (text) localStorage.setItem(essayKey(day), text);
    else localStorage.removeItem(essayKey(day));
  } catch {
    /* ignore */
  }
}

export function exportBackup(): string {
  const essays: Record<number, string> = {};
  for (let d = 1; d <= TOTAL_DAYS; d++) {
    const t = loadEssay(d);
    if (t) essays[d] = t;
  }
  return JSON.stringify({ app: 'ielts60', version: 1, exportedAt: new Date().toISOString(), state, essays }, null, 2);
}

export function importBackup(json: string) {
  const data = JSON.parse(json);
  if (data?.app !== 'ielts60' || typeof data.state !== 'object') throw new Error('This is not an IELTS 60 backup file.');
  set({ ...empty, ...data.state });
  for (const [d, t] of Object.entries(data.essays ?? {})) saveEssay(Number(d), String(t));
}

export function resetAll() {
  for (let d = 1; d <= TOTAL_DAYS; d++) saveEssay(d, '');
  set({ ...empty, accent: state.accent });
}
