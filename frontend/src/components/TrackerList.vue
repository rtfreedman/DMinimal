<template>
  <v-container>
    <v-btn flat @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()" v-if="characters.length > 1" flat color="blue">Long Rest All</v-btn>
    <v-tabs hide-slider v-model="selectedTab">
      <v-tab v-for="c in characters" :key="c.id">
        <span v-if="c.name !== ''">{{shortenName(c.name)}}</span>
        <span v-if="c.name === ''">Name</span>
        <v-layout justify-start align-start row ma-1>
          <span v-if="c.initiative !== null" class="colorText">{{c.initiative}}</span>
        </v-layout>
        <v-btn v-if="characters.length > 1 && c.id !== '0'" @click="deleteCharacter = c; deleteDialog = true" icon small flat color="red"> <v-icon small>mdi-close</v-icon> </v-btn>
      </v-tab>
    </v-tabs>
    <v-tabs-items>
      <v-tab-item>
        <v-card flat>
          <tracker :ref="'character' + characters[selectedTab].id" :id="characters[selectedTab].id" :index="selectedTab"></tracker>
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
    }
  },
  data () {
    return {
      deleteDialog: false,
      selectedTab: 0,
      deleteCharacter: ''
    }
  },
  methods: {
    addCharacter () {
      this.$store.commit('addCharacter')
      this.selectedTab = this.characters.length - 1
    },
    shortenName (name) {
      return name.split(' ')[0]
    },
    longRestAll () {
      this.$store.commit('longRestAll')
    },
    removeCharacter (c) {
      this.$store.commit('removeCharacter', c.id)
      this.selectedTab = 0
    }
  }
}
</script>

<style scoped>
.colorText {
  color: yellow;
  vertical-align: super;
  font-size: 10px;
}
</style>
