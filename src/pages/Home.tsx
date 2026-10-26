import { useRef } from 'react';
import { SECTIONS } from '../types';
import { TOTAL_DAYS, allWords } from '../data';
import {
  exportBackup,
  importBackup,
  isDayComplete,
  resetAll,
  setAccent,
  streaks,
  useStore,
} from '../store';
import { cls } from '../util';

const DAYS = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);
const WEEKS = Array.from({ length: Math.ceil(TOTAL_DAYS / 7) }, (_, w) => DAYS.slice(w * 7, w * 7 + 7));

export default function Home() {
  const s = useStore();
  const completeDays = DAYS.filter((d) => isDayComplete(s.days[d])).length;
  const sectionsDone = DAYS.reduce((n, d) => n + SECTIONS.filter((x) => s.days[d]?.[x.key]).length, 0);
  const nextDay = DAYS.find((d) => !isDayComplete(s.days[d])) ?? TOTAL_DAYS;
  const results = Object.values(s.cards);
  const known = results.filter((r) => r === 'known').length;
  const missed = results.filter((r) => r === 'missed').length;
  const { current, best } = streaks(s.activity);
  const pct = Math.round((sectionsDone / (TOTAL_DAYS * SECTIONS.length)) * 100);

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">60-day IELTS plan · A2 → B1+</p>
        <h1>
          IELTS <em>60</em>
        </h1>
        <p className="lede">
          Five short sections a day: listen, read, speak, write and learn 25 words. Tick each one off and keep the
          streak going.
        </p>
        <a className="btn primary big" href={`#/day/${nextDay}`}>
          {completeDays === TOTAL_DAYS ? 'All done! Revisit Day 60' : `Continue · Day ${nextDay}`} →
        </a>
      </header>

      <section className="stats" aria-label="Progress">
        <Stat value={`${completeDays}`} unit={`/ ${TOTAL_DAYS}`} label="days complete" />
        <Stat value={`${current}`} unit={current === 1 ? 'day' : 'days'} label={`streak 🔥 · best ${best}`} />
        <Stat value={`${known}`} unit={`/ ${allWords.length}`} label="words known" />
        <a className="stat stat-link" href="#/review">
          <span className="stat-value">
            {missed}
            <small> words</small>
          </span>
          <span className="stat-label">to review →</span>
        </a>
      </section>

      <div className="overall" aria-label={`${pct}% of all sections done`}>
        <div className="bar">
          <div style={{ width: `${pct}%` }} />
        </div>
        <span>{pct}%</span>
      </div>

      <section className="calendar" aria-label="60-day calendar">
        {WEEKS.map((week, w) => (
          <div className="week" key={w}>
            <span className="week-label">Week {w + 1}</span>
            <div className="week-days">
              {week.map((d) => {
                const p = s.days[d];
                const complete = isDayComplete(p);
                return (
                  <a
                    key={d}
                    href={`#/day/${d}`}
                    className={cls('tile', complete && 'complete', d === nextDay && !complete && 'current')}
                    aria-label={`Day ${d}${complete ? ', complete' : ''}`}
                  >
                    <span className="tile-num">{complete ? '✓' : d}</span>
                    <span className="dots">
                      {SECTIONS.map((x) => (
                        <i key={x.key} className={cls('dot', x.key, p?.[x.key] && 'on')} />
                      ))}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
        <div className="legend">
          {SECTIONS.map((x) => (
            <span key={x.key}>
              <i className={cls('dot on', x.key)} /> {x.label}
            </span>
          ))}
        </div>
      </section>

      <Settings />
    </div>
  );
}

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="stat">
      <span className="stat-value">
        {value}
        <small> {unit}</small>
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function Settings() {
  const s = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  function download() {
    const blob = new Blob([exportBackup()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ielts60-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function restore(file: File) {
    try {
      importBackup(await file.text());
      alert('Progress restored.');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not read that file.');
    }
  }

  return (
    <section className="settings">
      <h2>Settings</h2>
      <div className="setting-row">
        <span>Pronunciation accent</span>
        <div className="seg">
          {(['en-GB', 'en-US'] as const).map((a) => (
            <button key={a} className={cls(s.accent === a && 'active')} onClick={() => setAccent(a)}>
              {a === 'en-GB' ? '🇬🇧 British' : '🇺🇸 American'}
            </button>
          ))}
        </div>
      </div>
      <div className="setting-row">
        <span>Progress is saved in this browser only.</span>
        <div className="row-btns">
          <button className="btn" onClick={download}>
            Export backup
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) restore(f);
              e.target.value = '';
            }}
          />
          <button
            className="btn danger"
            onClick={() => confirm('Reset ALL progress, essays and flashcard results?') && resetAll()}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
