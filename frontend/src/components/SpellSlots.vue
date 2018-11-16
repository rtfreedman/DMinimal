<template>
  <v-layout column>
    <v-divider color="#ffd700"></v-divider>
    <h3 class="text-xs-center my-1">SPELL SLOTS</h3>
    <v-divider color="#ffd700" class="mb-1"></v-divider>
    <v-layout align-center justify-space-around px-2 pt-1>
      <div v-for="(value, slot) in characterClass.workingSlots" :key="slot">
        <v-layout align-center justify-center column>
          <h4 class="lvl">LVL {{ slot }}</h4>
          <v-btn flat small icon @click="incrementSlot(slot)" color="primary">
            <v-icon>expand_less</v-icon>
          </v-btn>
          <h3>{{ value }}</h3>
          <v-btn flat small icon @click="decrementSlot(slot)" color="primary">
            <v-icon>expand_more</v-icon>
          </v-btn>
        </v-layout>
      </div>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['character', 'characterClass', 'classIndex'],
  methods: {
    ...mapActions(['characterAction']),

    incrementSlot(slot) {
      this.characterAction({
        character: this.character,
        method: 'setSlot',
        args: [
          this.classIndex,
          slot,
          this.characterClass.workingSlots[slot] + 1,
        ],
      })
    },

    decrementSlot(slot) {
      if (this.characterClass.workingSlots[slot] > 0) {
        this.characterAction({
          character: this.character,
          method: 'setSlot',
          args: [
            this.classIndex,
            slot,
            this.characterClass.workingSlots[slot] - 1,
          ],
        })
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
