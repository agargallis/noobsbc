import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CookieBanner from '../components/ui/CookieBanner';
import ScrollToTopButton from '../components/ui/ScrollToTopButton';
import { useSiteData } from '../context/SiteDataContext';

const PUBLIC_THEME_STORAGE_KEY = 'noobs-public-theme';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.3" />
      <path d="M12 19.2v2.3" />
      <path d="m4.93 4.93 1.62 1.62" />
      <path d="m17.45 17.45 1.62 1.62" />
      <path d="M2.5 12h2.3" />
      <path d="M19.2 12h2.3" />
      <path d="m4.93 19.07 1.62-1.62" />
      <path d="m17.45 6.55 1.62-1.62" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A8.7 8.7 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function PrivacyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v5c0 5 3.4 8.5 7 10 3.6-1.5 7-5 7-10V6l-7-3Z" />
      <path d="M9.5 12.5 11 14l3.5-4" />
    </svg>
  );
}

function CookiesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4.5a3 3 0 0 0 4 4 7.5 7.5 0 1 1-8-3.5 3 3 0 0 0 4-0.5Z" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TermsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3h7l4 4v14H8z" />
      <path d="M15 3v4h4" />
      <path d="M11 12h5" />
      <path d="M11 16h5" />
      <path d="M11 8h1" />
    </svg>
  );
}

function RouteScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

export default function SiteShell() {
  const { siteData, siteDataLoading } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    return window.localStorage.getItem(PUBLIC_THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  });
  const location = useLocation();

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(PUBLIC_THEME_STORAGE_KEY, theme);
  }, [theme]);

  if (siteDataLoading || !siteData) {
    return (
      <div className="app-shell app-shell-loading" aria-busy="true">
        <RouteScrollRestoration />
        <main className="app-loading-main" />
      </div>
    );
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <RouteScrollRestoration />

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <Link className="brand" to="/">
          <img src="/images/logo1.png" alt="Λογότυπο Noobs" className="brand-logo" />
          <div className="brand-copy">
            <strong>{siteData.meta.shortName} BC</strong>
          </div>
        </Link>

        <div className="site-header-actions">
          <nav id="site-navigation" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Κύρια πλοήγηση">
            <a href="/#standings" onClick={() => setMenuOpen(false)}>
              Βαθμολογία
            </a>
            <a href="/#scores" onClick={() => setMenuOpen(false)}>
              Αποτελέσματα
            </a>
            <a href="/#schedule" onClick={() => setMenuOpen(false)}>
              Πρόγραμμα
            </a>
            <a href="/#roster" onClick={() => setMenuOpen(false)}>
              Ρόστερ
            </a>
            <a href="/#news" onClick={() => setMenuOpen(false)}>
              Νέα
            </a>
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            aria-label={theme === 'light' ? 'Ενεργοποίηση dark mode' : 'Ενεργοποίηση light mode'}
            aria-pressed={theme === 'light'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <div className="pre-footer-note">
        <p>
          Για παραπάνω λεπτομέρειες επισκεφθείτε το{' '}
          <a href="https://www.basketaki.com/teams/noobs/profile" target="_blank" rel="noreferrer" className="pre-footer-link">
            basketaki.com
          </a>
          !
        </p>
      </div>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-copy">© 2026 Noobs. Όλα τα δικαιώματα διατηρούνται.</div>

          <div className="footer-legal">
            <NavLink to="/privacy" aria-label="Απόρρητο" title="Απόρρητο" className="footer-legal-icon">
              <PrivacyIcon />
            </NavLink>
            <NavLink to="/cookies" aria-label="Cookies" title="Cookies" className="footer-legal-icon">
              <CookiesIcon />
            </NavLink>
            <NavLink to="/terms" aria-label="Όροι" title="Όροι" className="footer-legal-icon">
              <TermsIcon />
            </NavLink>
          </div>

          <div className="footer-credit">
            Υλοποιήθηκε από την{' '}
            <a href="https://ubd.gr" target="_blank" rel="noreferrer" className="footer-ubd">
              UBD
            </a>
            .
          </div>
        </div>
      </footer>

      <CookieBanner />
      <ScrollToTopButton />
    </div>
  );
}


