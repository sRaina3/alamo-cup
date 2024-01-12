import { useState} from 'react'
import './PlayerRanking.css'
import './TrackRanking.css'

const TrackRanking = ({trackList}) => {
  const [sortOrder, setSortOrder] = useState(false)

  const updateSortOrder = () => {
    setSortOrder(!sortOrder)
  }

  const constructLeaderboard = () => {
    trackList.sort(sortByAT)
    return (
      <div className="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Map Name</th>
              <th>
                <button className="header-button" onClick={updateSortOrder}>AT Count{' '}
                  {!sortOrder ? (
                    <span className="sort-arrow">&#9650;</span>
                  ) : (
                    <span className="sort-arrow">&#9660;</span>
                  )}
                </button>
              </th>
              <th>Author Time</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaderboard(trackList)}
          </tbody>
        </table>
      </div>
    )
  }

  const sortByAT = (a, b) => {
    if (sortOrder) {
      return b.ATcount - a.ATcount
    } else {
      return a.ATcount - b.ATcount
    }
  }

  const displayLeaderboard = (list) => {
    return (
      <>
        {list.map((map, index) => (
          <tr key={map.UID}>
            <td className="rank">{index + 1}</td>
            <td className='displayFont'>{map._id}</td>
            <td className='displayFont'>{map.ATcount}</td>
            <td className='displayFont'>{map.AT.toString().substring(0,map.AT.toString().length - 3)
              .concat(`.${map.AT.toString().substring(map.AT.toString().length - 3, map.AT.toString().length)}`)}
            </td>
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