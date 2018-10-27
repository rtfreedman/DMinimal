<template>
  <v-layout
    align-center
    justify-space-around
    grid-list-xs
  >
    <div
      v-for="(slot, level) in characterClass.workingSlots"
      :key="level"
    >
      <v-layout
        align-center
        justify-center
        column
      >
        <v-btn
          flat
          @click="increment(level)"
          color="yellow"
        >+</v-btn>
        <span>{{ slot }}</span>
        <v-btn
          flat
          @click="decrement(level)"
          color="yellow"
        >-</v-btn>
        <h4 class="lvl">Lv {{level}}</h4>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>
export default {
  props: ['character', 'characterClass'],
  methods: {
    increment(level) {
      // this.$store.commit('incrementSlot', {
      //   charIndex: this.charIndex,
      //   classIndex: this.classIndex,
      //   level,
      // })
    },
    decrement(level) {
      // this.$store.commit('decrementSlot', {
      //   charIndex: this.charIndex,
      //   classIndex: this.classIndex,
      //   level,
      // })
    },
  },
}
</script>

<style>
h4.lvl {
  color: grey;
}
</style>
