<template>
  <div>
    <v-layout align-start justify-center column fill-height m-3>
      <h3>Spell Atk Mod : d20 + {{spellMod}} </h3>
      <h3>Spell Save DC : {{8 + spellMod}} </h3>
    </v-layout>
    <spell-slots :charIndex="charIndex" :classIndex="classIndex"> </spell-slots>
  </div>
</template>

<script>
import SpellSlots from '@/components/SpellSlots'
export default {
  props: ['charIndex', 'classIndex'],
  components: {
    'spell-slots': SpellSlots
  },
  computed: {
    character () {
      return this.$store.state.characters[this.charIndex]
    },
    classItem () {
      return this.character.classes[this.classIndex]
    },
    spellMod () {
      let mod = this.getMod(this.$store.state.characters[this.charIndex].abilityScores.INT)
      if (this.chrClasses.includes(this.classItem.classname)) {
        mod = this.getMod(this.$store.state.characters[this.charIndex].abilityScores.CHR)
      } else if (this.wisClasses.includes(this.classItem.classname)) {
        mod = this.getMod(this.$store.state.characters[this.charIndex].abilityScores.WIS)
      }
      return this.character.proficiency + mod
    }
  },
  data () {
    return {
      chrClasses: ['Bard', 'Sorcerer', 'Paladin', 'Warlock'],
      wisClasses: ['Cleric', 'Druid', 'Ranger']
    }
  },
  methods: {
    getMod (val) {
      return Math.floor((val - 10) / 2)
    }
  }
}
</script>

