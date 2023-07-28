import { useState } from 'react'
import './PlayerRanking.css';

const PlayerRanking = ({playerList, trackCount}) => {
  const [curPage, setCurPage] = useState(1)

  let playerArr = []
  const constructLeaderboard = () => {
    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].ATcount > 0) {
        playerArr.push(playerList[i])
      }
    }
    playerArr.sort(sortByAT)
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

  const sortByAT = (a, b) => {
    return b.ATcount - a.ATcount
  }

  const displayLeaderboard = (list) => {
    return (
      <>
        {list.map((player, index) => (
          <tr key={player.id}>
            <td className={`rank ${curPage === 1 && index === 0 ? 'gold' : curPage === 1 
                            && index === 1 ? 'silver' : curPage === 1 && index === 2 ? 'bronze' : ''}`}>
              {index + 1 + ((curPage - 1) * 100)}
            </td>
            <td className='displayFont'>{player.id}</td>
            <td className='displayFont'>{player.ATcount}</td>
            <td className='displayFont'>{trackCount - player.ATcount}</td>
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
    if (curPage * 100 < playerList.length) {
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