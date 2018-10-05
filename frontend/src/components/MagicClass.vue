<template>
  <div>
    <spell-slots :charIndex="charIndex" :classIndex="classIndex"> </spell-slots>
    <spell-cast :charIndex="charIndex" :classIndex="classIndex"></spell-cast>
  </div>
</template>

<script>
import SpellSlots from '@/components/SpellSlots'
import SpellCast from '@/components/SpellCast'
export default {
  props: ['charIndex', 'classIndex'],
  components: {
    'spell-slots': SpellSlots,
    'spell-cast': SpellCast
  },
  computed: {
    character () {
      return this.$store.state.characters[this.charIndex]
    },
    classItem () {
      return this.character.classes[this.classIndex]
    }
  }
}
</script>

