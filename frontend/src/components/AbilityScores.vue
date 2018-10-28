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
            @click="rollStats()"
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
            @click="editStats()"
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
            <strong>{{ `${stat} (${value + getModifier(stat, value)})` }}</strong>
            <h1>{{ value }}</h1>
          </div>
          <h4
            style="margin-top: 36px; margin-left: -7px;"
          >+ {{ getModifier(stat, value) }}</h4>
        </v-layout>
      </v-layout>
    </v-layout>
    <v-dialog v-model="showDialog">
      <v-card>
        <v-layout justify-space-between>
          <h1 class="pa-3">SET ABILITY SCORES</h1>
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
              <v-flex style="max-width: 150px">
                <h3>BASE</h3>
              </v-flex>
              <v-flex style="max-width: 50px"></v-flex>
              <v-flex style="max-width: 150px">
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
              <v-flex style="max-width: 50px">
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
              <v-flex style="max-width: 50px">
                <h3>+</h3>
              </v-flex>
              <v-flex style="max-width: 50px">
                <v-btn
                  icon
                  flat
                  color="primary"
                  @click="decrModifier(stat, getModifier(stat, value))"
                >
                  <v-icon>expand_more</v-icon>
                </v-btn>
              </v-flex>
              <v-flex style="max-width: 50px">
                <h2>{{ getModifier(stat, value) }}</h2>
              </v-flex>
              <v-flex style="max-width: 50px">
                <v-btn
                  color="primary"
                  icon
                  flat
                  @click="incrModifier(stat, getModifier(stat, value))"
                >
                  <v-icon>expand_less</v-icon>
                </v-btn>
              </v-flex>
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

export default {
  name: 'AbilityScores',

  props: ['character', 'index'],

  data() {
    return {
      selectedStat: 'STR',
      diceResult: {},
      droppedDice: {},
      showDialog: true,
    }
  },

  methods: {
    getModifier(stat, value) {
      return Math.floor((value - 10) / 2) + this.character.customModifiers[stat]
    },

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

    incrModifier(stat, value) {
      this.character.customModifiers[stat]++
    },

    decrModifier(stat, value) {
      this.character.customModifiers[stat]--
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
        rolls.push(Math.floor(Math.random() * 6) + 1)
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
      // TBD
    },

    editStats() {
      this.showDialog = true
    },
  },
}
</script>
