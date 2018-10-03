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
  spellOpts: []
}

let defaultCharacter = {
  id: '',
  name: '',
  concentrating: '',
  classes: [],
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
      changeClass (state, payload) { // payload has charIndex classIndex newClass
        console.log(JSON.stringify(payload))
        this.state.characters[payload.charIndex].classes[payload.classIndex].classname = payload.newClass
      },
      changeClassLevel (state, payload) { // payload has charIndex classIndex newLevel
        this.state.characters[payload.charIndex].classes[payload.classIndex].level = payload.newLevel
      },
      changeName (state, payload) {
        this.state.characters[payload.index].name = payload.name
      },
      multiclass (state, payload) { // payload has index and classname
        if (this.state.characters[payload.index].classes.length > 10) {
          return
        }
        for (let i in this.state.characters[payload.index].classes) {
          let c = this.state.characters[payload.index].classes[i]
          if (c.classname === payload.classname) {
            return
          }
        }
        let newclass = JSON.parse(JSON.stringify(defaultClass))
        newclass.classname = payload.classname
        this.state.characters[payload.index].classes.push(newclass)
      },
      offsetStat (state, payload) {
        // stat, index, offset
        this.state.characters[payload.index].abilityScores[payload.stat] += payload.offset
      },
      removeCharacter (state, identifier) {
        console.log('rmchar')
        let index = this.state.characters.findIndex(function (element) {
          return element.id === identifier
        })
        if (index === -1) {
          console.log(JSON.stringify(identifier))
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
