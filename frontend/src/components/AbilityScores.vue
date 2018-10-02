<template>
  <v-layout align-center justify-start row>
    <v-layout v-for="(statVal, statName) in scores" :key="statName" align-center justify-start column>
      <span><h3> {{statName}} </h3></span>
      <v-btn flat @click="selectedStat=statName; statsDialog=true;">{{statVal}}</v-btn>
      <span> {{getMod(statVal)}} </span>
    </v-layout>
    <v-dialog v-model="statsDialog" max-width=200>
      <v-card>
        <v-layout align-center justify-start column>
          <v-btn flat @click="offsetStat(selectedStat, 1)">+</v-btn>
          <span>{{scores[selectedStat]}}</span>
          <v-btn flat @click="offsetStat(selectedStat, -1)">-</v-btn>
          <v-btn flat @click="rollStat(selectedStat)">Roll</v-btn>
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
    getMod (val) {
      let modifier = Math.floor((val - 10) / 2)
      if (modifier > 0) {
        return '+' + modifier
      } else {
        return '' + modifier
      }
    },
    offsetStat (stat, offset) {
      this.$store.commit('offsetStat', {
        stat: stat,
        offset: offset,
        index: this.index
      })
    },
    rollStat (stat) {
      let rolls = []
      for (let i = 0; i < 4; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1)
      }
      rolls.splice(rolls.indexOf(Math.min(rolls)), 1)
      let getsum = (total, num) => { return total + num }
      let newtotal = rolls.reduce(getsum)
      this.$store.commit('offsetStat', {
        stat: stat,
        offset: newtotal - this.scores[stat],
        index: this.index
      })
    }
  },
  data () {
    return {
      selectedStat: 'STR',
      statsDialog: false
    }
  }
}
</script>
