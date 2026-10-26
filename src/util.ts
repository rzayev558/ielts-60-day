import { useEffect, useState } from 'react';

export const cls = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(' ');

export const fmtTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export function useCountdown(initial: number) {
  const [remaining, setRemaining] = useState(initial);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  return {
    remaining,
    running,
    start: () => remaining > 0 && setRunning(true),
    pause: () => setRunning(false),
    reset: () => {
      setRunning(false);
      setRemaining(initial);
    },
  };
}

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const [page, arg] = hash.replace(/^#\/?/, '').split('/');
  const day = Number(arg);
  if (page === 'day' && Number.isInteger(day) && day >= 1 && day <= 60) return { page: 'day' as const, day };
  if (page === 'review') return { page: 'review' as const };
  return { page: 'home' as const };
}
