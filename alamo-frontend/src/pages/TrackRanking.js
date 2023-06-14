import './PlayerRanking.css'

const TrackRanking = ({mapATList}) => {
  const constructLeaderboard = () => {
    mapATList.sort(sortByAt)
    return (
      <div className="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Map Name</th>
              <th>AT Count</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaderboard(mapATList)}
          </tbody>
        </table>
      </div>
    )
  }

  const sortByAt = (a, b) => {
    return a.ATHolders.length - b.ATHolders.length
  }

  const displayLeaderboard = (list) => {
    return (
      <>
        {list.map((map, index) => (
          <tr key={map.UID}>
            <td>{index + 1}</td>
            <td>{map.Name}</td>
            <td>{map.ATHolders.length}</td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <div>
      <div className='header-text'>
        <h1>Tracks</h1>
      </div>
      {constructLeaderboard()}
    </div>
  )
}

export default TrackRanking