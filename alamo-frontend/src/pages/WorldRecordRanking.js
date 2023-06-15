import './PlayerRanking.css';

const WorldRecordRanking = ({mapATList}) => {
  const constructLeaderboard = () => {
    let playerArr = []
    for (let i = 0; i < mapATList.length; i++) {
      let player = playerArr.find(player => player.name === mapATList[i].ATHolders[0])
      if (player) {
        player.WRcount++
      } else {
        let newPlayer = {
          name: mapATList[i].ATHolders[0],
          WRcount: 1
        }
        playerArr.push(newPlayer)
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
            <td>{index + 1}</td>
            <td>{player.name}</td>
            <td>{player.WRcount}</td>
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