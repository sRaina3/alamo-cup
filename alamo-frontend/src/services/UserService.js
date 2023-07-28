import axios from 'axios'
const baseURL = 'https://ey39vc0xjb.execute-api.us-east-1.amazonaws.com/prod';

const getPlayers = () => {
  const request = axios.get(baseURL + "/api/players")
  return request.then(response => response.data)
}

const getTracks = () => {
  const request = axios.get(baseURL + '/api/tracks')
  return request.then(response => response.data)
}

const userService = {getPlayers, getTracks}

export default userService