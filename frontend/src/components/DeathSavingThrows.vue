<template>
  <v-flex xs4>
    <v-layout column ma-3>
      <v-layout row align-center>
        <v-slider
          v-model="lifeThrows"
          color="yellow"
          step="1"
          min="0"
          max="3"
          persistent-hint
          hint="Success"
          ticks
          tick-size="2"
        />
        <v-flex xs1>
          <v-spacer/>
        </v-flex>
        <span v-if="lifeThrows < 3">{{lifeThrows}}</span>
        <span>
          <v-icon v-if="lifeThrows === 3">mdi-lifebuoy</v-icon>
        </span>
      </v-layout>
      <v-layout row align-center>
        <v-slider
          v-model="deathThrows"
          color="black"
          step="1"
          min="0"
          max="3"
          persistent-hint
          hint="Failures"
          ticks
          tick-size="2"
        />
        <v-flex xs1>
          <v-spacer/>
        </v-flex>
        <span v-if="deathThrows < 3">{{deathThrows}}</span>
        <span>
          <v-icon v-if="deathThrows === 3">mdi-skull</v-icon>
        </span>
      </v-layout>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: 'DeathSavingThrows', // too verbose?
  props: ['charIndex'],
  computed: {
    character() {
      return this.$store.state.characters[this.charIndex]
    },
    deathThrows: {
      get() {
        return this.character.deathThrows
      },
      set(val) {
        this.$store.commit('setDeathThrows', {
          charIndex: this.charIndex,
          throwVal: val,
        })
      },
    },
    lifeThrows: {
      get() {
        return this.character.lifeThrows
      },
      set(val) {
        this.$store.commit('setLifeThrows', {
          charIndex: this.charIndex,
          throwVal: val,
        })
      },
    },
  },
}
</script>
