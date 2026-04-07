import { useState } from 'react';

const IconBall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M4.93 4.93a16 16 0 0 1 14.14 14.14" />
    <path d="M19.07 4.93A16 16 0 0 1 4.93 19.07" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const IconHandshake = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    <path d="M12 5.36 8.87 8.5a2.13 2.13 0 0 0 0 3h0a2.13 2.13 0 0 0 3.02 0L12 11l.11.5a2.13 2.13 0 0 0 3.02 0h0a2.13 2.13 0 0 0 0-3z" />
  </svg>
);

const IconLightbulb = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const ROLES = [
  { value: 'player',     label: 'Παίκτης',       Icon: IconBall },
  { value: 'coach',      label: 'Προπονητής',    Icon: IconClipboard },
  { value: 'sponsor',    label: 'Χορηγός',       Icon: IconHandshake },
  { value: 'suggestion', label: 'Πρόταση / Άλλο', Icon: IconLightbulb },
];

export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const data = new FormData(e.target);

    try {
      const res = await fetch('https://formspree.io/f/mwvwyzjv', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        e.target.reset();
        setRole('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-success">
        <div className="contact-success-icon">✓</div>
        <h3>Το μήνυμά σου στάλθηκε!</h3>
        <p>Θα επικοινωνήσουμε μαζί σου σύντομα.</p>
        <button type="button" className="button ghost small" onClick={() => setStatus('idle')}>
          Νέο μήνυμα
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-roles">
        {ROLES.map(({ value, label, Icon }) => (
          <label key={value} className={`contact-role-chip${role === value ? ' is-active' : ''}`}>
            <input
              type="radio"
              name="role"
              value={value}
              required
              checked={role === value}
              onChange={() => setRole(value)}
            />
            <Icon />
            {label}
          </label>
        ))}
      </div>

      <div className="contact-row">
        <label className="contact-field">
          <span>Όνομα</span>
          <input type="text" name="name" placeholder="" required />
        </label>
        <label className="contact-field">
          <span>Κινητό</span>
          <input type="tel" name="phone" placeholder="" required />
        </label>
      </div>

      <label className="contact-field">
        <span>Μήνυμα</span>
        <textarea name="message" rows={4} placeholder="" required />
      </label>

      {status === 'error' && (
        <p className="contact-error">Κάτι πήγε στραβά. Δοκίμασε ξανά.</p>
      )}

      <button type="submit" className="button" disabled={status === 'sending'}>
        {status === 'sending' ? 'Αποστολή…' : 'Αποστολή μηνύματος'}
      </button>
    </form>
  );
}
