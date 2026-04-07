import { useEffect } from 'react';

export default function PlayerModal({ player, onClose }) {
  useEffect(() => {
    if (!player) return;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [player, onClose]);

  if (!player) {
    return null;
  }

  return (
    <div className="player-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="player-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`player-${player.id}-name`}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="player-modal-close" onClick={onClose} aria-label="Κλείσιμο λεπτομερειών παίκτη">
          Κλείσιμο
        </button>
        <img src={player.photo} alt={player.name} className="player-modal-photo" />
        <div className="player-modal-content">
          <span className="pill">#{player.number}</span>
          <h3 id={`player-${player.id}-name`}>{player.name}</h3>
          <p>{player.bio}</p>
          <div className="player-details-grid">
            <div>
              <small>Θέση</small>
              <strong>{player.position}</strong>
            </div>
            <div>
              <small>Ηλικία</small>
              <strong>{player.age}</strong>
            </div>
            <div>
              <small>Ύψος</small>
              <strong>{player.height}</strong>
            </div>
            <div>
              <small>Πόλη</small>
              <strong>{player.hometown}</strong>
            </div>
            <div>
              <small>Χέρι εκτέλεσης</small>
              <strong>{player.shootingHand}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
