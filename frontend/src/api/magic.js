import axios from 'axios'

export default {
  getSlots(classes) {
    return axios
      .post('/api/magic/slots/', { classes })
      .then(response => response.data)
  },
}
