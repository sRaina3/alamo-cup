import './PlayerRanking.css';

const AuthorRanking = ({mapATList}) => {
  const constructLeaderboard = () => {
    let mapperArr = []
    for (let i = 0; i < mapATList.length; i++) {
      let mapper = mapperArr.find(player => player.name === mapATList[i].MapperName)
      if (mapper) {
        mapper.TrackCount++
      } else {
        let newMapper = {
          name: mapATList[i].MapperName,
          TrackCount: 1
        }
        mapperArr.push(newMapper)
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
    return b.TrackCount - a.TrackCount
  }

  const displayLeaderboard = (list) => {
    return (
      <>
        {list.map((mapper, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{mapper.name}</td>
            <td>{mapper.TrackCount}</td>
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