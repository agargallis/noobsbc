import { formatFullMatchDate } from '../../utils/format';

export default function UpcomingMatchesList({ matches }) {
  return (
    <div className="upcoming-list">
      {matches.map((match) => {
        const homeLogo = match.home ? '/images/logo.png' : (match.opponentLogo || '/images/basketaki.png');
        const awayLogo = match.home ? (match.opponentLogo || '/images/basketaki.png') : '/images/logo.png';

        return (
          <article key={match.id} className="upcoming-item">
            <div className="upcoming-item-date">
              <strong>{formatFullMatchDate(match.date)}</strong>
              <span>{match.competition}</span>
            </div>

            <div className="upcoming-item-main">
              <div className="upcoming-vs-row">
                <img src={homeLogo} alt="" className="upcoming-team-logo" aria-hidden="true" />
                <span className="upcoming-vs-dot">vs</span>
                <img src={awayLogo} alt="" className="upcoming-team-logo" aria-hidden="true" />
              </div>
              <h3>{match.home ? `Noobs - ${match.opponent}` : `${match.opponent} - Noobs`}</h3>
              <p>{match.venue}</p>
            </div>

            <div className="upcoming-item-badge">{match.home ? 'Εντός' : 'Εκτός'}</div>
          </article>
        );
      })}
    </div>
  );
}
