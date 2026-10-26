import type { Word } from '../types';
import { useStore } from '../store';
import { canSpeak, speak } from '../speech';
import { cls } from '../util';
import Flashcards from '../components/Flashcards';

export default function Vocab({ words, onRoundComplete }: { words: Word[]; onRoundComplete: () => void }) {
  const s = useStore();

  return (
    <>
      <Flashcards words={words} onRoundComplete={onRoundComplete} />

      <details className="guide">
        <summary>All {words.length} words for today</summary>
        <ul className="wordlist">
          {words.map((w) => (
            <li key={w.w} className={cls(s.cards[w.w])}>
              {canSpeak && (
                <button className="icon-btn" onClick={() => speak(w.w, 0.85)} aria-label={`Pronounce ${w.w}`}>
                  🔊
                </button>
              )}
              <strong>{w.w}</strong>
              <span className="muted">{w.pos}</span>
              <span className="az">{w.az}</span>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
