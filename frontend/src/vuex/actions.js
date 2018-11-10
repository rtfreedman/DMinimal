import magicAPI from '../api/magic'
import stateAPI from '../api/state'
import monsterAPI from '../api/monsters'

function handleError(error) {
  console.error(error)
}

export default {
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

  dispatchRetrieveMonsterOptions({ commit }) {
    monsterAPI
      .getMonsters()
      .then(data => commit('setMonsterOpts', { monsters: data.Monsters }))
      .catch(handleError)
  },

  dispatchRetrieveMonsterInfo({ commit }, { name }) {
    monsterAPI
      .getMonster(name)
      .then(data => commit('setMonsterInfo', data))
      .catch(handleError)
  },

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

  dispatchAddMonster({ commit }, monster) {
    commit('addMonster', monster)
    // then save (?)
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

  dispatchAddClass({ commit }, { character, className, subClassName, level }) {
    commit('mutateCharacter', {
      character,
      method: 'addClass',
      args: [className, subClassName, level],
    })
  },

  dispatchUpdateClass(
    { commit, dispatch },
    { character, existingClassName, className, subClassName, level },
  ) {
    commit('mutateCharacter', {
      character,
      method: 'updateClass',
      args: [existingClassName, className, subClassName, level],
    })
    const classIndex = character.classes.findIndex(
      c => c.className === className,
    )
    dispatch('dispatchRetrieveSlots', {
      character,
      classIndex,
      className,
      level,
    })
  },

  dispatchRemoveClass({ commit }, { character, classIndex }) {
    commit('mutateCharacter', {
      character,
      method: 'removeClass',
      args: [classIndex],
    })
  },

  dispatchRetrieveSpells({ commit }, { spellClass }) {
    magicAPI
      .getSpells(spellClass)
      .then(data => {
        commit('setSpells', {
          spells: data,
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

  dispatchRetrieveSlots(
    { commit },
    { character, classIndex, className, level },
  ) {
    magicAPI
      .getSlots([{ class: className, level }])
      .then(data => {
        commit('mutateCharacter', {
          character,
          method: 'setSlots',
          args: [classIndex, className, data.Slots],
        })
      })
      .catch(handleError)
  },

  dispatchSetSlot({ commit }, { character, classIndex, slot, value }) {
    commit('mutateCharacter', {
      character,
      method: 'setSlot',
      args: [classIndex, slot, value],
    })
  },

  dispatchCastSpell({ commit }, { character, classIndex, slot, spellInfo }) {
    commit('mutateCharacter', {
      character,
      method: 'castSpell',
      args: [classIndex, slot, spellInfo],
    })
  },
}
