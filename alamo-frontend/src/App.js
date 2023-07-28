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
  const [trackList, setTrackList] = useState(JSON.parse(localStorage.getItem('trackList')) || []);
  const [playerList, setPlayerList] = useState(JSON.parse(localStorage.getItem('playerList')) || []);

  useEffect(() => {
    userService.getPlayers()
      .then(response => {
        setPlayerList(response)
        localStorage.setItem('playerList', JSON.stringify(response));
      })
    userService.getTracks()
      .then(response => {
        setTrackList(response)
        localStorage.setItem('trackList', JSON.stringify(response));
      })
  }, []);


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<PlayerRanking playerList={playerList} trackCount={trackList.length}/>}/>
        <Route path='/World-Records' element={<WorldRecordRanking playerList={playerList}/>}/>
        <Route path='/Tracks' element={<TrackRanking trackList={trackList}/>}/>
        <Route path='/Map-Authors' element={<AuthorRanking playerList={playerList}/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='*' element={<PlayerRanking playerList={playerList}/>}/>
      </Routes>
    </Router>
  )
}

export default App;
