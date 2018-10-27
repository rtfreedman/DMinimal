import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import { Character } from './common/models'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nextCharacterId: 2,
    snackbar: {
      show: false,
      color: 'red darken-1',
      message: '',
      buttonMessage: '',
      buttonFunction: undefined,
    },
    spellsInfo: {
      spellList: [],
      className: '',
      currSpellInfo: {},
    },
    classOptions: [],
    magicClassOptions: [],
    characters: [new Character(1)],
  },
  getters,
  mutations,
  actions,
})
