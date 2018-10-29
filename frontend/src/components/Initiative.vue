<template>
  <v-layout column mx-3 style="max-width: 150px">
    <v-layout align-center>
      <h3>INITIATIVE</h3>
      <v-tooltip bottom>
        <v-btn
          icon
          flat
          slot="activator"
          color="primary"
          @click="rollInitiative"
        >
          <v-icon>mdi-dice-multiple</v-icon>
        </v-btn>
        <span>ROLL INITIATIVE</span>
      </v-tooltip>
    </v-layout>
    <v-select
      class="border-primary"
      solo
      flat
      :items="oneToTwenty"
      v-model="character.initiative"
      clearable
      @change="fixTabWidth"
      @click:prepend-inner="rollInitiative"
      style="width: 120px; font-size: 28px; font-weight: bold;"
      hide-details
    />
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'
import { oneToTwenty, roll } from '../common/functions'

export default {
  name: 'initiative',

  props: ['character'],

  data() {
    return {
      oneToTwenty: oneToTwenty(),
    }
  },

  methods: {
    ...mapMutations(['triggerChangeDetection']),

    rollInitiative() {
      const dexModifier = Math.floor(
        (this.character.abilityScores.DEX - 10) / 2,
      )
      this.character.initiative = dexModifier + roll(20)
      this.fixTabWidth()
    },

    fixTabWidth() {
      this.triggerChangeDetection()
      setImmediate(() => {
        this.triggerChangeDetection(true)
      })
    },
  },
}
</script>
