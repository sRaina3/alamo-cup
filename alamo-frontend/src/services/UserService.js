import axios from 'axios'
const baseURL = 'https://raw.githubusercontent.com/sRaina3/alamo-cup/main/alamo-backend';

const getPlayers = () => {
  const request = axios.get(baseURL + "/playerArr.json")
  return request.then(response => response.data)
}

const getTracks = () => {
  const request = axios.get(baseURL + '/trackArr.json')
  return request.then(response => response.data)
}

const userService = {getPlayers, getTracks}

export default userService