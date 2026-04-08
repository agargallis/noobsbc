import { useCountdown } from '../../hooks/useCountdown';
import { formatMatchDate } from '../../utils/format';
import { resolveLocationUrl } from '../../utils/location';

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

  return (
    <article className="countdown-panel">
      <div className="countdown-copy">
        <span className="pill">ΕΠΟΜΕΝΟΣ ΑΓΩΝΑΣ</span>
        <div className="countdown-matchup">
          <span className="countdown-team-card is-home">
            <img src="/images/logo1.png" alt="" className="countdown-team-logo" aria-hidden="true" />
            <span className="countdown-team-name">Noobs</span>
          </span>
          <span className="countdown-vs">VS</span>
          <span className="countdown-team-card is-away">
            <img src={nextMatch.opponentLogo || '/images/basketaki.png'} alt="" className="countdown-team-logo" aria-hidden="true" />
            <span className="countdown-team-name">{nextMatch.opponent}</span>
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
        <strong>{formatMatchDate(nextMatch.date)}</strong>
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
