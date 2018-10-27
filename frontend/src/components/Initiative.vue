<template>
  <v-layout>
    <v-text-field
      v-model="character.initiative"
      clearable
      outline
      class="ml-3"
      append-icon="mdi-dice-multiple"
      @click:append="rollInitiative"
      label="Initiative"
      style="max-width: 170px"
      hide-details
    />
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
  },
}
</script>
