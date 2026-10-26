import { useState } from 'react';
import { allWords } from '../data';
import { useStore } from '../store';
import Flashcards from '../components/Flashcards';

export default function ReviewPage() {
  const s = useStore();
  // Snapshot the pile on entry so cards don't vanish mid-session as they're marked known.
  const [pile] = useState(() => allWords.filter((w) => s.cards[w.w] === 'missed'));
  const remaining = allWords.filter((w) => s.cards[w.w] === 'missed').length;

  return (
    <div className="page">
      <nav className="topbar">
        <a href="#/" className="back">
          ← Calendar
        </a>
      </nav>
      <header className="day-head">
        <h1>Review pile</h1>
        <p className="muted">
          Every word you marked “didn’t know”, from all days. Mark it “knew it” to remove it. {remaining} left.
        </p>
      </header>
      <main className="panel vocab">
        {pile.length ? (
          <Flashcards words={pile} />
        ) : (
          <p className="empty">Nothing to review yet. Words you miss in the daily flashcards will appear here.</p>
        )}
      </main>
    </div>
  );
}
