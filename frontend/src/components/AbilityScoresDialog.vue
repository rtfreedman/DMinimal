<template>
  <v-card>
    <v-toolbar card light style="background-color: #ffd700">
      <h3>ABILITY SCORES</h3>
      <v-spacer></v-spacer>
      <v-btn icon flat>
        <v-icon @click="$emit('close')">close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-layout class="text-xs-center">
        <v-layout column class="bold">
          <v-divider style="margin-top: 30px"></v-divider>
          <v-layout style="min-height: 30px" justify-end align-center my-2>
            <span class="mr-3" style="padding-top: 2px">BASE</span>
          </v-layout>
          <v-layout style="min-height: 30px" justify-end align-center my-2>
            <span class="mr-3">CUSTOM</span>
          </v-layout>
          <v-layout style="min-height: 30px" justify-end align-center my-2>
            <span class="mr-3">TOTAL</span>
          </v-layout>
          <v-layout style="min-height: 30px" justify-end align-center my-2>
            <span class="mr-3">MODIFIER</span>
          </v-layout>
          <v-layout style="min-height: 30px" justify-end align-center my-2>
            <v-tooltip bottom>
              <v-btn
                class="my-0"
                icon
                small
                flat
                slot="activator"
                color="primary"
                @click="rollStats"
              >
                <v-icon>mdi-dice-multiple</v-icon>
              </v-btn>
              <span>ROLL ABILITIES</span>
            </v-tooltip>
            <span class="mr-3">DICE</span>
          </v-layout>
        </v-layout>
        <v-divider vertical></v-divider>
        <v-layout column v-for="stat in statNames" :key="stat">
          <v-layout justify-center align-center class="bold" style="min-height: 30px">{{ stat }}</v-layout>
          <v-divider></v-divider>
          <v-layout my-2 justify-center align-center style="min-height: 30px">
            <v-btn icon flat small color="primary" class="my-0" @click="decrementStat(stat)">
              <v-icon small>remove</v-icon>
            </v-btn>
            <h4 style="width: 20px">{{ character.abilityScores[stat] }}</h4>
            <v-btn color="primary" icon small flat class="my-0" @click="incrementStat(stat)">
              <v-icon small>add</v-icon>
            </v-btn>
          </v-layout>
          <v-layout style="min-height: 30px" my-2 align-center justify-center>
            <v-btn icon flat small class="my-0" color="primary" @click="decrementStatOffset(stat)">
              <v-icon small>remove</v-icon>
            </v-btn>
            <h4 style="width: 20px">{{ character.customAbilityOffsets[stat] }}</h4>
            <v-btn color="primary" icon small class="my-0" flat @click="incrementStatOffset(stat)">
              <v-icon small>add</v-icon>
            </v-btn>
          </v-layout>
          <v-layout style="min-height: 30px" justify-center align-center my-2>
            <h4>{{ character.abilityScores[stat] + character.customAbilityOffsets[stat] }}</h4>
          </v-layout>
          <v-layout style="min-height: 30px" justify-center align-center my-2>
            <h4>{{ character.getModifier(stat) >= 0 ? "+" : "-" }}{{ Math.abs(character.getModifier(stat)) }}</h4>
          </v-layout>
          <v-layout style="min-height: 30px" justify-center align-center my-2>
            <div style="height: 28px">
              <v-icon v-for="(val, index) in diceResult[stat]" :key="index">{{ val }}</v-icon>
              <v-icon color="grey darken-1">{{ droppedDice[stat] }}</v-icon>
            </div>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
import { rollNdS } from '../common/functions'
import { statNames } from '../common/constants'

export default {
  name: 'abilityScoresDialog',

  props: ['character'],

  data() {
    return {
      diceResult: {},
      droppedDice: {},
      statNames,
    }
  },

  methods: {
    ...mapActions(['characterAction']),

    decrementStat(stat) {
      this.characterAction({
        character: this.character,
        method: 'setStat',
        args: [stat, this.character.abilityScores[stat] - 1],
      })
    },

    incrementStat(stat) {
      this.characterAction({
        character: this.character,
        method: 'setStat',
        args: [stat, this.character.abilityScores[stat] + 1],
      })
    },

    decrementStatOffset(stat) {
      this.characterAction({
        character: this.character,
        method: 'setStatOffset',
        args: [stat, this.character.customAbilityOffsets[stat] - 1],
      })
    },

    incrementStatOffset(stat) {
      this.characterAction({
        character: this.character,
        method: 'setStatOffset',
        args: [stat, this.character.customAbilityOffsets[stat] + 1],
      })
    },

    rollStat(stat) {
      const rolls = []
      for (let i = 0; i < 4; i++) {
        rolls.push(rollNdS(1, 6))
      }
      Vue.set(this.droppedDice, stat, 'mdi-dice-' + Math.min(...rolls))
      rolls.splice(rolls.indexOf(Math.min(...rolls)), 1)
      const value = rolls.reduce((acc, n) => acc + n)
      this.characterAction({
        character: this.character,
        method: 'setStat',
        args: [stat, value],
      })
      Vue.set(this.diceResult, stat, rolls.map(v => 'mdi-dice-' + v))
    },

    rollStats() {
      statNames.forEach(s => {
        this.rollStat(s)
      })
    },
  },
}
</script>

<style>
.bold {
  font-weight: bold;
}
</style>
