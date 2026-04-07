import { formatShortDate } from '../../utils/format';

export default function NewsGrid({ items }) {
  return (
    <div className="news-grid">
      {items.map((item) => (
        <article key={item.id} className="news-card">
          <img src={item.image} alt={item.title} />
          <div>
            <span>
              {item.category} · {formatShortDate(item.date)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
          </div>
        </article>
      ))}
    </div>
  );
}