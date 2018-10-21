<template>
  <v-layout align-center justify-space-around row grid-list-xs>
    <div v-for="(slot, level) in workingSpellSlots" :key="level">
      <v-layout align-center justify-center column>
        <v-btn flat @click="increment(level)" color="yellow">+</v-btn>
        <span>{{slot}}</span>
        <v-btn flat @click="decrement(level)" color="yellow">-</v-btn>
        <h4 class="lvl">Lv {{level}}</h4>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>
export default {
  props: ['charIndex', 'classIndex'],
  computed: {
    character() {
      return this.$store.state.characters[this.charIndex]
    },
    classItem() {
      return this.character.classes[this.classIndex]
    },
    workingSpellSlots() {
      return this.classItem.workingSlots
    },
    totalSpellSlots() {
      return this.classItem.slots
    },
  },
  methods: {
    increment(level) {
      this.$store.commit('incrementSlot', {
        charIndex: this.charIndex,
        classIndex: this.classIndex,
        level,
      })
    },
    decrement(level) {
      this.$store.commit('decrementSlot', {
        charIndex: this.charIndex,
        classIndex: this.classIndex,
        level,
      })
    },
  },
}
</script>

<style>
h4.lvl {
  color: grey;
}
</style>
