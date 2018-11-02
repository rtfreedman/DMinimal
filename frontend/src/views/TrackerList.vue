<template>
  <v-container>
    <v-btn
      color="primary"
      flat
      @click="add"
      class="ml-0"
    >Add Character</v-btn>
    <v-btn
      v-if="characters.length > 1"
      @click="groupRest"
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
        <span>{{ characters[i - 1].name.split(' ')[0] || 'Name' }}</span>
        <v-layout justify-start align-start ma-1>
          <span
            v-if="characters[i - 1].initiative"
            class="primary--text"
          >({{ characters[i - 1].initiative }})</span>
        </v-layout>
        <v-btn
          v-if="characters.length > 1"
          @click.stop="deleteCharacter = characters[i - 1]; showDeleteDialog = true"
          icon
          dark
          small
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-tab>
      <v-tab-item
        v-for="i in characters.length"
        :key="i"
      >
        <v-card flat>
          <app-tracker
            :character="characters[i - 1]"
          ></app-tracker>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog
      v-if="deleteCharacter"
      v-model="showDeleteDialog"
      max-width="300"
    >
      <v-card>
        <v-card-text>
          <h2>Are you sure you want to delete {{ deleteCharacter.name || 'this character' }}?</h2>
        </v-card-text>
        <v-card-actions>
          <v-layout justify-end>
            <v-btn
              @click="showDeleteDialog = false; deleteCharacter = null"
              flat
            >No</v-btn>
            <v-btn
              @click="confirmDelete"
              color="error"
              flat
            >Yes</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <app-msg-snackbar/>
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

export default {
  name: 'trackerList',

  components: {
    'app-tracker': Tracker,
    'app-msg-snackbar': MessageSnackbar,
  },

  computed: {
    ...mapGetters(['characters']),
  },

  data() {
    return {
      selectedTab: 0,
      showDeleteDialog: false,
      deleteCharacter: null,
    }
  },

  created() {
    this.retrieveClassOptions()
  },

  methods: {
    ...mapActions([
      'addCharacter',
      'groupRest',
      'removeCharacter',
      'retrieveClassOptions',
    ]),

    add() {
      this.addCharacter().then(() => {
        this.selectedTab = this.characters.length - 1
      })
    },

    confirmDelete() {
      this.removeCharacter({ id: this.deleteCharacter.id }).then(() => {
        if (this.selectedTab > this.characters.length - 1) {
          this.selectedTab = this.characters.length - 1
        }
        this.showDeleteDialog = false
        this.deleteCharacter = null
      })
    },
  },
}
</script>
