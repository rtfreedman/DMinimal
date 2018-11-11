<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>CAST {{ spellClass.className.toUpperCase() }} SPELL</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
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
        :mb-3="!slotsAvailable"
        align-center
        justify-space-between
      >
        <v-autocomplete
          label="Spell"
          v-model="castSpellState.spell"
          :items="spellItems"
          style="max-width: 500px"
          @input="handleSelect"
        />
        <v-select
          v-if="castSpellState.spell"
          v-model="castSpellState.level"
          label="Cast At Level"
          style="max-width: 120px"
          class="ml-5"
          :disabled="!slotsAvailable"
          :items="levelOptions"
          :hint="!slotsAvailable ? 'NO SLOT AVAILBLE' : ''"
          persistent-hint
        ></v-select>
        <v-btn
          v-if="castSpellState.spell"
          class="ml-5 mr-0"
          color="primary"
          outline
          :disabled="!slotsAvailable"
          @click="castSpell"
        >CAST SPELL</v-btn>
      </v-layout>
      <!-- concentration requirement -->
      <h3
        class="text mb-3 error--text"
        v-if="slotsAvailable && character.concentratingOn && currentSpellInfo.Concentration"
      >This spell requires concentration, but this character is already concentrating on {{ character.concentratingOn }}. Inform the player that their current spell will be interrupted.</h3>
      <!-- information about the current spell -->
      <v-layout
        v-if="castSpellState.spell && currentSpellInfo.Name"
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
            <v-flex xs6 py-1 :class="{'primary--text': atHigherLevel && key === 'Higher Level Bonus'}">{{ key }}</v-flex>
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
              :class="{'primary--text': atHigherLevel && key === 'Higher Level Bonus'}"
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
  props: ['character', 'spellClassIndex', 'castSpellState'],

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

    spellClass() {
      return this.character.classes[this.spellClassIndex]
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

    atHigherLevel() {
      if (this.currentSpellInfo && this.castSpellState) {
        return this.currentSpellInfo.Level < this.castSpellState.level
      }
    },
  },

  data() {
    return {
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
    ...mapActions([
      'dispatchRetrieveSpellInfo',
      'dispatchRetrieveSpells',
      'dispatchCastSpell',
    ]),

    handleSelect(spell) {
      this.dispatchRetrieveSpellInfo({ spell })
    },

    castSpell() {
      this.dispatchCastSpell({
        character: this.character,
        classIndex: this.spellClassIndex,
        slot: this.castSpellState.level,
        spellInfo: this.currentSpellInfo,
      })
      this.$emit('close')
    },
  },

  watch: {
    levelOptions(state) {
      if (state.length) {
        this.castSpellState.level = Math.min(...state)
        this.slotsAvailable = true
      } else {
        this.slotsAvailable = false
      }
    },
  },
}
</script>
