<template>
  <v-layout align-center justify-space-around pa-2>
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
          @click="increment(level)"
          color="yellow"
        >
          <v-icon>expand_less</v-icon>
        </v-btn>
        <h3>{{ slot }}</h3>
        <v-btn
          flat
          small
          icon
          @click="decrement(level)"
          color="yellow"
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
