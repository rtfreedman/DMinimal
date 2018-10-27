<template>
  <v-layout>
    <!-- <v-btn
      color="primary"
      flat
      icon
      @click="rollInitative"
    >
      <v-icon>mdi-dice-multiple</v-icon>
    </v-btn>-->
    {{ character.initiative }}
    <v-text-field
      v-model="character.initiative"
      clearable
      outline
      :rules="[mustBeNum, minNum]"
      class="ml-2"
      append-icon="mdi-dice-multiple"
      :append-icon-cb="rollInitiative"
      label="Initiative"
      style="max-width: 170px"
      hide-details
    >{{ character.initiative || '?' }}</v-text-field>
    <!-- Conditional clear button -->
  </v-layout>
</template>

<script>
export default {
  name: 'initiative',
  props: ['character'],
  methods: {
    rollInitiative() {
      console.log('da fuck')
      const value =
        Math.floor((this.character.abilityScores.DEX - 10) / 2) +
        Math.floor(Math.random() * 20) +
        1
      this.character.initiative = parseInt(value)
    },

    mustBeNum(val) {
      if (typeof val === 'string' && val.toLowerCase().includes('e')) {
        return 'Scientific notation not allowed'
      }
      if (isNaN(parseInt(val))) {
        return 'Input is not a number'
      }
      return true
    },
    minNum(val) {
      if (parseInt(val) < 0) {
        return 'No negative numbers'
      }
      return true
    },
  },
}
</script>
