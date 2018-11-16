import { Character, Monster } from '../common/models'

export default {
  // set application state on restore action

  SET_STATE(state, retrievedState) {
    state = retrievedState
  },

  // single character mutation

  MUTATE_CHARACTER(state, { character, method, args }) {
    character[method](...args)
    const i = state.characters.findIndex(c => c.id === character.id)
    state.characters.splice(i, 1, character)
  },

  // TBD: move this to a constant
  // set class options (currently API driven)

  SET_CLASS_OPTIONS(state, { classOptions, magicClassOptions }) {
    state.classOptions = classOptions
    state.magicClassOptions = magicClassOptions
  },

  // add or remove characters
  ADD_CHARACTER(state, name) {
    state.characters.push(new Character(state.nextCharacterId++, name))
  },

  REMOVE_CHARACTER(state, { id }) {
    const i = state.characters.findIndex(c => c.id === id)
    this.state.characters.splice(i, 1)
  },

  // monsters

  ADD_MONSTER(state, { monster }) {
    state.monsters.push(new Monster(state.nextMonsterId++, monster))
  },

  SET_MONSTER_OPTIONS(state, { monsters }) {
    state.monsterOptions = monsters
  },

  SET_MONSTER_INFO(state, monsterInfo) {
    state.currentMonsterInfo = monsterInfo
  },

  // change detection hacking required for vuetify tabs

  TRIGGER_CD(state, remove) {
    if (!remove) {
      state.characters.push(state.characters[0])
    } else {
      state.characters.pop()
    }
  },

  // spells

  SET_SPELL_INFO(state, spellInfo) {
    state.currentSpellInfo = spellInfo
  },

  SET_SPELLS(state, { spells, spellClass }) {
    state.spells = spells
    state.currentSpellInfo = {}
    state.currentSpellClass = spellClass
  },

  // snackbar

  HIDE_SNACKBAR(state) {
    state.snackbar.show = false
  },

  SHOW_SNACKBAR(state, { message, func, buttonMessage, color }) {
    // message, optional: func buttonMessage color
    state.snackbar.message = message

    if (func && buttonMessage) {
      state.snackbar.buttonMessage = buttonMessage
      state.snackbar.buttonFunction = func
    }

    if (color) {
      state.snackbar.color = color
    }

    state.snackbar.show = true
  },
}
