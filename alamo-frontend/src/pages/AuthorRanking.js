import './PlayerRanking.css';

const AuthorRanking = ({playerList}) => {
  const constructLeaderboard = () => {
    let mapperArr = []
    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].Mapcount > 0) {
        mapperArr.push(playerList[i])
      }
    }
    mapperArr.sort(sortByTrackCount)
    return (
      <div className="leaderboard">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Mapper Name</th>
              <th>Map Count</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaderboard(mapperArr)}
          </tbody>
        </table>
      </div>
    )
  }

  const sortByTrackCount = (a, b) => {
    return b.Mapcount - a.Mapcount
  }

  const displayLeaderboard = (list) => {
    return (
      <>
        {list.map((mapper, index) => (
          <tr key={index}>
            <td className={`rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
              {index + 1}
            </td>
            <td className='displayFont'>{mapper.id}</td>
            <td className='displayFont'>{mapper.Mapcount}</td>
          </tr>
        ))}
      </>
    )
  }

  return (
    <div>
      <div className='header-text'>
        <h1>Authors</h1>
      </div>
      {constructLeaderboard()}
    </div>
  )
}

export default AuthorRanking