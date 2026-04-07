import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';

const clone = (value) => JSON.parse(JSON.stringify(value));

const emptyStanding = () => ({
  id: Date.now(),
  team: '',
  played: 0,
  won: 0,
  lost: 0,
  points: 0,
  streak: ''
});

const emptyMatch = () => ({
  id: Date.now(),
  date: new Date().toISOString(),
  home: '',
  away: '',
  homeScore: 0,
  awayScore: 0,
  venue: ''
});

const emptyUpcomingMatch = () => ({
  id: Date.now(),
  date: new Date().toISOString(),
  opponent: '',
  venue: '',
  competition: 'Basketaki The League',
  home: true
});

const emptyPlayer = () => ({
  id: Date.now(),
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

const emptyNews = () => ({
  id: Date.now(),
  title: '',
  date: new Date().toISOString().slice(0, 10),
  category: '',
  excerpt: '',
  image: '/images/logo.png'
});

const emptyInstagramPost = () => ({
  id: Date.now(),
  image: '/images/logo.png',
  caption: '',
  likes: 0,
  comments: 0,
  href: 'https://instagram.com/noobsbasketball'
});

const toDateTimeLocal = (value) => {
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const fieldNumber = (value) => Number(value || 0);

export default function AdminPage() {
  const { defaultSiteData, siteData, setSiteData, resetSiteData } = useSiteData();
  const [draft, setDraft] = useState(() => clone(siteData));
  const [status, setStatus] = useState('Λειτουργία τοπικής αποθήκευσης. Έτοιμο για αλλαγές.');

  useEffect(() => {
    setDraft(clone(siteData));
  }, [siteData]);

  const updateNestedField = (section, field, value) => {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value
      }
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setDraft((current) => {
      const items = [...current[section]];
      items[index] = { ...items[index], [field]: value };
      return { ...current, [section]: items };
    });
  };

  const addArrayItem = (section, factory) => {
    setDraft((current) => ({
      ...current,
      [section]: [...current[section], factory()]
    }));
  };

  const removeArrayItem = (section, index) => {
    setDraft((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const saveChanges = () => {
    setSiteData(clone(draft));
    setStatus('Οι αλλαγές αποθηκεύτηκαν και εμφανίζονται ήδη στον ιστότοπο.');
  };

  const restoreDefaults = () => {
    resetSiteData();
    setDraft(clone(defaultSiteData));
    setStatus('Έγινε επαναφορά στις αρχικές τιμές.');
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'noobs-site-data.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Η εξαγωγή JSON ολοκληρώθηκε.');
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <Link className="brand admin-brand" to="/">
          <img src="/images/logo.png" alt="Noobs logo" className="brand-logo" />
          <div>
            <strong>Διαχείριση Noobs</strong>
            <span>Έτοιμο για σύνδεση με Supabase</span>
          </div>
        </Link>

        <p>
          Από εδώ μπορείς να ενημερώνεις το περιεχόμενο του ιστοτόπου. Αυτή τη στιγμή οι αλλαγές αποθηκεύονται τοπικά
          στον browser, ώστε αργότερα να συνδεθεί εύκολα το ίδιο panel με Supabase.
        </p>

        <div className="admin-actions">
          <button type="button" className="button" onClick={saveChanges}>
            Αποθήκευση
          </button>
          <button type="button" className="button ghost" onClick={exportJson}>
            Εξαγωγή JSON
          </button>
          <button type="button" className="button ghost" onClick={restoreDefaults}>
            Επαναφορά
          </button>
          <Link className="button ghost" to="/">
            Επιστροφή στον ιστότοπο
          </Link>
        </div>

        <div className="admin-status">{status}</div>
      </aside>

      <main className="admin-content">
        <section className="admin-panel">
          <div className="admin-panel-header">
            <h1>Βασικές ρυθμίσεις</h1>
            <span>Ταυτότητα ομάδας, αρχική ενότητα και επόμενος αγώνας.</span>
          </div>

          <div className="admin-grid">
            <label>
              Όνομα ομάδας
              <input value={draft.meta.teamName} onChange={(event) => updateNestedField('meta', 'teamName', event.target.value)} />
            </label>
            <label>
              Σύντομο όνομα
              <input value={draft.meta.shortName} onChange={(event) => updateNestedField('meta', 'shortName', event.target.value)} />
            </label>
            <label>
              Πόλη
              <input value={draft.meta.city} onChange={(event) => updateNestedField('meta', 'city', event.target.value)} />
            </label>
            <label>
              Σεζόν
              <input value={draft.meta.season} onChange={(event) => updateNestedField('meta', 'season', event.target.value)} />
            </label>
            <label className="full-span">
              Σύνθημα
              <input value={draft.meta.tagline} onChange={(event) => updateNestedField('meta', 'tagline', event.target.value)} />
            </label>
            <label className="full-span">
              Περιγραφή
              <textarea value={draft.meta.description} onChange={(event) => updateNestedField('meta', 'description', event.target.value)} />
            </label>
            <label>
              Instagram όνομα
              <input value={draft.meta.instagramHandle} onChange={(event) => updateNestedField('meta', 'instagramHandle', event.target.value)} />
            </label>
            <label>
              Σύνδεσμος Instagram
              <input value={draft.meta.instagramUrl} onChange={(event) => updateNestedField('meta', 'instagramUrl', event.target.value)} />
            </label>
            <label className="full-span">
              Τίτλος αρχικής
              <textarea value={draft.hero.headline} onChange={(event) => updateNestedField('hero', 'headline', event.target.value)} />
            </label>
            <label className="full-span">
              Κείμενο αρχικής
              <textarea value={draft.hero.summary} onChange={(event) => updateNestedField('hero', 'summary', event.target.value)} />
            </label>
            <label>
              Επόμενος αντίπαλος
              <input value={draft.nextMatch.opponent} onChange={(event) => updateNestedField('nextMatch', 'opponent', event.target.value)} />
            </label>
            <label>
              Γήπεδο
              <input value={draft.nextMatch.venue} onChange={(event) => updateNestedField('nextMatch', 'venue', event.target.value)} />
            </label>
            <label>
              Διοργάνωση
              <input value={draft.nextMatch.competition} onChange={(event) => updateNestedField('nextMatch', 'competition', event.target.value)} />
            </label>
            <label>
              Ημερομηνία και ώρα
              <input
                type="datetime-local"
                value={toDateTimeLocal(draft.nextMatch.date)}
                onChange={(event) => updateNestedField('nextMatch', 'date', new Date(event.target.value).toISOString())}
              />
            </label>
            <label className="full-span">
              Σημείωση αγώνα
              <input value={draft.nextMatch.note} onChange={(event) => updateNestedField('nextMatch', 'note', event.target.value)} />
            </label>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Πρόγραμμα αγώνων</h2>
            <button type="button" className="button ghost" onClick={() => addArrayItem('upcomingMatches', emptyUpcomingMatch)}>
              Προσθήκη αγώνα
            </button>
          </div>
          <div className="admin-stack">
            {draft.upcomingMatches.map((match, index) => (
              <article key={match.id} className="editor-card">
                <div className="editor-card-top">
                  <strong>{match.opponent || `Αγώνας ${index + 1}`}</strong>
                  <button type="button" className="button ghost small" onClick={() => removeArrayItem('upcomingMatches', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact">
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
                    <input
                      type="datetime-local"
                      value={toDateTimeLocal(match.date)}
                      onChange={(event) => updateArrayItem('upcomingMatches', index, 'date', new Date(event.target.value).toISOString())}
                    />
                  </label>
                  <label>
                    Έδρα
                    <select
                      value={match.home ? 'home' : 'away'}
                      onChange={(event) => updateArrayItem('upcomingMatches', index, 'home', event.target.value === 'home')}
                    >
                      <option value="home">Εντός</option>
                      <option value="away">Εκτός</option>
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Βαθμολογία</h2>
            <button type="button" className="button ghost" onClick={() => addArrayItem('standings', emptyStanding)}>
              Προσθήκη σειράς
            </button>
          </div>
          <div className="admin-stack">
            {draft.standings.map((team, index) => (
              <article key={team.id} className="editor-card">
                <div className="editor-card-top">
                  <strong>{team.team || `Ομάδα ${index + 1}`}</strong>
                  <button type="button" className="button ghost small" onClick={() => removeArrayItem('standings', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact">
                  <label>
                    Ομάδα
                    <input value={team.team} onChange={(event) => updateArrayItem('standings', index, 'team', event.target.value)} />
                  </label>
                  <label>
                    Αγώνες
                    <input type="number" value={team.played} onChange={(event) => updateArrayItem('standings', index, 'played', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Νίκες
                    <input type="number" value={team.won} onChange={(event) => updateArrayItem('standings', index, 'won', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Ήττες
                    <input type="number" value={team.lost} onChange={(event) => updateArrayItem('standings', index, 'lost', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Βαθμοί
                    <input type="number" value={team.points} onChange={(event) => updateArrayItem('standings', index, 'points', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Φόρμα
                    <input value={team.streak} onChange={(event) => updateArrayItem('standings', index, 'streak', event.target.value)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Τελευταία αποτελέσματα</h2>
            <button type="button" className="button ghost" onClick={() => addArrayItem('latestMatches', emptyMatch)}>
              Προσθήκη αγώνα
            </button>
          </div>
          <div className="admin-stack">
            {draft.latestMatches.map((match, index) => (
              <article key={match.id} className="editor-card">
                <div className="editor-card-top">
                  <strong>
                    {match.home || 'Γηπεδούχος'} vs {match.away || 'Φιλοξενούμενος'}
                  </strong>
                  <button type="button" className="button ghost small" onClick={() => removeArrayItem('latestMatches', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact">
                  <label>
                    Ημερομηνία και ώρα
                    <input
                      type="datetime-local"
                      value={toDateTimeLocal(match.date)}
                      onChange={(event) => updateArrayItem('latestMatches', index, 'date', new Date(event.target.value).toISOString())}
                    />
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
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Ρόστερ</h2>
            <button type="button" className="button ghost" onClick={() => addArrayItem('players', emptyPlayer)}>
              Προσθήκη παίκτη
            </button>
          </div>
          <div className="admin-stack">
            {draft.players.map((player, index) => (
              <article key={player.id} className="editor-card">
                <div className="editor-card-top">
                  <strong>{player.name || `Παίκτης ${index + 1}`}</strong>
                  <button type="button" className="button ghost small" onClick={() => removeArrayItem('players', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact">
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
                  <label className="full-span">
                    Σύνδεσμος φωτογραφίας
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
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Νέα ομάδας</h2>
            <button type="button" className="button ghost" onClick={() => addArrayItem('news', emptyNews)}>
              Προσθήκη είδησης
            </button>
          </div>
          <div className="admin-stack">
            {draft.news.map((post, index) => (
              <article key={post.id} className="editor-card">
                <div className="editor-card-top">
                  <strong>{post.title || `Νέα ${index + 1}`}</strong>
                  <button type="button" className="button ghost small" onClick={() => removeArrayItem('news', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact">
                  <label>
                    Τίτλος
                    <input value={post.title} onChange={(event) => updateArrayItem('news', index, 'title', event.target.value)} />
                  </label>
                  <label>
                    Κατηγορία
                    <input value={post.category} onChange={(event) => updateArrayItem('news', index, 'category', event.target.value)} />
                  </label>
                  <label>
                    Ημερομηνία
                    <input type="date" value={post.date} onChange={(event) => updateArrayItem('news', index, 'date', event.target.value)} />
                  </label>
                  <label>
                    Σύνδεσμος εικόνας
                    <input value={post.image} onChange={(event) => updateArrayItem('news', index, 'image', event.target.value)} />
                  </label>
                  <label className="full-span">
                    Κείμενο
                    <textarea value={post.excerpt} onChange={(event) => updateArrayItem('news', index, 'excerpt', event.target.value)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Instagram</h2>
            <button type="button" className="button ghost" onClick={() => addArrayItem('instagramPosts', emptyInstagramPost)}>
              Προσθήκη post
            </button>
          </div>
          <div className="admin-stack">
            {draft.instagramPosts.map((post, index) => (
              <article key={post.id} className="editor-card">
                <div className="editor-card-top">
                  <strong>Instagram card {index + 1}</strong>
                  <button type="button" className="button ghost small" onClick={() => removeArrayItem('instagramPosts', index)}>
                    Αφαίρεση
                  </button>
                </div>
                <div className="admin-grid compact">
                  <label>
                    URL εικόνας
                    <input value={post.image} onChange={(event) => updateArrayItem('instagramPosts', index, 'image', event.target.value)} />
                  </label>
                  <label>
                    Σύνδεσμος post
                    <input value={post.href} onChange={(event) => updateArrayItem('instagramPosts', index, 'href', event.target.value)} />
                  </label>
                  <label>
                    Likes
                    <input type="number" value={post.likes} onChange={(event) => updateArrayItem('instagramPosts', index, 'likes', fieldNumber(event.target.value))} />
                  </label>
                  <label>
                    Σχόλια
                    <input type="number" value={post.comments} onChange={(event) => updateArrayItem('instagramPosts', index, 'comments', fieldNumber(event.target.value))} />
                  </label>
                  <label className="full-span">
                    Λεζάντα
                    <textarea value={post.caption} onChange={(event) => updateArrayItem('instagramPosts', index, 'caption', event.target.value)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Χορηγοί</h2>
            <span>Τα λογότυπα χρησιμοποιούν ήδη τα αρχεία που ανέβασες. Από εδώ αλλάζεις τίτλους και links.</span>
          </div>
          <div className="admin-stack">
            {draft.sponsors.map((sponsor, index) => (
              <article key={sponsor.id} className="editor-card">
                <div className="admin-grid compact">
                  <label>
                    Όνομα χορηγού
                    <input value={sponsor.name} onChange={(event) => updateArrayItem('sponsors', index, 'name', event.target.value)} />
                  </label>
                  <label>
                    Ετικέτα
                    <input value={sponsor.label} onChange={(event) => updateArrayItem('sponsors', index, 'label', event.target.value)} />
                  </label>
                  <label>
                    Διαδρομή εικόνας
                    <input value={sponsor.image} onChange={(event) => updateArrayItem('sponsors', index, 'image', event.target.value)} />
                  </label>
                  <label>
                    Σύνδεσμος
                    <input value={sponsor.url} onChange={(event) => updateArrayItem('sponsors', index, 'url', event.target.value)} />
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
