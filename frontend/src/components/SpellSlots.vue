<template>
  <v-layout
    align-center
    justify-space-around
    pa-2
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
        <h4 class="lvl">LVL {{ level }}</h4>
        <v-btn
          flat
          small
          icon
          @click="incrementSlot(level)"
          color="primary"
        >
          <v-icon>expand_less</v-icon>
        </v-btn>
        <h3>{{ slot }}</h3>
        <v-btn
          flat
          small
          icon
          @click="decrementSlot(level)"
          color="primary"
        >
          <v-icon>expand_more</v-icon>
        </v-btn>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>
export default {
  props: ['character', 'characterClass'],
  methods: {
    incrementSlot(level) {
      this.characterClass.workingSlots[level]++
    },

    decrementSlot(level) {
      if (this.characterClass.workingSlots[level] > 0) {
        this.characterClass.workingSlots[level]--
      }
    },
  },
}
</script>

<style>
h4.lvl {
  color: grey;
}
</style>
