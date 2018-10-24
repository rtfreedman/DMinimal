import { Class, Character } from './common/models'

export default {
  // character mutations
  addCharacter(state) {
    state.characters.push(new Character(state.nextCharacterId++))
  },

  changeClass(state, { charIndex, classIndex, newClass }) {
    // charIndex classIndex newClass
    this.state.characters[charIndex].classes[classIndex].classname = newClass
    this.commit('updateSlots', {
      charIndex,
      classIndex,
    })
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
          this.state.hitDice[
            this.state.characters[charIndex].classes[classIndex].classname
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
            (this.state.hitDice[
              this.state.characters[charIndex].classes[classIndex].classname
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
            this.state.hitDice[
              this.state.characters[charIndex].classes[classIndex].classname
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
  longRestAll() {
    for (const c in this.state.characters) {
      this.commit('longRest', c)
    }
  },
  longRest(state, charIndex) {
    if (this.state.characters[charIndex].hitpoints === 0) {
      // you cannot gain the benefits of a long rest at 0 hitpoints
      this.commit('showSnackbar', {
        message:
          this.state.characters[charIndex].name +
          ' cannot gain the benefits of a long rest at 0 HP',
      })
      return
    }
    this.commit('setHP', {
      charIndex,
      hitpoints: this.state.characters[charIndex].maxHitpoints,
    })
    for (const c in this.state.characters[charIndex].classes) {
      this.state.characters[charIndex].classes[c].workingSlots = JSON.parse(
        JSON.stringify(this.state.characters[charIndex].classes[c].slots),
      )
    }
  },
  multiclass(state, payload) {
    // index, classname
    if (this.state.characters[payload.index].classes.length > 10) {
      return // no more than 10 classes
    }
    for (const i in this.state.characters[payload.index].classes) {
      const c = this.state.characters[payload.index].classes[i]
      if (c.classname === payload.classname) {
        return // no duplicate classes
      }
    }
    const newclass = new Class()
    newclass.classname = payload.classname
    this.state.characters[payload.index].classes.push(newclass)
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
  removeCharacter(state, identifier) {
    const index = this.state.characters.findIndex(function(element) {
      return element.id === identifier
    })
    if (index === -1) {
      return
    }
    this.state.characters.splice(index, 1)
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
  updateSlots(state, payload) {
    // charIndex classIndex
    const strBody = JSON.stringify({
      classes: [
        {
          class: this.state.characters[payload.charIndex].classes[
            payload.classIndex
          ].classname,
          level: this.state.characters[payload.charIndex].classes[
            payload.classIndex
          ].level,
        },
      ],
    })
    const r = new Request('http://localhost:8010/magic/slots/', {
      method: 'POST',
      body: strBody,
    })
    fetch(r)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('Something went wrong on api server!')
        }
      })
      .then(response => {
        this.state.characters[payload.charIndex].classes[
          payload.classIndex
        ].slots = response.Slots
        // make a deep copy for long rests without need to re-access backend
        this.state.characters[payload.charIndex].classes[
          payload.classIndex
        ].workingSlots = JSON.parse(JSON.stringify(response.Slots))
      })
      .catch(error => {
        console.error(error)
      })
  },
  // classopts mutations
  updateClassOpts() {
    const r = new Request('http://localhost:8010/classes/')
    fetch(r)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('Something went wrong on api server!')
        }
      })
      .then(response => {
        this.state.classOpts = response.Classes
        this.state.magicClassOpts = response.MagicClasses
      })
      .catch(error => {
        console.error(error)
      })
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
