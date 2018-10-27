<template>
  <v-layout align-center justify-start>
    <v-layout
      v-for="(statVal, statName) in scores"
      :key="statName"
      align-center
      justify-start
      column
    >
      <span>
        <h3>{{statName}}</h3>
      </span>
      <v-btn
        flat
        @click="selectedStat=statName; diceResult = []; droppedDice = ''; statsDialog=true;"
      >{{statVal}}</v-btn>
      <span>{{getMod(statVal)}}</span>
    </v-layout>
    <v-dialog v-model="statsDialog" max-width="150">
      <v-card>
        <v-layout align-center justify-space-around>
          <v-icon v-for="(val, index) in diceResult" :key="index">{{val}}</v-icon>
          <v-icon color="grey darken-1">{{droppedDice}}</v-icon>
        </v-layout>
        <v-layout align-center justify-start column>
          <v-btn flat @click="offsetStat(selectedStat, 1)">+</v-btn>
          <span>{{scores[selectedStat]}}</span>
          <v-btn flat @click="offsetStat(selectedStat, -1)">-</v-btn>
          <v-btn flat @click="rollStat(selectedStat)">
            <v-icon>mdi-dice-multiple</v-icon>
          </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'AbilityScores',
  props: ['scores', 'index'],
  methods: {
    getMod(val) {
      const modifier = Math.floor((val - 10) / 2)
      if (modifier > 0) {
        return '+' + modifier
      } else {
        return '' + modifier
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
        rolls.push(Math.floor(Math.random() * 6) + 1)
      }
      this.droppedDice = 'mdi-dice-' + Math.min.apply(null, rolls).toString()
      rolls.splice(rolls.indexOf(Math.min.apply(null, rolls)), 1)
      const getsum = (total, num) => {
        return total + num
      }
      const newtotal = rolls.reduce(getsum)
      this.$store.commit('offsetStat', {
        stat,
        offset: newtotal - this.scores[stat],
        index: this.index,
      })
      this.diceResult = rolls.map(val => {
        return 'mdi-dice-' + val.toString()
      })
    },
  },
  data() {
    return {
      selectedStat: 'STR',
      diceResult: [],
      droppedDice: '',
      statsDialog: false,
    }
  },
}
</script>
