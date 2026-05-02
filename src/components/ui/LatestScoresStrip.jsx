import { formatMatchDate } from '../../utils/format';
import { resolveLocationUrl } from '../../utils/location';

function CalendarIcon() {
  return (
    <svg
      className="score-calendar-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
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

function getYoutubeEmbedUrl(url) {
  if (!url) {
    return '';
  }

  try {
    const parsed = new URL(url);
    let videoId = '';

    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace(/\//g, '');
    } else if (parsed.pathname.startsWith('/live/')) {
      videoId = parsed.pathname.split('/')[2] || '';
    } else {
      videoId = parsed.searchParams.get('v') || '';
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  } catch {
    return '';
  }
}

export default function LatestScoresStrip({ matches }) {
  const visibleMatches = matches.filter((match) => !match.hidden);

  return (
    <div className={`scores-strip count-${Math.min(visibleMatches.length, 3)}`} id="scores">
      {visibleMatches.map((match) => {
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
        const youtubeEmbedUrl = getYoutubeEmbedUrl(match.youtubeUrl);

        return (
          <div key={match.id} className="score-item-stack">
            <article className={`score-card ${isWin ? 'is-win' : 'is-loss'}`}>
              <div className="score-card-top">
                <span className="score-date-line"><CalendarIcon />{formatMatchDate(match.date)}</span>
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

            {youtubeEmbedUrl ? (
              <div className="score-youtube-preview">
                <div className="score-youtube-thumb-wrap">
                  <iframe
                    className="score-youtube-embed"
                    src={youtubeEmbedUrl}
                    title={`YouTube video για ${match.home} - ${match.away}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
