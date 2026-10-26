import type { ReadingItem } from '../types';

export default function Reading({ item }: { item: ReadingItem }) {
  return (
    <>
      <a className="article" href={item.url} target="_blank" rel="noopener noreferrer">
        <span className="article-source">{item.source}</span>
        <span className="article-title">{item.title}</span>
        <span className="article-meta">
          ~{item.minutes} min read · {item.topic} ↗
        </span>
      </a>

      <div className="task">
        <strong>Reading task</strong>
        <p>{item.task}</p>
      </div>

      <ol className="steps">
        <li>Skim the article in 1 minute: title, headings, first sentence of each paragraph.</li>
        <li>Read it fully. Don’t stop for every unknown word. Guess from context.</li>
        <li>Write a 2-sentence summary, then pick 5 useful words to remember.</li>
      </ol>

      <a className="btn primary" href={item.url} target="_blank" rel="noopener noreferrer">
        Open article ↗
      </a>
    </>
  );
}
