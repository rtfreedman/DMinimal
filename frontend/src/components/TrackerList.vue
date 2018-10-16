<template>
  <v-container>
    <v-btn flat @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()" v-if="characters.length > 1" flat color="blue">Long Rest All</v-btn>
    <v-tabs hide-slider v-model="tabs">
      <v-tab v-for="c in characters" :key="c.id">
        <span v-if="c.name !== ''">{{shortenName(c.name)}}</span>
        <span v-if="c.name === ''">Name</span>
        <v-btn v-if="characters.length > 1 && c.id !== '0'" @click="deleteCharacter = c; deleteDialog = true" icon flat color="grey"> <v-icon>cancel</v-icon> </v-btn>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item v-for="(c, index) in characters" :key="c.id">
        <v-card flat>
          <tracker :ref="'character' + c.id" :id="c.id" :index="index"></tracker>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="deleteDialog" max-width=300>
      <v-card>
        <v-card-text>
          <h2>Are you sure you want to delete <span v-if="deleteCharacter.name !== ''">{{deleteCharacter.name}}</span> <span v-else>unnamed character</span>?</h2>
        </v-card-text>
        <v-layout column>
          <v-btn @click="deleteDialog = false; removeCharacter(deleteCharacter)" flat> Yes </v-btn>
          <v-btn @click="deleteDialog = false;" flat> No </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <msg-snackbar/>
  </v-container>
</template>

<script>
import Tracker from '@/components/Tracker'
import MessageSnackbar from '@/components/MessageSnackbar'
export default {
  name: 'TrackerList',
  beforeMount () {
    this.$store.commit('updateClassOpts')
  },
  components: {
    'tracker': Tracker,
    'msg-snackbar': MessageSnackbar
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
      currentTab: 0,
      deleteDialog: false,
      deleteCharacter: '',
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
      this.tabs = 0
      this.allowTabChange = false
    }
  }
}
</script>
