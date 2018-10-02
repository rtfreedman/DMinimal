<template>
    <v-card>
      <v-layout align-center justify-center row>
        <v-flex xs11>
          <v-text-field v-model="name" placeholder="Name..."></v-text-field>
        </v-flex>
      </v-layout>
      <!-- Ability Scores -->
      <ability-scores :scores="character.abilityScores" :index="index"></ability-scores>
      <!-- End Ability Scores -->
    </v-card>
</template>

<script>
import AbilityScores from '@/components/AbilityScores'
export default {
  name: 'Tracker1',
  props: ['id', 'index'],
  computed: {
    character () {
      return this.$store.state.characters[this.index]
    },
    name: {
      get () {
        return this.character.name
      },
      set (state) {
        this.$store.commit('changeName', {
          index: this.index,
          name: state
        })
      }
    }
  },
  components: {
    'ability-scores': AbilityScores
  }
}
</script>
