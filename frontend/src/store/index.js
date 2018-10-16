import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let defaultClass = {
  classname: '',
  level: 0,
  slots: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0
  },
  workingSlots: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0
  }
}

let defaultCharacter = {
  deathThrows: 0,
  lifeThrows: 0,
  initiative: null,
  hitpoints: 1,
  maxHitpoints: 1,
  id: '0',
  name: '',
  proficiency: 0,
  concentrating: '',
  classes: [JSON.parse(JSON.stringify(defaultClass))],
  abilityScores: {
    STR: 10,
    INT: 10,
    WIS: 10,
    DEX: 10,
    CON: 10,
    CHR: 10
  }
}

export default new Vuex.Store(
  {
    state: {
      hitDice: {
        Barbarian: 12,
        Bard: 8,
        Cleric: 8,
        Druid: 8,
        Fighter: 10,
        Monk: 8,
        Paladin: 10,
        Ranger: 10,
        Rogue: 8,
        Sorcerer: 6,
        Warlock: 8,
        Wizard: 6
      },
      tab: 0,
      snackbar: {
        show: false,
        color: 'red darken-1',
        message: '',
        buttonMessage: '',
        buttonFunction: undefined
      },
      spellsInfo: {
        spellList: [],
        className: '',
        currSpellInfo: {}
      },
      classOpts: [],
      magicClassOpts: [],
      characters: [
        JSON.parse(JSON.stringify(defaultCharacter))
      ]
    },
    mutations: {
      // character mutations
      addCharacter () {
        let newChar = JSON.parse(JSON.stringify(defaultCharacter))
        newChar.id = Math.floor(Math.random() * (10 ** 10)).toString()
        this.state.characters.push(newChar)
      },
      changeClass (state, payload) { // charIndex classIndex newClass
        this.state.characters[payload.charIndex].classes[payload.classIndex].classname = payload.newClass
        this.commit('updateSlots', {
          charIndex: payload.charIndex,
          classIndex: payload.classIndex
        })
      },
      changeClassLevel (state, payload) { // charIndex classIndex newLevel
        let levelOffset = payload.newLevel - this.state.characters[payload.charIndex].classes[payload.classIndex].level
        if (payload.classIndex === 0 && this.state.characters[payload.charIndex].classes[payload.classIndex].level === 0) {
          this.commit('setMaxHP', {
            charIndex: payload.charIndex,
            hitpoints: this.state.characters[payload.charIndex].maxHitpoints += this.state.hitDice[this.state.characters[payload.charIndex].classes[payload.classIndex].classname] + ((this.state.characters[payload.charIndex].abilityScores.CON - 10) / 2)
          })
          levelOffset -= 1
        }
        if (this.state.characters[payload.charIndex].rollHealth) { // health was calculated by rolling. Roll again.
          this.commit('setMaxHP', {
            charIndex: payload.charIndex,
            hitpoints: this.state.characters[payload.charIndex].maxHitpoints += ((Math.random() * (this.state.hitDice[this.state.characters[payload.charIndex].classes[payload.classIndex].classname] - 1)) + 1 + ((this.state.characters[payload.charIndex].abilityScores.CON - 10) / 2)) * levelOffset
          })
        } else { // health took average. do that.
          this.commit('setMaxHP', {
            charIndex: payload.charIndex,
            hitpoints: this.state.characters[payload.charIndex].maxHitpoints += (Math.ceil(this.state.hitDice[this.state.characters[payload.charIndex].classes[payload.classIndex].classname] / 2) + ((this.state.characters[payload.charIndex].abilityScores.CON - 10) / 2)) * levelOffset
          })
        }
        this.state.characters[payload.charIndex].classes[payload.classIndex].level = payload.newLevel
        this.commit('updateSlots', {
          charIndex: payload.charIndex,
          classIndex: payload.classIndex
        })
        this.commit('proficiencyBonus', payload.charIndex)
      },
      changeName (state, payload) { // index name
        this.state.characters[payload.index].name = payload.name
      },
      changeTab (state, index) {
        this.state.tab = index
      },
      incrementSlot (state, payload) { // charIndex classIndex level
        this.state.characters[payload.charIndex].classes[payload.classIndex].workingSlots[payload.level] ++
      },
      decrementSlot (state, payload) { // charIndex classIndex level
        if (this.state.characters[payload.charIndex].classes[payload.classIndex].workingSlots[payload.level] > 0) {
          this.state.characters[payload.charIndex].classes[payload.classIndex].workingSlots[payload.level] --
        }
      },
      longRest (state, charIndex) {
        for (let c in this.state.characters[charIndex].classes) {
          this.state.characters[charIndex].classes[c].workingSlots = JSON.parse(JSON.stringify(this.state.characters[charIndex].classes[c].slots))
        }
      },
      multiclass (state, payload) { // index, classname
        if (this.state.characters[payload.index].classes.length > 10) {
          return // no more than 10 classes
        }
        for (let i in this.state.characters[payload.index].classes) {
          let c = this.state.characters[payload.index].classes[i]
          if (c.classname === payload.classname) {
            return // no duplicate classes
          }
        }
        let newclass = JSON.parse(JSON.stringify(defaultClass))
        newclass.classname = payload.classname
        this.state.characters[payload.index].classes.push(newclass)
      },
      offsetStat (state, payload) { // stat index offset
        if (this.state.characters[payload.index].abilityScores[payload.stat] + payload.offset < 0) {
          return
        }
        if (payload.stat === 'CON') {
          let totalLevel = 0
          for (let c in this.state.characters[payload.index].classes) {
            totalLevel += this.state.characters[payload.index].classes[c].level
          }
          if (totalLevel === 0) {
            this.state.characters[payload.index].abilityScores[payload.stat] += payload.offset
            return
          }
          let oddCorrection = (this.state.characters[payload.index].abilityScores[payload.stat] % 2) / 2.0
          let newmax = this.state.characters[payload.index].maxHitpoints + (Math.floor((payload.offset / 2) + oddCorrection) * totalLevel)
          this.commit('setMaxHP', {
            charIndex: payload.index,
            hitpoints: newmax
          })
          if (this.state.characters[payload.index].maxHitpoints < this.state.characters[payload.index].hitpoints) {
            this.commit('setHP', {
              charIndex: payload.index,
              hitpoints: newmax
            })
          }
        }
        this.state.characters[payload.index].abilityScores[payload.stat] += payload.offset
      },
      proficiencyBonus (state, charIndex) {
        let totalLevel = 0
        for (let c in this.state.characters[charIndex].classes) {
          if (this.state.characters[charIndex].classes[c].hasOwnProperty('level')) {
            totalLevel += this.state.characters[charIndex].classes[c].level
          }
        }
        this.state.characters[charIndex].proficiency = (Math.floor(totalLevel / 5) + 2)
      },
      removeCharacter (state, identifier) {
        let index = this.state.characters.findIndex(function (element) {
          return element.id === identifier
        })
        if (index === -1) {
          return
        }
        this.state.characters.splice(index, 1)
        this.commit('changeTab', 0)
      },
      setDeathThrows (state, payload) { // charIndex throwVal
        this.state.characters[payload.charIndex].deathThrows = payload.throwVal
      },
      setLifeThrows (state, payload) { // charIndex throwVal
        this.state.characters[payload.charIndex].lifeThrows = payload.throwVal
      },
      setHP (state, payload) { // charIndex hitpoints
        if (payload.hitpoints > 0) {
          this.commit('setLifeThrows', {
            charIndex: payload.charIndex,
            throwVal: 0
          })
          this.commit('setDeathThrows', {
            charIndex: payload.charIndex,
            throwVal: 0
          })
        }
        if (payload.hitpoints > this.state.characters[payload.charIndex].maxHitpoints) {
          this.state.characters[payload.charIndex].hitpoints = Math.floor(this.state.characters[payload.charIndex].maxHitpoints)
          return
        }
        this.state.characters[payload.charIndex].hitpoints = payload.hitpoints
      },
      setMaxHP (state, payload) { // charIndex hitpoints
        if (payload.hitpoints >= 0) {
          this.state.characters[payload.charIndex].maxHitpoints = Math.floor(payload.hitpoints)
        }
      },
      setRollState (state, payload) {
        this.state.characters[payload.charIndex].rollHealth = payload.rollHealth
      },
      stopConcentrating (state, index) {
        this.state.characters[index].concentrating = ''
      },
      updateSlots (state, payload) { // charIndex classIndex
        let strBody = JSON.stringify({
          classes: [{
            class: this.state.characters[payload.charIndex].classes[payload.classIndex].classname,
            level: this.state.characters[payload.charIndex].classes[payload.classIndex].level
          }]
        })
        let r = new Request('http://localhost:8010/magic/slots/', {method: 'POST', body: strBody})
        fetch(r)
        .then(response => {
          if (response.status === 200) {
            return response.json()
          } else {
            throw new Error('Something went wrong on api server!')
          }
        })
        .then(response => {
          this.state.characters[payload.charIndex].classes[payload.classIndex].slots = response.Slots
          // make a deep copy for long rests without need to re-access backend
          this.state.characters[payload.charIndex].classes[payload.classIndex].workingSlots = JSON.parse(JSON.stringify(response.Slots))
        })
        .catch(error => {
          console.error(error)
        })
      },
      // classopts mutations
      updateClassOpts () {
        let r = new Request('http://localhost:8010/classes/')
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
      setSpellOpts (state, payload) { // className spellOpts
        this.state.spellsInfo.currSpellInfo = {}
        this.state.spellsInfo.spellList = payload.spellOpts
        this.state.spellsInfo.className = payload.className
      },
      setSpellInfo (state, spellInfo) {
        this.state.spellsInfo.currSpellInfo = spellInfo
      },
      // snackbar mutations
      hideSnackbar () {
        this.state.snackbar.show = false
      },
      showSnackbar (state, payload) { // message, optional: func buttonMessage color
        this.state.snackbar.message = payload.message
        if (payload.hasOwnProperty('func') && payload.hasOwnProperty('buttonMessage')) {
          this.state.snackbar.buttonMessage = payload.buttonMessage
          this.state.snackbar.buttonFunction = payload.func
        }
        if (payload.hasOwnProperty('color')) {
          this.state.snackbar.color = payload.color
        }
        this.state.snackbar.show = true
      }
    }
  }
)
