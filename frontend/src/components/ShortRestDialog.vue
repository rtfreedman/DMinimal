<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>SHORT REST</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <p>A short rest is a period of downtime, at least 1 hour long, during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds.</p>
      <p>A character can spend one or more hit dice at the end of a short rest, up to the character’s maximum number of hit dice, which is equal to the character’s level. For each hit die spent in this way, the player rolls the die and adds the character’s constitution modifier to it. The character regains hit points equal to the total. The player can decide to spend an additional hit die after each roll. A character regains some spent hit dice upon finishing a long rest.</p>
      <v-autocomplete
        label="Amount of HP to Recover"
        :items="options"
        v-model="recoveryHitPoints"
        style="max-width: 240px"
      />
      <v-layout>TBD: expend available hit dice</v-layout>
    </v-card-text>
    <v-layout justify-end pb-1>
      <v-btn
        flat
        color="primary"
        :disabled="!recoveryHitPoints"
        @click="shortRest"
      >TAKE REST</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { oneToN } from '../common/functions'

export default {
  props: ['character'],

  

  data() {
    return {
      options: oneToN(100),
      recoveryHitPoints: null,
    }
  },

  methods: {
    ...mapActions(['dispatchShortRest']),

    shortRest() {
      this.dispatchShortRest({
        character: this.character,
        recoveredHitPoints: this.recoveryHitPoints,
      })
      this.$emit('close')
      this.recoveryHitPoints = null
    },
  },
}
</script>

<style>
</style>
