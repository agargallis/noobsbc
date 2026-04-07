import { useCountdown } from '../../hooks/useCountdown';
import { formatMatchDate } from '../../utils/format';

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

  return (
    <article className="countdown-panel">
      <div className="countdown-copy">
        <span className="pill">ΕΠΟΜΕΝΟΣ ΑΓΩΝΑΣ</span>
        <h3>{nextMatch.opponent}</h3>
        <p className="countdown-location-line">
          <LocationIcon />
          <span>{nextMatch.venue}</span>
        </p>
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
