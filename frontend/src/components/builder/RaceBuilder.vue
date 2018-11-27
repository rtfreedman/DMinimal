<template>
  <v-container>
    <h1>Race</h1>
    <v-btn-toggle v-model="selectedRace">
      <v-btn
        flat
        v-for="race in races"
        :key="race.name"
      >{{ race.name }}</v-btn>
    </v-btn-toggle>
    {{ selectedRace }}
  </v-container>
</template>

<script>
import { races } from '@/common/constants'
export default {
  data() {
    return {
      races,
      selectedRace: null,
    }
  },
}
</script>

<style scoped>
</style>
