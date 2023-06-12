import { useState } from 'react'
import './App.css';

import userService from './services/UserService'

const App = () => {
  const [info, setInfo] = useState("")

  console.log(info)
  return (
    <div>
      Hello
    </div>
  )
}

export default App;
