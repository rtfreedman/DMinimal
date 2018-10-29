<template>
  <v-container pa-0>
    <!-- actions -->
    <v-toolbar color="secondary" flat>
      <v-tooltip bottom>
        <v-btn
          color="primary"
          icon
          flat
          slot="activator"
          @click="character.longRest()"
        >
          <v-icon>hotel</v-icon>
        </v-btn>
        <span>LONG REST</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          color="primary"
          icon
          flat
          slot="activator"
          @click="shortRest()"
        >
          <v-icon>restore</v-icon>
        </v-btn>
        <span>SHORT REST</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          :disabled="!character.concentrating"
          @click="showConcentrationDialog = true"
          color="primary"
          icon
          flat
          slot="activator"
        >
          <v-icon>remove_red_eye</v-icon>
        </v-btn>
        <span
          v-if="character.concentrating"
        >Concentrating on {{ character.concentrating }}</span>
        <span
          v-if="!character.concentrating || character.concentrating === ''"
        >Not currently concentrating</span>
      </v-tooltip>
    </v-toolbar>
    <!-- concentrating dialog -->
    <v-dialog
      v-model="showConcentrationDialog"
      max-width="300"
    >
      <v-card>
        <v-card-text>
          <h2>Stop Concentrating on {{ character.concentrating }}?</h2>
        </v-card-text>
        <v-layout column>
          <v-btn
            @click="showConcentrationDialog = false; stopConcentrating()"
            flat
            color="primary"
          >Yes</v-btn>
          <v-btn
            @click="showConcentrationDialog = false;"
            flat
            color="primary"
          >No</v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { hitDice } from '../common/constants'

export default {
  props: ['character'],

  data() {
    return {
      showConcentrationDialog: false,
      shortRestDie: {},
    }
  },

  methods: {
    resetCharacter() {
      for (const c in this.character.classes) {
        this.$store.commit('updateSlots', {
          charIndex: this.index,
          classIndex: c,
        })
      }
    },

    performShortRest() {
      let restoredHealth = 0
      for (const a in this.shortRestDie) {
        restoredHealth += Math.floor(Math.random() * this.shortRestDie[a])
      }
      this.character.hitPoints += restoredHealth
      this.$store.commit('hideSnackbar')
    },

    shortRest() {
      const acc = {}
      for (const c in this.character.classes) {
        if (
          hitDice.hasOwnProperty(this.character.classes[c].name.split(' ')[0])
        ) {
          continue
        }
        const hitDie = hitDice[this.character.classes[c].name.split(' ')[0]]
        if (!acc.hasOwnProperty(hitDie)) {
          acc[hitDie] = 0
        }
        acc[hitDie] += this.character.classes[c].level
      }
      let message = []
      this.shortRestDie = []
      for (const k in acc) {
        message.push(acc[k].toString() + 'd' + k.toString())
        this.shortRestDie.push.apply(
          this.shortRestDie,
          new Array(acc[k]).fill(k),
        )
      }
      message = 'Restore ' + message.join(', ')
      this.$store.commit('showSnackbar', {
        color: 'green',
        message,
        func: this.performShortRest,
        buttonMessage: 'Roll',
      })
    },

    stopConcentrating() {
      this.$store.commit('stopConcentrating', this.index)
    },
  },
}
</script>

<style>
</style>
