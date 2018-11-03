<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>SPELL CONCENTRATION</h3>
    </v-toolbar>
    <v-card-text>Cease concentration on {{ character.concentratingOn }}?</v-card-text>
    <v-layout justify-end>
      <v-btn @click="$emit('close')" flat>No</v-btn>
      <v-btn
        @click="dispatchConcentrate({ character, spellName: '' }); $emit('close')"
        flat
        color="primary"
      >Yes</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['character'],

  methods: {
    ...mapActions(['dispatchConcentrate']),
  },
}
</script>
