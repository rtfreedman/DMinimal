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

  addCharacter({ commit }) {
    commit('addCharacter')
    // then save
    return new Promise(resolve => {
      setImmediate(() => {
        resolve()
      })
    })
  },

  removeCharacter({ commit }, id) {
    commit('removeCharacter', id)
    // then save
    return new Promise(resolve => {
      setImmediate(() => {
        resolve()
      })
    })
  },

  groupRest({ state, commit }) {
    const deadCharacters = []
    state.characters.forEach(character => {
      if (!character.hitPoints) {
        deadCharacters.push(character.name)
      } else {
        commit('mutateCharacter', {
          character,
          method: 'longRest',
          args: [],
        })
      }
    })
    const deadCharactersString = deadCharacters.join(', ')
    commit('showSnackbar', {
      message: `The following characters are resting in peace: ${deadCharactersString}`,
    })
    // then save
  },

  updateCharacterInfo({ commit }, payload) {
    const character = payload.character
    delete payload.character
    commit('mutateCharacter', {
      character,
      method: 'updateInfo',
      args: [payload],
    })
    commit('triggerChangeDetection')
    setImmediate(() => {
      commit('triggerChangeDetection', true)
    })
    // then save
  },

  retrieveSpells({ commit }, { spellClass }) {
    magicAPI
      .getSpells(spellClass)
      .then(data => {
        commit('setSpells', {
          spells: data.spellOpts,
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
