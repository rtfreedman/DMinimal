<template>
  <v-container>
    <v-btn flat @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()" v-if="characters.length > 1" flat color="blue">Long Rest All</v-btn>
    <v-tabs>
      <v-tab v-for="c in characters" :key="c">
            asdf
            <v-btn v-if="characters.length > 1" @click='removeCharacter(c)' icon flat color="grey"> <v-icon>cancel</v-icon> </v-btn>
      </v-tab>
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tabs-items>
        <v-tab-item v-for="c in characters" :key="c">
          <v-card flat>
            <tracker :ref="'character' + c" v-bind:classOpts='classOpts'></tracker>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>
<script>
import Tracker from '@/components/Tracker'
export default {
  data () {
    return {
      characters: [0],
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
    longRestAll () {
      for (let i in this.characters) {
        // if someone could explain to me why the ['0'] is needed that would be awesome
        this.$refs['character' + this.characters[i]]['0'].longRest()
      }
    },
    addCharacter () {
      if (this.characters.length < 10) {
        this.characters.push(Math.random() * (10 ** 10))
      }
    },
    removeCharacter (c) {
      let index = this.characters.findIndex(function (element) {
        return element === c
      })
      if (index === -1) {
        return
      }
      this.characters.splice(index, 1)
    },
    getClassOpts () {
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
