import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CountdownPanel from '../components/ui/CountdownPanel';
import InstaCarousel from '../components/ui/InstaCarousel';
import LatestScoresStrip from '../components/ui/LatestScoresStrip';
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
  homeLogo: '/images/logo.png',
  awayLogo: '/images/basketaki.png',
  homeScore: 0,
  awayScore: 0,
  venue: ''
});

const emptyUpcomingMatch = () => ({
  id: createId(),
  date: new Date().toISOString(),
  opponent: '',
  opponentLogo: '/images/basketaki.png',
  venue: '',
  competition: 'Basketaki The League',
  home: true
});

const emptyPlayer = () => ({
  id: createId(),
  name: '',
  number: 0,
  position: '',
  age: 0,
  height: '',
  hometown: '',
  shootingHand: '',
  bio: '',
  photo: '/images/logo.png'
});

const emptyInstagramPost = () => ({
  id: createId(),
  image: '/images/logo.png',
  caption: '',
  likes: 0,
  comments: 0,
  href: 'https://instagram.com/noobsbc'
});

const emptySponsor = () => ({
  id: `sponsor-${createId()}`,
  name: '',
  label: '',
  image: '/images/logo.png',
  url: ''
});

const fieldNumber = (value) => Number(value || 0);

const toDateTimeLocal = (value) => {
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const toIsoString = (value) => new Date(value).toISOString();

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
    <section id={id} className="admin-builder-section">
      <div className="admin-builder-head">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {actions ? <div className="admin-builder-actions">{actions}</div> : null}
      </div>

      <div className="admin-builder-grid">
        <div className="admin-preview-card">{preview}</div>
        <div className="admin-editor-card">{children}</div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const { isSupabaseConfigured, authLoading, isAuthenticated, signIn, signOut, user } = useAuth();
  const { siteData, siteDataLoading, saveSiteData, resetSiteData, refreshSiteData, siteDataError } = useSiteData();

  const [draft, setDraft] = useState(() => clone(siteData));
  const [activeSection, setActiveSection] = useState('admin-next-match');
  const [status, setStatus] = useState('Το panel είναι έτοιμο για live αλλαγές.');
  const [statusType, setStatusType] = useState('ok');
  const [isSaving, setIsSaving] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [dragState, setDragState] = useState(null);

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

  const addArrayItem = (section, factory) => {
    applyDraft((current) => ({
      ...current,
      [section]: [...current[section], factory()]
    }));
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

  const heroMatch = resolveHeroMatch(draft);

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

  const restoreDefaults = async () => {
    window.clearTimeout(autoSaveTimerRef.current);
    setIsSaving(true);
    try {
      const resetValue = await resetSiteData();
      setDraft(clone(resetValue));
      setHasPendingChanges(false);
      setLastSavedAt(new Date());
      setStatus('Έγινε επαναφορά στα προεπιλεγμένα δεδομένα.');
      setStatusType('ok');
    } catch (error) {
      setStatus(`Η επαναφορά απέτυχε: ${error.message}`);
      setStatusType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const syncFromSupabase = async () => {
    window.clearTimeout(autoSaveTimerRef.current);
    setIsSaving(true);
    try {
      const freshData = await refreshSiteData();
      setDraft(clone(freshData));
      setHasPendingChanges(false);
      setStatus('Το panel συγχρονίστηκε με τα live δεδομένα.');
      setStatusType('ok');
    } catch (error) {
      setStatus(`Ο συγχρονισμός απέτυχε: ${error.message}`);
      setStatusType('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const { error } = await signIn({
      email: loginForm.email.trim(),
      password: loginForm.password
    });

    if (error) {
      setLoginError(error.message);
      setStatus('Η είσοδος απέτυχε. Έλεγξε τα στοιχεία του Supabase user.');
      setStatusType('error');
    } else {
      setStatus('Συνδέθηκες επιτυχώς. Οι αλλαγές γράφονται live.');
      setStatusType('ok');
    }

    setLoginLoading(false);
  };

  const handleLogout = async () => {
    window.clearTimeout(autoSaveTimerRef.current);
    await signOut();
    setStatus('Έγινε αποσύνδεση από το panel διαχείρισης.');
    setStatusType('ok');
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

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-auth-shell">
        <div className="not-found-card admin-login-card">
          <Link className="brand admin-brand" to="/">
            <img src="/images/logo.png" alt="Noobs logo" className="brand-logo" />
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
          <Link className="brand admin-brand" to="/">
            <img src="/images/logo.png" alt="Noobs logo" className="brand-logo" />
            <div>
              <strong>Διαχείριση Noobs</strong>
              <span>Σύνδεση με Supabase Auth</span>
            </div>
          </Link>

          <h1>Σύνδεση διαχειριστή</h1>
          <p>
            Συνδέσου με email και password από χρήστη που έχεις δημιουργήσει στο Supabase Auth. Μόλις μπεις, κάθε αλλαγή
            συγχρονίζεται live με το frontend.
          </p>

          <form className="admin-login-form" onSubmit={handleLoginSubmit}>
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete="current-password"
                required
              />
            </label>

            {loginError ? <p className="admin-inline-error">{loginError}</p> : null}

            <div className="admin-login-actions">
              <button type="submit" className="button" disabled={loginLoading}>
                {loginLoading ? 'Σύνδεση...' : 'Είσοδος στο admin'}
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
    <div className="admin-shell">
      <aside className="admin-rail">
        <Link className="brand admin-brand" to="/">
          <img src="/images/logo.png" alt="Noobs logo" className="brand-logo" />
          <div>
            <strong>Διαχείριση Noobs</strong>
          </div>
        </Link>

        <div className="admin-rail-card">
          <span className={`admin-live-pill${isSaving ? ' is-saving' : ''}`}>{isSaving ? 'Live saving' : 'Live synced'}</span>
          <strong>{user?.email}</strong>
          <p className={`admin-status-msg${statusType === 'error' ? ' is-error' : ''}`}>{status}</p>
          <small>
            {lastSavedAt
              ? `Τελευταία αποθήκευση: ${lastSavedAt.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}`
              : 'Δεν έχει γίνει ακόμη αποθήκευση από αυτό το session.'}
          </small>
        </div>

        <nav className="admin-section-nav" aria-label="Ενότητες διαχείρισης">
          {sectionLinks.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`admin-section-button${activeSection === section.id ? ' is-active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="admin-rail-actions">
          <button type="button" className="button" onClick={publishNow} disabled={isSaving}>
            {isSaving ? 'Αποθήκευση...' : 'Αποθήκευση τώρα'}
          </button>
          <button type="button" className="button ghost" onClick={syncFromSupabase} disabled={isSaving}>
            Συγχρονισμός live
          </button>
          <button type="button" className="button ghost" onClick={restoreDefaults} disabled={isSaving}>
            Επαναφορά προεπιλογών
          </button>
          <button type="button" className="button ghost" onClick={handleLogout}>
            Αποσύνδεση
          </button>
          <Link className="button ghost" to="/">
            Επιστροφή στο site
          </Link>
        </div>
      </aside>

      <main className="admin-builder" data-active-section={activeSection}>
        <header className="admin-builder-hero">
          <div>
            <span className="pill">Noobs control room</span>
            <h1>Διαχείριση περιεχομένου με άμεσο preview και live site sync</h1>
            <p>
              Το panel δείχνει μόνο τη section που θέλεις να δουλέψεις: επόμενος αγώνας, βαθμολογία, αποτελέσματα,
              πρόγραμμα, ρόστερ, νέα ομάδας και χορηγοί.
            </p>
            <div className="admin-editor-note">
              <strong>Τώρα επεξεργάζεσαι</strong>
              <span>{activeSectionMeta.label}</span>
            </div>
          </div>
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
          preview={<CountdownPanel nextMatch={heroMatch} />}
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
              <strong>Fallback / χειροκίνητος αγώνας</strong>
              <span>Αν δεν θες να εμφανίζεται αγώνας από το πρόγραμμα, άφησε κενό το featured match και όρισε manual περιεχόμενο.</span>
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
                Custom αντίπαλος
                <input value={draft.nextMatch.opponent} onChange={(event) => updateNestedField('nextMatch', 'opponent', event.target.value)} />
              </label>
              <label>
                Custom γήπεδο
                <input value={draft.nextMatch.venue} onChange={(event) => updateNestedField('nextMatch', 'venue', event.target.value)} />
              </label>
              <label>
                Custom διοργάνωση
                <input value={draft.nextMatch.competition} onChange={(event) => updateNestedField('nextMatch', 'competition', event.target.value)} />
              </label>
              <label>
                Custom ημερομηνία και ώρα
                <input
                  type="datetime-local"
                  value={toDateTimeLocal(draft.nextMatch.date)}
                  onChange={(event) => updateNestedField('nextMatch', 'date', toIsoString(event.target.value))}
                />
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
          preview={<LatestScoresStrip matches={draft.latestMatches} />}
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
                className="admin-sortable-card"
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
                  <button type="button" className="button ghost" onClick={() => removeArrayItem('latestMatches', index)}>
                    Αφαίρεση
                  </button>
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
          preview={<UpcomingMatchesList matches={draft.upcomingMatches} />}
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
                  className={`admin-sortable-card${isHero ? ' is-featured' : ''}`}
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
          preview={
            <div className="roster-grid admin-preview-roster">
              {draft.players.map((player) => (
                <article key={player.id} className="player-card">
                  <div className="player-card-photo">
                    <img src={player.photo} alt={player.name} />
                    <span className="player-card-number">#{player.number}</span>
                  </div>
                  <div className="player-card-info">
                    <span>{player.position}</span>
                    <h3>{player.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          }
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
                    Πόλη
                    <input value={player.hometown} onChange={(event) => updateArrayItem('players', index, 'hometown', event.target.value)} />
                  </label>
                  <label>
                    Χέρι εκτέλεσης
                    <input value={player.shootingHand} onChange={(event) => updateArrayItem('players', index, 'shootingHand', event.target.value)} />
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
          description="Διαχειρίζεσαι το carousel της ενότητας Νέα ομάδας με εικόνα, caption, likes, comments και link για κάθε card."
          preview={<InstaCarousel posts={draft.instagramPosts} instagramUrl={draft.meta.instagramUrl} />}
          actions={
            <button type="button" className="button" onClick={() => addArrayItem('instagramPosts', emptyInstagramPost)}>
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
                    Likes
                    <input type="number" value={post.likes} onChange={(event) => updateArrayItem('instagramPosts', index, 'likes', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Comments
                    <input type="number" value={post.comments} onChange={(event) => updateArrayItem('instagramPosts', index, 'comments', fieldNumber(event.target.value))} />
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
            <div className="sponsor-grid admin-preview-sponsors">
              {draft.sponsors.map((sponsor) => (
                <article key={sponsor.id} className="sponsor-card">
                  <span>{sponsor.label}</span>
                  <img src={sponsor.image} alt={sponsor.name} />
                  <h3>{sponsor.name}</h3>
                </article>
              ))}
            </div>
          }
          actions={
            <button type="button" className="button" onClick={() => addArrayItem('sponsors', emptySponsor)}>
              Προσθήκη χορηγού
            </button>
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
                </div>
              </article>
            ))}
          </div>
        </AdminSection>
      </main>
    </div>
  );
}
