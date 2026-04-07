import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'noobs-cookie-consent-v1';

export default function CookieBanner() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    setConsent(saved);
  }, []);

  const handleConsent = (value) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
  };

  if (consent) {
    return null;
  }

  return (
    <aside className="cookie-banner" role="dialog" aria-live="polite" aria-label="Προτιμήσεις cookies">
      <div>
        <strong>Χρήση cookies</strong>
        <p>
          Το site αποθηκεύει την επιλογή συναίνεσης και τις τοπικές αλλαγές διαχείρισης στον browser σας. Δείτε
          λεπτομέρειες στην <Link to="/cookies">πολιτική cookies</Link>.
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
