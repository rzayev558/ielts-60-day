import { useEffect, useState } from 'react';
import type { WritingItem, WritingType } from '../types';
import { loadEssay, saveEssay } from '../store';
import { cls, countWords, fmtTime, useCountdown } from '../util';

const GUIDE: Record<WritingType, { label: string; plan: string[] }> = {
  opinion: {
    label: 'Opinion',
    plan: [
      'Intro: paraphrase the question and state your opinion clearly',
      'Body 1: first reason, explanation and example',
      'Body 2: second reason, explanation and example',
      'Conclusion: restate your opinion in different words',
    ],
  },
  discussion: {
    label: 'Discuss both views',
    plan: [
      'Intro: paraphrase both views and give your opinion',
      'Body 1: the first view, with reasons and an example',
      'Body 2: the second view, with reasons and an example',
      'Conclusion: summarise both views and repeat your opinion',
    ],
  },
  advantages: {
    label: 'Advantages & disadvantages',
    plan: [
      'Intro: paraphrase and say which side you think is stronger (if asked)',
      'Body 1: main advantages, explained with an example',
      'Body 2: main disadvantages, explained with an example',
      'Conclusion: summarise and give your final answer',
    ],
  },
  'problem-solution': {
    label: 'Problem & solution',
    plan: [
      'Intro: paraphrase the issue and say what the essay will cover',
      'Body 1: causes or problems, explained with an example',
      'Body 2: a solution for each problem and how it would work',
      'Conclusion: summarise the main problems and solutions',
    ],
  },
  'two-part': {
    label: 'Two-part question',
    plan: [
      'Intro: paraphrase and briefly answer both questions',
      'Body 1: answer the first question fully',
      'Body 2: answer the second question fully',
      'Conclusion: summarise both answers',
    ],
  },
};

const TARGET = 250;
const EXAM_SECONDS = 40 * 60;

export default function Writing({ item }: { item: WritingItem }) {
  const guide = GUIDE[item.type];
  const [text, setText] = useState(() => loadEssay(item.day));
  const timer = useCountdown(EXAM_SECONDS);
  const words = countWords(text);

  useEffect(() => {
    const id = setTimeout(() => saveEssay(item.day, text), 400);
    return () => clearTimeout(id);
  }, [item.day, text]);

  return (
    <>
      <p className="eyebrow">
        Task 2 · {guide.label} · {item.topic}
      </p>
      <blockquote className="prompt">
        {item.prompt}
        <span className="prompt-foot">Write at least 250 words.</span>
      </blockquote>

      <details className="guide">
        <summary>Plan & ideas</summary>
        <h4>Suggested structure (4 paragraphs)</h4>
        <ol>
          {guide.plan.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
        <h4>Ideas to get you started</h4>
        <ul>
          {item.ideas.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </details>

      <div className="editor-bar">
        <span className={cls('wordcount', words >= TARGET && 'ok')}>
          {words} / {TARGET} words
        </span>
        <span className={cls('timer', timer.remaining === 0 && 'over')}>
          ⏱ {fmtTime(timer.remaining)}
          {timer.running ? (
            <button className="link-btn" onClick={timer.pause}>
              pause
            </button>
          ) : (
            <button className="link-btn" onClick={timer.start} disabled={timer.remaining === 0}>
              {timer.remaining === EXAM_SECONDS ? 'start 40 min' : 'resume'}
            </button>
          )}
          {timer.remaining !== EXAM_SECONDS && (
            <button className="link-btn" onClick={timer.reset}>
              reset
            </button>
          )}
        </span>
      </div>
      <textarea
        className="editor"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your essay here. It saves automatically."
        spellCheck={false}
      />
      <p className="muted small">
        Spell-check is off, as in the real exam. Your essay is saved in this browser.
      </p>
    </>
  );
}
