import { useState, useEffect } from 'react'
import userService from './services/UserService'

import './pages/PlayerRanking'
import './App.css';
import PlayerRanking from './pages/PlayerRanking';

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

  if (mapATList.length !== 0) {
    return (
      <div>
        <PlayerRanking mapATList={mapATList}/>
      </div>
    )
  }
}

export default App;
