import { useEffect, useRef, useState } from 'react';

export default function InstaCarousel({ posts, instagramUrl }) {
  const trackRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const total = posts.length;

  const getCards = () => Array.from(trackRef.current?.children ?? []);

  const getMaxIndex = () => {
    const track = trackRef.current;
    const cards = getCards();

    if (!track || !cards.length) {
      return 0;
    }

    const canScroll = track.scrollWidth > track.clientWidth + 1;
    return canScroll ? cards.length - 1 : 0;
  };

  const getTargetLeft = (card) => {
    const track = trackRef.current;

    if (!track || !card) {
      return 0;
    }

    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    return Math.min(card.offsetLeft, maxScrollLeft);
  };

  const measureScrollBounds = () => {
    const nextMaxIndex = getMaxIndex();

    setMaxIndex(nextMaxIndex);
    setIndex((currentIndex) => Math.min(currentIndex, nextMaxIndex));
  };

  const scrollToCard = (targetIndex, behavior = 'smooth') => {
    const cards = getCards();
    const targetCard = cards[Math.max(0, Math.min(getMaxIndex(), targetIndex))];
    if (!trackRef.current || !targetCard) {
      return;
    }

    trackRef.current.scrollTo({
      left: getTargetLeft(targetCard),
      behavior,
    });
  };

  const goTo = (targetIndex) => {
    const clamped = Math.max(0, Math.min(getMaxIndex(), targetIndex));
    setIndex(clamped);
    scrollToCard(clamped);
  };

  const onScroll = () => {
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      const cards = getCards();
      if (!track || !cards.length) {
        return;
      }

      const currentLeft = track.scrollLeft;
      const currentMaxIndex = getMaxIndex();
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, cardIndex) => {
        const distance = Math.abs(getTargetLeft(card) - currentLeft);
        if (distance <= nearestDistance) {
          nearestDistance = distance;
          nearestIndex = cardIndex;
        }
      });

      setMaxIndex(currentMaxIndex);
      setIndex((currentIndex) => (currentIndex === nearestIndex ? currentIndex : nearestIndex));
    });
  };

  useEffect(() => {
    setIndex(0);
    const frame = requestAnimationFrame(() => {
      measureScrollBounds();
      scrollToCard(0, 'auto');
    });

    return () => cancelAnimationFrame(frame);
  }, [posts]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return undefined;
    }

    const observer = new ResizeObserver(measureScrollBounds);
    observer.observe(track);

    return () => {
      observer.disconnect();
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="insta-carousel">
      <div className="insta-track-outer">
        <div className={`insta-track${maxIndex > 0 ? ' is-scrollable' : ' is-static'}`} ref={trackRef} onScroll={onScroll}>
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

        <button
          type="button"
          className="insta-arrow"
          onClick={() => goTo(index + 1)}
          disabled={index >= maxIndex || total <= 1}
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
