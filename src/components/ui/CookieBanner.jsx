import { Link } from 'react-router-dom';
import { useState } from 'react';

const STORAGE_KEY = 'noobs-cookie-consent-v1';

function CookieIcon() {
  return (
    <svg className="cookie-icon-svg" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <circle cx="28" cy="28" r="24" fill="rgba(244,198,61,0.14)" stroke="rgba(244,198,61,0.5)" strokeWidth="1.6" />
      <ellipse cx="19" cy="22" rx="3.4" ry="2.8" fill="#75a8ff" opacity="0.9" transform="rotate(-20 19 22)" />
      <ellipse cx="34" cy="19" rx="3" ry="2.4" fill="#75a8ff" opacity="0.9" transform="rotate(12 34 19)" />
      <ellipse cx="22" cy="35" rx="3.2" ry="2.6" fill="#75a8ff" opacity="0.9" transform="rotate(8 22 35)" />
      <ellipse cx="36" cy="33" rx="2.8" ry="2.2" fill="#75a8ff" opacity="0.9" transform="rotate(-10 36 33)" />
      <ellipse cx="14" cy="33" rx="2.4" ry="2" fill="#75a8ff" opacity="0.9" />
      <ellipse cx="29" cy="42" rx="2.6" ry="2.1" fill="#75a8ff" opacity="0.9" transform="rotate(5 29 42)" />
    </svg>
  );
}

export default function CookieBanner() {
  const [consent, setConsent] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(STORAGE_KEY);
  });

  const handleConsent = (value) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  if (consent) {
    return null;
  }

  return (
    <aside className="cookie-banner" role="dialog" aria-modal="true" aria-live="polite" aria-label="Προτιμήσεις cookies">
      <div className="cookie-icon-wrap">
        <CookieIcon />
      </div>
      <div className="cookie-text">
        <strong>Χρήση cookies</strong>
        <p>
          Το site αποθηκεύει την επιλογή συναίνεσης και τις τοπικές αλλαγές διαχείρισης στον browser σας. Δείτε λεπτομέρειες
          στην <Link to="/cookies">πολιτική cookies</Link>.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="button ghost" onClick={() => handleConsent('essential')}>
          Μόνο απαραίτητα
        </button>
        <button type="button" className="button" onClick={() => handleConsent('all')}>
          Αποδοχή όλων
        </button>
      </div>
    </aside>
  );
}
