<template>
  <v-container>
    <v-layout align-center justify-start row>
      <v-flex xs3>
        <v-layout align-start justify-center column fill-height>
          <v-autocomplete
            label="Class"
            :items="classOpts"
            v-model="selectedClass"
            @input="updateClass"
            flat
            dense
          />
          <v-flex xs1>
            <v-autocomplete label="Level" :items="levelOpts" :search-input.sync="level" flat dense/>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <magic-class
      :charIndex="charIndex"
      :classIndex="classIndex"
      v-if="magicClassOpts.includes(classItem.classname)"
    ></magic-class>
  </v-container>
</template>

<script>
import MagicClass from '@/components/MagicClass'
export default {
  // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['characterClass', 'classIndex', 'charIndex'],

  components: {
    'magic-class': MagicClass,
  },

  computed: {
    classOpts() {
      return this.$store.state.classOpts
    },

    classItem() {
      return this.$store.state.characters[this.charIndex].classes[
        this.classIndex
      ]
    },

    className() {
      return this.classItem.classname
    },

    level: {
      get() {
        return this.classItem.level
      },
      set(state) {
        if (typeof state === 'number') {
          this.$store.commit('changeClassLevel', {
            charIndex: this.charIndex,
            classIndex: this.classIndex,
            newLevel: state,
          })
        }
      },
    },

    magicClassOpts() {
      return this.$store.state.magicClassOpts
    },
  },

  data() {
    return {
      selectedClass: null,
      levelOpts: Array.from(new Array(20), (x, i) => i + 1), // [1,20]
    }
  },

  created() {
    this.selectedClass = this.characterClass.classname
  },

  methods: {
    updateClass() {
      this.$store.dispatch('updateClass', {
        charIndex: this.charIndex,
        classIndex: this.classIndex,
        className: this.selectedClass,
        level: this.characterClass.level,
      })
    },
  },
}
</script>
