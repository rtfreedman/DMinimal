<template>
  <v-card>
    <v-flex xs4>
      <v-card-text>
        <div>
          <!--Character Details-->
          <v-text-field v-model="characterName" placeholder="Name..."></v-text-field>
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
              <v-btn flat @click="launchOffsetter(slot)" color="white"> {{slot.slot}} </v-btn>
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
      <v-dialog v-model="dialog" max-width="800">
        <v-card>
          <v-card-title class="headline">Find spell</v-card-title>
          <v-card-text>
            <v-autocomplete
              v-model="spellInput"
              placeholder='Spell...'
              :search-input.sync="input"
              :items="spellOpts"
            />
          </v-card-text>
          <v-card-text>
            <v-list dense>
              <v-list-tile v-if="currSpellInfo.hasOwnProperty(elem)" v-for="(elem, text) in spellSearchDialogOpts" :key="elem">
                <v-list-tile-content><h3>{{text}}:</h3></v-list-tile-content>
                <v-list-tile-content class="align-end">{{ currSpellInfo[elem] }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-if="currSpellInfo.hasOwnProperty('Classes')">
                <v-list-tile-content><h3>Classes:</h3></v-list-tile-content>
                <v-list-tile-content v-if="currSpellInfo.Classes" class="align-end">{{ currSpellInfo.Classes.join(", ") }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-if="currSpellInfo.hasOwnProperty('AtHigherLevels') && currSpellInfo.AtHigherLevels !== ''">
                <v-list-tile-content><h3>At Higher Levels:</h3></v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-if="currSpellInfo.hasOwnProperty('AtHigherLevels') && currSpellInfo.AtHigherLevels !== ''">
                <v-list-tile-content>{{ currSpellInfo.AtHigherLevels }}</v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-if="currSpellInfo.hasOwnProperty('Description')">
                <v-list-tile-content><h3>Description:</h3></v-list-tile-content>
              </v-list-tile>
              <v-list-tile-content v-if="currSpellInfo.hasOwnProperty('Description')">{{ currSpellInfo.Description }}</v-list-tile-content>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red lighten-1" flat @click="dialog = false"> Close </v-btn>
            <v-btn color="green lighten-1" flat @click="castSpell(input)"> Cast </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--End Search Dialog-->
    </v-layout>
    <!--Start Snackbar-->
    <v-snackbar
      color="red darken-3"
      v-model="snackbar"
      :timeout="snackbarTimeout"> Not enough slots
      <v-btn flat @click="highlvldialog=true">Cast at higher level</v-btn>
    </v-snackbar>
    <!--End Snackbar-->
    <!--Start CastAtHigherLevel Dialog-->
    <v-dialog v-model="highlvldialog" max-width=300>
      <v-card>
        <v-card-text>
          <h2>Cast spell at level</h2>
        </v-card-text>
        <v-card-text>
          <v-radio-group v-model="atHigherLevelSlot" :mandatory="false">
            <v-radio v-for="(slot, index) in spellSlots" v-if="(slot.level >= currSpellInfo.Level) && (slot.slot > 0)" :key="index" :label="slot.level.toString()" :value="slot">{{slot}}</v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="castSpellAtHigherLevel(atHigherLevelSlot); snackbar=false" flat> Cast </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--End CastAtHigherLevel Dialog-->
    <!--Start Offset Dialog-->
    <v-dialog v-model="offsetDialog" max-width=200>
      <v-card>
        <v-card-text>
          <h2>Add Offset</h2>
        </v-card-text>
        <v-card-text>
        <v-layout column justify-center>
          <v-btn @click="incrementFull(offsetSlot)">+</v-btn>
          <v-btn flat :disabled="true">{{offsetSlot.slot}}</v-btn>
          <v-btn @click="decrementFull(offsetSlot)">-</v-btn>
        </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="offsetDialog=false" flat> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--End Offset Dialog-->
  </v-card>
</template>

<script>
export default {
  props: ['classOpts'],
  data () {
    return {
      levelOpts: [],
      currSpellClasses: [],
      spellSearchDialogOpts: {Level: 'Level', Name: 'Name', School: 'School', Duration: 'Duration', SpellRange: 'Range', Concentration: 'Concentration', Components: 'Components'},
      spellInput: '',
      offsetDialog: false,
      offsetSlot: 0,
      offsetIndex: 0,
      highlvldialog: false,
      slotLevelInput: 9,
      spellSlots: [],
      spellSlotsFull: [],
      levels: Array.from(new Array(20), (x, i) => i + 1), // [1,20]
      characterName: '',
      atHigherLevelSlot: 0,
      numClasses: 1,
      currSpellInfo: {},
      classes: [{
        class: '',
        level: 1,
        id: 0
      }],
      snackbar: false,
      snackbarTimeout: 8000,
      dialog: false,
      input: '',
      spellOpts: []
    }
  },
  watch: {
    spellInput (state) {
      this.getSpellInfo(state, false)
    },
    input () {
      let classList = []
      for (let i = 0; i < this.classes.length; i++) {
        classList.push(this.classes[i].class)
      }
      let sameList = true
      if (classList.length === this.currSpellClasses.length) {
        for (let i = 0; i < classList.length; i++) {
          if (!this.currSpellClasses.includes(classList[i])) {
            sameList = false
            break
          }
        }
        if (sameList) {
          return
        }
      }
      this.currSpellClasses = classList
      let strBody = JSON.stringify({
        classes: classList,
        spellName: ''
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
  methods: {
    increment (slot) {
      slot.slot++
    },
    incrementFull (slot) {
      for (let i = 0; i < this.spellSlotsFull.length; i++) {
        if (this.spellSlotsFull[i].level === slot.level) {
          this.spellSlotsFull[i].slot ++
          slot.slot ++
          return
        }
      }
    },
    decrement (slot) {
      if (slot.slot > 0) {
        slot.slot--
      } else {
        // Show snackbar
      }
    },
    decrementFull (slot) {
      for (let i = 0; i < this.spellSlotsFull.length; i++) {
        if (this.spellSlotsFull[i].level === slot.level) {
          this.spellSlotsFull[i].slot --
          slot.slot --
          return
        }
      }
    },
    castSpellAtHigherLevel (slot) {
      this.decrement(slot)
      this.highlvldialog = false
      this.snackbar = false
    },
    launchOffsetter (slot) {
      this.offsetSlot = slot
      this.offsetDialog = true
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
        if (decrement && this.currSpellInfo.Level !== 0) {
          this.decrement(this.spellSlots[this.currSpellInfo.Level - 1])
          this.dialog = false
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
        if (this.currSpellInfo.Level === 0) {
          this.dialog = false
          return
        }
        if (this.spellSlots[this.currSpellInfo.Level - 1].slot === 0) {
          this.snackbar = true
          return
        }
        this.decrement(this.spellSlots[this.currSpellInfo.Level - 1])
        this.dialog = false
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
          class: '',
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