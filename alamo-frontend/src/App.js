import { useState, useEffect } from 'react'
import userService from './services/UserService'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TrackRanking from './pages/TrackRanking';
import WorldRecordRanking from './pages/WorldRecordRanking';
import PlayerRanking from './pages/PlayerRanking';
import AuthorRanking from './pages/AuthorRanking';
import About from './pages/About';
import Navbar from './Navbar'

const App = () => {
  const [mapATList, setMapATList] = useState([])

  useEffect(() => {
    userService.getInfo()
      .then(response => {
        let pos = 0
        let mapList = []
        while (response[pos]) {
          const mapDetails = response[pos]
          let newMap = {
            UID: mapDetails.id,
            Name: mapDetails.name.replace(/\$[0-9a-fA-F]{3}/g, '').replace(/\$[oiwntsgzOIWNTSGZ$]/g, ''),
            MapperName: mapDetails.authorName,
            AT: mapDetails.authorScore,
            ATHolders: []
          }
          mapList.push(newMap)
          
          const mapRecords = response[pos].records
          for (const r in mapRecords) {
            const record = mapRecords[r]
            if (record.time <= mapList[pos].AT) {
              mapList[pos].ATHolders.push(record.player.name)
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
        <Route path='/World-Records' element={<WorldRecordRanking mapATList={mapATList}/>}/>
        <Route path='/Tracks' element={<TrackRanking mapATList={mapATList}/>}/>
        <Route path='/Map-Authors' element={<AuthorRanking mapATList={mapATList}/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='*' element={<PlayerRanking mapATList={mapATList}/>}/>
      </Routes>
    </Router>
  )
}

export default App;
