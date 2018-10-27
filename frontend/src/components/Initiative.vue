<template>
  <v-layout>
    <!-- <v-btn
      color="primary"
      flat
      icon
      @click="rollInitative"
    >
      <v-icon>mdi-dice-multiple</v-icon>
    </v-btn> -->
    <v-text-field
      v-model="character.iniative"
      clearable
      outline
      class="ml-2"
      append-icon="mdi-dice-multiple"
      :append-icon-cb="rollInitiative"
      label="Initiative"
      style="max-width: 170px"
      hide-details
    >{{ character.initiative || '?' }}</v-text-field>
    <!-- Conditional clear button -->
    <v-btn
      v-if="character.initiative"
      icon
      @click="clearInitiative()"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'initiative',
  props: ['character'],
  methods: {
    validate(val) {
      if (typeof val === 'string' && val.toLowerCase().includes('e')) {
        return 'Scientific notation not allowed'
      }
      if (val === null) {
        return true
      }
      if (isNaN(parseInt(val))) {
        return 'Input is not a number'
      }
      if (parseInt(val) < 0) {
        return 'No negative numbers'
      }
      return true
    },
    rollInitiative() {
      const value =
        Math.floor((this.character.abilityScores.DEX - 10) / 2) +
        Math.floor(Math.random() * 20) +
        1
      this.character.iniative = parseInt(value)
    },
    clearInitiative() {
      this.character.initiative = null
    },
  },
}
</script>
