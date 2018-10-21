<template>
  <v-container>
    <v-btn flat
           @click="addCharacter()"> +Character </v-btn>
    <v-btn @click="longRestAll()"
           v-if="characters.length > 1"
           flat
           color="blue">Long Rest All</v-btn>
    <v-tabs slider-color="yellow"
            v-model="selectedTab">
      <v-tab v-for="c in characters.length"
             :key="'tab'+c">
        <span v-if="characters[c - 1].name !== ''">{{shortenName(characters[c - 1].name)}}</span>
        <span v-if="characters[c - 1].name === ''">Name</span>
        <v-layout justify-start
                  align-start
                  row
                  ma-1>
          <span v-if="characters[c - 1].initiative !== null"
                class="colorText">{{characters[c - 1].initiative}}</span>
        </v-layout>
        <v-btn v-if="characters.length > 1"
               @click.stop="deleteCharacter = characters[selectedTab]; deleteDialog = true"
               icon
               small
               flat
               color="red">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-tab>
      <v-tab-item v-for="c in characters.length"
                  :key="'character' + c">
        <v-card flat>
          <tracker :id="characters[c - 1].id"
                   :index="selectedTab"></tracker>
        </v-card>
      </v-tab-item>
    </v-tabs>
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
    <msg-snackbar />
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
    tracker: Tracker,
    'msg-snackbar': MessageSnackbar,
  },
  computed: {
    characters() {
      return this.$store.state.characters
    },
  },
  data() {
    return {
      deleteDialog: false,
      selectedTab: 0,
      deleteCharacter: '',
    }
  },
  methods: {
    addCharacter() {
      this.$store.commit('addCharacter')
      this.selectedTab = this.characters.length - 1
    },
    shortenName(name) {
      return name.split(' ')[0]
    },
    longRestAll() {
      this.$store.commit('longRestAll')
    },
    removeCharacter(c) {
      this.$store.commit('removeCharacter', c.id)
    },
  },
}
</script>

<style scoped>
.colorText {
  color: yellow;
  vertical-align: super;
  font-size: 10px;
}
</style>
