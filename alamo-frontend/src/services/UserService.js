import axios from 'axios'
//const baseURL = 'https://raw.githubusercontent.com/sRaina3/alamo-cup/main/alamo-backend/data.json'
const baseURL = 'http://alamo-api.us-east-1.elasticbeanstalk.com/api/mapRecords';

const getInfo = () => {
  const request = axios.get(baseURL)
  return request.then(response => response.data)
}
const userService = {getInfo}

export default userService