<template>
  <v-container>
    <v-btn flat @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()" v-if="characters.length > 1" flat color="blue">Long Rest All</v-btn>
    <v-tabs hide-slider v-model="tabs">
      <v-tab v-for="c in characters" :key="c.id">
        <span v-if="c.name !== ''">{{shortenName(c.name)}}</span>
        <span v-if="c.name === ''">Name</span>
        <v-btn v-if="characters.length > 1 && c.id !== '0'" @click='removeCharacter(c)' icon flat color="grey"> <v-icon>cancel</v-icon> </v-btn>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item v-for="(c, index) in characters" :key="c.id">
        <v-card flat>
          <tracker1 :ref="'character' + c.id" :id="c.id" :index="index"></tracker1>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import Tracker1 from '@/components/Tracker1'
export default {
  name: 'TrackerList',
  components: {
    Tracker1
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
      this.$store.commit('longRestAll')
    },
    removeCharacter (c) {
      this.$store.commit('removeCharacter', c.id)
    }
  }
}
</script>
