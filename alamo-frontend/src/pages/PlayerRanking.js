import './PlayerRanking.css';

const PlayerRanking = ({mapATList}) => {
  
  const constructLeaderboard = () => {
    let playerArr = []
    for (let i = 0; i < mapATList.length; i++) {
      const curMap = mapATList[i]
      for (let j = 0; j < curMap.ATHolders.length; j++) {
        let player = playerArr.find(player => player.name === curMap.ATHolders[j])
        if (player) {
          player.ATcount++
        } else {
          let newPlayer = {
            name: curMap.ATHolders[j],
            ATcount: 1
          }
          playerArr.push(newPlayer)
        }
      }
    }
    playerArr.sort(sortByAt)
    return (
      <div className="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player Name</th>
              <th>AT Count</th>
              <th>Missing</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaderboard(playerArr)}
          </tbody>
        </table>
      </div>
    )
  }

  const sortByAt = (a, b) => {
    return b.ATcount - a.ATcount
  }

  const displayLeaderboard = (list) => {
    return (
      <>
        {list.map((player, index) => (
          <tr key={player.name}>
            <td>{index + 1}</td>
            <td>{player.name}</td>
            <td>{player.ATcount}</td>
            <td>{mapATList.length - player.ATcount}</td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <div>
      <div className='header-text'>
        <h1>AT Rankings</h1>
      </div>
      {constructLeaderboard()}
    </div>
  )
}

export default PlayerRanking