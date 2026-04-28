import { useCountdown } from '../../hooks/useCountdown';
import { formatMatchDate } from '../../utils/format';
import { resolveLocationUrl } from '../../utils/location';

function CalendarIcon() {
  return (
    <svg
      className="countdown-calendar-icon"
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
      className="countdown-location-icon"
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

export default function CountdownPanel({ nextMatch }) {
  const countdown = useCountdown(nextMatch.date);
  const units = [
    { label: 'ΗΜΕΡΕΣ', value: countdown.days },
    { label: 'ΩΡΕΣ', value: countdown.hours },
    { label: 'ΛΕΠΤΑ', value: countdown.minutes },
    { label: 'ΔΕΥΤ.', value: countdown.seconds, isSeconds: true }
  ];

  const locationUrl = resolveLocationUrl(nextMatch.mapUrl, nextMatch.venue);
  const noobsAreHome = nextMatch.home !== false;
  const homeLogo = noobsAreHome ? '/images/logo1.png' : nextMatch.opponentLogo || '/images/basketaki.png';
  const awayLogo = noobsAreHome ? nextMatch.opponentLogo || '/images/basketaki.png' : '/images/logo1.png';
  const homeName = noobsAreHome ? 'Noobs' : nextMatch.opponent;
  const awayName = noobsAreHome ? nextMatch.opponent : 'Noobs';

  return (
    <article className="countdown-panel">
      <div className="countdown-copy">
        <span className="pill">ΕΠΟΜΕΝΟΣ ΑΓΩΝΑΣ</span>
        <div className="countdown-matchup">
          <span className="countdown-team-card is-home">
            <img src={homeLogo} alt="" className="countdown-team-logo" aria-hidden="true" />
            <span className="countdown-team-name">{homeName}</span>
          </span>
          <span className="countdown-vs">VS</span>
          <span className="countdown-team-card is-away">
            <img src={awayLogo} alt="" className="countdown-team-logo" aria-hidden="true" />
            <span className="countdown-team-name">{awayName}</span>
          </span>
        </div>
        {locationUrl ? (
          <a className="countdown-location-line location-link" href={locationUrl} target="_blank" rel="noreferrer">
            <LocationIcon />
            <span>{nextMatch.venue}</span>
          </a>
        ) : (
          <p className="countdown-location-line">
            <LocationIcon />
            <span>{nextMatch.venue}</span>
          </p>
        )}
        <strong className="countdown-date-line"><CalendarIcon />{formatMatchDate(nextMatch.date)}</strong>
      </div>

      <div className="countdown-grid" aria-live="polite">
        {countdown.isLive ? (
          <div className="countdown-live">Ώρα αγώνα.</div>
        ) : (
          units.map((item) => (
            <div key={item.label} className={`countdown-item${item.isSeconds ? ' is-seconds' : ''}`}>
              <span>{String(item.value).padStart(2, '0')}</span>
              <small>{item.label}</small>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
