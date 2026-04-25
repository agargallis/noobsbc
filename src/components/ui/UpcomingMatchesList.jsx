import { formatFullMatchDate } from '../../utils/format';
import { resolveLocationUrl } from '../../utils/location';

function CalendarIcon() {
  return (
    <svg
      className="upcoming-calendar-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="upcoming-location-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

export default function UpcomingMatchesList({ matches }) {
  const visibleMatches = matches.filter((match) => !match.hidden);

  return (
    <div className="upcoming-list">
      {visibleMatches.map((match) => {
        const homeLogo = match.home ? '/images/logo1.png' : match.opponentLogo || '/images/basketaki.png';
        const awayLogo = match.home ? match.opponentLogo || '/images/basketaki.png' : '/images/logo1.png';
        const homeName = match.home ? 'Noobs' : match.opponent;
        const awayName = match.home ? match.opponent : 'Noobs';
        const locationUrl = resolveLocationUrl(match.mapUrl, match.venue);

        return (
          <article key={match.id} className="upcoming-item">
            <div className="upcoming-item-date">
              <a className="upcoming-item-competition competition-link" href="https://www.basketaki.com" target="_blank" rel="noreferrer">{match.competition}</a>
              <strong className="upcoming-date-line"><CalendarIcon />{formatFullMatchDate(match.date)}</strong>
            </div>

            <div className="upcoming-item-main">
              <div className="upcoming-matchup">
                <span className="upcoming-team-card is-home">
                  <img src={homeLogo} alt="" className="upcoming-team-logo" aria-hidden="true" />
                  <span className="upcoming-team-name">{homeName}</span>
                </span>
                <span className="upcoming-vs"><span className="upcoming-vs-line" aria-hidden="true" /><span className="upcoming-vs-badge">VS</span><span className="upcoming-vs-line" aria-hidden="true" /></span>
                <span className="upcoming-team-card is-away">
                  <img src={awayLogo} alt="" className="upcoming-team-logo" aria-hidden="true" />
                  <span className="upcoming-team-name">{awayName}</span>
                </span>
              </div>
              {locationUrl ? (
                <a className="upcoming-location-line location-link" href={locationUrl} target="_blank" rel="noreferrer">
                  <LocationIcon />
                  <span>{match.venue}</span>
                </a>
              ) : (
                <p className="upcoming-location-line">
                  <LocationIcon />
                  <span>{match.venue}</span>
                </p>
              )}
            </div>

            <div className={`upcoming-item-badge ${match.home ? 'is-home' : 'is-away'}`}>{match.home ? 'Εντός' : 'Εκτός'}</div>
          </article>
        );
      })}
    </div>
  );
}

