const svgToDataUri = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const buildPlayerPortrait = ({ name, number, accent, background }) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 580" role="img" aria-label="${name}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${background}" />
          <stop offset="100%" stop-color="#09111f" />
        </linearGradient>
        <linearGradient id="shirt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="480" height="580" rx="36" fill="url(#bg)" />
      <circle cx="240" cy="170" r="92" fill="#f2dcc0" />
      <path d="M115 535c20-120 85-186 125-186s105 66 125 186" fill="url(#shirt)" />
      <path d="M148 186c12-76 66-126 137-116 57 8 90 47 102 103-24-17-47-21-66-23-10 15-24 29-42 37-44 20-92 18-131-1z" fill="#0b1220" />
      <circle cx="206" cy="176" r="6" fill="#09111f" />
      <circle cx="274" cy="176" r="6" fill="#09111f" />
      <path d="M212 220c14 14 42 14 56 0" fill="none" stroke="#09111f" stroke-width="6" stroke-linecap="round" />
      <text x="240" y="466" text-anchor="middle" font-size="88" font-family="Arial, sans-serif" font-weight="700" fill="#09111f">${number}</text>
      <text x="240" y="546" text-anchor="middle" font-size="42" font-family="Arial, sans-serif" font-weight="700" fill="#f8fafc">${initials}</text>
    </svg>
  `);
};

const sponsorLinks = [
  {
    id: 'logitel',
    name: 'Logitel',
    label: 'Μεγάλος χορηγός',
    image: '/images/sponsor1.png',
    url: 'https://logitel.gr'
  },
  {
    id: 'aspro-provato',
    name: 'Άσπρο Πρόβατο Κρεατοφαγείον',
    label: 'Χορηγός φιλοξενίας',
    image: '/images/sponsor2.png',
    url: 'https://aspro-provato.gr'
  },
  {
    id: 'ubd',
    name: 'UBD',
    label: 'Χορηγός επίσημου site',
    image: '/images/sponsor3.png',
    url: 'https://ubd.gr'
  }
];

export const defaultSiteData = {
  meta: {
    teamName: 'Noobs Basketball Club',
    shortName: 'Noobs',
    city: 'Αθήνα',
    season: 'Σεζόν 2026',
    tagline: 'Νέα ομάδα, καθαρό μυαλό, καθόλου φόβος.',
    description:
      'Η επίσημη ψηφιακή έδρα των Noobs για τη συμμετοχή στο Basketaki The League, με πρόγραμμα, βαθμολογία, νέα και όλο τον αγωνιστικό παλμό της ομάδας.',
    instagramHandle: '@noobsbasketball',
    instagramUrl: 'https://instagram.com/noobsbasketball'
  },
  hero: {
    eyebrow: 'Basketaki The League',
    headline: 'Οι Noobs μπαίνουν στο Basketaki με ενέργεια, ένταση και βλέμμα μόνο μπροστά.',
    summary:
      'Εδώ συγκεντρώνεται όλη η σεζόν: οι χορηγοί, τα τελευταία αποτελέσματα, η επόμενη αναμέτρηση, το ρόστερ και τα νέα της ομάδας.',
    primaryCta: {
      label: 'Δες το ρόστερ',
      href: '#roster'
    },
    secondaryCta: {
      label: 'Δες τη βαθμολογία',
      href: '#standings'
    }
  },
  nextMatch: {
    opponent: 'Rim Runners',
    competition: 'Basketaki The League',
    venue: 'Κλειστό Άνω Λιοσίων',
    date: '2026-04-18T19:30:00+03:00',
    note: 'Η είσοδος ανοίγει 45 λεπτά πριν το τζάμπολ.'
  },
  upcomingMatches: [
    {
      id: 1,
      date: '2026-04-18T19:30:00+03:00',
      opponent: 'Rim Runners',
      venue: 'Κλειστό Άνω Λιοσίων',
      competition: 'Basketaki The League',
      home: true
    },
    {
      id: 2,
      date: '2026-04-25T20:15:00+03:00',
      opponent: 'Fast Breakers',
      venue: 'Galatsi Dome',
      competition: 'Basketaki The League',
      home: false
    },
    {
      id: 3,
      date: '2026-05-03T18:00:00+03:00',
      opponent: 'Paint Protectors',
      venue: 'Κλειστό Περιστερίου',
      competition: 'Basketaki The League',
      home: true
    }
  ],
  sponsors: sponsorLinks,
  standings: [
    { id: 1, team: 'Fast Breakers', played: 8, won: 7, lost: 1, points: 15, streak: 'Ν4' },
    { id: 2, team: 'Noobs', played: 8, won: 6, lost: 2, points: 14, streak: 'Ν2' },
    { id: 3, team: 'Rim Runners', played: 8, won: 5, lost: 3, points: 13, streak: 'Η1' },
    { id: 4, team: 'Paint Protectors', played: 8, won: 4, lost: 4, points: 12, streak: 'Ν1' },
    { id: 5, team: 'Clutch Factory', played: 8, won: 3, lost: 5, points: 11, streak: 'Η2' },
    { id: 6, team: 'Triple Trouble', played: 8, won: 2, lost: 6, points: 10, streak: 'Η3' }
  ],
  latestMatches: [
    {
      id: 1,
      date: '2026-04-03T21:00:00+03:00',
      home: 'Noobs',
      away: 'Clutch Factory',
      homeScore: 78,
      awayScore: 70,
      venue: 'Galatsi Dome'
    },
    {
      id: 2,
      date: '2026-03-29T18:30:00+03:00',
      home: 'Paint Protectors',
      away: 'Noobs',
      homeScore: 65,
      awayScore: 72,
      venue: 'Κλειστό Χολαργού'
    },
    {
      id: 3,
      date: '2026-03-21T20:00:00+03:00',
      home: 'Noobs',
      away: 'Triple Trouble',
      homeScore: 81,
      awayScore: 62,
      venue: 'Κλειστό Περιστερίου'
    }
  ],
  players: [
    {
      id: 1,
      name: 'Νίκος Βλάστος',
      number: 4,
      position: 'PG',
      age: 26,
      height: '1.82 μ.',
      hometown: 'Αθήνα',
      shootingHand: 'Δεξί',
      bio: 'Οργανώνει τον ρυθμό, πιέζει την πρώτη πάσα και έχει αξιόπιστο pull-up σουτ.',
      photo: buildPlayerPortrait({ name: 'Νίκος Βλάστος', number: 4, accent: '#f6c945', background: '#10436f' })
    },
    {
      id: 2,
      name: 'Γιώργος Τζελέπης',
      number: 7,
      position: 'SG',
      age: 24,
      height: '1.88 μ.',
      hometown: 'Πειραιάς',
      shootingHand: 'Αριστερό',
      bio: 'Εκρηκτικό scoring wing που απειλεί στο transition και εκτελεί σε δύσκολες κατοχές.',
      photo: buildPlayerPortrait({ name: 'Γιώργος Τζελέπης', number: 7, accent: '#ff8a2a', background: '#4e1f6d' })
    },
    {
      id: 3,
      name: 'Μάριος Καλογέρης',
      number: 11,
      position: 'SF',
      age: 28,
      height: '1.93 μ.',
      hometown: 'Νέα Σμύρνη',
      shootingHand: 'Δεξί',
      bio: 'Πολύπλευρος φόργουορντ με γερά ριμπάουντ και σταθερό σουτ από τις γωνίες.',
      photo: buildPlayerPortrait({ name: 'Μάριος Καλογέρης', number: 11, accent: '#78e3c9', background: '#173f35' })
    },
    {
      id: 4,
      name: 'Πέτρος Λιάπης',
      number: 21,
      position: 'PF',
      age: 30,
      height: '1.98 μ.',
      hometown: 'Μαρούσι',
      shootingHand: 'Δεξί',
      bio: 'Σκληρός στο σκριν, τελειώνει φάσεις στη ρακέτα και δίνει πολλές δεύτερες κατοχές.',
      photo: buildPlayerPortrait({ name: 'Πέτρος Λιάπης', number: 21, accent: '#f36f82', background: '#5b1624' })
    },
    {
      id: 5,
      name: 'Δημήτρης Κανέλος',
      number: 34,
      position: 'C',
      age: 27,
      height: '2.02 μ.',
      hometown: 'Αιγάλεω',
      shootingHand: 'Δεξί',
      bio: 'Προστατεύει το καλάθι, τελειώνει δυνατά στο roll και κρατά την άμυνα σε εγρήγορση.',
      photo: buildPlayerPortrait({ name: 'Δημήτρης Κανέλος', number: 34, accent: '#7cc5ff', background: '#112a54' })
    }
  ],
  news: [
    {
      id: 1,
      title: 'Σημαντική νίκη των Noobs στην τελευταία αγωνιστική',
      date: '2026-04-04',
      category: 'Αγώνας',
      excerpt:
        'Οι Noobs έκλεισαν δυνατά το παιχνίδι απέναντι στην Clutch Factory και κράτησαν το προβάδισμα στα τελευταία λεπτά με σωστές επιλογές σε άμυνα και επίθεση.',
      image: '/images/basketaki.png'
    },
    {
      id: 2,
      title: 'Έμφαση στην πίεση και στο transition στην προπόνηση της εβδομάδας',
      date: '2026-04-01',
      category: 'Προπόνηση',
      excerpt:
        'Το τεχνικό τιμ δούλεψε ένταση πάνω στην μπάλα, γρήγορη πρώτη πάσα και τελειώματα στο ανοιχτό γήπεδο ενόψει του επόμενου αγώνα.',
      image: '/images/logo.png'
    },
    {
      id: 3,
      title: 'Η UBD στηρίζει την ψηφιακή παρουσία της ομάδας για τη σεζόν 2026',
      date: '2026-03-27',
      category: 'Ομάδα',
      excerpt:
        'Η UBD βρίσκεται δίπλα στους Noobs ως χορηγός του επίσημου website, ενισχύοντας την online εικόνα της ομάδας σε όλη τη φετινή πορεία στο Basketaki.',
      image: '/images/sponsor3.png'
    }
  ],
  instagramPosts: [
    {
      id: 1,
      image: '/images/logo.png',
      caption: '',
      likes: 0,
      comments: 0,
      href: 'https://instagram.com/noobsbc'
    },
    {
      id: 2,
      image: '/images/logo.png',
      caption: '',
      likes: 0,
      comments: 0,
      href: 'https://instagram.com/noobsbc'
    },
    {
      id: 3,
      image: '/images/logo.png',
      caption: '',
      likes: 0,
      comments: 0,
      href: 'https://instagram.com/noobsbc'
    }
  ]
};
