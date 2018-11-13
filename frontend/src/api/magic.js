import axios from 'axios'

export default {
  getSlots(classes) {
    return axios
      .post('/api/magic/slots', { classes })
      .then(response => response.data)
  },

  getSpell(spell) {
    return axios
      .get(`/api/magic/spell/${spell}`)
      .then(response => response.data)
  },

  getSpells(spellClass) {
    return axios
      .get(`/api/magic/spells/${spellClass}`)
      .then(response => response.data)
  },

  getClasses() {
    return axios.get('/api/magic/classes').then(response => response.data)
  },
}
