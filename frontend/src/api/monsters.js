import axios from 'axios'

export default {
  getMonsters() {
    return axios.get('/api/monsters').then(response => response.data)
  },

  getMonster(monster) {
    return axios.get('/api/monsters/' + monster).then(response => response.data)
  },
}
