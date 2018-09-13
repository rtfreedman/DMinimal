<template>
  <v-card>
    <v-card-actions>
      <v-btn flat @click="addCharacter()"> +Character </v-btn>
    </v-card-actions>
    <div v-for="c in characters" :key="c">
      <p class="text-lg-right"><v-btn v-if="characters.length > 1" @click='removeCharacter(c)' icon flat color="red"> <v-icon>cancel</v-icon> </v-btn></p>
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
    addCharacter: function () {
      if (this.characters.length < 10) {
        this.characters.push(Math.random() * (10 ** 10))
      }
    },
    removeCharacter: function (c) {
      let index = this.characters.findIndex(function (element) {
        return element === c
      })
      if (index === -1) {
        return
      }
      this.characters.splice(index, 1)
    },
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
