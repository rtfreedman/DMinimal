import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import { Character } from './common/models'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    characters: [new Character(1)],
    nextCharacterId: 2,
    classOptions: [],
    magicClassOptions: [],
    spells: [],
    currentSpellClass: null,
    currentSpellInfo: {},
    snackbar: {
      show: false,
      color: 'red darken-1',
      message: '',
      buttonMessage: '',
      buttonFunction: undefined,
    },
  },
  getters,
  mutations,
  actions,
})
