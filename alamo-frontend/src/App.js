import { useState, useEffect } from 'react'
import userService from './services/UserService'
import './App.css';

const App = () => {
  const [mapATList, setMapATList] = useState([])

  useEffect(() => {
    userService.getInfo()
      .then(response => {
        let pos = 0
        let mapList = []
        while (response.campaigns[pos]) {
          const mapDetails = response.campaigns[pos].mapsDetail
          for (let i = 0; i < mapDetails.length; i++) {
            const newMap = {
              UID: mapDetails[i].mapUid,
              AT: mapDetails[i].authorScore,
              ATHolders: []
            }
            mapList.push(newMap)
          }


          const mapRecords = response.campaigns[pos].mapsRecords
          for (const map in mapRecords) {
            const records = mapRecords[map].tops
            const mapObj = mapList.find(elem => elem.UID === map)
            for (let i = 0; i < records.length; i++) {
              if (records[i].time <= mapObj.AT) {
                mapObj.ATHolders.push(records[i].player.name)
              }
            }
          }
          pos++
        }

        setMapATList(mapList)
      })
  }, [])

  const constructLeaderboard = () => {
    let playerArr = []
    //console.log(mapATList)
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
    return displayLeaderboard(playerArr)
  }

  const sortByAt = (a, b) => {
    console.log(a)
    return b.ATcount - a.ATcount
  }

  const displayLeaderboard = (list) => {
    console.log(list)
    return (
      <div>
        {list.map((player) => 
          <div key={player.name}>
            {player.name} {player.ATcount}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {constructLeaderboard()}
    </div>
  )
}

export default App;
