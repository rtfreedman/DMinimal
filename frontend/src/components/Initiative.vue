<template>
  <v-layout column ml-3 style="max-width: 150px">
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
    <v-autocomplete
      class="border-primary align-center"
      solo
      flat
      :items="initiativeRange"
      v-model="initiative"
      clearable
      @change="setInitiative({ character, initiative })"
      style="width: 120px; height: 60px; font-size: 28px; font-weight: bold;"
      hide-details
    />
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { oneToN, rollNdS } from '../common/functions'

export default {
  name: 'initiative',

  props: ['character'],

  data() {
    return {
      initiative: this.character.initiative,
      initiativeRange: oneToN(50),
    }
  },

  methods: {
    ...mapActions(['setInitiative']),

    rollInitiative() {
      this.initiative = this.character.getModifier('DEX') + rollNdS(1, 20)
      this.setInitiative({
        character: this.character,
        initiative: this.initiative,
      })
    },
  },
}
</script>
