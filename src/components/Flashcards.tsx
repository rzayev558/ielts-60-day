import { useEffect, useState } from 'react';
import type { Word } from '../types';
import { markCard, useStore } from '../store';
import { canSpeak, speak } from '../speech';
import { cls } from '../util';

interface Props {
  words: Word[];
  onRoundComplete?: () => void;
}

export default function Flashcards({ words, onRoundComplete }: Props) {
  const s = useStore();
  const [queue, setQueue] = useState(words);
  const [i, setI] = useState(0);
  const [round, setRound] = useState(1);
  const [revealed, setRevealed] = useState(false);
  const [missed, setMissed] = useState<Word[]>([]);
  const card = queue[i];

  function answer(known: boolean) {
    if (!card) return;
    markCard(card.w, known ? 'known' : 'missed');
    if (!known) setMissed((m) => [...m, card]);
    setRevealed(false);
    setI(i + 1);
    if (i + 1 === queue.length && round === 1) onRoundComplete?.();
  }

  function restart(list: Word[]) {
    setQueue(list);
    setI(0);
    setMissed([]);
    setRevealed(false);
    setRound((r) => r + 1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!card || (e.target as HTMLElement).closest('input, textarea, button')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRevealed((r) => !r);
      } else if (revealed && (e.key === 'ArrowLeft' || e.key === '1')) answer(false);
      else if (revealed && (e.key === 'ArrowRight' || e.key === '2')) answer(true);
      else if (e.key === 's') speak(card.w, 0.85);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!card) {
    const knownCount = queue.length - missed.length;
    return (
      <div className="fc-done">
        <p className="fc-done-big">{missed.length === 0 ? '🎉' : '💪'}</p>
        <p>
          Round finished: <strong>{knownCount}</strong> known, <strong>{missed.length}</strong> to practise.
        </p>
        <div className="row-btns center">
          {missed.length > 0 && (
            <button className="btn primary" onClick={() => restart(missed)}>
              Practise the {missed.length} missed
            </button>
          )}
          <button className="btn" onClick={() => restart(words)}>
            Start over ({words.length})
          </button>
        </div>
      </div>
    );
  }

  const prev = s.cards[card.w];

  return (
    <div className="fc">
      <div className="fc-progress">
        <span>
          {i + 1} / {queue.length}
          {round > 1 && ' · practice round'}
        </span>
        <div className="bar thin">
          <div style={{ width: `${(i / queue.length) * 100}%` }} />
        </div>
      </div>

      <div
        key={`${round}-${i}`}
        className={cls('fc-card', revealed && 'flipped')}
        onClick={() => setRevealed((r) => !r)}
        role="button"
        tabIndex={0}
        aria-label={revealed ? 'Hide answer' : 'Reveal answer'}
      >
        <div className="fc-face fc-front">
          {prev && <span className={cls('fc-prev', prev)}>{prev === 'known' ? 'known before' : 'missed before'}</span>}
          <span className="fc-word">{card.w}</span>
          <span className="fc-pos">
            {card.pos} · {card.lvl}
          </span>
          {canSpeak && (
            <button
              className="icon-btn big"
              onClick={(e) => {
                e.stopPropagation();
                speak(card.w, 0.85);
              }}
              aria-label="Pronounce"
            >
              🔊
            </button>
          )}
          <span className="fc-hint">tap to reveal</span>
        </div>
        <div className="fc-face fc-back">
          <span className="fc-word small">{card.w}</span>
          <p className="fc-def">{card.def}</p>
          <p className="fc-ex">
            “{card.ex}”
            {canSpeak && (
              <button
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(card.ex);
                }}
                aria-label="Read example"
              >
                🔊
              </button>
            )}
          </p>
          <p className="fc-az">
            <span>AZ</span> {card.az}
          </p>
        </div>
      </div>

      <div className={cls('fc-actions', !revealed && 'hidden')}>
        <button className="btn miss" onClick={() => answer(false)} disabled={!revealed}>
          ✗ Didn’t know
        </button>
        <button className="btn know" onClick={() => answer(true)} disabled={!revealed}>
          ✓ Knew it
        </button>
      </div>
      <p className="muted small center kbd-hint">Keys: Space to flip · ← didn’t know · → knew it · S to speak</p>
    </div>
  );
}
