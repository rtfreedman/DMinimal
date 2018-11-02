import { Character } from './common/models'

export default {
  // set application state on restore action
  setState(state, retrievedState) {
    state = retrievedState
  },

  // character mutations
  addCharacter(state) {
    state.characters.push(new Character(state.nextCharacterId++))
  },

  removeCharacter(state, { id }) {
    const i = state.characters.findIndex(c => c.id === id)
    this.state.characters.splice(i, 1)
  },

  setClassOptions(state, { classOptions, magicClassOptions }) {
    state.classOptions = classOptions
    state.magicClassOptions = magicClassOptions
  },

  triggerChangeDetection(state, remove) {
    if (!remove) {
      state.characters.push(state.characters[0])
    } else {
      state.characters.pop()
    }
  },

  setSpellInfo(state, spellInfo) {
    state.currentSpellInfo = spellInfo
  },

  setSpells(state, { spells, spellClass }) {
    state.spells = spells
    state.currentSpellInfo = {}
    state.currentSpellClass = spellClass
  },

  offsetStat(state, payload) {
    // stat index offset
    if (
      this.state.characters[payload.index].abilityScores[payload.stat] +
        payload.offset <
      0
    ) {
      return
    }
    if (payload.stat === 'CON') {
      let totalLevel = 0
      for (const c in this.state.characters[payload.index].classes) {
        totalLevel += this.state.characters[payload.index].classes[c].level
      }
      if (totalLevel === 0) {
        this.state.characters[payload.index].abilityScores[payload.stat] +=
          payload.offset
        return
      }
      let oddCorrection = this.state.characters[payload.index].abilityScores[
        payload.stat
      ]
      oddCorrection %= 2
      oddCorrection /= 2.0
      const newmax =
        this.state.characters[payload.index].maxHitpoints +
        Math.floor(payload.offset / 2 + oddCorrection) * totalLevel
      this.commit('setMaxHP', {
        charIndex: payload.index,
        hitpoints: newmax,
      })
      if (
        this.state.characters[payload.index].maxHitpoints <
        this.state.characters[payload.index].hitpoints
      ) {
        this.commit('setHP', {
          charIndex: payload.index,
          hitpoints: newmax,
        })
      }
    }
    this.state.characters[payload.index].abilityScores[payload.stat] +=
      payload.offset
  },

  setDeathThrows(state, payload) {
    // charIndex throwVal
    this.state.characters[payload.charIndex].deathThrows = payload.throwVal
  },

  setLifeThrows(state, payload) {
    // charIndex throwVal
    this.state.characters[payload.charIndex].lifeThrows = payload.throwVal
  },

  setHP(state, payload) {
    // charIndex hitpoints
    if (payload.hitpoints > 0) {
      this.commit('setLifeThrows', {
        charIndex: payload.charIndex,
        throwVal: 0,
      })
      this.commit('setDeathThrows', {
        charIndex: payload.charIndex,
        throwVal: 0,
      })
    }
    if (payload.hitpoints < 0) {
      payload.hitpoints = 0
    }
    if (
      payload.hitpoints > this.state.characters[payload.charIndex].maxHitpoints
    ) {
      this.state.characters[payload.charIndex].hitpoints = Math.floor(
        this.state.characters[payload.charIndex].maxHitpoints,
      )
      return
    }
    this.state.characters[payload.charIndex].hitpoints = payload.hitpoints
  },

  setRollState(state, payload) {
    this.state.characters[payload.charIndex].rollHealth = payload.rollHealth
  },

  stopConcentrating(state, index) {
    this.state.characters[index].concentrating = ''
  },

  // snackbar mutations
  hideSnackbar() {
    this.state.snackbar.show = false
  },

  showSnackbar(state, payload) {
    // message, optional: func buttonMessage color
    this.state.snackbar.message = payload.message
    if (
      payload.hasOwnProperty('func') &&
      payload.hasOwnProperty('buttonMessage')
    ) {
      this.state.snackbar.buttonMessage = payload.buttonMessage
      this.state.snackbar.buttonFunction = payload.func
    }
    if (payload.hasOwnProperty('color')) {
      this.state.snackbar.color = payload.color
    }
    this.state.snackbar.show = true
  },
}
