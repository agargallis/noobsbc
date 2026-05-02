import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CountdownPanel from '../components/ui/CountdownPanel';
import InstaCarousel from '../components/ui/InstaCarousel';
import LatestScoresStrip from '../components/ui/LatestScoresStrip';
import PlayerModal from '../components/ui/PlayerModal';
import RosterCarousel from '../components/ui/RosterCarousel';
import SectionHeading from '../components/ui/SectionHeading';
import StandingsTable from '../components/ui/StandingsTable';
import UpcomingMatchesList from '../components/ui/UpcomingMatchesList';
import { useAuth } from '../context/AuthContext';
import { useSiteData } from '../context/SiteDataContext';
import { formatMatchDate } from '../utils/format';

const clone = (value) => JSON.parse(JSON.stringify(value));
const createId = () => Date.now() + Math.floor(Math.random() * 100000);

const emptyStanding = () => ({
  id: createId(),
  team: '',
  logo: '/images/basketaki.png',
  played: 0,
  won: 0,
  lost: 0,
  points: 0,
  streak: '',
  scored: 0,
  conceded: 0,
  diff: 0,
  ab: 0
});

const emptyLatestMatch = () => ({
  id: createId(),
  date: new Date().toISOString(),
  home: 'Noobs',
  away: '',
  homeLogo: '/images/logo1.png',
  awayLogo: '/images/basketaki.png',
  homeScore: 0,
  awayScore: 0,
  venue: '',
  mapUrl: '',
  youtubeUrl: '',
  hidden: false
});

const emptyUpcomingMatch = () => ({
  id: createId(),
  date: new Date().toISOString(),
  opponent: '',
  opponentLogo: '/images/basketaki.png',
  venue: '',
  mapUrl: '',
  competition: 'Basketaki The League',
  home: true,
  hidden: false
});

const emptyPlayer = () => ({
  id: createId(),
  name: '',
  number: 0,
  position: '',
  age: 0,
  height: '',
  bio: '',
  photo: '/images/logo1.png'
});

const emptyInstagramPost = () => ({
  id: createId(),
  image: '/images/logo1.png',
  caption: '',
  likes: 0,
  comments: 0,
  href: 'https://instagram.com/noobs.gr'
});

const emptySponsor = () => ({
  id: `sponsor-${createId()}`,
  name: '',
  label: '',
  image: '/images/logo1.png',
  url: '',
  logoToneDark: 'original',
  logoToneLight: 'original'
});

const fieldNumber = (value) => Number(value || 0);

const toDateTimeLocal = (value) => {
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const toIsoString = (value) => new Date(value).toISOString();

const visibleItems = (items) => items.filter((item) => !item.hidden);

const moveItem = (items, fromIndex, toIndex) => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

function DragHandle() {
  return (
    <span className="admin-drag-handle" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function AdminSection({ id, title, description, preview, actions, children }) {
  return (
    <section id={id} className="section-block admin-live-section admin-builder-section">
      <div className="admin-live-section-head">
        <SectionHeading eyebrow={title} title={title} body={description} />
        {actions ? <div className="admin-builder-actions">{actions}</div> : null}
      </div>

      <div className="admin-live-preview">{preview}</div>
      <div className="admin-live-editor">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  const { isSupabaseConfigured, authLoading, isAuthenticated, signIn, signOut, user } = useAuth();
  const { siteData, siteDataLoading, saveSiteData, siteDataError } = useSiteData();

  const [draft, setDraft] = useState(() => clone(siteData));
  const [activeSection, setActiveSection] = useState('admin-next-match');
  const [previewPlayer, setPreviewPlayer] = useState(null);
  const [status, setStatus] = useState('Το panel είναι έτοιμο για live αλλαγές.');
  const [statusType, setStatusType] = useState('ok');
  const [isSaving, setIsSaving] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [sponsorPreviewTheme, setSponsorPreviewTheme] = useState('dark');

  const hydrateRef = useRef(true);
  const autoSaveTimerRef = useRef(null);

  useEffect(() => {
    setDraft(clone(siteData));
    hydrateRef.current = false;
  }, [siteData]);

  useEffect(() => {
    if (siteDataError?.message) {
      setStatus(`Σφάλμα φόρτωσης: ${siteDataError.message}`);
      setStatusType('error');
    }
  }, [siteDataError]);

  useEffect(() => {
    if (!isAuthenticated || hydrateRef.current || !hasPendingChanges) {
      return undefined;
    }

    window.clearTimeout(autoSaveTimerRef.current);
    setStatus('Γίνεται αυτόματη αποθήκευση στο Supabase...');
      setStatusType('saving');

    autoSaveTimerRef.current = window.setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveSiteData(clone(draft));
        setHasPendingChanges(false);
        setLastSavedAt(new Date());
        setStatus('Οι αλλαγές ενημερώθηκαν live στο site.');
        setStatusType('ok');
      } catch (error) {
        setStatus(`Η αποθήκευση απέτυχε: ${error.message}`);
        setStatusType('error');
      } finally {
        setIsSaving(false);
      }
    }, 700);

    return () => window.clearTimeout(autoSaveTimerRef.current);
  }, [draft, hasPendingChanges, isAuthenticated, saveSiteData]);

  const applyDraft = (updater) => {
    setDraft((current) => (typeof updater === 'function' ? updater(current) : updater));
    setHasPendingChanges(true);
  };

  const updateNestedField = (section, field, value) => {
    applyDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value
      }
    }));
  };

  const updateDeepField = (section, nestedField, field, value) => {
    applyDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [nestedField]: {
          ...current[section][nestedField],
          [field]: value
        }
      }
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    applyDraft((current) => {
      const items = [...current[section]];
      items[index] = { ...items[index], [field]: value };
      return { ...current, [section]: items };
    });
  };

  const addArrayItem = (section, factory, position = 'end') => {
    applyDraft((current) => {
      const newItem = factory();
      const items = position === 'start' ? [newItem, ...current[section]] : [...current[section], newItem];

      return {
        ...current,
        [section]: items
      };
    });
  };

  const removeArrayItem = (section, index) => {
    applyDraft((current) => {
      const removedItem = current[section][index];
      const nextItems = current[section].filter((_, itemIndex) => itemIndex !== index);
      const nextDraft = {
        ...current,
        [section]: nextItems
      };

      if (section === 'upcomingMatches' && String(current.hero.featuredMatchId) === String(removedItem?.id)) {
        nextDraft.hero = {
          ...current.hero,
          featuredMatchId: nextItems[0]?.id ?? null
        };
      }

      return nextDraft;
    });
  };

  const moveArrayItem = (section, fromIndex, toIndex) => {
    if (fromIndex === toIndex) {
      return;
    }

    applyDraft((current) => ({
      ...current,
      [section]: moveItem(current[section], fromIndex, toIndex)
    }));
  };

  const startDragging = (section, index) => {
    setDragState({ section, index });
  };

  const handleDrop = (section, index) => {
    if (!dragState || dragState.section !== section) {
      return;
    }

    moveArrayItem(section, dragState.index, index);
    setDragState(null);
  };

  const setFeaturedMatchId = (matchId) => {
    applyDraft((current) => ({
      ...current,
      hero: {
        ...current.hero,
        featuredMatchId: matchId
      }
    }));
  };

  const resolveHeroMatch = (currentDraft) =>
    currentDraft.upcomingMatches.find((match) => String(match.id) === String(currentDraft.hero.featuredMatchId)) ?? currentDraft.nextMatch;

  const resolveHeroMatchIndex = (currentDraft) =>
    currentDraft.upcomingMatches.findIndex((match) => String(match.id) === String(currentDraft.hero.featuredMatchId));

  const updateHeroMatchField = (field, value) => {
    const featuredIndex = resolveHeroMatchIndex(draft);

    if (featuredIndex >= 0) {
      updateArrayItem('upcomingMatches', featuredIndex, field, value);
      return;
    }

    updateNestedField('nextMatch', field, value);
  };

  const heroMatch = resolveHeroMatch(draft);
  const heroMatchIndex = resolveHeroMatchIndex(draft);
  const heroSponsors = [...draft.sponsors, ...draft.sponsors];

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      await signIn(loginForm.email, loginForm.password);
      setStatus('Η σύνδεση ολοκληρώθηκε. Το panel είναι έτοιμο για αλλαγές.');
      setStatusType('ok');
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setLoginError(error.message || 'Η σύνδεση απέτυχε.');
      setStatus('Η σύνδεση απέτυχε. Έλεγξε τα στοιχεία σου.');
      setStatusType('error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    window.clearTimeout(autoSaveTimerRef.current);
    await signOut();
    setStatus('Έγινε αποσύνδεση από το panel διαχείρισης.');
    setStatusType('ok');
    setHasPendingChanges(false);
  };

  const publishNow = async () => {
    window.clearTimeout(autoSaveTimerRef.current);
    setIsSaving(true);
    try {
      await saveSiteData(clone(draft));
      setHasPendingChanges(false);
      setLastSavedAt(new Date());
      setStatus('Η δημοσίευση ολοκληρώθηκε και το frontend ενημερώθηκε.');
      setStatusType('ok');
    } catch (error) {
      setStatus(`Η αποθήκευση απέτυχε: ${error.message}`);
      setStatusType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const sectionLinks = [
    { id: 'admin-next-match', label: 'Επόμενος αγώνας' },
    { id: 'admin-standings', label: 'Βαθμολογία' },
    { id: 'admin-latest-results', label: 'Τελευταία αποτελέσματα' },
    { id: 'admin-schedule', label: 'Πρόγραμμα' },
    { id: 'admin-roster', label: 'Ρόστερ' },
    { id: 'admin-news', label: 'Νέα ομάδας' },
    { id: 'admin-sponsors', label: 'Χορηγοί' }
  ];

  const activeSectionMeta = sectionLinks.find((section) => section.id === activeSection) ?? sectionLinks[0];


  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-auth-shell">
        <div className="not-found-card admin-login-card">
          <Link className="brand admin-brand" to="/">
            <img src="/images/logo1.png" alt="Noobs logo" className="brand-logo" />
            <div>
              <strong>Admin Noobs</strong>
              <span>Απαιτείται Supabase config</span>
            </div>
          </Link>
          <h1>Λείπουν οι ρυθμίσεις του Supabase</h1>
          <p>
            Συμπλήρωσε τα <code>VITE_SUPABASE_URL</code> και <code>VITE_SUPABASE_ANON_KEY</code> στο <code>.env</code> για να
            ενεργοποιηθεί το admin login.
          </p>
          <Link className="button" to="/">
            Επιστροφή στο site
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading || siteDataLoading || !draft) {
    return (
      <div className="admin-auth-shell">
        <div className="not-found-card admin-login-card">
          <h1>Φόρτωση διαχείρισης</h1>
          <p>Ελέγχονται το session και τα live δεδομένα του Supabase.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-auth-shell">
        <div className="not-found-card admin-login-card">
          <span className="admin-login-kicker">Noobs Control Room</span>

          <Link className="brand admin-brand admin-login-brand" to="/">
            <img src="/images/logo1.png" alt="Noobs logo" className="brand-logo" />
            <div className="brand-copy">
              <strong>Διαχείριση Noobs BC</strong>
              <span>Private Access</span>
            </div>
          </Link>

          <div className="admin-login-copy">
            <h1>Σύνδεση διαχειριστή</h1>
          </div>

          <form className="admin-login-form" onSubmit={handleLoginSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                autoComplete="email"
                placeholder="admin@noobs.gr"
                required
              />
            </label>
            <label>
              <span>Κωδικός πρόσβασης</span>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete="current-password"
                placeholder="Πληκτρολόγησε τον κωδικό σου"
                required
              />
            </label>

            {loginError ? <p className="admin-inline-error">{loginError}</p> : null}

            <div className="admin-login-actions">
              <button type="submit" className="button" disabled={loginLoading}>
                {loginLoading ? 'Σύνδεση...' : 'Είσοδος'}
              </button>
              <Link className="button ghost" to="/">
                Επιστροφή στο site
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell admin-studio-shell">
      <header className="admin-studio-bar">
        <div className="admin-studio-bar-main">
          <Link className="brand admin-brand admin-studio-brand" to="/">
            <img src="/images/logo1.png" alt="Noobs logo" className="brand-logo" />
            <div className="brand-copy">
              <strong>Διαχείριση Noobs BC</strong>
              <span>Ζωντανή διαχείριση</span>
            </div>
          </Link>
        </div>

        <div className="admin-studio-bar-side">
          <div className="admin-rail-card admin-rail-card-compact">
            <span className={`admin-live-pill${isSaving ? ' is-saving' : ''}`}>{isSaving ? 'Γίνεται αποθήκευση' : 'Συνδεδεμένος live'}</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="admin-rail-actions admin-studio-actions">
            <button type="button" className="button" onClick={publishNow} disabled={isSaving}>
              {isSaving ? 'Αποθήκευση...' : 'Αποθήκευση'}
            </button>
            <button type="button" className="button ghost" onClick={handleLogout}>
              Αποσύνδεση
            </button>
          </div>
        </div>
      </header>

      <nav className="admin-section-nav admin-studio-nav" aria-label="Ενότητες διαχείρισης">
        {sectionLinks.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`admin-section-button${activeSection === section.id ? ' is-active' : ''}`}
            onClick={() => scrollToSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <main className="admin-builder admin-studio-main" data-active-section={activeSection}>
        <header className="admin-builder-hero admin-studio-hero">
          <div className="admin-builder-summary">
            <article>
              <strong>{draft.upcomingMatches.length}</strong>
              <span>Αγώνες πριν</span>
            </article>
            <article>
              <strong>{draft.players.length}</strong>
              <span>Παίκτες</span>
            </article>
            <article>
              <strong>{draft.instagramPosts.length}</strong>
              <span>Cards νέων</span>
            </article>
          </div>
        </header>

        <AdminSection
          id="admin-next-match"
          title="Επόμενος αγώνας"
          description="Διάλεξε ποιος αγώνας του προγράμματος εμφανίζεται στο hero. Το countdown ακολουθεί live τη selected ημερομηνία."
          preview={
            <div className="admin-hero-preview">
              <div className="hero-main-grid">
                <div className="hero-aside">
                  <CountdownPanel nextMatch={heroMatch} />
                </div>

                <aside className="hero-showcase" aria-label="Noobs και χορηγοί">
                  <div className="hero-showcase-logo">
                    <img src="/images/logo1.png" alt={draft.meta.shortName} className="hero-zoom-logo" />
                  </div>

                  <div className="hero-sponsors-loop">
                    <div className="hero-sponsors-track">
                      <a className="hero-sponsor-pill" href="https://www.basketaki.com" target="_blank" rel="noreferrer">
                        <img src="/images/basketaki.png" alt="Basketaki The League" />
                      </a>
                      {heroSponsors.map((sponsor, index) => (
                        <a
                          key={`${sponsor.id}-${index}`}
                          className="hero-sponsor-pill"
                          href={sponsor.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-hidden={index >= draft.sponsors.length}
                          tabIndex={index >= draft.sponsors.length ? -1 : undefined}
                        >
                          <img src={sponsor.image} alt={sponsor.name} />
                        </a>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              <div className="button-row hero-buttons admin-preview-hero-buttons">
                <a className="button" href={draft.hero.primaryCta.href}>
                  {draft.hero.primaryCta.label}
                </a>
                <a className="button ghost" href={draft.hero.secondaryCta.href}>
                  {draft.hero.secondaryCta.label}
                </a>
              </div>
            </div>
          }
        >
          <div className="admin-editor-stack">
            <div className="admin-inline-grid two-columns">
              {draft.upcomingMatches.map((match) => {
                const isActive = String(draft.hero.featuredMatchId) === String(match.id);
                return (
                  <button
                    key={match.id}
                    type="button"
                    className={`admin-select-card${isActive ? ' is-active' : ''}`}
                    onClick={() => setFeaturedMatchId(match.id)}
                  >
                    <strong>{match.opponent || 'Αντίπαλος'}</strong>
                    <small>{formatMatchDate(match.date)}</small>
                    <small>{match.home ? 'Εντός έδρας' : 'Εκτός έδρας'}</small>
                  </button>
                );
              })}
            </div>

            <div className="admin-editor-note">
              <strong>{heroMatchIndex >= 0 ? 'Το hero διαβάζει τον επιλεγμένο αγώνα του προγράμματος' : 'Δεν έχει οριστεί featured αγώνας'}</strong>
              <span>
                {heroMatchIndex >= 0
                  ? 'Κάθε αλλαγή σε αντίπαλο, venue, Google Maps link, ώρα ή λογότυπο ενημερώνει άμεσα το box του Επόμενου αγώνα στο frontend.'
                  : 'Επίλεξε έναν αγώνα από τα cards πιο πάνω για να συνδεθεί σωστά το hero με το πρόγραμμα.'}
              </span>
            </div>

            <div className="admin-grid compact two-columns">
              <label>
                Hero CTA 1
                <input value={draft.hero.primaryCta.label} onChange={(event) => updateDeepField('hero', 'primaryCta', 'label', event.target.value)} />
              </label>
              <label>
                Hero CTA 1 link
                <input value={draft.hero.primaryCta.href} onChange={(event) => updateDeepField('hero', 'primaryCta', 'href', event.target.value)} />
              </label>
              <label>
                Hero CTA 2
                <input value={draft.hero.secondaryCta.label} onChange={(event) => updateDeepField('hero', 'secondaryCta', 'label', event.target.value)} />
              </label>
              <label>
                Hero CTA 2 link
                <input value={draft.hero.secondaryCta.href} onChange={(event) => updateDeepField('hero', 'secondaryCta', 'href', event.target.value)} />
              </label>
              <label>
                Αντίπαλος hero
                <input value={heroMatch.opponent} onChange={(event) => updateHeroMatchField('opponent', event.target.value)} />
              </label>
              <label>
                Venue hero
                <input value={heroMatch.venue} onChange={(event) => updateHeroMatchField('venue', event.target.value)} />
              </label>
              <label>
                Google Maps link
                <input value={heroMatch.mapUrl || ''} onChange={(event) => updateHeroMatchField('mapUrl', event.target.value)} />
              </label>
              <label>
                Διοργάνωση hero
                <input value={heroMatch.competition} onChange={(event) => updateHeroMatchField('competition', event.target.value)} />
              </label>
              <label>
                Ημερομηνία και ώρα hero
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(heroMatch.date)}
                  onChange={(event) => updateHeroMatchField('date', toIsoString(event.target.value))}
                />
              </label>
              <label>
                Logo αντιπάλου hero (URL)
                <div className="admin-logo-preview-row">
                  {heroMatch.opponentLogo && <img src={heroMatch.opponentLogo} alt="" className="admin-logo-thumb" />}
                  <input value={heroMatch.opponentLogo || ''} onChange={(event) => updateHeroMatchField('opponentLogo', event.target.value)} />
                </div>
              </label>
            </div>
          </div>
        </AdminSection>

        <AdminSection
          id="admin-standings"
          title="Βαθμολογία"
          description="Το standings board ακολουθεί τη λογική του Basketaki: Β, Α, Ν, Η, STR, ΥΠ, ΚΤ, +/- και ΑΒ, μαζί με logo ομάδας."
          preview={<StandingsTable standings={draft.standings} groupTitle={draft.standingsGroupTitle} />}
          actions={
            <button type="button" className="button" onClick={() => addArrayItem('standings', emptyStanding)}>
              Προσθήκη ομάδας
            </button>
          }
        >
          <div className="admin-editor-stack">
            <div className="admin-grid compact">
              <label>
                Τίτλος ομίλου
                <input value={draft.standingsGroupTitle || ''} onChange={(event) => applyDraft((current) => ({ ...current, standingsGroupTitle: event.target.value }))} />
              </label>
            </div>

            <div className="admin-sortable-list">
              {draft.standings.map((team, index) => (
                <article
                  key={team.id}
                  className="admin-sortable-card"
                  draggable
                  onDragStart={() => startDragging('standings', index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop('standings', index)}
                >
                  <div className="admin-sortable-head">
                    <div className="admin-sortable-title">
                      <DragHandle />
                      <strong>{team.team || `Ομάδα ${index + 1}`}</strong>
                    </div>
                    <button type="button" className="button ghost" onClick={() => removeArrayItem('standings', index)}>
                      Αφαίρεση
                    </button>
                  </div>

                  <div className="admin-grid compact three-columns">
                    <label>
                      Ομάδα
                      <input value={team.team} onChange={(event) => updateArrayItem('standings', index, 'team', event.target.value)} />
                    </label>
                    <label>
                      URL logo
                      <input value={team.logo || ''} onChange={(event) => updateArrayItem('standings', index, 'logo', event.target.value)} />
                    </label>
                    <label>
                      STR
                      <input value={team.streak || ''} onChange={(event) => updateArrayItem('standings', index, 'streak', event.target.value)} />
                    </label>
                    <label>
                      Β
                      <input type="number" value={team.points ?? 0} onChange={(event) => updateArrayItem('standings', index, 'points', fieldNumber(event.target.value))} />
                    </label>
                    <label>
                      Α
                      <input type="number" value={team.played ?? 0} onChange={(event) => updateArrayItem('standings', index, 'played', fieldNumber(event.target.value))} />
                    </label>
                    <label>
                      Ν
                      <input type="number" value={team.won ?? 0} onChange={(event) => updateArrayItem('standings', index, 'won', fieldNumber(event.target.value))} />
                    </label>
                    <label>
                      Η
                      <input type="number" value={team.lost ?? 0} onChange={(event) => updateArrayItem('standings', index, 'lost', fieldNumber(event.target.value))} />
                    </label>
                    <label>
                      ΥΠ
                      <input type="number" value={team.scored ?? 0} onChange={(event) => updateArrayItem('standings', index, 'scored', fieldNumber(event.target.value))} />
                    </label>
                    <label>
                      ΚΤ
                      <input type="number" value={team.conceded ?? 0} onChange={(event) => updateArrayItem('standings', index, 'conceded', fieldNumber(event.target.value))} />
                    </label>
                    <label>
                      +/-
                      <input type="number" value={team.diff ?? 0} onChange={(event) => updateArrayItem('standings', index, 'diff', fieldNumber(event.target.value))} />
                    </label>
                    <label>
                      ΑΒ
                      <input type="number" value={team.ab ?? 0} onChange={(event) => updateArrayItem('standings', index, 'ab', fieldNumber(event.target.value))} />
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </AdminSection>

        <AdminSection
          id="admin-latest-results"
          title="Τελευταία αποτελέσματα"
          description="Τα score cards ενημερώνονται άμεσα. Άλλαξε σειρά, σκορ, ομάδες και venue με drag and drop."
          preview={<LatestScoresStrip matches={visibleItems(draft.latestMatches)} />}
          actions={
            <button type="button" className="button" onClick={() => addArrayItem('latestMatches', emptyLatestMatch)}>
              Προσθήκη αποτελέσματος
            </button>
          }
        >
          <div className="admin-sortable-list">
            {draft.latestMatches.map((match, index) => (
              <article
                key={match.id}
                className={`admin-sortable-card${match.hidden ? ' is-disabled' : ''}`}
                draggable
                onDragStart={() => startDragging('latestMatches', index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop('latestMatches', index)}
              >
                <div className="admin-sortable-head">
                  <div className="admin-sortable-title">
                    <DragHandle />
                    <strong>
                      {match.home || 'Γηπεδούχος'} - {match.away || 'Φιλοξενούμενος'}
                    </strong>
                  </div>
                  <div className="admin-card-actions-inline">
                    <button
                      type="button"
                      className="button ghost"
                      onClick={() => updateArrayItem('latestMatches', index, 'hidden', !match.hidden)}
                    >
                      {match.hidden ? 'Ενεργοποίηση' : 'Προσωρινή απενεργοποίηση'}
                    </button>
                    <button type="button" className="button ghost" onClick={() => removeArrayItem('latestMatches', index)}>
                      Αφαίρεση
                    </button>
                  </div>
                </div>
                <div className="admin-grid compact three-columns">
                  <label>
                    Ημερομηνία
                    <input type="datetime-local" value={toDateTimeLocal(match.date)} onChange={(event) => updateArrayItem('latestMatches', index, 'date', toIsoString(event.target.value))} />
                  </label>
                  <label>
                    Γηπεδούχος
                    <input value={match.home} onChange={(event) => updateArrayItem('latestMatches', index, 'home', event.target.value)} />
                  </label>
                  <label>
                    Φιλοξενούμενος
                    <input value={match.away} onChange={(event) => updateArrayItem('latestMatches', index, 'away', event.target.value)} />
                  </label>
                  <label>
                    Σκορ γηπεδούχου
                    <input type="number" value={match.homeScore} onChange={(event) => updateArrayItem('latestMatches', index, 'homeScore', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Σκορ φιλοξενούμενου
                    <input type="number" value={match.awayScore} onChange={(event) => updateArrayItem('latestMatches', index, 'awayScore', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Γήπεδο
                    <input value={match.venue} onChange={(event) => updateArrayItem('latestMatches', index, 'venue', event.target.value)} />
                  </label>
                  <label>
                    Google Maps link
                    <input value={match.mapUrl || ''} onChange={(event) => updateArrayItem('latestMatches', index, 'mapUrl', event.target.value)} />
                  </label>
                  <label>
                    YouTube URL
                    <input value={match.youtubeUrl || ''} onChange={(event) => updateArrayItem('latestMatches', index, 'youtubeUrl', event.target.value)} />
                  </label>
                  <label>
                    Logo γηπεδούχου (URL)
                    <div className="admin-logo-preview-row">
                      {match.homeLogo && <img src={match.homeLogo} alt="" className="admin-logo-thumb" />}
                      <input value={match.homeLogo || ''} onChange={(event) => updateArrayItem('latestMatches', index, 'homeLogo', event.target.value)} />
                    </div>
                  </label>
                  <label>
                    Logo φιλοξενούμενου (URL)
                    <div className="admin-logo-preview-row">
                      {match.awayLogo && <img src={match.awayLogo} alt="" className="admin-logo-thumb" />}
                      <input value={match.awayLogo || ''} onChange={(event) => updateArrayItem('latestMatches', index, 'awayLogo', event.target.value)} />
                    </div>
                  </label>
                </div>
              </article>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          id="admin-schedule"
          title="Πρόγραμμα αγώνων"
          description="Το πρόγραμμα τροφοδοτεί και τη standalone section και το hero featured match."
          preview={<UpcomingMatchesList matches={visibleItems(draft.upcomingMatches)} />}
          actions={
            <button type="button" className="button" onClick={() => addArrayItem('upcomingMatches', emptyUpcomingMatch)}>
              Προσθήκη αγώνα
            </button>
          }
        >
          <div className="admin-sortable-list">
            {draft.upcomingMatches.map((match, index) => {
              const isHero = String(draft.hero.featuredMatchId) === String(match.id);

              return (
                <article
                  key={match.id}
                  className={`admin-sortable-card${isHero ? ' is-featured' : ''}${match.hidden ? ' is-disabled' : ''}`}
                  draggable
                  onDragStart={() => startDragging('upcomingMatches', index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop('upcomingMatches', index)}
                >
                  <div className="admin-sortable-head">
                    <div className="admin-sortable-title">
                      <DragHandle />
                      <strong>{match.opponent || `Αγώνας ${index + 1}`}</strong>
                    </div>
                    <div className="admin-card-actions-inline">
                      <button type="button" className="button ghost" onClick={() => setFeaturedMatchId(match.id)}>
                        {isHero ? 'Στο hero' : 'Ορισμός στο hero'}
                      </button>
                      <button
                        type="button"
                        className="button ghost"
                        onClick={() => updateArrayItem('upcomingMatches', index, 'hidden', !match.hidden)}
                      >
                        {match.hidden ? 'Ενεργοποίηση' : 'Προσωρινή απενεργοποίηση'}
                      </button>
                      <button type="button" className="button ghost" onClick={() => removeArrayItem('upcomingMatches', index)}>
                        Αφαίρεση
                      </button>
                    </div>
                  </div>
                  <div className="admin-grid compact three-columns">
                    <label>
                      Αντίπαλος
                      <input value={match.opponent} onChange={(event) => updateArrayItem('upcomingMatches', index, 'opponent', event.target.value)} />
                    </label>
                    <label>
                      Γήπεδο
                      <input value={match.venue} onChange={(event) => updateArrayItem('upcomingMatches', index, 'venue', event.target.value)} />
                    </label>
                    <label>
                      Google Maps link
                      <input value={match.mapUrl || ''} onChange={(event) => updateArrayItem('upcomingMatches', index, 'mapUrl', event.target.value)} />
                    </label>
                    <label>
                      Διοργάνωση
                      <input value={match.competition} onChange={(event) => updateArrayItem('upcomingMatches', index, 'competition', event.target.value)} />
                    </label>
                    <label>
                      Ημερομηνία και ώρα
                      <input type="datetime-local" value={toDateTimeLocal(match.date)} onChange={(event) => updateArrayItem('upcomingMatches', index, 'date', toIsoString(event.target.value))} />
                    </label>
                    <label>
                      Έδρα
                      <select value={match.home ? 'home' : 'away'} onChange={(event) => updateArrayItem('upcomingMatches', index, 'home', event.target.value === 'home')}>
                        <option value="home">Εντός</option>
                        <option value="away">Εκτός</option>
                      </select>
                    </label>
                    <label>
                      Logo αντιπάλου (URL)
                      <div className="admin-logo-preview-row">
                        {match.opponentLogo && <img src={match.opponentLogo} alt="" className="admin-logo-thumb" />}
                        <input value={match.opponentLogo || ''} onChange={(event) => updateArrayItem('upcomingMatches', index, 'opponentLogo', event.target.value)} />
                      </div>
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        </AdminSection>

        <AdminSection
          id="admin-roster"
          title="Ρόστερ"
          description="Άλλαξε τη σειρά των παικτών, ενημέρωσε στοιχεία και φωτογραφίες και το roster section ακολουθεί live."
          preview={<div className="admin-roster-realview"><RosterCarousel players={draft.players} onSelectPlayer={setPreviewPlayer} /></div>}
          actions={
            <button type="button" className="button" onClick={() => addArrayItem('players', emptyPlayer)}>
              Προσθήκη παίκτη
            </button>
          }
        >
          <div className="admin-sortable-list">
            {draft.players.map((player, index) => (
              <article
                key={player.id}
                className="admin-sortable-card"
                draggable
                onDragStart={() => startDragging('players', index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop('players', index)}
              >
                <div className="admin-sortable-head">
                  <div className="admin-sortable-title">
                    <DragHandle />
                    <strong>{player.name || `Παίκτης ${index + 1}`}</strong>
                  </div>
                  <button type="button" className="button ghost" onClick={() => removeArrayItem('players', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact three-columns">
                  <label>
                    Όνομα
                    <input value={player.name} onChange={(event) => updateArrayItem('players', index, 'name', event.target.value)} />
                  </label>
                  <label>
                    Αριθμός
                    <input type="number" value={player.number} onChange={(event) => updateArrayItem('players', index, 'number', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Θέση
                    <input value={player.position} onChange={(event) => updateArrayItem('players', index, 'position', event.target.value)} />
                  </label>
                  <label>
                    Ηλικία
                    <input type="number" value={player.age} onChange={(event) => updateArrayItem('players', index, 'age', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Ύψος
                    <input value={player.height} onChange={(event) => updateArrayItem('players', index, 'height', event.target.value)} />
                  </label>
                  <label>
                    URL φωτογραφίας
                    <input value={player.photo} onChange={(event) => updateArrayItem('players', index, 'photo', event.target.value)} />
                  </label>
                  <label className="full-span">
                    Βιογραφικό
                    <textarea value={player.bio} onChange={(event) => updateArrayItem('players', index, 'bio', event.target.value)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          id="admin-news"
          title="Νέα ομάδας"
          description="Διαχειρίζεσαι το carousel της ενότητας Νέα ομάδας με εικόνα, caption και link για κάθε card."
          preview={<InstaCarousel posts={draft.instagramPosts} instagramUrl={draft.meta.instagramUrl} />}
          actions={
            <button type="button" className="button" onClick={() => addArrayItem('instagramPosts', emptyInstagramPost, 'start')}>
              Προσθήκη card
            </button>
          }
        >
          <div className="admin-sortable-list">
            {draft.instagramPosts.map((post, index) => (
              <article
                key={post.id}
                className="admin-sortable-card"
                draggable
                onDragStart={() => startDragging('instagramPosts', index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop('instagramPosts', index)}
              >
                <div className="admin-sortable-head">
                  <div className="admin-sortable-title">
                    <DragHandle />
                    <strong>{post.caption || `Card ${index + 1}`}</strong>
                  </div>
                  <button type="button" className="button ghost" onClick={() => removeArrayItem('instagramPosts', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact three-columns">
                  <label className="full-span">
                    Caption
                    <textarea value={post.caption} onChange={(event) => updateArrayItem('instagramPosts', index, 'caption', event.target.value)} />
                  </label>
                  <label>
                    URL εικόνας
                    <input value={post.image} onChange={(event) => updateArrayItem('instagramPosts', index, 'image', event.target.value)} />
                  </label>
                  <label className="full-span">
                    Link card
                    <input value={post.href} onChange={(event) => updateArrayItem('instagramPosts', index, 'href', event.target.value)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </AdminSection>

        <AdminSection
          id="admin-sponsors"
          title="Χορηγοί"
          description="Άλλαξε σειρά, ονόματα, labels, λογότυπα και links. Το hero marquee και η sponsor section τραβούν από το ίδιο data source."
          preview={
            <div className={`sponsor-grid admin-preview-sponsors is-${sponsorPreviewTheme}`}>
              {draft.sponsors.map((sponsor) => (
                <article
                  key={sponsor.id}
                  className="sponsor-card"
                  data-logo-tone={sponsorPreviewTheme === 'light'
                    ? sponsor.logoToneLight || sponsor.logoTone || 'black'
                    : sponsor.logoToneDark || sponsor.logoTone || 'white'}
                >
                  <span>{sponsor.label}</span>
                  <img src={sponsor.image} alt={sponsor.name} />
                  <h3>{sponsor.name}</h3>
                </article>
              ))}
            </div>
          }
          actions={
            <>
              <button
                type="button"
                className="button ghost admin-mini-button"
                onClick={() => setSponsorPreviewTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              >
                {sponsorPreviewTheme === 'light' ? 'Dark logos' : 'Light logos'}
              </button>
              <button type="button" className="button" onClick={() => addArrayItem('sponsors', emptySponsor)}>
                Προσθήκη χορηγού
              </button>
            </>
          }
        >
          <div className="admin-sortable-list">
            {draft.sponsors.map((sponsor, index) => (
              <article
                key={sponsor.id}
                className="admin-sortable-card"
                draggable
                onDragStart={() => startDragging('sponsors', index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop('sponsors', index)}
              >
                <div className="admin-sortable-head">
                  <div className="admin-sortable-title">
                    <DragHandle />
                    <strong>{sponsor.name || `Χορηγός ${index + 1}`}</strong>
                  </div>
                  <button type="button" className="button ghost" onClick={() => removeArrayItem('sponsors', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact two-columns">
                  <label>
                    Όνομα
                    <input value={sponsor.name} onChange={(event) => updateArrayItem('sponsors', index, 'name', event.target.value)} />
                  </label>
                  <label>
                    Label
                    <input value={sponsor.label} onChange={(event) => updateArrayItem('sponsors', index, 'label', event.target.value)} />
                  </label>
                  <label>
                    URL λογοτύπου
                    <input value={sponsor.image} onChange={(event) => updateArrayItem('sponsors', index, 'image', event.target.value)} />
                  </label>
                  <label>
                    Link προορισμού
                    <input value={sponsor.url} onChange={(event) => updateArrayItem('sponsors', index, 'url', event.target.value)} />
                  </label>
                  <label className="admin-logo-tone-label">
                    Χρώμα σε dark theme
                    <select
                      className="admin-logo-tone-select"
                      value={sponsor.logoToneDark || sponsor.logoTone || 'white'}
                      onChange={(event) => updateArrayItem('sponsors', index, 'logoToneDark', event.target.value)}
                    >
                      <option value="original">Όπως ανέβηκε</option>
                      <option value="black">Μαύρο</option>
                      <option value="white">Λευκό</option>
                    </select>
                  </label>
                  <label className="admin-logo-tone-label">
                    Χρώμα σε light theme
                    <select
                      className="admin-logo-tone-select"
                      value={sponsor.logoToneLight || sponsor.logoTone || 'black'}
                      onChange={(event) => updateArrayItem('sponsors', index, 'logoToneLight', event.target.value)}
                    >
                      <option value="original">Όπως ανέβηκε</option>
                      <option value="black">Μαύρο</option>
                      <option value="white">Λευκό</option>
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        </AdminSection>
      </main>

      <PlayerModal player={previewPlayer} onClose={() => setPreviewPlayer(null)} />
    </div>
  );
}







