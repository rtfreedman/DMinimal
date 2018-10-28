<template>
  <v-layout column class="border-primary">
    <v-layout mb-2>
      <v-layout justify-start pt-4 pl-4 pb-2>
        <v-select
          placeholder="Class"
          :items="classOptions"
          v-model="characterClass.name"
          @input="handleSelectClass"
          light
          solo
          hide-details
          style="max-width: 300px"
        />
        <v-select
          placeholder="Level"
          :items="oneToTwenty"
          v-model="characterClass.level"
          light
          solo
          hide-details
          style="max-width: 100px; margin-left: 10px;"
        />
      </v-layout>
      <v-btn
        icon
        flat
        @click="removeClass"
        class="ma-1"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-layout>
    <app-magic-class
      v-if="magicClassOptions.includes(characterClass.name)"
      :character="character"
      :characterClass="characterClass"
    />
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MagicClass from './MagicClass'
import { oneToTwenty } from '../common/functions'

export default {
  // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['characterClass', 'classIndex', 'character'],

  components: {
    'app-magic-class': MagicClass,
  },

  computed: {
    ...mapGetters(['classOptions', 'magicClassOptions']),
  },

  data() {
    return {
      oneToTwenty: oneToTwenty(),
    }
  },

  methods: {
    ...mapActions(['selectClass']),

    handleSelectClass() {
      this.selectClass({
        index: this.classIndex,
        name: this.characterClass.name,
        level: this.characterClass.level,
        character: this.character,
      })
    },

    removeClass() {
      // TBD
    },
  },
}
</script>
