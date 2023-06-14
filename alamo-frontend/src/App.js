import { useState, useEffect } from 'react'
import userService from './services/UserService'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TrackRanking from './pages/TrackRanking';
import Navbar from './Navbar'

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
            console.log(mapDetails[i].name)
            const newMap = {
              UID: mapDetails[i].mapUid,
              Name: mapDetails[i].name.replace(/\$i{1}/g, '').replace(/\$g{1}/g, '').replace(/\$[a-zA-Z0-9]{1,3}/g, ''),
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

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<PlayerRanking mapATList={mapATList}/>}/>
        <Route path='/Tracks' element={<TrackRanking mapATList={mapATList}/>}/>
        <Route path='*' element={<PlayerRanking mapATList={mapATList}/>}/>
      </Routes>
    </Router>
  )
}

export default App;
