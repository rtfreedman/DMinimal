<template>
  <v-card>
    <v-toolbar
      card
      light
      style="background-color: #ffd700"
    >
      <h3>ABILITY SCORES</h3>
      <v-spacer></v-spacer>
      <v-btn icon flat>
        <v-icon @click="$emit('close')">close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-layout column class="text-xs-center">
        <v-layout align-center>
          <v-flex style="max-width: 70px"></v-flex>
          <v-flex style="max-width: 130px">
            <h3 class="monospace">BASE</h3>
          </v-flex>
          <v-flex style="max-width: 30px"></v-flex>
          <v-flex style="max-width: 130px">
            <h3 class="monospace">CUSTOM</h3>
          </v-flex>
          <v-flex style="max-width: 30px"></v-flex>
          <v-flex style="max-width: 130px">
            <h3 class="monospace">TOTAL</h3>
          </v-flex>
          <v-flex style="max-width: 30px"></v-flex>
          <v-flex style="max-width: 130px">
            <h3 class="monospace">MODIFIER</h3>
          </v-flex>
          <v-flex class="text-xs-center">
            <v-tooltip bottom>
              <v-btn
                icon
                flat
                slot="activator"
                color="primary"
                class="mr-0"
                @click="rollStats"
              >
                <v-icon>mdi-dice-multiple</v-icon>
              </v-btn>
              <span>ROLL ABILITIES</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout
          align-center
          v-for="(value, stat) in character.abilityScores"
          :key="stat"
        >
          <v-flex
            style="max-width: 70px"
            class="text-xs-left"
          >
            <h3
              class="text-xs-center monospace"
            >{{ stat }}</h3>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex style="max-width: 50px">
            <v-btn
              icon
              flat
              color="primary"
              @click="dispatchSetStat({ character, stat, value: character.abilityScores[stat] - 1 })"
            >
              <v-icon small>remove</v-icon>
            </v-btn>
          </v-flex>
          <v-flex style="max-width: 30px">
            <h2>{{ value }}</h2>
          </v-flex>
          <v-flex style="max-width: 50px">
            <v-btn
              color="primary"
              icon
              flat
              @click="dispatchSetStat({ character, stat, value: character.abilityScores[stat] + 1 })"
            >
              <v-icon small>add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex style="max-width: 30px"></v-flex>
          <v-flex style="max-width: 50px">
            <v-btn
              icon
              flat
              color="primary"
              @click="dispatchSetStatOffset({ character, stat, value: character.customAbilityOffsets[stat] - 1 })"
            >
              <v-icon small>remove</v-icon>
            </v-btn>
          </v-flex>
          <v-flex style="max-width: 30px">
            <h2>{{ character.customAbilityOffsets[stat] }}</h2>
          </v-flex>
          <v-flex style="max-width: 50px">
            <v-btn
              color="primary"
              icon
              flat
              @click="dispatchSetStatOffset({ character, stat, value: character.customAbilityOffsets[stat] + 1 })"
            >
              <v-icon small>add</v-icon>
            </v-btn>
          </v-flex>
          <v-flex style="max-width: 30px"></v-flex>
          <v-flex style="max-width: 125px">
            <h2>{{ value + character.customAbilityOffsets[stat] }}</h2>
          </v-flex>
          <v-flex style="max-width: 30px"></v-flex>
          <v-flex style="max-width: 130px">
            <h2>{{ character.getModifier(stat) >= 0 ? "+" : "-" }} {{ Math.abs(character.getModifier(stat)) }}</h2>
          </v-flex>
          <v-flex style="max-width: 30px"></v-flex>
          <v-divider vertical></v-divider>
          <v-flex class="text-xs-center">
            <v-icon
              v-for="(val, index) in diceResult[stat]"
              :key="index"
            >{{ val }}</v-icon>
            <v-icon
              color="grey darken-1"
            >{{ droppedDice[stat] }}</v-icon>
          </v-flex>
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
    }
  },

  methods: {
    ...mapActions(['dispatchSetStat', 'dispatchSetStatOffset']),

    rollStat(stat) {
      const rolls = []
      for (let i = 0; i < 4; i++) {
        rolls.push(rollNdS(1, 6))
      }
      Vue.set(this.droppedDice, stat, 'mdi-dice-' + Math.min(...rolls))
      rolls.splice(rolls.indexOf(Math.min(...rolls)), 1)
      const value = rolls.reduce((acc, n) => acc + n)
      this.dispatchSetStat({
        character: this.character,
        stat,
        value,
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
.monospace {
  font-family: Lucida Console, Courier, monospace;
  font-size: 24px;
}
</style>
