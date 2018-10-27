<template>
  <div>
    <!-- Multiple Classes Dialog -->
    <v-dialog v-model="classChoiceDialog" max-width="300">
      <v-card>
        <v-layout column align-center justify-center ma-2>
          <h2>Cast as which class?</h2>
          <v-btn
            @click="selectedClass = index; classChoiceDialog = false; fetchSpellOpts()"
            flat
            v-for="(c, index) in character.classes"
            :key="c.classname"
          >{{c.classname}}</v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <!-- End Multiple Classes Dialog -->
    <v-dialog persistent v-model="spellSearchDialog" max-width="800">
      <v-card>
        <v-card-title class="headline">Find spell</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="spellInput"
            placeholder="Spell..."
            :search-input.sync="input"
            :items="spellOpts"
          />
        </v-card-text>
        <v-card-text>
          <h1>{{currSpellInfo.Name}}</h1>
          <div v-if="currSpellInfo.hasOwnProperty('Concentration')">Concentration</div>
          <v-list dense>
            <v-list-tile
              v-if="currSpellInfo.hasOwnProperty(elem)"
              v-for="(elem, text) in spellSearchDialogOpts"
              :key="elem"
            >
              <v-list-tile-content>
                <h3>{{text}}:</h3>
              </v-list-tile-content>
              <v-list-tile-content class="align-end">{{ currSpellInfo[elem] }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="currSpellInfo.hasOwnProperty('Classes')">
              <v-list-tile-content>
                <h3>Classes:</h3>
              </v-list-tile-content>
              <v-list-tile-content
                v-if="currSpellInfo.Classes"
                class="align-end"
              >{{ currSpellInfo.Classes.join(", ") }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-if="currSpellInfo.hasOwnProperty('AtHigherLevels') && currSpellInfo.AtHigherLevels !== ''"
            >
              <v-list-tile-content>
                <h3>At Higher Levels:</h3>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-if="currSpellInfo.hasOwnProperty('AtHigherLevels') && currSpellInfo.AtHigherLevels !== ''"
            >
              <v-list-tile-content>{{ currSpellInfo.AtHigherLevels }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="currSpellInfo.hasOwnProperty('Description')">
              <v-list-tile-content>
                <h3>Description:</h3>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile-content
              v-if="currSpellInfo.hasOwnProperty('Description')"
            >{{ currSpellInfo.Description }}</v-list-tile-content>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red lighten-1" flat @click="spellSearchDialog = false">Close</v-btn>
          <v-btn color="green lighten-1" flat @click="castSpell()">Cast</v-btn>
          <v-btn color="yellow darken-1" flat @click="atHigherLevelDialog=true">At Higher Level</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="atHigherLevelDialog" max-width="200">
      <v-card>
        <v-layout column justify-center align-center>
          <h2>Cast at level...</h2>
          <v-btn
            flat
            v-for="(value, level) in this.workingSlots"
            v-if="value > 0 && parseInt(level, 10) > currSpellInfo.Level"
            @click="castSpellAtLvl(parseInt(level, 10))"
            :key="level"
          >{{level}}</v-btn>
        </v-layout>
        <v-btn flat @click="atHigherLevelDialog=false" color="red">Close</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['charIndex'],
  computed: {
    character() {
      return this.$store.state.characters[this.charIndex]
    },
    classItem() {
      return this.character.classes[this.selectedClass]
    },
    concentrating() {
      return this.character.concentrating
    },
    currSpellInfo() {
      return this.$store.state.spellsInfo.currSpellInfo
    },
    currSpellClass() {
      return this.$store.state.spellsInfo.className
    },
    magicClassOpts() {
      return this.$store.state.magicClassOpts
    },
    spellOpts() {
      return this.$store.state.spellsInfo.spellList
    },
    workingSlots() {
      return this.classItem.workingSlots
    },
  },
  data() {
    return {
      spellSearchDialogOpts: {
        Level: 'Level',
        School: 'School',
        Duration: 'Duration',
        SpellRange: 'Range',
        Components: 'Components',
      }, // why is this shameful?
      classChoiceDialog: false,
      spellSearchDialog: false,
      atHigherLevelDialog: false,
      classChoices: [],
      input: '',
      spellInput: '',
      selectedClass: 0,
      snackbarMessage: '',
      snackbar: false,
    }
  },
  watch: {
    spellInput(val) {
      if (
        this.currSpellInfo.hasOwnProperty('Name') &&
        val === this.currSpellInfo.Name
      ) {
        return
      }
      const r = new Request('/api/magic/spell/' + val, {
        method: 'GET',
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
          this.$store.commit('setSpellInfo', response)
        })
        .catch(error => {
          console.error(error)
        })
    },
  },
  methods: {
    spellPreflight() {
      const magicClasses = []
      for (const c in this.character.classes) {
        if (this.magicClassOpts.includes(this.character.classes[c].classname)) {
          magicClasses.push(c)
        }
      }
      if (magicClasses.length > 1) {
        this.classChoices = magicClasses
        this.classChoiceDialog = true
      } else if (magicClasses.length === 1) {
        this.selectedClass = 0
        this.spellSearchDialog = true
        this.fetchSpellOpts()
      } else {
        this.$store.commit('showSnackbar', {
          message: 'Cannot Cast Spells: No Magic Classes',
        })
      }
    },
    fetchSpellOpts() {
      if (this.currSpellClass === this.classItem.classname) {
        return
      }
      const strBody = JSON.stringify({
        classes: [this.classItem.classname],
        spellName: '',
      })
      const r = new Request('/api/magic/search/', {
        method: 'Post',
        body: strBody,
      })
      let opts = []
      fetch(r)
        .then(response => {
          if (response.status === 200) {
            return response.json()
          } else {
            throw new Error('Something went wrong on api server!')
          }
        })
        .then(response => {
          opts = response.spellOpts
          this.$store.commit('setSpellOpts', {
            spellOpts: opts,
            className: this.classItem.classname,
          })
          this.spellSearchDialog = true
        })
        .catch(error => {
          console.error(error)
        })
    },
    stopConcentrating() {
      this.$store.commit('stopConcentrating', this.charIndex)
      this.$store.commit('hideSnackbar')
    },
    castSpell() {
      if (
        this.concentrating &&
        this.currSpellInfo.hasOwnProperty('Concentration')
      ) {
        // launch concentration snackbar
        this.$store.commit('showSnackbar', {
          message: 'Concentrating on ' + this.concentrating,
          func: this.stopConcentrating,
          buttonMessage: 'Stop Concentrating',
        })
        return
      }
      if (this.workingSlots[this.currSpellInfo.Level.toString()] !== 0) {
        this.$store.commit('decrementSlot', {
          charIndex: this.charIndex,
          classIndex: this.selectedClass,
          level: this.currSpellInfo.Level,
        })
        this.spellSearchDialog = false
        return
      }
      let slotsAvailable = false
      for (let i = this.currSpellInfo.Level + 1; i < 10; i++) {
        if (this.workingSlots[i.toString()] > 0) {
          slotsAvailable = true
          break
        }
      }
      const payload = {
        message: 'No slots available at spell level',
      }
      if (slotsAvailable) {
        payload['func'] = this.openAtHigherLevelDialog
        payload['buttonMessage'] = 'Cast at Higher Level?'
      }
      this.$store.commit('showSnackbar', payload)
    },
    openAtHigherLevelDialog() {
      this.atHigherLevelDialog = true
      this.$store.commit('hideSnackbar')
    },
    castSpellAtLvl(level) {
      this.$store.commit('decrementSlot', {
        charIndex: this.charIndex,
        classIndex: this.selectedClass,
        level,
      })
      this.atHigherLevelDialog = false
      this.spellSearchDialog = false
    },
  },
}
</script>
