<template>
  <v-card>
    <!--Ability Scores-->
    <v-layout align-center justify-start row>
      <v-layout v-for="(statVal, statName) in stats" :key="statName" align-center justify-start column>
        <span><h3> {{statName}} </h3> </span>
        <v-btn flat @click="selectedStat=statName; statsDialog=true;">{{statVal}}</v-btn>
      </v-layout>
    </v-layout>
    <!--End Ability Scores-->
    <!--Ability Scores Dialog-->
    <v-dialog v-model="statsDialog" max-width=200>
      <v-card>
        <v-layout align-center justify-start column>
          <v-btn flat @click="stats[selectedStat]++">+</v-btn>
          <span>{{stats[selectedStat]}}</span>
          <v-btn flat @click="stats[selectedStat] = Math.max(0, stats[selectedStat]-1)">-</v-btn>
          <v-btn flat @click="stats[selectedStat]=rollStat()">Roll</v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <!--End Ability Scores Dialog-->
    <v-flex xs4>
      <v-card-text>
        <!--Character Details-->
        <span v-for="(c, index) in classes" :key="index">
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
        </span>
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
        <v-tooltip right>
          <v-btn :disabled="!concentrating" @click="concentrationDialog=true" flat icon slot="activator"><v-icon>remove_red_eye</v-icon></v-btn>
          <span v-if="concentrating">Concentrating on {{concentrationSpell}}</span>
          <span v-if="!concentrating">Not currently concentrating</span>
        </v-tooltip>
      </v-card-text>
    </v-flex>
    <v-flex xs6>
      <v-layout align-center justify-start row>
        <v-layout align-center justify-start column>
          <h3>Proficiency Bonus</h3>
          <span>+{{proficiencyBonus()}}</span>
        </v-layout>
        <v-layout align-center justify-start column>
          <h3>Spell Save DC</h3>
          <span>{{spellStat(true)}}</span>
        </v-layout>
        <v-layout align-center justify-start column>
          <h3>Spell Attack Modifier</h3>
          <span>{{spellStat(false)}} + d20</span>
        </v-layout>
      </v-layout>
    </v-flex>
    <v-card-text>
      <!--Slot Counters-->
      <v-layout row grid-list-xs>
        <div v-for="(slot, index) in spellSlots" :key="index">
          <v-btn flat @click="increment(slot)" color="yellow">+</v-btn>
          <v-btn flat @click="launchOffsetter(slot)" color="white"> {{slot.slot}} </v-btn>
          <v-btn flat @click="decrement(slot)" color="yellow">-</v-btn>
          <v-btn flat disabled color="red"> Lv {{slot.level}} </v-btn>
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
            <h1>{{currSpellInfo.Name}}</h1>
            <div v-if="currSpellInfo.hasOwnProperty('Concentration')">Concentration</div>
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
            <v-btn color="green lighten-1" flat @click="castSpell()"> Cast </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--End Search Dialog-->
    </v-layout>
    <!--Start Out of Slots Snackbar-->
    <v-snackbar
      color="red darken-3"
      v-model="outOfSlotsSnackbar"
      :timeout="snackbarTimeout"> <h3>Not enough slots</h3>
      <v-btn v-if="haveSlotsAboveLevel()" flat @click="highlvldialog=true">Cast at higher level</v-btn>
    </v-snackbar>
    <!--End Out of Slots Snackbar-->
    <!--Start Concentrating Snackbar-->
    <v-snackbar
      color="red darken-3"
      v-model="concentrationSnackbar"
      :timeout="snackbarTimeout"> Concentrating on {{concentrationSpell}}
      <v-btn flat @click="concentrating=false; concentrationSpell=''; castSpell(); concentrationSnackbar=false">Cast Anyway</v-btn>
    </v-snackbar>
    <!--End Concentrating Snackbar-->
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
          <v-btn @click="castSpellAtHigherLevel(atHigherLevelSlot); highlvldialog=false" flat> Cast </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--End CastAtHigherLevel Dialog-->
    <!--Start Concentration Dialog-->
    <v-dialog v-model="concentrationDialog" max-width=300>
      <v-card>
        <v-card-text>
          <h2>Stop Concentrating on {{concentrationSpell}}?</h2>
        </v-card-text>
        <v-layout column>
        <v-btn @click="concentrationDialog = false; concentrating = false; concentrationSpell = '';" flat> Yes </v-btn>
        <v-btn @click="concentrationDialog = false;" flat> No </v-btn>
        </v-layout>
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
      stats: {
        STR: 10,
        DEX: 10,
        CON: 10,
        INT: 10,
        WIS: 10,
        CHR: 10
      },
      selectedStat: '',
      statsDialog: false,
      levelOpts: [],
      currSpellClasses: [],
      spellSearchDialogOpts: {Level: 'Level', School: 'School', Duration: 'Duration', SpellRange: 'Range', Components: 'Components'},
      spellInput: '',
      offsetDialog: false,
      offsetSlot: 0,
      concentrationSnackbar: false,
      concentrating: false,
      concentrationSpell: '',
      concentrationDialog: false,
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
      outOfSlotsSnackbar: false,
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
    spellStat (dc) {
      let stat = this.proficiencyBonus()
      if (this.classes.length === 1 && this.classes[0].class === 'Sorcerer') {
        stat += Math.floor(((this.stats.CHR) - 10) / 2) + 8
      } else {
        stat += Math.floor(((this.stats.INT) - 10) / 2) + 8
      }
      return stat
    },
    proficiencyBonus () {
      let totalLevel = 0
      for (let c in this.classes) {
        totalLevel += this.classes[c].level
      }
      return Math.floor(totalLevel / 5) + 2
    },
    haveSlotsAboveLevel () {
      for (let i = this.currSpellInfo.Level; i < this.spellSlots.length; i++) {
        if (this.spellSlots[i].slot > 0) {
          return true
        }
      }
      return false
    },
    rollStat () {
      let rolls = []
      for (let i = 0; i < 4; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1)
      }
      rolls.splice(rolls.indexOf(Math.min(rolls)), 1)
      let getsum = (total, num) => { return total + num }
      return rolls.reduce(getsum)
    },
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
    launchOffsetter (slot) {
      this.offsetSlot = slot
      this.offsetDialog = true
    },
    getSpellInfo (spellName, decrement) {
      if (spellName === this.currSpellInfo.Name) {
        if (decrement) {
          this.decrement(this.spellSlots[this.currSpellInfo.Level - 1])
          this.dialog = false
        }
        return
      }
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
    castSpellAtHigherLevel (slot) {
      if (this.currSpellInfo.hasOwnProperty('Concentration') && this.currSpellInfo.Concentration) {
        this.concentrating = true
        this.concentrationSpell = this.currSpellInfo.Name
      }
      this.decrement(slot)
      this.highlvldialog = false
      this.outOfSlotsSnackbar = false
    },
    castSpell () {
      if (this.spellSlots[this.currSpellInfo.Level - 1].slot === 0) {
        this.outOfSlotsSnackbar = true
        return
      }
      if (this.currSpellInfo.hasOwnProperty('Concentration') && this.currSpellInfo.Concentration) {
        if (this.concentrating) {
          this.concentrationSnackbar = true
          return
        }
        this.concentrating = true
        this.concentrationSpell = this.currSpellInfo.Name
      }
      if (this.currSpellInfo.Level === 0) {
        this.dialog = false
        return
      }
      this.decrement(this.spellSlots[this.currSpellInfo.Level - 1])
      this.dialog = false
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