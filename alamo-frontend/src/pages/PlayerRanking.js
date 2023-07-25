import { useState } from 'react'
import './PlayerRanking.css';

const PlayerRanking = ({mapATList}) => {
  const [curPage, setCurPage] = useState(1)
  let playerArr = []

  const constructLeaderboard = () => {
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
            {displayLeaderboard(playerArr.slice(((curPage - 1) * 100), curPage * 100))}
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
            <td>{index + 1 + ((curPage - 1) * 100)}</td>
            <td>{player.name}</td>
            <td>{player.ATcount}</td>
            <td>{mapATList.length - player.ATcount}</td>
          </tr>
        ))}
      </>
    )
  }

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1)
    }
  }

  const nextPage = () => {
    if (curPage * 100 < playerArr.length) {
      setCurPage(curPage + 1)
    }
  }

  return (
    <div>
      <div className='header-text'>
        <h1>AT Rankings</h1>
      </div>
      <div className="page-buttons-container-left">
        <button className='page-button' onClick={prevPage}>&#9664; Prev</button>
      </div>
      <div className="page-buttons-container-right"> 
        <button className='page-button' onClick={nextPage}>Next {"\u25B6"}</button>
      </div>
      {constructLeaderboard()}
    </div>
  )
}

export default PlayerRanking