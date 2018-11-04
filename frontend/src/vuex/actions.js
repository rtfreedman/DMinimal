import magicAPI from '../api/magic'
import stateAPI from '../api/state'

function handleError(error) {
  console.error(error)
}

export default {
  // PLACEHOLDER

  dispatchSave({ state }) {
    stateAPI.save(state).catch(handleError)
  },

  dispatchRestore({ commit }, { gameId }) {
    stateAPI
      .restore(gameId)
      .then(data => {
        commit('setState', data)
      })
      .catch(handleError)
  },

  // IN USE

  dispatchRetrieveClassOptions({ commit }) {
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

  dispatchAddCharacter({ commit }, name) {
    commit('addCharacter', name)
    // then save
    return new Promise(resolve => {
      setImmediate(() => {
        resolve()
      })
    })
  },

  dispatchRemoveCharacter({ commit }, id) {
    commit('removeCharacter', id)
    // then save
    return new Promise(resolve => {
      setImmediate(() => {
        resolve()
      })
    })
  },

  dispatchGroupRest({ state, commit }) {
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

  dispatchUpdateCharacterInfo({ commit }, payload) {
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

  dispatchLongRest({ commit }, character) {
    commit('mutateCharacter', {
      character,
      method: 'longRest',
      args: [],
    })
    // then save
  },

  dispatchShortRest({ commit }, { character, recoveredHitPoints }) {
    commit('mutateCharacter', {
      character,
      method: 'shortRest',
      args: [recoveredHitPoints],
    })
    // then save
  },

  dispatchConcentrate({ commit }, { character, spellName }) {
    commit('mutateCharacter', {
      character,
      method: 'concentrateOn',
      args: [spellName],
    })
    // then save
  },

  dispatchSetInitiative({ commit }, { character, initiative }) {
    commit('mutateCharacter', {
      character,
      method: 'setInitiative',
      args: [initiative],
    })
    commit('triggerChangeDetection')
    setImmediate(() => {
      commit('triggerChangeDetection', true)
    })
  },

  dispatchSetStat({ commit }, { character, stat, value }) {
    commit('mutateCharacter', {
      character,
      method: 'setStat',
      args: [stat, value],
    })
  },

  dispatchSetStatOffset({ commit }, { character, stat, value }) {
    commit('mutateCharacter', {
      character,
      method: 'setStatOffset',
      args: [stat, value],
    })
  },

  dispatchAddClass({ commit }, { character }) {
    commit('mutateCharacter', {
      character,
      method: 'addClass',
      args: [],
    })
  },

  // THE LINE

  dispatchRetrieveSpells({ commit }, { spellClass }) {
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

  dispatchRetrieveSpellInfo({ commit }, { spell }) {
    magicAPI
      .getSpell(spell)
      .then(data => {
        commit('setSpellInfo', data)
      })
      .catch(handleError)
  },

  dispatchRetrieveSlots(_, { index, name, level, character }) {
    magicAPI
      .getSlots([{ class: name, level }])
      .then(data => {
        character.setSlots(index, name, data.Slots)
      })
      .catch(handleError)
  },
}
