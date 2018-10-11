import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let defaultClass = {
  classname: '',
  level: 1,
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
  hitpoints: 0,
  maxHitpoints: 0,
  id: '',
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
      snackbar: {
        show: false,
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
        {
          hitpoints: 0,
          maxHitpoints: 0,
          id: '0',
          name: 'Rorik Ironforge',
          proficiency: 0,
          concentrating: 'Animate Objects',
          classes: [
            {
              classname: 'Warlock',
              level: 1,
              slots: { // slots for this class to reset/rest to
                '1': 4,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0
              },
              workingSlots: { // slots that we're working with
                '1': 0,
                '2': 0,
                '3': 0,
                '4': 0,
                '5': 0,
                '6': 0,
                '7': 0,
                '8': 0,
                '9': 0
              }
            }
          ],
          abilityScores: {
            STR: 20,
            INT: 1,
            WIS: 10,
            DEX: 10,
            CON: 20,
            CHR: 1
          }
        }
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
      },
      setHP (state, payload) { // charIndex hitpoints
        if (payload.hitpoints > this.state.characters[payload.charIndex].maxHitpoints) {
          this.state.characters[payload.charIndex].hitpoints = this.state.characters[payload.charIndex].maxHitpoints
          return
        }
        this.state.characters[payload.charIndex].hitpoints = payload.hitpoints
      },
      setMaxHP (state, payload) { // charIndex hitpoints
        this.state.characters[payload.charIndex].maxHitpoints = payload.hitpoints
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
      showSnackbar (state, payload) { // message func buttonMessage
        this.state.snackbar.message = payload.message
        if (payload.hasOwnProperty('func') && payload.hasOwnProperty('buttonMessage')) {
          this.state.snackbar.buttonMessage = payload.buttonMessage
          this.state.snackbar.buttonFunction = payload.func
        }
        this.state.snackbar.show = true
      }
    }
  }
)
