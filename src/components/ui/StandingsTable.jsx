export default function StandingsTable({ standings, groupTitle = '1ος Όμιλος' }) {
  return (
    <div className="standings-card">
      <div className="standings-group-title">{groupTitle}</div>

      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ομάδα</th>
            <th>Β</th>
            <th>Α</th>
            <th>Ν</th>
            <th>Η</th>
            <th>STR</th>
            <th>ΥΠ</th>
            <th>ΚΤ</th>
            <th>+/-</th>
            <th>ΑΒ</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id} className={team.team === 'Noobs' ? 'is-highlighted' : ''}>
              <td>
                <span className="standings-rank-badge">{index + 1}</span>
              </td>
              <td className="standings-team-cell">
                <span className="standings-team-brand">
                  <img src={team.logo || '/images/logo.png'} alt={team.team} className="standings-team-logo" />
                  <span className="standings-team-name">{team.team}</span>
                </span>
              </td>
              <td>{team.points ?? 0}</td>
              <td>{team.played ?? 0}</td>
              <td>{team.won ?? 0}</td>
              <td>{team.lost ?? 0}</td>
              <td>{team.streak || '-'}</td>
              <td>{team.scored ?? 0}</td>
              <td>{team.conceded ?? 0}</td>
              <td>{team.diff ?? 0}</td>
              <td>{team.ab ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
