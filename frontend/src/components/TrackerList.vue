<template>
  <div>
    <v-btn flat @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()" v-if="characters.length > 1" flat color="blue">Long Rest All</v-btn>
    <v-tabs hide-slider v-model="tabs">
      <v-tab v-for="c in characters" :key="c">
            <span v-if="c.name !== ''">{{shortenName(c.name)}}</span>
            <span v-if="c.name === ''">Name</span>
            <v-btn v-if="characters.length > 1 && c.id !== 0" @click='removeCharacter(c)' icon flat color="grey"> <v-icon>cancel</v-icon> </v-btn>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item v-for="c in characters" :key="c">
        <v-card flat>
          <v-card-text>
            <v-flex xs6>
              <v-text-field v-model="c.name" placeholder="Name..."></v-text-field>
            </v-flex>
          </v-card-text>
          <tracker :ref="'character' + c.id" v-bind:classOpts='classOpts'></tracker>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import Tracker from '@/components/Tracker'
export default {
  data () {
    return {
      currentTab: 0,
      allowTabChange: true,
      characters: [{
        id: 0,
        name: ''
      }],
      classOpts: []
    }
  },
  computed: {
    tabs: {
      get: function () {
        if (!this.allowTabChange) {
          this.allowTabChange = true
        }
        return this.currentTab
      },
      set: function (value) {
        if (this.allowTabChange) {
          this.currentTab = value
        } else {
          this.allowTabChange = true
        }
      }
    }
  },
  beforeMount () {
    this.getClassOpts()
  },
  components: {
    Tracker
  },
  methods: {
    shortenName (name) {
      return name.split(' ')[0]
    },
    longRestAll () {
      for (let i in this.characters) {
        // if someone could explain to me why the ['0'] is needed that would be awesome
        this.$refs['character' + this.characters[i].id]['0'].longRest()
      }
    },
    addCharacter () {
      if (this.characters.length < 10) {
        this.characters.push({
          id: Math.random() * (10 ** 10),
          name: ''
        })
      }
    },
    removeCharacter (c) {
      let index = this.characters.findIndex(function (element) {
        return element.id === c.id
      })
      if (index === -1) {
        return
      }
      this.characters.splice(index, 1)
      this.allowTabChange = false
      this.currentTab = 0
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
