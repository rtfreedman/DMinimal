<template>
  <v-layout column style="margin-top: 12px; max-width: 150px;">
    <h3 style="margin-bottom: 12px">SPEED</h3>
    <v-layout
      align-center
      justify-space-between
      class="border-primary text-xs-center"
      style="width: 118px; height: 50px; font-size: 28px; font-weight: bold;"
    >
      <template v-if="character.speed !== null">
        <v-btn flat small icon @click="decrementSpeed">
          <v-icon>expand_more</v-icon>
        </v-btn>
        <span>{{ character.speed }}</span>
        <v-btn flat small icon @click="incrementSpeed">
          <v-icon>expand_less</v-icon>
        </v-btn>
      </template>
    </v-layout>
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'speed',
  props: ['character'],
  methods: {
    ...mapActions(['characterAction']),

    decrementSpeed() {
      this.characterAction({
        character: this.character,
        method: 'setSpeed',
        args: [this.character.speed - 1],
      })
    },

    incrementSpeed() {
      this.chracterAction({
        character: this.character,
        method: 'setSpeed',
        args: [this.character.speed + 1],
      })
    },
  },
}
</script>
