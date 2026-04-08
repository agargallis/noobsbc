import { useEffect, useRef, useState } from 'react';

export default function RosterCarousel({ players, onSelectPlayer }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    const updateScrollState = () => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;
      setCanScrollLeft(track.scrollLeft > 8);
      setCanScrollRight(track.scrollLeft < maxScrollLeft - 8);
    };

    updateScrollState();
    track.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [players.length]);

  const scrollTrack = (direction) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const firstCard = track.querySelector('.roster-carousel-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 280;
    const gap = 18;

    track.scrollBy({
      left: direction * (cardWidth + gap) * 2,
      behavior: 'smooth'
    });
  };

  return (
    <div className="roster-carousel" data-animate style={{ '--anim-delay': '0.08s' }}>
      <div className="roster-carousel-controls">
        <button
          type="button"
          className="roster-carousel-button"
          onClick={() => scrollTrack(-1)}
          disabled={!canScrollLeft}
          aria-label="Προηγούμενοι παίκτες"
        >
          ‹
        </button>
        <button
          type="button"
          className="roster-carousel-button"
          onClick={() => scrollTrack(1)}
          disabled={!canScrollRight}
          aria-label="Επόμενοι παίκτες"
        >
          ›
        </button>
      </div>

      <div className="roster-carousel-track" ref={trackRef}>
        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            className="player-card roster-carousel-card"
            onClick={() => onSelectPlayer(player)}
          >
            <div className="player-card-photo">
              <img src={player.photo} alt={player.name} />
              <span className="player-card-number">#{player.number}</span>
            </div>
            <div className="player-card-info">
              <span>{player.position}</span>
              <h3>{player.name}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
