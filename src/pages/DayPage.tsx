import { useState } from 'react';
import { SECTIONS, type SectionKey } from '../types';
import { TOTAL_DAYS, getDay } from '../data';
import { setSection, useStore } from '../store';
import { cls } from '../util';
import Listening from '../sections/Listening';
import Reading from '../sections/Reading';
import Speaking from '../sections/Speaking';
import Writing from '../sections/Writing';
import Vocab from '../sections/Vocab';

export default function DayPage({ day }: { day: number }) {
  const s = useStore();
  const p = s.days[day] ?? {};
  const content = getDay(day);
  const [tab, setTab] = useState<SectionKey>(() => SECTIONS.find((x) => !p[x.key])?.key ?? 'listening');
  const doneCount = SECTIONS.filter((x) => p[x.key]).length;

  function toggle(key: SectionKey) {
    const done = !p[key];
    setSection(day, key, done);
    if (done) {
      const next = SECTIONS.find((x) => x.key !== key && !p[x.key]);
      if (next) setTab(next.key);
    }
  }

  return (
    <div className="page">
      <nav className="topbar">
        <a href="#/" className="back">
          ← Calendar
        </a>
        <div className="daynav">
          {day > 1 ? (
            <a href={`#/day/${day - 1}`} aria-label="Previous day">
              ‹
            </a>
          ) : (
            <span />
          )}
          <span>
            Day {day} / {TOTAL_DAYS}
          </span>
          {day < TOTAL_DAYS ? (
            <a href={`#/day/${day + 1}`} aria-label="Next day">
              ›
            </a>
          ) : (
            <span />
          )}
        </div>
      </nav>

      <header className="day-head">
        <h1>Day {day}</h1>
        <div className="bar">
          <div style={{ width: `${(doneCount / SECTIONS.length) * 100}%` }} />
        </div>
        <p className="muted">
          {doneCount === SECTIONS.length ? 'Day complete. Great work! 🎉' : `${doneCount} of ${SECTIONS.length} sections done`}
        </p>
      </header>

      <div className="tabs" role="tablist">
        {SECTIONS.map((x) => (
          <button
            key={x.key}
            role="tab"
            aria-selected={tab === x.key}
            className={cls('tab', x.key, tab === x.key && 'active', p[x.key] && 'done')}
            onClick={() => setTab(x.key)}
          >
            <span className="tab-icon">{p[x.key] ? '✓' : x.icon}</span>
            <span className="tab-label">{x.label}</span>
          </button>
        ))}
      </div>

      <main className={cls('panel', tab)} role="tabpanel">
        {tab === 'listening' && <Listening item={content.listening} />}
        {tab === 'reading' && <Reading item={content.reading} />}
        {tab === 'speaking' && <Speaking item={content.speaking} />}
        {tab === 'writing' && <Writing item={content.writing} />}
        {tab === 'vocab' && (
          <Vocab words={content.words} onRoundComplete={() => !p.vocab && setSection(day, 'vocab', true)} />
        )}

        <button className={cls('btn done-btn', p[tab] && 'is-done')} onClick={() => toggle(tab)}>
          {p[tab] ? '✓ Done (tap to undo)' : `Mark ${SECTIONS.find((x) => x.key === tab)!.label} as done`}
        </button>
      </main>
    </div>
  );
}
