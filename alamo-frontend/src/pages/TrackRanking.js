import { useState} from 'react'
import './PlayerRanking.css'
import './TrackRanking.css'

const TrackRanking = ({mapATList}) => {
  const [sortOrder, setSortOrder] = useState(false)

  const updateSortOrder = () => {
    setSortOrder(!sortOrder)
  }

  const constructLeaderboard = () => {
    mapATList.sort(sortByAt)
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
    if (sortOrder) {
      return b.ATHolders.length - a.ATHolders.length
    } else {
      return a.ATHolders.length - b.ATHolders.length
    }
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