import { useState, useEffect } from 'react'
import userService from './services/UserService'
import './App.css';

const App = () => {
  const [mapATList, setMapATList] = useState([])

  useEffect(() => {
    userService.getInfo()
      .then(response => {
        const mapDetails = response.campaigns[0].mapsDetail
        let mapList = []
        for (let i = 0; i < mapDetails.length; i++) {
          const newMap = {
            UID: mapDetails[i].mapUid,
            AT: mapDetails[i].authorScore,
            ATHolders: []
          }
          mapList.push(newMap)
        }


        const mapRecords = response.campaigns[0].mapsRecords
        for (const map in mapRecords) {
          const records = mapRecords[map].tops
          const mapObj = mapList.find(elem => elem.UID === map)
          for (let i = 0; i < records.length; i++) {
            if (records[i].time <= mapObj.AT) {
              mapObj.ATHolders.push(records[i].player.name)
            }
          }
        }

        setMapATList(mapList)
      })
  }, [])

  const constructLeaderboard = () => {
    let playerArr = []
    console.log(mapATList)
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
    console.log(playerArr)
  }

  return (
    <div>
      {constructLeaderboard()}
    </div>
  )
}

export default App;
