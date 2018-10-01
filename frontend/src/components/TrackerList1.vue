<template>
  <v-container>
    <v-btn flat @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()" v-if="characters.length > 1" flat color="blue">Long Rest All</v-btn>
    <v-tabs hide-slider v-model="tabs">
      <v-tab v-for="c in characters" :key="c.id">
        <span v-if="c.name !== ''">{{shortenName(c.name)}}</span>
        <span v-if="c.name === ''">Name</span>
        <v-btn v-if="characters.length > 1 && c.id !== 0" @click='removeCharacter(c)' icon flat color="grey"> <v-icon>cancel</v-icon> </v-btn>
      </v-tab>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
  name: 'TrackerList1',
  beforeMount () {
    this.getClassOpts()
  },
  computed: {
    characters () {
      return this.$store.state.characters
    },
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
  data () {
    return {
      classOpts: [],
      currentTab: 0,
      allowTabChange: true
    }
  },
  methods: {
    addCharacter () {
      this.$store.commit('addCharacter')
    },
    shortenName (name) {
      return name.split(' ')[0]
    },
    longRestAll () {
      for (let i in this.characters) {
        // if someone could explain to me why the ['0'] is needed that would be awesome
        this.$refs['character' + this.characters[i].id]['0'].longRest()
      }
    },
    removeCharacter (c) {
      console.log('method')
      this.$store.commit('removeCharacter', c.id)
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
