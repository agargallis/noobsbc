import { useEffect, useRef, useState } from 'react';

export default function InstaCarousel({ posts, instagramUrl }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const total = posts.length;

  const getCards = () => Array.from(trackRef.current?.children ?? []);

  const scrollToCard = (targetIndex, behavior = 'smooth') => {
    const cards = getCards();
    const targetCard = cards[targetIndex];
    if (!trackRef.current || !targetCard) {
      return;
    }

    trackRef.current.scrollTo({
      left: targetCard.offsetLeft,
      behavior,
    });
  };

  const goTo = (targetIndex) => {
    const clamped = Math.max(0, Math.min(total - 1, targetIndex));
    setIndex(clamped);
    scrollToCard(clamped);
  };

  const onScroll = () => {
    const track = trackRef.current;
    const cards = getCards();
    if (!track || !cards.length) {
      return;
    }

    const currentLeft = track.scrollLeft;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, cardIndex) => {
      const distance = Math.abs(card.offsetLeft - currentLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = cardIndex;
      }
    });

    setIndex((currentIndex) => (currentIndex === nearestIndex ? currentIndex : nearestIndex));
  };

  useEffect(() => {
    setIndex(0);
    requestAnimationFrame(() => scrollToCard(0, 'auto'));
  }, [posts]);

  return (
    <div className="insta-carousel">
      <div className="insta-track-outer">
        <div className="insta-track" ref={trackRef} onScroll={onScroll}>
          {posts.map((post) => (
            <a key={post.id} href={post.href} target="_blank" rel="noreferrer" className="insta-card">
              <div className="insta-card-img">
                <img src={post.image} alt="" />
                <div className="insta-card-img-overlay" />
              </div>
              <div className="insta-card-body">
                <p>{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="insta-controls">
        <button
          type="button"
          className="insta-arrow"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Προηγούμενο"
        >
          ←
        </button>

        <div className="insta-dots" role="tablist">
          {posts.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className={`insta-dot${i === index ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Post ${i + 1}`}
              aria-selected={i === index}
            />
          ))}
        </div>

        <button
          type="button"
          className="insta-arrow"
          onClick={() => goTo(index + 1)}
          disabled={index >= total - 1}
          aria-label="Επόμενο"
        >
          →
        </button>
      </div>

      <div className="insta-cta">
        <a href={instagramUrl} target="_blank" rel="noreferrer" className="button ghost">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          Δες εδώ περισσότερα
        </a>
      </div>
    </div>
  );
}
