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
  },
  spellOpts: []
}

let defaultCharacter = {
  id: '',
  name: '',
  proficiency: '+0',
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
      characters: [
        {
          id: '0',
          name: 'Rorik Ironforge',
          proficiency: '+0',
          concentrating: 'Animate Objects',
          classes: [
            {
              classname: 'Warlock',
              level: 1,
              slots: {
                1: 4,
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
              },
              spellOpts: [
                'Eldritch Blast',
                'Anger'
              ]
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
      addCharacter () {
        let newChar = JSON.parse(JSON.stringify(defaultCharacter))
        newChar.id = Math.floor(Math.random() * (10 ** 10)).toString()
        this.state.characters.push(newChar)
      },
      changeClass (state, payload) { // charIndex classIndex newClass
        this.state.characters[payload.charIndex].classes[payload.classIndex].classname = payload.newClass
      },
      changeClassLevel (state, payload) { // charIndex classIndex newLevel
        this.state.characters[payload.charIndex].classes[payload.classIndex].level = payload.newLevel
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
        this.state.characters[charIndex].proficiency = '+' + (Math.floor(totalLevel / 5) + 2).toString()
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
      stopConcentrating (state, index) {
        this.state.characters[index].concentrating = ''
      }
    }
  }
)
