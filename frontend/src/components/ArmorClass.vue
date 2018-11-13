<template>
  <v-layout
    column
    style="margin-top: 12px; max-width: 150px;"
  >
    <h3 style="margin-bottom: 12px">ARMOR CLASS</h3>
    <v-autocomplete
      class="border-primary"
      solo
      flat
      :items="armorClassRange"
      v-model="armorClass"
      clearable
      @change="dispatchSetArmorClass({ character, armorClass })"
      style="width: 120px; font-size: 28px; font-weight: bold;"
      hide-details
    />
  </v-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { oneToN } from '../common/functions'

export default {
  name: 'armorClass',

  props: ['character'],

  data() {
    return {
      armorClass: this.character.armorClass,
      armorClassRange: oneToN(50),
    }
  },

  methods: {
    ...mapActions(['dispatchSetArmorClass']),
  },
}
</script>
