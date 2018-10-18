<template>
  <v-container>
    <v-btn flat
           @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()"
           v-if="characters.length > 1"
           flat
           color="blue">Long Rest All</v-btn>

    <pre>{{ selectedTab }}</pre>

    <v-tabs hide-slider
            v-model="selectedTab">
      <v-tab v-for="c in characters"
             :key="c.id">
        <span v-if="c.name !== ''">{{shortenName(c.name)}}</span>
        <span v-if="c.name === ''">Name</span>
        <v-btn v-if="characters.length > 1 && c.id !== '0'"
               @click="deleteCharacter = c; deleteDialog = true"
               icon
               flat
               color="grey">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>
    <!-- <v-tabs-items v-model="selectedTab">
      <v-tab-item v-for="(c, index) in characters" :key="c.id">
        <v-card flat>
          <app-tracker :ref="'character' + c.id" :id="c.id" :index="index"></app-tracker>
        </v-card>
      </v-tab-item>
    </v-tabs-items> -->

    <v-tabs-items>
      <v-tab-item>
        <v-card flat>
          <app-tracker :ref="'character' + characters[selectedTab].id"
                       :id="characters[selectedTab].id"
                       :index="selectedTab"></app-tracker>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <!-- <template v-for="(c, index) in characters">
      <v-card flat :key="c.id" v-if="index === selectedTab">
        <tracker :ref="'character' + characters[selectedTab].id" :id="characters[selectedTab].id" :index="selectedTab"></tracker>
      </v-card>
    </template> -->

    <v-dialog v-model="deleteDialog"
              max-width=300>
      <v-card>
        <v-card-text>
          <h2>Are you sure you want to delete <span v-if="deleteCharacter.name !== ''">{{deleteCharacter.name}}</span> <span v-else>unnamed character</span>?</h2>
        </v-card-text>
        <v-layout column>
          <v-btn @click="deleteDialog = false; removeCharacter(deleteCharacter)"
                 flat> Yes </v-btn>
          <v-btn @click="deleteDialog = false;"
                 flat> No </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <app-msg-snackbar />
  </v-container>
</template>

<script>
import Tracker from '@/components/Tracker'
import MessageSnackbar from '@/components/MessageSnackbar'

export default {
  name: 'TrackerList',
  beforeMount() {
    this.$store.commit('updateClassOpts')
  },
  components: {
    'app-tracker': Tracker,
    'app-msg-snackbar': MessageSnackbar,
  },
  computed: {
    characters() {
      return this.$store.state.characters
    },

    tabs() {
      return this.$store.state.tab
    },

    // tabs: {
    //   get: function () {
    //     return this.$store.state.tab
    //   },
    //   set: function (value) {
    //     // we don't want v-tabs to be able to set anything because it messes
    //     // everything up when doing deletion
    //   }
    // }
  },
  data() {
    return {
      deleteDialog: false,
      deleteCharacter: '',
      selectedTab: 0,
    }
  },
  methods: {
    addCharacter() {
      this.$store.commit('addCharacter')
    },
    shortenName(name) {
      return name.split(' ')[0]
    },
    longRestAll() {
      this.$store.commit('longRestAll')
    },
    removeCharacter(c) {
      this.$store.commit('removeCharacter', c.id)
      setTimeout(() => {
        this.selectedTab = 1
        this.selectedTab = 0
      }, 1000)
    },
    setTab(index) {
      this.$store.commit('changeTab', index)
    },
  },
}
</script>
