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
      @click="longRestAll"
      flat
      color="primary"
    >Long Rest All</v-btn>
    <v-tabs
      slider-color="primary"
      v-model="selectedTab"
    >
      <v-tab
        v-for="c in characters"
        :key="`tab_${c.id}`"
      >
        <span>{{ c.name.split(' ')[0] || 'Name' }}</span>
        <v-layout justify-start align-start ma-1>
          <span
            v-if="c.initiative !== null"
            class="primary--text"
          >({{ c.initiative }})</span>
        </v-layout>

        <v-btn
          v-if="characters.length > 1"
          @click.stop="deleteCharacter = c; showDeleteDialog = true"
          icon
          dark
          small
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-tab>
      <v-tab-item
        v-for="i in characters.length"
        :key="`tab_item_${characters[i - 1].id}`"
      >
        <v-card flat>
          <app-tracker
            :character="characters[i - 1]"
            :index="selectedTab"
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
            <v-btn @click="confirmDelete" flat>Yes</v-btn>
            <v-btn
              color="primary"
              @click="showDeleteDialog = false; deleteCharacter = null"
              flat
            >No</v-btn>
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
import { setImmediate } from 'timers';
export default {
  components: {
    'app-tracker': Tracker,
    'app-msg-snackbar': MessageSnackbar,
  },

  computed: {
    ...mapGetters(['characters']),
  },

  data() {
    return {
      showDeleteDialog: false,
      selectedTab: 0,
      deleteCharacter: null,
    }
  },

  beforeMount() {
    this.retrieveClassOptions()
  },

  methods: {
    ...mapMutations(['addCharacter', 'removeCharacter']),
    ...mapActions(['retrieveClassOptions']),

    add() {
      this.addCharacter()
      // Vuex's use of the event loop is not well understood
      // assignment is beating the characters array change detection
      setImmediate(() => {
        this.selectedTab = this.characters.length - 1
      })
    },

    longRestAll() {
      this.characters.forEach(c => {
        c.rest()
      })
    },

    confirmDelete() {
      this.removeCharacter({ id: this.deleteCharacter.id })
      this.showDeleteDialog = false
      this.deleteCharacter = null
    },
  },
}
</script>
