<template>
  <v-container>
    {{ characterClass }}
    <v-layout align-center justify-start>
      <v-flex xs3>
        <v-layout
          align-start
          justify-center
          column
          fill-height
        >
          <v-autocomplete
            label="Class"
            :items="classOptions"
            v-model="characterClass.name"
            @input="updateClass"
            flat
            dense
          />
          <v-flex xs1>
            <v-autocomplete
              label="Level"
              :items="levelOpts"
              v-model="characterClass.level"
              flat
              dense
            />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <app-magic-class
      :character="character"
      :characterClass="characterClass"
      v-if="magicClassOptions.includes(characterClass.name)"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import MagicClass from './MagicClass'

export default {
  // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['characterClass', 'character'],

  components: {
    'app-magic-class': MagicClass,
  },

  computed: {
    ...mapGetters(['classOptions', 'magicClassOptions']),
  },

  data() {
    return {
      selectedClass: null,
      levelOpts: Array.from(new Array(20), (x, i) => i + 1), // [1,20]
    }
  },

  created() {
    this.selectedClass = this.characterClass.name
  },

  methods: {
    updateClass() {
      this.$store.dispatch('updateClass', {
        className: this.selectedClass,
        level: this.characterClass.level,
      })
    },
  },
}
</script>
