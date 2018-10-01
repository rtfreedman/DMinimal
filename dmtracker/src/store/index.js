import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let defaultCharacter = {
  ID: '',
  Name: '',
  Concentrating: '',
  Class: {},
  AbilityScores: {
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
          ID: '0',
          Name: 'Rorik Ironforge',
          Concentrating: 'Animate Objects',
          Class: {
            Warlock: {
              Level: 1,
              Slots: {
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
              SpellOpts: [
                'Eldritch Blast',
                'Anger'
              ]
            }
          },
          AbilityScores: {
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
        newChar.ID = Math.random() * (10 ** 10).toString()
        this.state.characters.push(newChar)
      }
    }
  }
)
