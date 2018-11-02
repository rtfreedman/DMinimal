import magicAPI from './api/magic'
import stateAPI from './api/state'

function handleError(error) {
  console.error(error)
}

export default {
  save({ state }) {
    stateAPI.save(state).catch(handleError)
  },

  restore({ commit }, { gameId }) {
    stateAPI
      .restore(gameId)
      .then(data => {
        commit('setState', data)
      })
      .catch(handleError)
  },

  retrieveSpells({ commit }, { spellClass, filter }) {
    magicAPI
      .getSpells(spellClass, filter)
      .then(data => {
        commit('setSpells', {
          spells: data.spells,
          spellClass,
        })
      })
      .catch(handleError)
  },

  retrieveSpellInfo({ commit }, { spell }) {
    magicAPI
      .getSpell(spell)
      .then(data => {
        commit('setSpellInfo', data)
      })
      .catch(handleError)
  },

  retrieveSlots(_, { index, name, level, character }) {
    magicAPI
      .getSlots([{ class: name, level }])
      .then(data => {
        character.setSlots(index, name, data.Slots)
      })
      .catch(handleError)
  },

  retrieveClassOptions({ commit }) {
    magicAPI
      .getClasses()
      .then(data => {
        commit('setClassOptions', {
          classOptions: data.Classes,
          magicClassOptions: data.MagicClasses,
        })
      })
      .catch(handleError)
  },
}
