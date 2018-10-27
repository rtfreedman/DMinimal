<template>
  <v-layout align-center>
    <v-tooltip top>
      <v-btn icon slot="activator" @click="rollInitiative()">
        <v-icon>mdi-dice-multiple</v-icon>
      </v-btn>
      <span>Roll Initiative!</span>
    </v-tooltip>
    <!-- Initiative v-model'd input -->
    <!-- <v-text-field reverse placeholder="Initiative" :rules="[validate]" v-model="initiative" solo light></v-text-field> -->
    <h4>INITIATIVE:</h4>
    <div style="width: 36px; border: 1px solid white;" class="text-xs-center ml-2">
      <h3>{{ initiative || '?' }}</h3>
    </div>
    <!-- Conditional clear button -->
    <v-btn v-if="initiative" icon @click="clearInitiative()">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'initiative',
  props: ['charIndex'],
  computed: {
    character() {
      return this.$store.state.characters[this.charIndex]
    },
    initiative: {
      get() {
        return this.character.initiative
      },
      set(val) {
        if (this.validate(val) !== true) {
          return
        }
        let newInitiative = null
        if (val !== null) {
          newInitiative = parseInt(val)
        }
        this.$store.commit('setInitiative', {
          charIndex: this.charIndex,
          initiative: newInitiative,
        })
      },
    },
  },
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
      this.initiative =
        Math.floor((this.character.abilityScores.DEX - 10) / 2) +
        Math.floor(Math.random() * 20) +
        1
    },
    clearInitiative() {
      this.initiative = null
    },
  },
}
</script>
