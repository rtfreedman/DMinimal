<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>CAST {{ spellClass.className.toUpperCase() }} SPELL</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="close">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
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
      <v-layout
        mb-3
        align-center
        justify-space-between
      >
        <v-autocomplete
          label="Spell"
          v-model="spellInput"
          :items="spellItems"
          style="max-width: 500px"
          @input="handleSelect"
        />
        <v-select
          v-if="spellInput"
          v-model="selectedLevel"
          label="Cast At Level"
          style="max-width: 120px"
          class="ml-5"
          :disabled="!slotsAvailable"
          :items="levelOptions"
          :hint="!slotsAvailable ? 'NO SLOT AVAILBLE' : ''"
          persistent-hint
        ></v-select>
        <v-btn
          v-if="spellInput"
          class="ml-5 mr-0"
          color="primary"
          outline
          :disabled="!slotsAvailable"
          @click="castSpell()"
        >CAST SPELL</v-btn>
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
          column
        >
          <v-layout class="text-xs-right">
            <v-flex xs6 py-1>{{ key }}</v-flex>
            <v-divider vertical class="mx-3"></v-divider>
            <v-flex
              class="text-xs-left"
              xs6
              py-1
              v-if="key === 'Concentration'"
            >{{ currentSpellInfo.Concentration ? 'Required' : 'Not Required' }}</v-flex>
            <v-flex
              xs6
              py-1
              class="text-xs-left"
              v-else-if="key === 'Classes'"
            >{{ currentSpellInfo[key].join(", ") }}</v-flex>
            <v-flex
              xs6
              py-1
              class="text-xs-left"
              v-else
            >{{ currentSpellInfo[key] }}</v-flex>
          </v-layout>
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
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { chrClasses, wisClasses } from '../common/constants'

export default {
  props: ['character', 'spellClass'],

  computed: {
    ...mapGetters([
      'spellOptions',
      'magicClassOptions',
      'currentSpellInfo',
      'currentSpellClass',
      'currentSpellKeys',
    ]),

    // should put this on the model
    proficiencyBonus() {
      let totalLevel = 0
      this.character.classes.forEach(c => {
        totalLevel += c.level
      })
      return Math.floor(totalLevel / 5) + 2
    },

    spellModifier() {
      let modifier = this.character.getModifier('INT')
      if (chrClasses.includes(this.spellClass.className)) {
        modifier = this.character.getModifier('CHR')
      } else if (wisClasses.includes(this.spellClass.className)) {
        modifier = this.character.getModifier('WIS')
      }
      return this.proficiencyBonus + modifier
    },

    spellSaveDifficultyClass() {
      return this.spellModifier + 8
    },

    spellItems() {
      return this.spellOptions.map(s => ({
        text: `${s.name} (Level ${s.level})`,
        value: s.name,
      }))
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
      spellInput: null,
      snackbarMessage: '',
      showSnackbar: false,
      slotsAvailable: false,
    }
  },

  created() {
    this.dispatchRetrieveSpells({
      spellClass: this.spellClass.className,
    })
  },

  methods: {
    ...mapActions(['dispatchRetrieveSpellInfo', 'dispatchRetrieveSpells']),

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

    close() {
      this.selectedLevel = null
      this.spellInput = ''
      this.slotsAvailable = false
      this.$emit('close')
    },
  },

  watch: {
    levelOptions(state) {
      if (state.length) {
        this.selectedLevel = Math.min(...state)
        this.slotsAvailable = true
      } else {
        this.slotsAvailable = false
      }
    },
  },
}
</script>
