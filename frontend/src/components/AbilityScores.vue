<template>
  <v-container py-0 px-3 mb-2>
    <v-layout justify-space-between align-center>
      <v-layout align-center>
        <h3>ABILITY SCORES</h3>
        <v-tooltip bottom>
          <v-btn
            icon
            flat
            slot="activator"
            color="primary"
            @click="editStats"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <span>EDIT ABILITIES</span>
        </v-tooltip>
      </v-layout>
      <h3>PROFICIENCY BONUS: +{{ proficiencyBonus }}</h3>
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
      <app-ability-scores-dialog
        @close="showDialog = false"
        :character="character"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import AbilityScoresDialog from './AbilityScoresDialog'

export default {
  name: 'abilityScores',

  components: {
    'app-ability-scores-dialog': AbilityScoresDialog,
  },

  props: ['character', 'index'],

  computed: {
    proficiencyBonus() {
      let totalLevel = 0
      this.character.classes.forEach(c => {
        totalLevel += c.level
      })
      return Math.floor(totalLevel / 5) + 2
    },
  },

  data() {
    return {
      showDialog: false,
    }
  },

  methods: {
    editStats() {
      this.showDialog = true
    },
  },
}
</script>
