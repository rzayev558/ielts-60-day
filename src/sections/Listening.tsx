import type { ListeningItem } from '../types';

export default function Listening({ item }: { item: ListeningItem }) {
  const id = new URL(item.url).searchParams.get('v');

  return (
    <>
      <a className="video" href={item.url} target="_blank" rel="noopener noreferrer">
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
        <span className="play" aria-hidden>
          ▶
        </span>
        <span className="duration">{item.durationMin} min</span>
      </a>
      <h2 className="item-title">{item.title}</h2>
      <p className="meta">
        {item.channel} · <span className="chip">{item.topic}</span>
      </p>

      <div className="task">
        <strong>Focus task</strong>
        <p>{item.tip}</p>
      </div>

      <ol className="steps">
        <li>Watch once without subtitles. Just follow the main idea.</li>
        <li>Watch again with English subtitles. Pause and write down 5 new words or phrases.</li>
        <li>Say the main idea out loud in 3–4 sentences.</li>
      </ol>

      <a className="btn primary" href={item.url} target="_blank" rel="noopener noreferrer">
        Open on YouTube ↗
      </a>
    </>
  );
}
