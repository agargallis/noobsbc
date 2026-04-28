import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function InstaCarousel({ posts, instagramUrl }) {
  const trackRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
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

  useEffect(() => {
    if (!selectedPost) {
      document.body.classList.remove('modal-open');
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setSelectedPost(null);
      }
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedPost]);

  const selectedPostUrl = selectedPost?.href || instagramUrl || 'https://www.instagram.com/noobs.gr';
  const postModal = selectedPost && typeof document !== 'undefined'
    ? createPortal(
        <div className="news-post-modal-backdrop" role="presentation" onClick={() => setSelectedPost(null)}>
          <article
            className="news-post-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Instagram post"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="news-post-modal-close"
              onClick={() => setSelectedPost(null)}
              aria-label="Κλείσιμο νέου"
            >
              Κλείσιμο
            </button>

            <div className="news-post-modal-media">
              <img src={selectedPost.image} alt="" />
            </div>

            <div className="news-post-modal-footer">
              <a
                href={selectedPostUrl}
                target="_blank"
                rel="noreferrer"
                className="news-post-instagram-link"
                aria-label="Άνοιγμα post στο Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </article>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className="insta-carousel">
        <div className="insta-track-outer">
          <div className={`insta-track${maxIndex > 0 ? ' is-scrollable' : ' is-static'}`} ref={trackRef} onScroll={onScroll}>
            {posts.map((post) => (
              <button key={post.id} type="button" className="insta-card" onClick={() => setSelectedPost(post)}>
                <div className="insta-card-img">
                  <img src={post.image} alt="" />
                  <div className="insta-card-img-overlay" />
                </div>
                <div className="insta-card-body">
                  <p>{post.caption}</p>
                </div>
              </button>
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
      {postModal}
    </>
  );
}
