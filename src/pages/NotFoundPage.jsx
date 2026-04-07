import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <span className="pill">404</span>
        <h1>Αυτή η φάση δεν υπήρχε στο βιβλίο φάσεων.</h1>
        <p>Η σελίδα που ζήτησες δεν υπάρχει ή μετακινήθηκε σε άλλη διαδρομή.</p>
        <div className="button-row">
          <Link className="button" to="/">
            Επιστροφή στην αρχική
          </Link>
          <Link className="button ghost" to="/admin">
            Άνοιγμα διαχείρισης
          </Link>
        </div>
      </div>
    </section>
  );
}
