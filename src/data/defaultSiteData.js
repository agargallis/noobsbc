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
    label: 'Επίσημος χορηγός',
    image: '/images/sponsor1.png',
    url: 'https://logitel.gr',
    logoToneDark: 'white',
    logoToneLight: 'black'
  },
  {
    id: 'aspro-provato',
    name: 'Άσπρο Πρόβατο',
    label: 'Χορηγός εξοπλισμού',
    image: '/images/sponsor2.png',
    url: 'https://aspro-provato.gr',
    logoToneDark: 'white',
    logoToneLight: 'black'
  },
  {
    id: 'ubd',
    name: 'UBD',
    label: 'Κατασκευή του site',
    image: '/images/sponsor3.png',
    url: 'https://ubd.gr',
    logoToneDark: 'white',
    logoToneLight: 'black'
  }
];

export const defaultSiteData = {
  meta: {
    teamName: 'Noobs Basketball Club',
    shortName: 'Noobs',
    city: 'Αθήνα',
    season: 'Σεζόν 2026',
    tagline: 'Παίζουμε σκληρά, χάνουμε σπάνια, κερδίζουμε μαζί.',
    description:
      'Η επίσημη ιστοσελίδα της ομάδας Noobs στη Basketaki The League. Βαθμολογία, αποτελέσματα, ρόστερ και νέα απευθείας από το γήπεδο.',
    instagramHandle: '@noobs.gr',
    instagramUrl: 'https://instagram.com/noobs.gr'
  },
  hero: {
    eyebrow: 'Basketaki The League',
    headline: 'Οι Noobs παίζουν σκληρά στο Basketaki με πάθος, τεχνική και ομαδικό πνεύμα.',
    summary:
      'Ακολούθα όλα όσα γίνονται στο γήπεδο: live αποτελέσματα, η τελευταία βαθμολογία, το πρόγραμμα αγώνων και το ρόστερ της ομάδας.',
    featuredMatchId: 1,
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
    venue: 'Άνω Λιόσια Arena',
    date: '2026-04-18T19:30:00+03:00',
    note: 'Οι πόρτες ανοίγουν 45 λεπτά πριν από το τζάμπολ.'
  },
  upcomingMatches: [
    {
      id: 1,
      date: '2026-04-18T19:30:00+03:00',
      opponent: 'Rim Runners',
      opponentLogo: '/images/basketaki.png',
      venue: 'Άνω Λιόσια Arena',
      competition: 'Basketaki The League',
      home: true,
      note: 'Οι πόρτες ανοίγουν 45 λεπτά πριν από το τζάμπολ.'
    },
    {
      id: 2,
      date: '2026-04-25T20:15:00+03:00',
      opponent: 'Fast Breakers',
      opponentLogo: '/images/basketaki.png',
      venue: 'Galatsi Dome',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galatsi+Dome',
      competition: 'Basketaki The League',
      home: false,
      note: 'Σημείο συνάντησης ομάδας 60 λεπτά πριν από το παιχνίδι.'
    },
    {
      id: 3,
      date: '2026-05-03T18:00:00+03:00',
      opponent: 'Paint Protectors',
      opponentLogo: '/images/basketaki.png',
      venue: 'Κλειστό Περιστερίου',
      competition: 'Basketaki The League',
      home: true,
      note: 'Πριν το ματς θα γίνει σύντομη παρουσίαση των χορηγών.'
    }
  ],
  sponsors: sponsorLinks,
  standingsGroupTitle: '1ος Όμιλος',
  standings: [
    {
      id: 1,
      team: 'Fast Breakers',
      logo: '/images/basketaki.png',
      points: 16,
      played: 8,
      won: 8,
      lost: 0,
      streak: '8W',
      scored: 642,
      conceded: 511,
      diff: 131,
      ab: 0
    },
    {
      id: 2,
      team: 'Noobs',
      logo: '/images/logo1.png',
      points: 15,
      played: 8,
      won: 7,
      lost: 1,
      streak: '3W',
      scored: 618,
      conceded: 552,
      diff: 66,
      ab: 0
    },
    {
      id: 3,
      team: 'Rim Runners',
      logo: '/images/basketaki.png',
      points: 13,
      played: 8,
      won: 5,
      lost: 3,
      streak: '1L',
      scored: 587,
      conceded: 566,
      diff: 21,
      ab: 0
    },
    {
      id: 4,
      team: 'Paint Protectors',
      logo: '/images/basketaki.png',
      points: 12,
      played: 8,
      won: 4,
      lost: 4,
      streak: '1W',
      scored: 571,
      conceded: 574,
      diff: -3,
      ab: 0
    },
    {
      id: 5,
      team: 'Clutch Factory',
      logo: '/images/basketaki.png',
      points: 11,
      played: 8,
      won: 3,
      lost: 5,
      streak: '2L',
      scored: 544,
      conceded: 589,
      diff: -45,
      ab: 0
    },
    {
      id: 6,
      team: 'Triple Trouble',
      logo: '/images/basketaki.png',
      points: 9,
      played: 8,
      won: 1,
      lost: 7,
      streak: '4L',
      scored: 503,
      conceded: 612,
      diff: -109,
      ab: 0
    }
  ],
  latestMatches: [
    {
      id: 1,
      date: '2026-04-03T21:00:00+03:00',
      home: 'Noobs',
      away: 'Clutch Factory',
      homeLogo: '/images/logo1.png',
      awayLogo: '/images/basketaki.png',
      homeScore: 78,
      awayScore: 70,
      venue: 'Galatsi Dome',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Galatsi+Dome'
    },
    {
      id: 2,
      date: '2026-03-29T18:30:00+03:00',
      home: 'Paint Protectors',
      away: 'Noobs',
      homeLogo: '/images/basketaki.png',
      awayLogo: '/images/logo1.png',
      homeScore: 65,
      awayScore: 72,
      venue: 'Κλειστό Χολαργού'
    },
    {
      id: 3,
      date: '2026-03-21T20:00:00+03:00',
      home: 'Noobs',
      away: 'Triple Trouble',
      homeLogo: '/images/logo1.png',
      awayLogo: '/images/basketaki.png',
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
      name: 'Θεόδωρος Παπαδόπουλος',
      number: 7,
      position: 'SG',
      age: 24,
      height: '1.88 μ.',
      hometown: 'Θεσσαλονίκη',
      shootingHand: 'Αριστερό',
      bio: 'Επιθετικό scoring wing με εκρηκτικό transition και ικανότητα να δημιουργεί ευκαιρίες.',
      photo: buildPlayerPortrait({ name: 'Θεόδωρος Παπαδόπουλος', number: 7, accent: '#ff8a2a', background: '#4e1f6d' })
    },
    {
      id: 3,
      name: 'Κωνσταντίνος Αλεξίου',
      number: 11,
      position: 'SF',
      age: 28,
      height: '1.93 μ.',
      hometown: 'Νέα Σμύρνη',
      shootingHand: 'Δεξί',
      bio: 'Αμυντικός ειδικός με εκρηκτικό πρώτο βήμα και ικανότητα να κλέβει την μπάλα.',
      photo: buildPlayerPortrait({ name: 'Κωνσταντίνος Αλεξίου', number: 11, accent: '#78e3c9', background: '#173f35' })
    },
    {
      id: 4,
      name: 'Γιώργος Σιδέρης',
      number: 21,
      position: 'PF',
      age: 30,
      height: '1.98 μ.',
      hometown: 'Πειραιάς',
      shootingHand: 'Δεξί',
      bio: 'Δυνατός στο ριμπάουντ, αξιόπιστος επιλογή για pick and roll και εξαιρετικός αμυντικός παίκτης.',
      photo: buildPlayerPortrait({ name: 'Γιώργος Σιδέρης', number: 21, accent: '#f36f82', background: '#5b1624' })
    },
    {
      id: 5,
      name: 'Δημήτρης Λεωνίδας',
      number: 34,
      position: 'C',
      age: 27,
      height: '2.02 μ.',
      hometown: 'Ηράκλειο',
      shootingHand: 'Δεξί',
      bio: 'Κυριαρχεί στη ρακέτα, αξιόπιστος επιλογή για pick and roll και ισχυρός στο block.',
      photo: buildPlayerPortrait({ name: 'Δημήτρης Λεωνίδας', number: 34, accent: '#7cc5ff', background: '#112a54' })
    }
  ],
  news: [
    {
      id: 1,
      title: 'Νίκη των Noobs κόντρα στην Clutch Factory με διαφορά οκτώ πόντων',
      date: '2026-04-04',
      category: 'Αγώνας',
      excerpt:
        'Οι Noobs επικράτησαν με σκορ 78-70 επί της Clutch Factory σε ένα αγωνιστικό ματς με εναλλαγές στην ηγεσία.',
      image: '/images/basketaki.png'
    },
    {
      id: 2,
      title: 'Εβδομάδα προπόνησης με έμφαση στο transition και στην αμυντική οργάνωση',
      date: '2026-04-01',
      category: 'Προπόνηση',
      excerpt:
        'Η ομάδα επικεντρώθηκε στο γρήγορο transition και στη βελτίωση της αμυντικής στάσης ενόψει των επόμενων αγώνων.',
      image: '/images/logo1.png'
    },
    {
      id: 3,
      title: 'Η UBD κατασκεύασε την επίσημη ιστοσελίδα της ομάδας για τη σεζόν 2026',
      date: '2026-03-27',
      category: 'Χορηγία',
      excerpt:
        'Η UBD ανέπτυξε το νέο website των Noobs με live αποτελέσματα, βαθμολογία και ρόστερ για τη σεζόν Basketaki.',
      image: '/images/sponsor3.png'
    }
  ],
  instagramPosts: [
    {
      id: 1,
      image: '/images/logo1.png',
      caption: '',
      likes: 0,
      comments: 0,
      href: 'https://instagram.com/noobs.gr'
    },
    {
      id: 2,
      image: '/images/logo1.png',
      caption: '',
      likes: 0,
      comments: 0,
      href: 'https://instagram.com/noobs.gr'
    },
    {
      id: 3,
      image: '/images/logo1.png',
      caption: '',
      likes: 0,
      comments: 0,
      href: 'https://instagram.com/noobs.gr'
    }
  ]
};
