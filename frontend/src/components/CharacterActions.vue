<template>
  <v-container pa-0>
    <!-- actions -->
    <v-toolbar color="secondary" flat>
      <v-tooltip bottom>
        <v-btn
          color="primary"
          icon
          flat
          slot="activator"
          @click="longRest()"
        >
          <v-icon>hotel</v-icon>
        </v-btn>
        <span>LONG REST</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          color="primary"
          icon
          flat
          slot="activator"
          @click="showShortRestDialog = true"
        >
          <v-icon>restore</v-icon>
        </v-btn>
        <span>SHORT REST</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          :disabled="!character.concentratingOn"
          @click="showConcentrationDialog = true"
          color="primary"
          icon
          flat
          slot="activator"
        >
          <v-icon>remove_red_eye</v-icon>
        </v-btn>
        <span
          v-if="character.concentratingOn"
        >Concentrating on {{ character.concentratingOn }}</span>
        <span
          v-if="!character.concentratingOn || character.concentratingOn === ''"
        >Not currently concentrating</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn
          v-if="characters.length > 1 && !trigger"
          @click="showRemoveCharacterDialog = true"
          color="primary"
          slot="activator"
          icon
          flat
        >
          <v-icon>delete</v-icon>
        </v-btn>
        <span>REMOVE CHARACTER</span>
      </v-tooltip>
    </v-toolbar>
    <!-- short rest dialog -->
    <v-dialog v-model="showShortRestDialog">
      <app-short-rest-dialog
        :character="character"
        @close="showShortRestDialog = false"
      />
    </v-dialog>
    <!-- confirm cease concentration dialog -->
    <!-- <v-dialog
      v-model="showConcentrationDialog"
      max-width="300"
    >
      <app-concentration-dialog
        :character="character"
        @close="showConcentrationDialog = false"
      />
    </v-dialog>-->
    <app-confirm-dialog
      :show="showConcentrationDialog"
      okColor="error"
      @ok="concentrate()"
      @close="showConcentrationDialog = false"
    >
      <h3 slot="title">CEASE CONCENTRATION</h3>
      <h3
        slot="text"
      >Cease concentration on {{ character.concentratingOn }}?</h3>
      <span slot="ok">Yes</span>
    </app-confirm-dialog>
    <!-- confirm remove character dialog -->
    <app-confirm-dialog
      :show="showRemoveCharacterDialog"
      okColor="error"
      @ok="confirmDelete"
      @close="showRemoveCharacterDialog = false"
    >
      <h3 slot="title">REMOVE CHARACTER</h3>
      <h3
        slot="text"
      >Are you sure you want to remove this character? This cannot be undone.</h3>
      <span slot="ok">Remove</span>
    </app-confirm-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ShortRestDialog from './ShortRestDialog'
import ConfirmDialog from './ConfirmDialog'

export default {
  components: {
    'app-short-rest-dialog': ShortRestDialog,
    'app-confirm-dialog': ConfirmDialog,
  },

  props: ['character'],

  computed: {
    ...mapGetters(['characters', 'trigger']),
  },

  data() {
    return {
      showConcentrationDialog: false,
      showShortRestDialog: false,
      showRemoveCharacterDialog: false,
    }
  },

  methods: {
    ...mapActions(['characterAction', 'removeCharacter']),

    concentrate() {
      this.characterAction({
        character: this.character,
        method: 'concentrateOn',
        args: [''],
      })
    },

    longRest() {
      this.characterAction({
        character: this.character,
        method: 'longRest',
        args: [],
      })
    },

    confirmDelete() {
      this.removeCharacter({ id: this.character.id }).then(() => {
        this.$emit('characterRemoved')
      })
    },
  },
}
</script>

<style>
</style>
