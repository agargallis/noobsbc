import { useState } from 'react';
import ContactForm from '../components/ui/ContactForm';
import CountdownPanel from '../components/ui/CountdownPanel';
import InstaCarousel from '../components/ui/InstaCarousel';
import LatestScoresStrip from '../components/ui/LatestScoresStrip';
import PlayerModal from '../components/ui/PlayerModal';
import RosterCarousel from '../components/ui/RosterCarousel';
import SectionHeading from '../components/ui/SectionHeading';
import StandingsTable from '../components/ui/StandingsTable';
import UpcomingMatchesList from '../components/ui/UpcomingMatchesList';
import { useSiteData } from '../context/SiteDataContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function HomePage() {
  const { siteData } = useSiteData();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const heroSponsors = [...siteData.sponsors, ...siteData.sponsors];
  const visibleLatestMatches = siteData.latestMatches.filter((match) => !match.hidden);
  const visibleUpcomingMatches = siteData.upcomingMatches.filter((match) => !match.hidden);
  const featuredHeroMatch =
    visibleUpcomingMatches.find((match) => String(match.id) === String(siteData.hero.featuredMatchId)) ?? siteData.nextMatch;

  useScrollAnimation();

  return (
    <>
      <section className="hero-section hero-section-focused">
        <div className="hero-content hero-content-focused">
          <div className="hero-focused">
            <div className="hero-main-grid">
              <div className="hero-aside">
                <CountdownPanel nextMatch={featuredHeroMatch} />
              </div>

              <aside className="hero-showcase" aria-label="Noobs και χορηγοί">
                <div className="hero-showcase-logo">
                  <img src="/images/logo1.png" alt={siteData.meta.shortName} className="hero-zoom-logo" />
                </div>

                <div className="hero-sponsors-loop">
                  <div className="hero-sponsors-track">
                    <a
                      className="hero-sponsor-pill"
                      href="https://www.basketaki.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="/images/basketaki.png" alt="Basketaki The League" />
                    </a>
                    {heroSponsors.map((sponsor, index) => (
                      <a
                        key={`${sponsor.id}-${index}`}
                        className="hero-sponsor-pill"
                        href={sponsor.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-hidden={index >= siteData.sponsors.length}
                        tabIndex={index >= siteData.sponsors.length ? -1 : undefined}
                      >
                        <img src={sponsor.image} alt={sponsor.name} />
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            <div className="button-row hero-buttons">
              <a className="button" href={siteData.hero.primaryCta.href}>
                {siteData.hero.primaryCta.label}
              </a>
              <a className="button ghost" href={siteData.hero.secondaryCta.href}>
                {siteData.hero.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block" id="standings">
        <div className="split-heading standings-heading" data-animate>
          <SectionHeading eyebrow="Βαθμολογία" title="Η βαθμολογική μας κατάταξη." />
          <a className="league-mark" href="https://www.basketaki.com" target="_blank" rel="noreferrer">
            <img src="/images/basketaki.png" alt="Basketaki The League" />
          </a>
        </div>
        <div data-animate style={{ '--anim-delay': '0.1s' }}>
          <StandingsTable standings={siteData.standings} groupTitle={siteData.standingsGroupTitle} />
        </div>
      </section>

      <section className="section-block" id="scores">
        <div data-animate>
          <SectionHeading eyebrow="Τελευταία αποτελέσματα" title="Τα πιο πρόσφατα τελικά μας σκορ." />
        </div>
        <LatestScoresStrip matches={visibleLatestMatches} />
      </section>

      <section className="section-block" id="schedule">
        <div data-animate>
          <SectionHeading eyebrow="Πρόγραμμα αγώνων" title="Οι επόμενες αναμετρήσεις μας." />
        </div>
        <div data-animate style={{ '--anim-delay': '0.1s' }}>
          <UpcomingMatchesList matches={visibleUpcomingMatches} />
        </div>
      </section>

      <section className="section-block" id="roster">
        <div data-animate>
          <SectionHeading eyebrow="Ρόστερ" title="Οι παίκτες μας." />
        </div>

        <RosterCarousel players={siteData.players} onSelectPlayer={setSelectedPlayer} />
      </section>

      <section className="section-block" id="news">
        <div data-animate>
          <SectionHeading eyebrow="Νέα ομάδας" title="Τα τελευταία νέα μας." align="center" />
        </div>
        <div data-animate style={{ '--anim-delay': '0.08s' }}>
          <InstaCarousel posts={siteData.instagramPosts} instagramUrl={siteData.meta.instagramUrl} />
        </div>
      </section>

      <section className="section-block" id="contact">
        <div className="contact-layout" data-animate>
          <div>
            <SectionHeading eyebrow="Επικοινωνία" title="Θέλεις να γίνεις μέρος της ομάδας;" align="center" />
            <p className="contact-intro">
              Ψάχνουμε παίκτες, προπονητές και χορηγούς. Αν έχεις κάτι να προτείνεις ή θέλεις να συνεργαστείς μαζί μας,
              στείλε μας μήνυμα.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <section className="section-block sponsor-highlight">
        <div data-animate>
          <SectionHeading eyebrow="Χορηγοί" title="Οι επίσημοι χορηγοί μας." />
        </div>

        <div className="sponsor-grid">
          {siteData.sponsors.map((sponsor, index) => (
            <a
              key={sponsor.id}
              className="sponsor-card"
              href={sponsor.url}
              target="_blank"
              rel="noreferrer"
              data-animate
              style={{ '--anim-delay': `${index * 0.1}s` }}
            >
              <span>{sponsor.label}</span>
              <img src={sponsor.image} alt={sponsor.name} />
              <h3>{sponsor.name}</h3>
            </a>
          ))}
        </div>
      </section>

      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </>
  );
}

