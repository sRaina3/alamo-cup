import axios from 'axios'
const baseURL = ''

const getInfo = (info) => {

  const request = axios.get(baseURL)
  return request.then(response => response.data)
}

const userService = {getInfo}

export default userService