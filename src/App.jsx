import { Navigate, Route, Routes } from 'react-router-dom';
import SiteShell from './layout/SiteShell';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';

const legalContent = {
  privacy: {
    title: 'Πολιτική Απορρήτου',
    lead:
      'Η τρέχουσα έκδοση του ιστοτόπου αποθηκεύει μόνο τα απολύτως απαραίτητα δεδομένα για προτιμήσεις επισκέπτη και τοπικές αλλαγές διαχείρισης.',
    sections: [
      {
        heading: 'Τι αποθηκεύεται',
        body:
          'Στο πρωτότυπο αποθηκεύονται η συναίνεση για cookies και τα δεδομένα που αλλάζουν μέσα από τη σελίδα διαχείρισης στην τοπική αποθήκευση του browser.'
      },
      {
        heading: 'Γιατί αποθηκεύεται',
        body:
          'Η αποθήκευση χρησιμοποιείται ώστε να μη ζητείται συνεχώς ξανά συναίνεση και για να παραμένουν οι δοκιμαστικές αλλαγές ορατές μετά από ανανέωση.'
      },
      {
        heading: 'Παραγωγική χρήση',
        body:
          'Όταν συνδεθεί Supabase και ο ιστότοπος βγει σε παραγωγή, η σελίδα αυτή πρέπει να ενημερωθεί με τις πραγματικές ροές δεδομένων, τους χρόνους διατήρησης και τα στοιχεία επικοινωνίας.'
      }
    ]
  },
  cookies: {
    title: 'Πολιτική Cookies',
    lead:
      'Οι Noobs χρησιμοποιούν έναν απλό μηχανισμό συναίνεσης για cookies και ρυθμίσεις εμπειρίας χρήστη.',
    sections: [
      {
        heading: 'Απαραίτητα cookies',
        body:
          'Τα απαραίτητα cookies και η τοπική αποθήκευση κρατούν την προτίμηση συναίνεσης και τα προσωρινά δεδομένα διαχείρισης όσο το project λειτουργεί σε δοκιμαστική μορφή.'
      },
      {
        heading: 'Προαιρετικά cookies',
        body:
          'Προαιρετικά analytics ή ενσωματώσεις τρίτων πρέπει να ενεργοποιηθούν μόνο αφού συνδεθεί ο αντίστοιχος πάροχος και ενημερωθεί σωστά ο μηχανισμός συναίνεσης.'
      },
      {
        heading: 'Διαχείριση επιλογών',
        body:
          'Ο επισκέπτης μπορεί να ξαναδεί το banner διαγράφοντας τα δεδομένα του browser ή με ξεχωριστό έλεγχο προτιμήσεων που μπορεί να προστεθεί αργότερα στο footer.'
      }
    ]
  },
  terms: {
    title: 'Όροι Χρήσης',
    lead:
      'Οι παρακάτω όροι αφορούν την πρωτότυπη έκδοση του ιστοτόπου των Noobs και πρέπει να αντικατασταθούν από την τελική εγκεκριμένη νομική πολιτική πριν το launch.',
    sections: [
      {
        heading: 'Ακρίβεια περιεχομένου',
        body:
          'Βαθμολογία, αποτελέσματα, στοιχεία ρόστερ και νέα ομάδας διαχειρίζονται από διαχειριστές του club και πρέπει να επιβεβαιώνονται πριν τη δημοσίευση.'
      },
      {
        heading: 'Πνευματικά δικαιώματα',
        body:
          'Το σήμα της ομάδας, τα λογότυπα των χορηγών, τα γραφικά της διοργάνωσης και κάθε editorial υλικό ανήκουν στους αντίστοιχους δικαιούχους τους.'
      },
      {
        heading: 'Διαθεσιμότητα υπηρεσίας',
        body:
          'Ο ιστότοπος μπορεί να τροποποιείται, να ενημερώνεται ή να σταματά προσωρινά στο πλαίσιο δοκιμών, staging ή παραγωγικής συντήρησης.'
      }
    ]
  }
};

export default function App() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route index element={<HomePage />} />
        <Route path="privacy" element={<LegalPage {...legalContent.privacy} />} />
        <Route path="cookies" element={<LegalPage {...legalContent.cookies} />} />
        <Route path="terms" element={<LegalPage {...legalContent.terms} />} />
        <Route path="home" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/gargalloadminonoobsikobc" element={<AdminPage />} />
      <Route path="/gargalloadminonoobsikobc/" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
