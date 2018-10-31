import axios from 'axios'

export default {
  getClassOptions() {
    return axios.get('/api/classes/').then(response => response.data)
  },
}
