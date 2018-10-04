<template>
  <div>
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
    }
  }
}
</script>

