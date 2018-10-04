<template>
  <v-layout align-center justify-space-around row grid-list-xs>
    <div v-for="(slot, level) in spellSlots" :key="level">
      <v-layout align-center justify-center column>
      <v-btn flat @click="increment(level)" color="yellow">+</v-btn>
      <span> {{slot}} </span>
      <v-btn flat @click="decrement(level)" color="yellow">-</v-btn>
      <h4 class="lvl"> Lv {{level}} </h4>
      </v-layout>
    </div>
    {{internalSlots}}
  </v-layout>
</template>
<script>
export default {
  props: ['charIndex', 'classIndex'],
  computed: {
    character () {
      return this.$store.state.characters[this.charIndex]
    },
    classItem () {
      return this.character.classes[this.classIndex]
    },
    spellSlots () {
      return this.classItem.slots
    }
  },
  data () {
    return {
      internalSlots: []
    }
  },
  methods: {
    increment (level) {
      console.log(level)
    },
    decrement (level) {
      console.log(level)
    },
    launchOffsetter (level) {
      console.log(level)
    }
  }
}
</script>

<style>
h4.lvl {
  color: grey
}
</style>
