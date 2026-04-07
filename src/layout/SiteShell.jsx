import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CookieBanner from '../components/ui/CookieBanner';
import ScrollToTopButton from '../components/ui/ScrollToTopButton';
import { useSiteData } from '../context/SiteDataContext';

function RouteScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

export default function SiteShell() {
  const { siteData } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  return (
    <div className="app-shell">
      <RouteScrollRestoration />

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <Link className="brand" to="/">
          <img src="/images/logo.png" alt="Λογότυπο Noobs" className="brand-logo" />
          <div className="brand-copy">
            <strong>{siteData.meta.shortName}</strong>
          </div>
        </Link>

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
          <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
            Διαχείριση
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-copy">© 2026 Noobs. Όλα τα δικαιώματα διατηρούνται.</div>

          <div className="footer-legal">
            <NavLink to="/privacy">Απόρρητο</NavLink>
            <NavLink to="/cookies">Cookies</NavLink>
            <NavLink to="/terms">Όροι</NavLink>
          </div>

          <div className="footer-credit">
            Δημιουργήθηκε από την{' '}
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
