<template>
  <div>
    <v-layout align-center justify-start row>
      <v-flex xs3>
        <v-layout align-start justify-center column fill-height>
          <v-autocomplete
            placeholder='Class'
            :items="classOpts"
            :search-input.sync="className"
            flat
            dense
          />
          <v-flex xs1>
            <v-autocomplete 
              placeholder='Level'
              :items="levelOpts"
              :search-input.sync="level"
              flat
              dense
            />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <magic-class :charIndex="charIndex" :classIndex="classIndex" v-if="magicClassOpts.includes(classItem.classname)"></magic-class>
  </div>
</template>

<script>
import MagicClass from '@/components/MagicClass'
export default { // TODO: spell save DC, spell attack modifier, spell slot counters, spell search dialog (all inside a conditional magic component)
  props: ['classIndex', 'charIndex'],
  components: {
    'magic-class': MagicClass
  },
  computed: {
    classOpts () {
      return this.$store.state.classOpts
    },
    classItem () {
      return this.$store.state.characters[this.charIndex].classes[this.classIndex]
    },
    className: {
      get () {
        return this.classItem.classname
      },
      set (state) {
        if (this.classOpts.includes(state)) {
          this.$store.commit('changeClass', {
            charIndex: this.charIndex,
            classIndex: this.classIndex,
            newClass: state
          })
        }
      }
    },
    level: {
      get () {
        return this.classItem.level
      },
      set (state) {
        this.$store.commit('changeClassLevel', {
          charIndex: this.charIndex,
          classIndex: this.classIndex,
          newLevel: state
        })
      }
    },
    magicClassOpts () {
      return this.$store.state.magicClassOpts
    }
  },
  data () {
    return {
      levelOpts: Array.from(new Array(20), (x, i) => i + 1) // [1,20]
    }
  }
}
</script>

