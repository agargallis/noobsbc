export default function StandingsTable({ standings }) {
  return (
    <div className="standings-card">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ομάδα</th>
            <th>Α</th>
            <th>Ν</th>
            <th>Η</th>
            <th>Β</th>
            <th>Φόρμα</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id} className={team.team === 'Noobs' ? 'is-highlighted' : ''}>
              <td>{index + 1}</td>
              <td>{team.team}</td>
              <td>{team.played}</td>
              <td>{team.won}</td>
              <td>{team.lost}</td>
              <td>{team.points}</td>
              <td>{team.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
