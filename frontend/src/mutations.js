import { Character } from './common/models'
import { hitDice } from './common/constants'

export default {
  // set application state on restore action
  setState(state, retrievedState) {
    state = retrievedState
  },

  // character mutations
  addCharacter(state) {
    state.characters.push(new Character(state.nextCharacterId++))
  },

  setClass(state, { charIndex, classIndex, className, slots }) {
    const ch = state.characters[charIndex]
    ch.setClass(classIndex, className, slots)
    state.characters.splice(charIndex, 1, ch)
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

  changeClassLevel(state, { newLevel, charIndex, classIndex }) {
    // charIndex classIndex newLevel
    let levelOffset =
      newLevel - this.state.characters[charIndex].classes[classIndex].level
    if (
      classIndex === 0 &&
      this.state.characters[charIndex].classes[classIndex].level === 0
    ) {
      this.commit('setMaxHP', {
        charIndex,
        hitpoints: (this.state.characters[charIndex].maxHitpoints +=
          hitDice[
            this.state.characters[charIndex].classes[classIndex].name
          ] +
          (this.state.characters[charIndex].abilityScores.CON - 10) / 2),
      })
      levelOffset -= 1
    }
    if (this.state.characters[charIndex].rollHealth) {
      // health was calculated by rolling. Roll again.
      this.commit('setMaxHP', {
        charIndex,
        hitpoints: (this.state.characters[charIndex].maxHitpoints +=
          (Math.random() *
            (hitDice[
              this.state.characters[charIndex].classes[classIndex].name
            ] -
              1) +
            1 +
            (this.state.characters[charIndex].abilityScores.CON - 10) / 2) *
          levelOffset),
      })
    } else {
      // health took average. do that.
      this.commit('setMaxHP', {
        charIndex,
        hitpoints: (this.state.characters[charIndex].maxHitpoints +=
          (Math.ceil(
            hitDice[
              this.state.characters[charIndex].classes[classIndex].name
            ] / 2,
          ) +
            (this.state.characters[charIndex].abilityScores.CON - 10) / 2) *
          levelOffset),
      })
    }
    this.state.characters[charIndex].classes[classIndex].level = newLevel
    this.commit('updateSlots', {
      charIndex,
      classIndex,
    })
    this.commit('proficiencyBonus', charIndex)
  },
  changeName(state, { index, name }) {
    // index name
    this.state.characters[index].name = name
  },
  decrementSlot(state, { classIndex, charIndex, level }) {
    // charIndex classIndex level
    if (
      this.state.characters[charIndex].classes[classIndex].workingSlots[level] >
      0
    ) {
      this.state.characters[charIndex].classes[classIndex].workingSlots[level]--
    }
  },
  incrementSlot(state, { classIndex, charIndex, level }) {
    // charIndex classIndex level
    this.state.characters[charIndex].classes[classIndex].workingSlots[level]++
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
  proficiencyBonus(state, charIndex) {
    let totalLevel = 0
    for (const c in this.state.characters[charIndex].classes) {
      if (this.state.characters[charIndex].classes[c].hasOwnProperty('level')) {
        totalLevel += this.state.characters[charIndex].classes[c].level
      }
    }
    this.state.characters[charIndex].proficiency =
      Math.floor(totalLevel / 5) + 2
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
  setMaxHP(state, payload) {
    // charIndex hitpoints
    if (payload.hitpoints >= 0) {
      this.state.characters[payload.charIndex].maxHitpoints = Math.floor(
        payload.hitpoints,
      )
    }
  },
  setInitiative(state, payload) {
    // charIndex initiative
    this.state.characters[payload.charIndex].initiative = payload.initiative
  },
  setRollState(state, payload) {
    this.state.characters[payload.charIndex].rollHealth = payload.rollHealth
  },
  stopConcentrating(state, index) {
    this.state.characters[index].concentrating = ''
  },
  // spell mutations
  setSpellOpts(state, { spellOpts, className }) {
    // className spellOpts
    this.state.spellsInfo.currSpellInfo = {}
    this.state.spellsInfo.spellList = spellOpts
    this.state.spellsInfo.className = className
  },
  setSpellInfo(state, spellInfo) {
    this.state.spellsInfo.currSpellInfo = spellInfo
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
