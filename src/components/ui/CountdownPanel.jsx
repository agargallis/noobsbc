import { useCountdown } from '../../hooks/useCountdown';
import { formatMatchDate } from '../../utils/format';

export default function CountdownPanel({ nextMatch }) {
  const countdown = useCountdown(nextMatch.date);
  const units = [
    { label: 'Ημέρες', value: countdown.days },
    { label: 'Ώρες', value: countdown.hours },
    { label: 'Λεπτά', value: countdown.minutes },
    { label: 'Δευτ.', value: countdown.seconds, isSeconds: true }
  ];

  return (
    <article className="countdown-panel">
      <div className="countdown-copy">
        <span className="pill">Επομενος αγωνας</span>
        <h3>{nextMatch.opponent}</h3>
        <p>
          {nextMatch.competition} στο {nextMatch.venue}
        </p>
        <strong>{formatMatchDate(nextMatch.date)}</strong>
        <small>{nextMatch.note}</small>
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
