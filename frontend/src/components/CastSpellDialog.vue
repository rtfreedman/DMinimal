<template>
  <v-card>
    <v-card-title class="headline">CAST SPELL</v-card-title>
    <v-card-text class="pt-0">
      <v-layout column>
        <h3>
          SPELL ATTACK MODIFIER: d20
          <span
            v-if="spellModifier >= 0"
          >+</span>
          {{ spellModifier }}
        </h3>
        <h3>SPELL SAVE DIFFICULTY CLASS: {{ spellSaveDifficultyClass }}</h3>
      </v-layout>
      <v-autocomplete
        v-model="spellInput"
        placeholder="Spell..."
        :search-input.sync="input"
        :items="spells"
      />
      <h1>{{ currentSpellInfo.Name }}</h1>
      <div
        v-if="currentSpellInfo.hasOwnProperty('Concentration')"
      >Concentration</div>
      <v-list dense>
        <v-list-tile
          v-if="currentSpellInfo.hasOwnProperty(elem)"
          v-for="(elem, text) in spellSearchDialogOpts"
          :key="elem"
        >
          <v-list-tile-content>
            <h3>{{ text }}:</h3>
          </v-list-tile-content>
          <v-list-tile-content
            class="align-end"
          >{{ currentSpellInfo[elem] }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="currentSpellInfo.hasOwnProperty('Classes')"
        >
          <v-list-tile-content>
            <h3>Classes:</h3>
          </v-list-tile-content>
          <v-list-tile-content
            v-if="currentSpellInfo.Classes"
            class="align-end"
          >{{ currentSpellInfo.Classes.join(", ") }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="currentSpellInfo.hasOwnProperty('AtHigherLevels') && currentSpellInfo.AtHigherLevels !== ''"
        >
          <v-list-tile-content>
            <h3>At Higher Levels:</h3>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="currentSpellInfo.hasOwnProperty('AtHigherLevels') && currentSpellInfo.AtHigherLevels !== ''"
        >
          <v-list-tile-content>{{ currentSpellInfo.AtHigherLevels }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="currentSpellInfo.hasOwnProperty('Description')"
        >
          <v-list-tile-content>
            <h3>Description:</h3>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile-content
          v-if="currentSpellInfo.hasOwnProperty('Description')"
        >{{ currentSpellInfo.Description }}</v-list-tile-content>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="red lighten-1"
        flat
        @click="showSearchDialog = false"
      >Close</v-btn>
      <v-btn
        color="green lighten-1"
        flat
        @click="castSpell()"
      >Cast</v-btn>
      <v-btn
        color="yellow darken-1"
        flat
        @click="showAtHigherLevelDialog = true"
      >At Higher Level</v-btn>
    </v-card-actions>
    <v-card v-if="showAtHigherLevelDialog">
      <v-layout
        column
        justify-center
        align-center
      >
        <h2>Cast at level...</h2>
        <v-btn
          flat
          v-for="(value, level) in character.workingSlots"
          v-if="value > 0 && parseInt(level, 10) > currentSpellInfo.Level"
          @click="castSpellAtLevel(parseInt(level, 10))"
          :key="level"
        >{{ level }}</v-btn>
      </v-layout>
      <v-btn
        flat
        @click="showAtHigherLevelDialog = false"
        color="red"
      >Close</v-btn>
    </v-card>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { chrClasses, wisClasses } from '../common/constants'

export default {
  props: ['character', 'spellClass'],

  computed: {
    ...mapGetters([
      'magicClassOptions',
      'spells',
      'currentSpellInfo',
      'currentSpellClass',
    ]),

    magicClasses() {
      return this.character.classes.filter(c =>
        this.magicClassOptions.includes(c.name),
      )
    },

    workingSlots() {
      return this.classItem.workingSlots
    },

    spellModifier() {
      let modifier = this.getModifier(this.character.abilityScores.INT)
      if (chrClasses.includes(this.spellClass.name)) {
        modifier = this.getModifier(this.character.abilityScores.CHR)
      } else if (wisClasses.includes(this.spellClass.name)) {
        modifier = this.getModifier(this.character.abilityScores.WIS)
      }
      return this.character.proficiency + modifier
    },

    spellSaveDifficultyClass() {
      return this.spellModifier + 8
    },
  },

  data() {
    return {
      // dialog visibility
      showClassDialog: true,
      showSearchDialog: false,
      showAtHigherLevelDialog: false,

      selectedClass: null,

      // why is this shameful?
      spellSearchDialogOpts: {
        Level: 'Level',
        School: 'School',
        Duration: 'Duration',
        SpellRange: 'Range',
        Components: 'Components',
      },

      classChoices: [],
      input: '',
      spellInput: '',
      snackbarMessage: '',
      snackbar: false,
    }
  },

  created() {
    this.retrieveSpells({
      spellClass: this.spellClass.name,
      filter: '',
    })
  },

  methods: {
    ...mapActions(['retrieveSpell', 'retrieveSpells']),

    getModifier(val) {
      return Math.floor((val - 10) / 2)
    },

    selectClass(cls) {
      this.selectedClass = cls
      this.showClassDialog = false
      this.retrieveSpells({
        spellClass: cls,
        filter: '',
      })
    },

    spellPreflight() {
      if (this.magicClasses.length > 1) {
        this.classChoices = this.magicClasses
        this.classChoiceDialog = true
      } else if (this.magicClasses.length === 1) {
        this.selectedClassIndex = 0
        this.spellSearchDialog = true
        this.fetchSpellOpts()
      } else {
        this.$store.commit('showSnackbar', {
          message: 'Cannot Cast Spells: No Magic Classes',
        })
      }
    },

    fetchSpellOpts() {
      this.retrieveSpells({
        filter: this.spellInput,
        className: this.selectedClass,
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
          classIndex: this.selectedClassIndex,
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
        classIndex: this.selectedClassIndex,
        level,
      })
      this.atHigherLevelDialog = false
      this.spellSearchDialog = false
    },
  },

  watch: {
    spellInput(val) {
      if (
        this.currSpellInfo.hasOwnProperty('Name') &&
        val === this.currSpellInfo.Name
      ) {
        return
      }
      this.retrieveSpellInfo()
    },
  },
}
</script>
