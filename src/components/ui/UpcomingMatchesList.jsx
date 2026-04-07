import { formatFullMatchDate } from '../../utils/format';

export default function UpcomingMatchesList({ matches }) {
  return (
    <div className="upcoming-list">
      {matches.map((match) => (
        <article key={match.id} className="upcoming-item">
          <div className="upcoming-item-date">
            <strong>{formatFullMatchDate(match.date)}</strong>
            <span>{match.competition}</span>
          </div>

          <div className="upcoming-item-main">
            <h3>{match.home ? `Noobs - ${match.opponent}` : `${match.opponent} - Noobs`}</h3>
            <p>{match.venue}</p>
          </div>

          <div className="upcoming-item-badge">{match.home ? 'Εντός' : 'Εκτός'}</div>
        </article>
      ))}
    </div>
  );
}
