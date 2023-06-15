import { useState, useEffect } from 'react'
import userService from './services/UserService'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TrackRanking from './pages/TrackRanking';
import WorldRecordRanking from './pages/WorldRecordRanking';
import AuthorRanking from './pages/AuthorRanking';
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
            const newMap = {
              UID: mapDetails[i].mapUid,
              Name: mapDetails[i].name.replace(/\$[0-9a-fA-F]{3}/g, '').replace(/\$[oiwntsgzOIWNTSGZ$]/g, ''),
              MapperName: mapDetails[i].author,
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
    <Router basename="/alamo-cup">
      <Navbar />
      <Routes>
        <Route path='/' element={<PlayerRanking mapATList={mapATList}/>}/>
        <Route path='/World-Records' element={<WorldRecordRanking mapATList={mapATList}/>}/>
        <Route path='/Tracks' element={<TrackRanking mapATList={mapATList}/>}/>
        <Route path='/Map-Authors' element={<AuthorRanking mapATList={mapATList}/>}/>
        <Route path='*' element={<PlayerRanking mapATList={mapATList}/>}/>
      </Routes>
    </Router>
  )
}

export default App;
