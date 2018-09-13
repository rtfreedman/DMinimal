<template>
  <v-card>
    <v-card-actions>
      <v-btn flat @click='characters.push("")'> +Character </v-btn>
    </v-card-actions>
    <div v-for="c in characters" :key="c">
      <tracker v-bind:classOpts='classOpts'></tracker>
    </div>
  </v-card>
</template>
<script>
import Tracker from '@/components/Tracker'
export default {
  data () {
    return {
      characters: [''],
      classOpts: []
    }
  },
  beforeMount () {
    this.getClassOpts()
  },
  components: {
    Tracker
  },
  methods: {
    getClassOpts: function () {
      let r = new Request('http://localhost:8010/magic/classes/')
      fetch(r)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error('Something went wrong on api server!')
        }
      })
      .then(response => {
        this.classOpts = response.Classes
      })
      .catch(error => {
        console.error(error)
      })
    }
  }
}
</script>
