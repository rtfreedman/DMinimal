<template>
  <v-card>
    <v-card-actions>
      <v-btn flat @click='characters.push("")'> +Character </v-btn>
    </v-card-actions>
    <div v-for="c in characters" :key="c">
      <tracker></tracker>
    </div>
  </v-card>
</template>
<script>
import Tracker from '@/components/Tracker'
export default {
  data () {
    return {
      characters: ['']
    }
  },
  components: {
    Tracker
  }
}
</script>
