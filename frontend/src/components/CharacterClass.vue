<template>
  <v-layout column class="border-primary">
    <v-toolbar color="primary" height="70px">
      <v-select
        placeholder="Class"
        :items="classOptions"
        v-model="characterClass.name"
        @input="handleSelect"
        solo
        hide-details
        style="max-width: 300px; margin-left: -5px;"
      />
      <v-select
        placeholder="Level"
        :items="oneToTwenty"
        v-model="characterClass.level"
        @input="handleSelect"
        solo
        hide-details
        style="max-width: 100px; margin-left: 10px;"
      />
      <v-spacer></v-spacer>
      <!-- remove character -->
      <v-btn
        v-if="character.classes.length > 1"
        icon
        color="secondary"
        flat
        @click="removeClass"
        class="ma-1"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- class options -->
    <v-layout
      mx-4
      align-center
      v-if="characterClass.name && characterClass.level"
    >
      <v-tooltip
        v-if="magicClassOptions.includes(characterClass.name)"
        bottom
      >
        <v-btn
          color="primary"
          flat
          slot="activator"
          icon
          @click="$emit('castSpell')"
        >
          <v-icon>mdi-auto-fix</v-icon>
        </v-btn>
        <span>CAST SPELL</span>
      </v-tooltip>
    </v-layout>
    <app-spell-slots
      v-if="magicClassOptions.includes(characterClass.name) && characterClass.level"
      :character="character"
      :characterClass="characterClass"
    />
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SpellSlots from './SpellSlots'
import { oneToTwenty } from '../common/functions'

export default {
  // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['characterClass', 'classIndex', 'character'],

  components: {
    'app-spell-slots': SpellSlots,
  },

  computed: {
    ...mapGetters(['classOptions', 'magicClassOptions']),
  },

  data() {
    return {
      oneToTwenty: oneToTwenty(),
    }
  },

  created() {
    this.retrieveSlots({
      index: this.classIndex,
      name: this.characterClass.name,
      level: this.characterClass.level,
      character: this.character,
    })
  },

  methods: {
    ...mapActions(['retrieveSlots']),

    handleSelect() {
      if (this.characterClass.name && this.characterClass.level) {
        this.retrieveSlots({
          index: this.classIndex,
          name: this.characterClass.name,
          level: this.characterClass.level,
          character: this.character,
        })
      }

      // do all that other shit
    },

    removeClass() {
      this.character.removeClass(this.classIndex)
    },

    castSpell() {
      // TBD
    },
  },
}
</script>
