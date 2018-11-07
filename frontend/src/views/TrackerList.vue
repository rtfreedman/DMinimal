<template>
  <v-container>
    <v-btn
      color="primary"
      flat
      @click="showAddCharacterDialog = true"
      class="ml-0"
    >Add Character</v-btn>
    <v-btn
      color="primary"
      flat
      @click="showAddMonsterDialog = true"
      class="ml-0"
    >Add Monster</v-btn>
    <v-btn
      v-if="characters.length > 1"
      @click="dispatchGroupRest"
      flat
      color="primary"
    >Long Rest All</v-btn>
    <v-tabs
      slider-color="primary"
      v-model="selectedTab"
    >
      <v-tab
        v-for="i in characters.length"
        :key="i"
      >
        <v-layout align-center>
          <span>{{ characters[i - 1].name.split(' ')[0] || 'Name' }}</span>
          <span
            v-if="characters[i - 1].initiative"
            class="primary--text ml-2"
          >({{ characters[i - 1].initiative }})</span>
        </v-layout>
      </v-tab>
      <v-tab-item
        v-for="i in characters.length"
        :key="i"
      >
        <v-card flat>
          <app-tracker
            :character="characters[i - 1]"
            @characterRemoved="adjustTabs"
          ></app-tracker>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <app-msg-snackbar/>
    <v-dialog v-model="showAddCharacterDialog">
      <!-- v-if allows autofocus on each open and clears name -->
      <app-add-character-dialog
        v-if="showAddCharacterDialog"
        @close="showAddCharacterDialog = false"
        @addCharacter="addCharacter($event)"
      />
    </v-dialog>
    <pre>
Characters:
{{ characters }}
    </pre>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Tracker from '@/components/Tracker'
import MessageSnackbar from '@/components/MessageSnackbar'
import AddCharacterDialog from '@/components/AddCharacterDialog.vue'

export default {
  name: 'trackerList',

  components: {
    'app-add-character-dialog': AddCharacterDialog,
    'app-tracker': Tracker,
    'app-msg-snackbar': MessageSnackbar,
  },

  computed: {
    ...mapGetters(['characters']),
  },

  data() {
    return {
      selectedTab: 0,
      showAddCharacterDialog: false,
      showAddMonsterDialog: false,
    }
  },

  created() {
    this.dispatchRetrieveClassOptions()
    this.dispatchRetrieveMonsterOptions()
  },

  methods: {
    ...mapActions([
      'dispatchAddCharacter',
      'dispatchGroupRest',
      'dispatchRetrieveClassOptions',
    ]),

    addCharacter(name) {
      // TBD: validate
      this.showAddCharacterDialog = false
      this.dispatchAddCharacter(name).then(() => {
        this.selectedTab = this.characters.length - 1
      })
    },

    adjustTabs() {
      if (this.selectedTab > this.characters.length - 1) {
        this.selectedTab = this.characters.length - 1
      }
    },
  },
}
</script>
