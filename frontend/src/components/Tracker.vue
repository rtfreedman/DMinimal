<template>
  <v-card>
    <v-flex xs6>
      <v-card-text>
        <div>
          <!--Character Details-->
          <v-text-field v-model="name" placeholder="Name..."></v-text-field>
          <div v-for="(c, index) in classes" :key="index">
            <v-layout row>
              <v-card-title>
                <v-autocomplete
                  placeholder='Class'
                  :items="classOpts"
                  :search-input.sync="c.class"
                  flat
                />
                <v-flex xs3>
                <v-autocomplete 
                  placeholder='Level'
                  :items="levels"
                  :search-input.sync="c.level"
                  flat
                />
                </v-flex>
              </v-card-title>
              <v-btn v-if="classes.length > 1" icon flat color="grey" @click="deleteClass(c.id)"> <v-icon>cancel</v-icon> </v-btn>
            </v-layout>
          </div>
          <!--End Character Details-->
          <!--Multiclass-->
          <v-tooltip right>
            <v-btn icon slot="activator" @click="multiclass()">
              <v-icon>add_circle_outline</v-icon>
            </v-btn>
            <span>Multiclass</span>
          </v-tooltip>
          <v-tooltip right>
            <v-btn flat slot="activator" icon @click="getSpellSlots">
              <v-icon> autorenew </v-icon>
            </v-btn>
            <span>Update Slots</span>
          </v-tooltip>
          <!--End Multiclass-->
        </div>
      </v-card-text>
    </v-flex>
    <v-card-text>
      <!--Slot Counters-->
      <v-layout row grid-list-xs>
        <div v-for="(slot, index) in spellSlots" :key="index">
          <v-flex xs2>
              <v-btn flat @click="increment(slot)" color="yellow">+</v-btn>
              <v-btn flat @click="launchOffsetter" color="white"> {{slot.slot}} </v-btn>
              <v-btn flat @click="decrement(slot)" color="yellow">-</v-btn>
              <v-btn flat disabled color="red"> Lv {{slot.level}} </v-btn>
          </v-flex>
        </div>
      </v-layout>
      <!--End Slot Counters-->
    <!--Character Slot Utilities-->
    </v-card-text>
    <v-card-actions>
      <v-btn flat color="green lighten-1" @click="dialog=true">Cast Spell</v-btn>
      <v-btn @click="longRest" flat color="blue lighten-2">Long Rest</v-btn>
    </v-card-actions>
    <!--End Character Slot Utilities-->
    <v-layout row justify-center>
      <!--Search Dialog-->
      <v-dialog v-model="dialog" max-width="300">
        <v-card>
          <v-card-title class="headline">Find spell</v-card-title>
          <v-card-text>
            <v-autocomplete 
              placeholder='Spell...'
              :search-input.sync="input"
              :items="spellOpts"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-1" flat @click="dialog = false"> Close </v-btn>
            <v-btn color="red lighten-1" flat @click="getSpellInfo(input, false)"> Info </v-btn>
            <v-btn color="green lighten-1" flat @click="castSpell(input)"> Cast </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--End Search Dialog-->
    </v-layout>
    {{currSpellInfo}}
  </v-card>
</template>

<script>
export default {
  props: ['classOpts'],
  data () {
    return {
      spellSlots: [],
      spellSlotsFull: [],
      levels: [...Array(21).keys()],
      characterName: '',
      dialogOpen: false,
      numClasses: 1,
      currSpellInfo: {},
      classes: [{
        class: 'Wizard',
        level: 1,
        id: 0
      }],
      dialog: false,
      input: '',
      spellOpts: []
    }
  },
  watch: {
    input () {
      let classList = []
      for (let i = 0; i < this.classes.length; i++) {
        classList.push(this.classes[i].class)
      }
      let strBody = JSON.stringify({
        classes: classList,
        spellName: this.input
      })
      let r = new Request('http://localhost:8010/magic/search/', {method: 'Post', body: strBody})
      fetch(r)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('Something went wrong on api server!')
        }
      })
      .then(response => {
        this.spellOpts = response.spellOpts
        return response.spellOpts
      })
      .catch(error => {
        console.error(error)
      })
    }
  },
  computed: {
    name: {
      get () {
        return this.characterName
      },
      set (val) {
        this.characterName = val
      }
    }
  },
  methods: {
    increment (slot) {
      slot.slot++
    },
    decrement (slot) {
      if (slot.slot > 0) {
        slot.slot--
      } else {
        // Show snackbar
      }
    },
    launchOffsetter () {
    },
    getSpellInfo (spellName, decrement) {
      let r = new Request('http://localhost:8010/magic/spell/' + spellName, {method: 'GET'})
      fetch(r)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('Something went wrong on api server!')
        }
      })
      .then(spellInfo => {
        this.currSpellInfo = spellInfo
        if (decrement) {
          this.decrement(this.spellSlots[this.currSpellInfo.Level - 1])
        }
      })
      .catch(error => {
        console.error(error)
      })
    },
    castSpell (spellName) {
      if (this.currSpellInfo.Name !== spellName) {
        this.getSpellInfo(spellName, true)
      } else {
        this.decrement(this.spellSlots[this.currSpellInfo.Level - 1])
      }
      // - 1 because 0 indexing
    },
    getSpellSlots () {
      let strBody = JSON.stringify({
        classes: this.classes
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
        this.spellSlots = response.Slots
        // make a deep copy for long rests without need to re-access backend
        this.spellSlotsFull = JSON.parse(JSON.stringify(response.Slots))
      })
      .catch(error => {
        console.error(error)
      })
    },
    longRest () {
      this.spellSlots = JSON.parse(JSON.stringify(this.spellSlotsFull))
    },
    multiclass () {
      if (this.classes.length < 10) {
        this.classes.push({
          class: 'Wizard',
          level: 1,
          id: Math.random() * (10 ** 10)
        })
      }
    },
    deleteClass (item) {
      let index = this.classes.findIndex(function (element) {
        return element.id === item
      })
      if (index === -1) {
        return
      }
      this.classes.splice(index, 1)
    }
  }
}
</script>