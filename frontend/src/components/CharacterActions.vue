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
          @click="dispatchLongRest(character)"
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
          @click="showShortRestDialog = true"
        >
          <v-icon>restore</v-icon>
        </v-btn>
        <span>SHORT REST</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          :disabled="!character.concentratingOn"
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
    <!-- short rest dialog -->
    <v-dialog v-model="showShortRestDialog">
      <app-short-rest-dialog
        :character="character"
        @close="showShortRestDialog = false"
      />
    </v-dialog>
    <!-- concentrating dialog -->
    <v-dialog
      v-model="showConcentrationDialog"
      max-width="300"
    >
      <app-concentration-dialog
        :character="character"
        @close="showConcentrationDialog = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { hitDice } from '../common/constants'
import ShortRestDialog from './ShortRestDialog'
import ConcentrationDialog from './ConcentrationDialog'

export default {
  components: {
    'app-short-rest-dialog': ShortRestDialog,
    'app-concentration-dialog': ConcentrationDialog,
  },

  props: ['character'],

  data() {
    return {
      showConcentrationDialog: false,
      shortRestDie: {},
      showShortRestDialog: false,
    }
  },

  methods: {
    ...mapActions(['dispatchLongRest']),

    stopConcentrating() {
      this.$store.commit('stopConcentrating', this.index)
    },
  },
}
</script>

<style>
</style>
