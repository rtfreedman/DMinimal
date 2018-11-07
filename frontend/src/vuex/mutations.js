import { Character } from '../common/models'

export default {
  // set application state on restore action
  setState(state, retrievedState) {
    state = retrievedState
  },

  // TBD: move this to a constant
  // set class options (currently API driven)
  setClassOptions(state, { classOptions, magicClassOptions }) {
    state.classOptions = classOptions
    state.magicClassOptions = magicClassOptions
  },

  // character mutations
  addCharacter(state, name) {
    state.characters.push(new Character(state.nextCharacterId++, name))
  },

  removeCharacter(state, { id }) {
    const i = state.characters.findIndex(c => c.id === id)
    this.state.characters.splice(i, 1)
  },

  // wrapper for a Character class method
  mutateCharacter(state, { character, method, args }) {
    character[method](...args)
    const i = state.characters.findIndex(c => c.id === character.id)
    state.characters.splice(i, 1, character)
  },

  setMonsterOpts(state, { monsters }) {
    state.monsterOptions = monsters
  },

  triggerChangeDetection(state, remove) {
    if (!remove) {
      state.characters.push(state.characters[0])
    } else {
      state.characters.pop()
    }
  },

  // handle spell related API request responses
  setSpellInfo(state, spellInfo) {
    state.currentSpellInfo = spellInfo
  },

  setSpells(state, { spells, spellClass }) {
    state.spells = spells
    state.currentSpellInfo = {}
    state.currentSpellClass = spellClass
  },

  // snackbar mutations
  hideSnackbar(state) {
    state.snackbar.show = false
  },

  showSnackbar(state, { message, func, buttonMessage, color }) {
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
