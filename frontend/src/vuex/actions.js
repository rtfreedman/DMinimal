import magicAPI from '../api/magic'
import stateAPI from '../api/state'
import monsterAPI from '../api/monsters'

function handleError(error) {
  console.error(error)
  throw error
}

export default {
  // commit or retrieve state to DB

  // "then save" is optimism that requires
  // special handling when the API call fails

  save({ state }) {
    return stateAPI.save(state).catch(handleError)
  },

  restore({ commit }, { gameId }) {
    return stateAPI
      .restore(gameId)
      .then(data => {
        commit('SET_STATE', data)
      })
      .catch(handleError)
  },

  // single character actions

  characterAction({ commit }, payload) {
    commit('MUTATE_CHARACTER', payload)
    // then save
  },

  // single character actions requiring special handling

  updateCharacterInfo({ commit }, payload) {
    const character = payload.character
    delete payload.character
    commit('MUTATE_CHARACTER', {
      character,
      method: 'updateInfo',
      args: [payload],
    })
    commit('TRIGGER_CD')
    setImmediate(() => {
      commit('TRIGGER_CD', true)
    })
    // then save
  },

  setInitiative({ commit }, { character, initiative }) {
    commit('MUTATE_CHARACTER', {
      character,
      method: 'setInitiative',
      args: [initiative],
    })
    commit('TRIGGER_CD')
    setImmediate(() => {
      commit('TRIGGER_CD', true)
    })
    // then save
  },

  updateClass(
    { commit, dispatch },
    { character, existingClassName, className, subClassName, level },
  ) {
    commit('MUTATE_CHARACTER', {
      character,
      method: 'updateClass',
      args: [existingClassName, className, subClassName, level],
    })
    const classIndex = character.classes.findIndex(
      c => c.className === className,
    )
    dispatch('retrieveSlots', {
      character,
      classIndex,
      className,
      level,
    })
    // then save
  },

  levelUp({ commit, dispatch }, { character, classIndex }) {
    commit('MUTATE_CHARACTER', {
      character,
      method: 'levelUp',
      args: [classIndex],
    })
    const cls = character.classes[classIndex]
    dispatch('retrieveSlots', {
      character,
      classIndex,
      className: cls.className,
      level: cls.level,
    })
    // then save
  },

  // multi character actions

  groupLongRest({ state, commit }) {
    const deadCharacters = []
    state.characters.forEach(character => {
      if (!character.hitPoints) {
        deadCharacters.push(character.name)
      } else {
        commit('MUTATE_CHARACTER', {
          character,
          method: 'longRest',
          args: [],
        })
      }
    })
    const deadCharactersString = deadCharacters.join(', ')
    commit('SHOW_SNACKBAR', {
      message: `The following characters are resting in peace: ${deadCharactersString}`,
    })
    // then save
  },

  // add and remove characters

  addCharacter({ commit }, name) {
    commit('ADD_CHARACTER', name)
    // then save
    return new Promise(resolve => {
      setImmediate(() => {
        resolve()
      })
    })
  },

  removeCharacter({ commit }, id) {
    commit('REMOVE_CHARACTER', id)
    // then save
    return new Promise(resolve => {
      setImmediate(() => {
        resolve()
      })
    })
  },

  // classes

  retrieveClassOptions({ commit }) {
    return magicAPI
      .getClasses()
      .then(data => {
        commit('SET_CLASS_OPTIONS', {
          classOptions: data.Classes,
          magicClassOptions: data.MagicClasses,
        })
      })
      .catch(handleError)
  },

  // monsters

  retrieveMonsterOptions({ commit }) {
    return monsterAPI
      .getMonsters()
      .then(data => commit('SET_MONSTER_OPTIONS', { monsters: data.Monsters }))
      .catch(handleError)
  },

  retrieveMonsterInfo({ commit }, { name }) {
    return monsterAPI
      .getMonster(name)
      .then(data => commit('SET_MONSTER_INFO', data))
      .catch(handleError)
  },

  addMonster({ commit }, monster) {
    commit('ADD_MONSTER', monster)
    // then save
    return new Promise(resolve => {
      setImmediate(() => {
        resolve()
      })
    })
  },

  // spells

  retrieveSpells({ commit }, { spellClass }) {
    return magicAPI
      .getSpells(spellClass)
      .then(data => {
        commit('SET_SPELLS', {
          spells: data,
          spellClass,
        })
      })
      .catch(handleError)
  },

  retrieveSpellInfo({ commit }, { spell }) {
    return magicAPI
      .getSpell(spell)
      .then(data => {
        commit('SET_SPELL_INFO', data)
      })
      .catch(handleError)
  },

  retrieveSlots({ commit }, { character, classIndex, className, level }) {
    return magicAPI
      .getSlots([{ class: className, level }])
      .then(data => {
        commit('MUTATE_CHARACTER', {
          character,
          method: 'setSlots',
          args: [classIndex, className, data.Slots],
        })
      })
      .catch(handleError)
  },
}
