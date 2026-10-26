import { useEffect, useState } from 'react';
import type { SpeakingItem } from '../types';
import { canSpeak, speak } from '../speech';
import { cls, fmtTime } from '../util';

export default function Speaking({ item }: { item: SpeakingItem }) {
  const bullets = item.cueCard.points;

  return (
    <>
      <p className="eyebrow">Theme · {item.theme}</p>

      <h3 className="part-title">Part 1 · Introduction</h3>
      <p className="muted small">Answer each in 2–3 sentences. Give a reason or example.</p>
      <QuestionList questions={item.part1} />

      <h3 className="part-title">Part 2 · Cue card</h3>
      <div className="cue-card">
        <p className="cue-prompt">
          {item.cueCard.prompt}
          {canSpeak && <SpeakBtn text={item.cueCard.prompt} />}
        </p>
        <p className="muted small">You should say:</p>
        <ul>
          {bullets.slice(0, -1).map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="cue-explain">{bullets[bullets.length - 1]}</p>
        <CueTimer />
      </div>

      <h3 className="part-title">Part 3 · Discussion</h3>
      <p className="muted small">Longer answers: give your opinion, explain why, compare, give examples.</p>
      <QuestionList questions={item.part3} />

      <h3 className="part-title">Useful phrases</h3>
      <div className="phrases">
        {item.usefulPhrases.map((p) => (
          <span key={p} className="chip">
            {p}
          </span>
        ))}
      </div>
    </>
  );
}

function QuestionList({ questions }: { questions: string[] }) {
  return (
    <ol className="questions">
      {questions.map((q) => (
        <li key={q}>
          <span>{q}</span>
          {canSpeak && <SpeakBtn text={q} />}
        </li>
      ))}
    </ol>
  );
}

function SpeakBtn({ text }: { text: string }) {
  return (
    <button className="icon-btn" onClick={() => speak(text)} aria-label="Read aloud" title="Read aloud">
      🔊
    </button>
  );
}

type Phase = 'idle' | 'prep' | 'talk' | 'done';
const PREP = 60;
const TALK = 120;

function CueTimer() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [left, setLeft] = useState(PREP);

  useEffect(() => {
    if (phase !== 'prep' && phase !== 'talk') return;
    const id = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (left > 0) return;
    if (phase === 'prep') {
      setPhase('talk');
      setLeft(TALK);
      speak('Please start speaking now.');
    } else if (phase === 'talk') {
      setPhase('done');
      speak('Thank you. That is the end of your time.');
    }
  }, [left, phase]);

  const start = (p: Phase, secs: number) => {
    setPhase(p);
    setLeft(secs);
  };

  return (
    <div className={cls('cue-timer', phase)}>
      <span className="cue-timer-label">
        {phase === 'idle' && '1 min to prepare, then talk for 2 min'}
        {phase === 'prep' && 'Preparing: make notes'}
        {phase === 'talk' && 'Speaking…'}
        {phase === 'done' && 'Time’s up! 🎉'}
      </span>
      {(phase === 'prep' || phase === 'talk') && <span className="cue-timer-clock">{fmtTime(left)}</span>}
      <div className="row-btns">
        {phase === 'idle' || phase === 'done' ? (
          <button className="btn" onClick={() => start('prep', PREP)}>
            Start timer
          </button>
        ) : (
          <>
            {phase === 'prep' && (
              <button className="btn" onClick={() => start('talk', TALK)}>
                Skip prep
              </button>
            )}
            <button className="btn" onClick={() => start('idle', PREP)}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
