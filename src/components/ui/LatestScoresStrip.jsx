import { formatMatchDate } from '../../utils/format';
import { resolveLocationUrl } from '../../utils/location';

function LocationIcon() {
  return (
    <svg
      className="score-location-icon"
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

export default function LatestScoresStrip({ matches }) {
  return (
    <div className="scores-strip" id="scores">
      {matches.map((match) => {
        const homeWon = match.homeScore > match.awayScore;
        const awayWon = match.awayScore > match.homeScore;
        const isDraw = match.homeScore === match.awayScore;
        const noobsAreHome = match.home === 'Noobs';
        const noobsScore = noobsAreHome ? match.homeScore : match.awayScore;
        const rivalScore = noobsAreHome ? match.awayScore : match.homeScore;
        const isWin = noobsScore > rivalScore;

        const homeStateClass = isDraw ? 'is-draw' : homeWon ? 'is-winner' : 'is-loser';
        const awayStateClass = isDraw ? 'is-draw' : awayWon ? 'is-winner' : 'is-loser';
        const locationUrl = resolveLocationUrl(match.mapUrl, match.venue);

        return (
          <article key={match.id} className={`score-card ${isWin ? 'is-win' : 'is-loss'}`}>
            <div className="score-card-top">
              <span>{formatMatchDate(match.date)}</span>
              <strong className={isWin ? 'win' : 'loss'}>{isWin ? 'Ν' : 'Η'}</strong>
            </div>

            <div className="score-result" aria-label={`Τελικό σκορ ${match.home} ${match.homeScore} - ${match.awayScore} ${match.away}`}>
              <span className={`score-result-value ${homeStateClass}`}>{match.homeScore}</span>
              <span className="score-result-sep">-</span>
              <span className={`score-result-value ${awayStateClass}`}>{match.awayScore}</span>
            </div>

            <div className="score-matchup">
              <span className={`score-team ${homeStateClass}`}>
                <img
                  src={match.homeLogo || '/images/basketaki.png'}
                  alt=""
                  className="match-team-logo"
                  aria-hidden="true"
                />
                <span className="score-team-name">{match.home}</span>
              </span>
              <span className={`score-team ${awayStateClass}`}>
                <img
                  src={match.awayLogo || '/images/basketaki.png'}
                  alt=""
                  className="match-team-logo"
                  aria-hidden="true"
                />
                <span className="score-team-name">{match.away}</span>
              </span>
            </div>

            {locationUrl ? (
              <a className="score-location-line location-link" href={locationUrl} target="_blank" rel="noreferrer">
                <LocationIcon />
                <span>{match.venue}</span>
              </a>
            ) : (
              <p className="score-location-line">
                <LocationIcon />
                <span>{match.venue}</span>
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
