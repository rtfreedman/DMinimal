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
    hitDice: {
      Barbarian: 12,
      Bard: 8,
      Cleric: 8,
      Druid: 8,
      Fighter: 10,
      Monk: 8,
      Paladin: 10,
      Ranger: 10,
      Rogue: 8,
      Sorcerer: 6,
      Warlock: 8,
      Wizard: 6,
    },
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
    classOpts: [],
    magicClassOpts: [],
    characters: [new Character(1)],
  },
  getters,
  mutations,
  actions,
})
