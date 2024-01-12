import './PlayerRanking.css';

const WorldRecordRanking = ({playerList}) => {
  const constructLeaderboard = () => {
    let playerArr = []
    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].WRcount > 0) {
        playerArr.push(playerList[i])
      }
    }
    playerArr.sort(sortByWR)
    return (
      <div className="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              <th>WR Count</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaderboard(playerArr)}
          </tbody>
        </table>
      </div>
    )
  }

  const sortByWR = (a, b) => {
    return b.WRcount - a.WRcount
  }

  const displayLeaderboard = (list) => {
    return (
      <>
        {list.map((player, index) => (
          <tr key={index}>
            <td className={`rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
              {index + 1}
            </td>
            <td className='displayFont'>{player._id}</td>
            <td className='displayFont'>{player.WRcount}</td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <div>
      <div className='header-text'>
        <h1>World Records</h1>
      </div>
      {constructLeaderboard()}
    </div>
  )
}

export default WorldRecordRanking