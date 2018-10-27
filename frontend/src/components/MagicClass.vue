<template>
  <div>
    <v-layout
      align-start
      justify-center
      column
      fill-height
      m-3
    >
      <h3>
        SPELL ATTACK MODIFIER: d20
        <span
          v-if="spellModifier >= 0"
        >+</span>
        {{ spellModifier }}
      </h3>
      <h3>SPELL SAVE DIFFICULTY CLASS: {{ spellSaveDifficultyClass }}</h3>
    </v-layout>
    <app-spell-slots
      :character="character"
      :characterClass="characterClass"
    ></app-spell-slots>
  </div>
</template>

<script>
import { chrClasses, wisClasses } from '../common/constants'
import SpellSlots from '@/components/SpellSlots'

export default {
  props: ['character', 'characterClass'],
  components: {
    'app-spell-slots': SpellSlots,
  },

  computed: {
    spellModifier() {
      let modifier = this.getModifier(this.character.abilityScores.INT)
      if (chrClasses.includes(this.characterClass.name)) {
        modifier = this.getModifier(this.character.abilityScores.CHR)
      } else if (wisClasses.includes(this.characterClass.name)) {
        modifier = this.getModifier(this.character.abilityScores.WIS)
      }
      return this.character.proficiency + modifier
    },

    spellSaveDifficultyClass() {
      return this.spellModifier + 8
    },
  },

  methods: {
    getModifier(val) {
      return Math.floor((val - 10) / 2)
    },
  },
}
</script>
