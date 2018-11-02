<template>
  <v-container pt-0 px-3>
    <v-layout justify-space-between align-center>
      <v-layout align-center>
        <h3>ABILITY SCORES</h3>
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
        <v-tooltip bottom>
          <v-btn
            icon
            flat
            slot="activator"
            color="primary"
            class="ml-0"
            @click="editStats"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <span>EDIT ABILITIES</span>
        </v-tooltip>
      </v-layout>
      <h3>PROFICIENCY BONUS: {{ character.proficiency }}</h3>
    </v-layout>
    <v-layout
      justify-space-around
      pa-2
      class="border-primary"
    >
      <v-layout
        column
        v-for="(value, stat) in character.abilityScores"
        :key="stat"
        class="text-xs-center"
      >
        <v-layout justify-center>
          <div>
            <strong>{{ stat }}</strong>
            <h1>{{ value + character.customAbilityOffsets[stat] }}</h1>
          </div>
          <h4
            style="margin-top: 36px; margin-left: 5px;"
          >{{ character.getModifier(stat) >= 0 ? '+' : '-' }} {{ Math.abs(character.getModifier(stat)) }}</h4>
        </v-layout>
      </v-layout>
    </v-layout>
    <v-dialog v-model="showDialog">
      <v-card>
        <v-layout justify-space-between>
          <h1 class="pa-3">ABILITY SCORES</h1>
          <v-btn icon flat>
            <v-icon
              @click="showDialog = false"
            >close</v-icon>
          </v-btn>
        </v-layout>
        <v-card-text>
          <v-layout column class="text-xs-center">
            <v-layout>
              <v-flex style="max-width: 70px"></v-flex>
              <v-flex style="max-width: 130px">
                <h3>BASE</h3>
              </v-flex>
              <v-flex style="max-width: 30px"></v-flex>
              <v-flex style="max-width: 130px">
                <h3>CUSTOM</h3>
              </v-flex>
              <v-flex style="max-width: 30px"></v-flex>
              <v-flex style="max-width: 50px">
                <h3>TOTAL</h3>
              </v-flex>
              <v-flex style="max-width: 30px"></v-flex>
              <v-flex style="max-width: 50px">
                <h3>MOD</h3>
              </v-flex>
            </v-layout>
            <v-layout
              align-center
              v-for="(value, stat) in character.abilityScores"
              :key="stat"
            >
              <v-flex
                style="max-width: 70px"
                class="text-xs-left"
              >
                <h3>{{ stat }}</h3>
              </v-flex>
              <v-flex style="max-width: 50px">
                <v-btn
                  icon
                  flat
                  color="primary"
                  @click="decrStat(stat, value)"
                >
                  <v-icon>expand_more</v-icon>
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
                  @click="incrStat(stat, value)"
                >
                  <v-icon>expand_less</v-icon>
                </v-btn>
              </v-flex>
              <v-flex style="max-width: 30px"></v-flex>
              <v-flex style="max-width: 50px">
                <v-btn
                  icon
                  flat
                  color="primary"
                  @click="character.customAbilityOffsets[stat]--"
                >
                  <v-icon>expand_more</v-icon>
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
                  @click="character.customAbilityOffsets[stat]++"
                >
                  <v-icon>expand_less</v-icon>
                </v-btn>
              </v-flex>
              <v-flex style="max-width: 30px"></v-flex>
              <v-flex style="max-width: 50px">
                <h2>{{ value + character.customAbilityOffsets[stat] }}</h2>
              </v-flex>
              <v-flex style="max-width: 30px"></v-flex>
              <v-flex style="max-width: 50px">
                <h2>{{ character.getModifier(stat) }}</h2>
              </v-flex>
              <v-flex style="max-width: 30px"></v-flex>
              <v-flex
                class="text-xs-left"
                style="max-width: 70px"
              >
                <v-btn
                  icon
                  flat
                  color="primary"
                  @click="rollStat(stat)"
                >
                  <v-icon>mdi-dice-multiple</v-icon>
                </v-btn>
              </v-flex>
              <v-flex class="text-xs-left">
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
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { rollNdS } from '../common/functions'
import { statNames } from '../common/constants'

export default {
  name: 'AbilityScores',

  props: ['character', 'index'],

  data() {
    return {
      diceResult: {},
      droppedDice: {},
      showDialog: false,
    }
  },

  methods: {
    incrStat(stat, value) {
      if (value < 20) {
        this.character.abilityScores[stat]++
      }
    },

    decrStat(stat, value) {
      if (value > 1) {
        this.character.abilityScores[stat]--
      }
    },

    offsetStat(stat, offset) {
      this.$store.commit('offsetStat', {
        stat,
        offset,
        index: this.index,
      })
    },

    rollStat(stat) {
      const rolls = []
      for (let i = 0; i < 4; i++) {
        rolls.push(rollNdS(1, 6))
      }
      Vue.set(this.droppedDice, stat, 'mdi-dice-' + Math.min.apply(null, rolls))
      rolls.splice(rolls.indexOf(Math.min.apply(null, rolls)), 1)
      const getsum = (total, num) => {
        return total + num
      }
      const newTotal = rolls.reduce(getsum)
      this.character.abilityScores[stat] = newTotal
      Vue.set(this.diceResult, stat, rolls.map(val => 'mdi-dice-' + val))
    },

    rollStats() {
      statNames.forEach(s => {
        this.rollStat(s)
      })
    },

    editStats() {
      this.showDialog = true
    },
  },
}
</script>
