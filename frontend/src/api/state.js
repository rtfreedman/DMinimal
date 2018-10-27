import axios from 'axios'

export default {
  save(state) {
    return axios
      .post('/api/state/save', { state })
      .then(response => response.data)
  },

  restore(gameId) {
    return axios
      .get(`api/state/restore/${gameId}`)
      .then(response => response.data)
  },
}
