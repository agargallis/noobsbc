import { formatMatchDate } from '../../utils/format';

export default function LatestScoresStrip({ matches }) {
  return (
    <div className="scores-strip" id="scores">
      {matches.map((match) => {
        const noobsAreHome = match.home === 'Noobs';
        const noobsScore = noobsAreHome ? match.homeScore : match.awayScore;
        const rivalScore = noobsAreHome ? match.awayScore : match.homeScore;
        const isWin = noobsScore > rivalScore;

        return (
          <article key={match.id} className={`score-card ${isWin ? 'is-win' : 'is-loss'}`}>
            <div className="score-card-top">
              <span>{formatMatchDate(match.date)}</span>
              <strong className={isWin ? 'win' : 'loss'}>{isWin ? 'Ν' : 'Η'}</strong>
            </div>
            <h3>
              {match.home} <span>{match.homeScore}</span>
            </h3>
            <h3>
              {match.away} <span>{match.awayScore}</span>
            </h3>
            <p>{match.venue}</p>
          </article>
        );
      })}
    </div>
  );
}
