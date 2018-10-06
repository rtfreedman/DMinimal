<template>
  <div>
    <!-- Multiple Classes Dialog -->
    <v-dialog v-model="classChoiceDialog" max-width="300">
      <v-layout column align-center justify-center ma-2>
        <h2>Cast as which class?</h2>
        <v-btn @click="selectedClass = c; classChoiceDialog = false; fetchSpellOpts()" flat v-for="c in character.classes" :key="c.classname">{{c.classname}}</v-btn>
      </v-layout>
    </v-dialog>
    <!-- End Multiple Classes Dialog -->
    <v-dialog v-model="spellSearchDialog" max-width="800">
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
        <!-- <v-card-text>
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
        </v-card-text> -->
        <v-card-actions>
          <v-btn color="red lighten-1" flat @click="spellSearchDialog = false"> Close </v-btn>
          <v-btn color="green lighten-1" flat @click="castSpell()"> Cast </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['charIndex'],
  computed: {
    character () {
      return this.$store.state.characters[this.charIndex]
    },
    classItem () {
      return this.character.classes[this.selectedClass]
    },
    currSpellInfo () {
      return this.$store.state.spellsInfo.currSpellInfo
    },
    currSpellClass () {
      return this.$store.state.spellsInfo.className
    },
    magicClassOpts () {
      return this.$store.state.magicClassOpts
    },
    spellOpts () {
      return this.$store.state.spellsInfo.spellList
    }
  },
  data () {
    return {
      classChoiceDialog: false,
      spellSearchDialog: false,
      classChoices: [],
      input: '',
      spellInput: '',
      selectedClass: 0,
      snackbarMessage: '',
      snackbar: false
    }
  },
  watch: {
    spellInput () {
      // TODO
    }
  },
  methods: {
    spellPreflight () {
      let magicClasses = []
      for (let c in this.character.classes) {
        if (this.magicClassOpts.includes(this.character.classes[c].classname)) {
          magicClasses.push(c)
        }
      }
      if (magicClasses.length > 1) {
        this.classChoices = magicClasses
        this.classChoiceDialog = true
      } else if (magicClasses.length === 1) {
        this.selectedClass = magicClasses[0]
        this.spellSearchDialog = true
        this.fetchSpellOpts()
      } else {
        this.$store.commit('showSnackbar', {message: 'Cannot Cast Spells: No Magic Classes'})
      }
    },
    fetchSpellOpts () {
      if (this.currSpellClass === this.classItem.classname) {
        return
      }
      let strBody = JSON.stringify({
        classes: [this.classItem.classname],
        spellName: ''
      })
      let r = new Request('http://localhost:8010/magic/search/', {method: 'Post', body: strBody})
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
          className: this.classItem.classname
        })
        this.spellSearchDialog = true
      })
      .catch(error => {
        console.error(error)
      })
    }
  }
}
</script>

