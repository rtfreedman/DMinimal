<template>
  <v-card>
    <!-- title and close -->
    <v-layout align-center justify-space-between>
      <h1
        class="px-3 pt-2"
      >CAST {{ spellClass.name.toUpperCase() }} SPELL</h1>
      <v-btn icon flat @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-layout>
    <!-- useful spell information -->
    <v-card-text>
      <v-layout column mb-2>
        <h3>
          SPELL ATTACK MODIFIER: d20
          <span
            v-if="spellModifier >= 0"
          >+</span>
          {{ spellModifier }}
        </h3>
        <h3>SPELL SAVE DIFFICULTY CLASS: {{ spellSaveDifficultyClass }}</h3>
      </v-layout>
      <!-- select spell and level -->
      <v-layout>
        <v-autocomplete
          label="Spell"
          v-model="spellInput"
          :items="spells"
          @input="handleSelect"
        />
        <v-spacer></v-spacer>
        <v-select
          v-if="spellInput"
          v-model="selectedLevel"
          label="Cast At Level"
          style="max-width: 120px"
          :items="levelOptions"
          hide-details
        ></v-select>
      </v-layout>
      <!-- information about the current spell -->
      <v-layout
        v-if="currentSpellInfo.Name"
        class="border-primary"
        column
        pa-3
      >
        <v-layout
          v-if="key !== 'Description' && key !== 'Name'"
          v-for="key in currentSpellKeys"
          :key="key"
        >
          <v-flex xs4>{{ key }}</v-flex>
          <v-flex
            v-if="key === 'Concentration'"
            xs8
          >{{ currentSpellInfo.Concentration ? 'Required' : 'Not Required' }}</v-flex>
          <v-flex
            v-else-if="key === 'Classes'"
            xs8
          >{{ currentSpellInfo[key].join(", ") }}</v-flex>
          <v-flex
            xs8
            v-else
          >{{ currentSpellInfo[key] }}</v-flex>
        </v-layout>
        <v-divider
          color="#ffd700"
          class="mx-3 mt-3"
        ></v-divider>
        <h3 class="text-xs-center">DESCRIPTION</h3>
        <v-divider
          color="#ffd700"
          class="mx-3 mb-3"
        ></v-divider>
        <v-layout>{{ currentSpellInfo.Description || 'No description available for this spell.' }}</v-layout>
      </v-layout>
    </v-card-text>
    <!-- actions -->
    <v-layout
      v-if="currentSpellInfo.Name"
      justify-end
      mx-2
    >
      <v-btn
        color="primary"
        flat
        @click="castSpell()"
      >Cast</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { chrClasses, wisClasses } from '../common/constants'

export default {
  props: ['character', 'spellClass'],

  computed: {
    ...mapGetters([
      'spells',
      'magicClassOptions',
      'currentSpellInfo',
      'currentSpellClass',
      'currentSpellKeys',
    ]),

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

    levelOptions() {
      const levelOptions = []
      Object.keys(this.spellClass.workingSlots).forEach(level => {
        const slots = this.spellClass.workingSlots[level]
        if (slots > 0 && parseInt(level, 10) >= this.currentSpellInfo.Level) {
          levelOptions.push(parseInt(level, 10))
        }
      })
      return levelOptions
    },
  },

  data() {
    return {
      selectedLevel: null,
      spellInput: '',
      snackbarMessage: '',
      showSnackbar: false,
    }
  },

  created() {
    this.dispatchRetrieveSpells({
      spellClass: this.spellClass.name,
    })
  },

  methods: {
    ...mapActions(['dispatchRetrieveSpellInfo', 'dispatchRetrieveSpells']),

    getModifier(val) {
      return Math.floor((val - 10) / 2)
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
      if (
        this.spellClass.workingSlots[this.currSpellInfo.Level.toString()] !== 0
      ) {
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
        if (this.spellCast.workingSlots[i.toString()] > 0) {
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

    castSpellAtLvl(level) {
      this.$store.commit('decrementSlot', {
        charIndex: this.charIndex,
        classIndex: this.selectedClassIndex,
        level,
      })
      this.$emit('castSpellAtLevel', {})
    },

    handleSelect(spell) {
      this.dispatchRetrieveSpellInfo({ spell })
    },
  },

  watch: {
    levelOptions(state) {
      if (state.length) {
        this.selectedLevel = Math.min(...state)
      }
    },
  },
}
</script>
